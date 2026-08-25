import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

interface Template {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  gallery: string[];
  notionPreviewUrl?: string;
}

interface User {
  user_id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface UserSession {
  user_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

interface Order {
  order_id: string;
  user_id?: string | null;
  user_email?: string | null;
  slugs: string[];
  total_cents: number;
  status: 'pending' | 'paid' | 'failed';
  stripe_session_id?: string;
  created_at: string;
  paid_at?: string;
}

interface LibraryItem {
  user_id: string;
  slug: string;
  acquired_at: string;
  order_id: string;
}

// Initial Seed Data
const SEED_TEMPLATES: Template[] = [
  {
    slug: "notion-second-brain",
    name: "Second Brain",
    tagline: "Organize your entire life and build your second brain inside Notion.",
    price: 49,
    originalPrice: 99,
    image: "https://images.unsplash.com/photo-1708447134640-2b57ad0dd846?w=1200&q=80",
    category: "Productivity",
    rating: 4.9,
    reviews: 2841,
    description: "The Second Brain is an all-in-one Notion template that helps you organize your entire digital life. Capture notes, tasks, projects, goals, ideas, and knowledge in one central hub inspired by the PARA method.",
    features: [
      "PARA method organization (Projects, Areas, Resources, Archive)",
      "Weekly review dashboard with progress tracking",
      "Notes system with backlinks and tags",
      "Integrated task manager with priorities",
      "Reading list with highlights capture",
      "Habit tracker and daily journal"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1708447134640-2b57ad0dd846?w=1400&q=80",
      "https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1400",
      "https://images.pexels.com/photos/7428211/pexels-photo-7428211.jpeg?w=1400"
    ],
    notionPreviewUrl: "https://www.notion.so/Notion-Template-Gallery-181e961aeb2c80d1a419fe23fe387fa8"
  },
  {
    slug: "notion-finance-tracker",
    name: "Finance Tracker",
    tagline: "Make smarter financial decisions and stay in control of your finances.",
    price: 39,
    originalPrice: 79,
    image: "https://images.pexels.com/photos/38888681/pexels-photo-38888681.jpeg?w=1200",
    category: "Finance",
    rating: 4.9,
    reviews: 1932,
    description: "Take full control of your money with a beautifully designed Notion finance system.",
    features: [
      "Monthly budget & expense tracker",
      "Net worth dashboard with historical trend",
      "Subscription and bill tracker",
      "Savings goals with visual progress",
      "Debt payoff planner",
      "Investment portfolio overview"
    ],
    gallery: [
      "https://images.pexels.com/photos/38888681/pexels-photo-38888681.jpeg?w=1400",
      "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80"
    ],
    notionPreviewUrl: "https://www.notion.so/Personal-Finance-Tracker-templates-46b96f1a01d94a0a89e5c1a0fac3f0f3"
  },
  {
    slug: "notion-life-planner",
    name: "Life Planner",
    tagline: "Plan your entire life and turn your goals into a reality effortlessly.",
    price: 39,
    originalPrice: 79,
    image: "https://images.unsplash.com/photo-1514782831304-632d84503f6f?w=1200&q=80",
    category: "Planning",
    rating: 4.9,
    reviews: 2213,
    description: "A complete life planning system inside Notion.",
    features: [
      "Yearly, quarterly, monthly, weekly, and daily planners",
      "Goal tracker with milestones",
      "Vision board and life wheel",
      "Habit builder with streaks",
      "Gratitude and reflection journal",
      "Bucket list and dream tracker"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1514782831304-632d84503f6f?w=1400&q=80",
      "https://images.pexels.com/photos/768472/pexels-photo-768472.jpeg?w=1400"
    ],
    notionPreviewUrl: "https://www.notion.so/Weekly-Planner-Template-9c0e6a2f6c7f4e8e9a6e4e4f5f4e4f4e"
  },
  {
    slug: "notion-creator-system",
    name: "Creator System",
    tagline: "Manage your entire creator business and grow faster than ever before.",
    price: 49,
    originalPrice: 99,
    image: "https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1200",
    category: "Business",
    rating: 4.8,
    reviews: 1421,
    description: "A powerful Notion OS for content creators.",
    features: [
      "Content calendar across platforms",
      "Idea vault with scoring system",
      "Brand deal & sponsorship pipeline",
      "Analytics dashboard",
      "Script and storyboard templates",
      "Community & audience CRM"
    ],
    gallery: [
      "https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1400",
      "https://images.unsplash.com/photo-1642417188964-870c08705ef3?w=1400&q=80"
    ],
    notionPreviewUrl: "https://www.notion.so/Content-Creator-Dashboard-e6f4c1e93b8a4b3f9b3d1b5f5d5f5d5f"
  },
  {
    slug: "notion-freelance-system",
    name: "Freelance System",
    tagline: "Manage your entire freelance business and take control of your work.",
    price: 49,
    originalPrice: 99,
    image: "https://images.pexels.com/photos/7428211/pexels-photo-7428211.jpeg?w=1200",
    category: "Business",
    rating: 4.9,
    reviews: 1108,
    description: "Run your freelance business like a pro.",
    features: [
      "Client CRM with pipeline stages",
      "Project & deliverable management",
      "Invoice tracker with status",
      "Contract & proposal library",
      "Time tracking per client",
      "Income & expense reports"
    ],
    gallery: [
      "https://images.pexels.com/photos/7428211/pexels-photo-7428211.jpeg?w=1400",
      "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80"
    ],
    notionPreviewUrl: "https://www.notion.so/Freelance-Client-Portal-cff3c1ef2c4a4e5cae7c7c7c7c7c7c7c"
  },
  {
    slug: "notion-business-system",
    name: "Business System",
    tagline: "Manage your entire business and take control of every aspect efficiently.",
    price: 59,
    originalPrice: 129,
    image: "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1200&q=80",
    category: "Business",
    rating: 4.9,
    reviews: 892,
    description: "The complete Notion OS for small businesses.",
    features: [
      "Company wiki & SOPs",
      "Sales pipeline & CRM",
      "Project & sprint tracker",
      "HR & team directory",
      "Financial dashboard",
      "Product roadmap & OKRs"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80",
      "https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1400"
    ],
    notionPreviewUrl: "https://www.notion.so/Small-Business-OS-b1a1b1a1b1a1b1a1b1a1b1a1b1a1b1a1"
  },
  {
    slug: "notion-complete-bundle",
    name: "The Complete Studio",
    tagline: "Every premium template. One low price.",
    price: 99,
    originalPrice: 494,
    image: "https://images.unsplash.com/photo-1642417188964-870c08705ef3?w=1400&q=80",
    category: "Bundle",
    rating: 4.9,
    reviews: 6421,
    description: "Get lifetime access to every Notion template Norra has ever released — plus every new template we launch.",
    features: [
      "Every current premium template",
      "All future template releases included",
      "Priority customer support",
      "Lifetime access & free updates",
      "Save $395 vs buying individually",
      "One-click Notion duplicate"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1642417188964-870c08705ef3?w=1400&q=80"
    ],
    notionPreviewUrl: "https://www.notion.so/Notion-Template-Gallery-181e961aeb2c80d1a419fe23fe387fa8"
  }
];

// In-memory Data Stores
const templatesStore = [...SEED_TEMPLATES];
const usersStore = new Map<string, User>();
const sessionsStore = new Map<string, UserSession>();
const ordersStore = new Map<string, Order>();
const libraryStore = new Map<string, LibraryItem>();

// Seed a default admin user for testing and evaluation
const defaultAdmin: User = {
  user_id: "user_admin_norra",
  email: "admin@norra.studio",
  name: "Studio Admin",
  picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
  role: "admin",
  created_at: new Date().toISOString(),
};
usersStore.set(defaultAdmin.user_id, defaultAdmin);

// Seed sample orders for realistic dashboard
const sampleOrders: Order[] = [
  {
    order_id: "ord_1001_seed",
    user_id: defaultAdmin.user_id,
    user_email: defaultAdmin.email,
    slugs: ["notion-complete-bundle"],
    total_cents: 9900,
    status: "paid",
    created_at: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
    paid_at: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
  },
  {
    order_id: "ord_1002_seed",
    user_id: null,
    user_email: "alexis.c@example.com",
    slugs: ["notion-second-brain"],
    total_cents: 4900,
    status: "paid",
    created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    paid_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  },
  {
    order_id: "ord_1003_seed",
    user_id: null,
    user_email: "devin.m@example.com",
    slugs: ["notion-finance-tracker"],
    total_cents: 3900,
    status: "paid",
    created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    paid_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
];
for (const order of sampleOrders) {
  ordersStore.set(order.order_id, order);
  if (order.user_id && order.status === "paid") {
    for (const slug of order.slugs) {
      if (slug === "notion-complete-bundle") {
        for (const t of SEED_TEMPLATES) {
          libraryStore.set(`${order.user_id}:${t.slug}`, {
            user_id: order.user_id,
            slug: t.slug,
            acquired_at: order.paid_at || new Date().toISOString(),
            order_id: order.order_id,
          });
        }
      } else {
        libraryStore.set(`${order.user_id}:${slug}`, {
          user_id: order.user_id,
          slug,
          acquired_at: order.paid_at || new Date().toISOString(),
          order_id: order.order_id,
        });
      }
    }
  }
}

// Helper: Resolve User from Request
function getUserFromRequest(req: Request): User | null {
  let token = req.cookies?.session_token;
  if (!token) {
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) {
      token = auth.slice(7);
    }
  }
  if (!token) return null;

  const session = sessionsStore.get(token);
  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    sessionsStore.delete(token);
    return null;
  }

  return usersStore.get(session.user_id) || null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  const api = express.Router();

  // Root & Config
  api.get('/', (req: Request, res: Response) => {
    res.json({
      message: "Norra / PathPages API",
      stripe_configured: Boolean(process.env.STRIPE_SECRET_KEY),
    });
  });

  api.get('/config', (req: Request, res: Response) => {
    res.json({
      stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || '',
      stripe_enabled: Boolean(process.env.STRIPE_SECRET_KEY),
    });
  });

  // Templates
  api.get('/templates', (req: Request, res: Response) => {
    res.json(templatesStore);
  });

  api.get('/templates/:slug', (req: Request, res: Response) => {
    const template = templatesStore.find(t => t.slug === req.params.slug);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  });

  // Auth: Session exchange & demo login
  api.post('/auth/session', async (req: Request, res: Response) => {
    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ error: 'session_id required' });
    }

    try {
      let userData = {
        email: 'user@example.com',
        name: 'Studio Guest',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        session_token: session_id,
      };

      // Try Emergent OAuth backend session resolver if available
      try {
        const response = await fetch('https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data', {
          headers: { 'X-Session-ID': session_id },
        });
        if (response.ok) {
          const externalData = await response.json();
          if (externalData.email) {
            userData = {
              email: externalData.email,
              name: externalData.name || externalData.email.split('@')[0],
              picture: externalData.picture,
              session_token: externalData.session_token || session_id,
            };
          }
        }
      } catch (err) {
        // Fallback to local session handling
      }

      // Check if user already exists
      let user = Array.from(usersStore.values()).find(u => u.email === userData.email);
      if (user) {
        user.name = userData.name;
        if (userData.picture) user.picture = userData.picture;
      } else {
        const isFirst = usersStore.size <= 1; // including default admin
        user = {
          user_id: `user_${crypto.randomBytes(6).toString('hex')}`,
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          role: isFirst ? 'admin' : 'user',
          created_at: new Date().toISOString(),
        };
        usersStore.set(user.user_id, user);
      }

      const token = userData.session_token;
      const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
      sessionsStore.set(token, {
        user_id: user.user_id,
        session_token: token,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      });

      res.cookie('session_token', token, {
        maxAge: 7 * 24 * 3600 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      res.json({
        user: {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role,
        },
      });
    } catch (e: any) {
      res.status(500).json({ error: 'Auth failed', details: e?.message });
    }
  });

  // Convenient Demo / Instant Sign-In
  api.post('/auth/demo-login', (req: Request, res: Response) => {
    const role = (req.body?.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user';
    const email = role === 'admin' ? 'admin@norra.studio' : 'user@norra.studio';
    let user = Array.from(usersStore.values()).find(u => u.email === email);

    if (!user) {
      user = {
        user_id: `user_${crypto.randomBytes(6).toString('hex')}`,
        email,
        name: role === 'admin' ? 'Studio Admin' : 'Demo User',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        role,
        created_at: new Date().toISOString(),
      };
      usersStore.set(user.user_id, user);
    }

    const sessionToken = `demo_${crypto.randomBytes(12).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
    sessionsStore.set(sessionToken, {
      user_id: user.user_id,
      session_token: sessionToken,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
    });

    res.cookie('session_token', sessionToken, {
      maxAge: 7 * 24 * 3600 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    res.json({
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
    });
  });

  api.get('/auth/me', (req: Request, res: Response) => {
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
    });
  });

  api.post('/auth/logout', (req: Request, res: Response) => {
    const token = req.cookies?.session_token;
    if (token) {
      sessionsStore.delete(token);
    }
    res.clearCookie('session_token', { path: '/' });
    res.json({ ok: true });
  });

  // Checkout
  api.post('/checkout/create', async (req: Request, res: Response) => {
    const { slugs } = req.body as { slugs: string[] };
    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    const templates = templatesStore.filter(t => slugs.includes(t.slug));
    if (templates.length === 0) {
      return res.status(404).json({ error: 'Templates not found' });
    }

    const totalCents = templates.reduce((sum, t) => sum + Math.round(t.price * 100), 0);
    const user = getUserFromRequest(req);
    const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;

    const orderId = `ord_${crypto.randomBytes(7).toString('hex')}`;
    const orderDoc: Order = {
      order_id: orderId,
      user_id: user?.user_id || null,
      user_email: user?.email || null,
      slugs,
      total_cents: totalCents,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const lineItems = templates.map(t => ({
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(t.price * 100),
            product_data: {
              name: t.name,
              images: [t.image],
            },
          },
          quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: lineItems,
          success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/cart`,
          metadata: { order_id: orderId },
        });

        orderDoc.stripe_session_id = session.id;
        ordersStore.set(orderId, orderDoc);

        return res.json({
          checkout_url: session.url,
          session_id: session.id,
          mocked: false,
        });
      } catch (err) {
        console.warn('Stripe checkout creation failed, falling back to test flow', err);
      }
    }

    // Mock checkout flow
    const mockSessionId = `cs_test_mock_${crypto.randomBytes(8).toString('hex')}`;
    orderDoc.stripe_session_id = mockSessionId;
    ordersStore.set(orderId, orderDoc);

    res.json({
      checkout_url: `${origin}/checkout/success?session_id=${mockSessionId}`,
      session_id: mockSessionId,
      mocked: true,
    });
  });

  api.get('/checkout/verify/:session_id', async (req: Request, res: Response) => {
    const sessionId = req.params.session_id;
    const order = Array.from(ordersStore.values()).find(o => o.stripe_session_id === sessionId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let paid = false;
    if (process.env.STRIPE_SECRET_KEY && !sessionId.startsWith('cs_test_mock_')) {
      try {
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const s = await stripe.checkout.sessions.retrieve(sessionId);
        paid = s.payment_status === 'paid';
      } catch (err) {
        paid = false;
      }
    } else {
      paid = true; // Instant mock success
    }

    if (paid && order.status !== 'paid') {
      order.status = 'paid';
      order.paid_at = new Date().toISOString();

      const user = getUserFromRequest(req);
      const uid = order.user_id || user?.user_id;

      if (uid) {
        order.user_id = uid;
        for (const slug of order.slugs) {
          if (slug === 'notion-complete-bundle') {
            // Complete bundle unlocks all templates
            for (const t of SEED_TEMPLATES) {
              libraryStore.set(`${uid}:${t.slug}`, {
                user_id: uid,
                slug: t.slug,
                acquired_at: new Date().toISOString(),
                order_id: order.order_id,
              });
            }
          } else {
            libraryStore.set(`${uid}:${slug}`, {
              user_id: uid,
              slug,
              acquired_at: new Date().toISOString(),
              order_id: order.order_id,
            });
          }
        }
      }
    }

    res.json({
      order,
      paid,
    });
  });

  // Library
  api.get('/library', (req: Request, res: Response) => {
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userItems = Array.from(libraryStore.values()).filter(i => i.user_id === user.user_id);
    const slugs = userItems.map(i => i.slug);
    const templates = templatesStore.filter(t => slugs.includes(t.slug));

    res.json({
      templates,
      count: templates.length,
    });
  });

  // Admin
  api.get('/admin/orders', (req: Request, res: Response) => {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const orders = Array.from(ordersStore.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    res.json({ orders });
  });

  api.get('/admin/stats', (req: Request, res: Response) => {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const paidOrders = Array.from(ordersStore.values()).filter(o => o.status === 'paid');
    const revenue = paidOrders.reduce((sum, o) => sum + (o.total_cents || 0), 0) / 100;
    const totalUsers = usersStore.size;

    res.json({
      total_orders: paidOrders.length,
      total_users: totalUsers,
      revenue,
    });
  });

  // Mount API routes
  app.use('/api', api);

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Norra app server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
