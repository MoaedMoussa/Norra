import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COMPETITORS } from '../src/constants/competitors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = process.env.VITE_SITE_URL || 'https://norra.ai';

const staticRoutes = [
  '/',
  '/compare',
  '/pricing',
  '/docs'
];

const competitorRoutes = COMPETITORS.map(comp => `/compare/${comp.slug}`);

const allRoutes = [...staticRoutes, ...competitorRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);
console.log(`✅ Sitemap generated successfully at ${sitemapPath} with ${allRoutes.length} routes.`);
