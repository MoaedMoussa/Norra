import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from "vite";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Health Check Endpoint
// ---------------------------------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'norra-scores' });
});


// ---------------------------------------------------------------------------
// ESPN API Proxy
// ---------------------------------------------------------------------------
app.get('/api/espn', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl || (!targetUrl.startsWith('https://site.api.espn.com/') && !targetUrl.startsWith('https://now.core.api.espn.com/'))) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  try {
    const fetchRes = await fetch(targetUrl);
    const text = await fetchRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      return res.status(500).json({ error: 'Invalid JSON response from ESPN' });
    }
    res.json(data);
  } catch (err: any) {
    console.error('Proxy error fetching', targetUrl, err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------------------------------------------------------------------------
// Vite Integration (Dev) & Static Serving (Prod)

// ---------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const httpServer = http.createServer(app);
  
  // Real-time Socket Setup
  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('Client connected for live updates', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  // Poll ESPN API every 15s and emit to connected clients
  setInterval(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?limit=1000', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      
      io.emit('liveMatchesUpdate', data);
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('Connect Timeout') || err.message?.includes('fetch failed')) {
        console.warn('ESPN polling timeout or connection error (retrying next cycle)');
      } else {
        console.error('Error polling ESPN:', err.message);
      }
    }
  }, 15000);

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Norra Scores Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
