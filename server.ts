import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './server/db.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images from /public directory
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Basic rate-limiting memory map for security
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 200;

  const current = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  if (now - current.lastReset > windowMs) {
    current.count = 1;
    current.lastReset = now;
  } else {
    current.count += 1;
  }
  rateLimitMap.set(ip, current);

  if (current.count > maxRequests) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }
  next();
});

// Admin auth middleware helper
function checkAdminAuth(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  if (!db.isTokenValid(token)) {
    return res.status(403).json({ error: 'Forbidden: Invalid admin session' });
  }
  next();
}

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Products API
app.get('/api/products', (req: Request, res: Response) => {
  try {
    let products = db.getProducts();
    const { category, search, minPrice, maxPrice, sort, limit } = req.query;

    if (category && typeof category === 'string' && category !== 'All') {
      const catLower = category.toLowerCase();
      products = products.filter(p =>
        p.category.toLowerCase().includes(catLower) ||
        (catLower === 'new arrivals' && p.isNewArrival) ||
        (catLower === 'best sellers' && p.isBestSeller)
      );
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else if (sort === 'best_seller') {
      products.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    if (limit && !isNaN(Number(limit))) {
      products = products.slice(0, Number(limit));
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = db.getProductById(id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

app.post('/api/products', checkAdminAuth, (req: Request, res: Response) => {
  try {
    const { name, price, category, brand, image, description, stock } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required.' });
    }
    const created = db.addProduct(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/products/:id', checkAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updated = db.updateProduct(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: updated });
});

app.delete('/api/products/:id', checkAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const ok = db.deleteProduct(id);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});

// 2. Categories API
app.get('/api/categories', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json({ success: true, data: categories });
});

app.post('/api/categories', checkAdminAuth, (req: Request, res: Response) => {
  const cat = db.addCategory(req.body);
  res.status(201).json({ success: true, data: cat });
});

app.delete('/api/categories/:id', checkAdminAuth, (req: Request, res: Response) => {
  const ok = db.deleteCategory(req.params.id);
  res.json({ success: ok });
});

// 3. Orders API
app.get('/api/orders', checkAdminAuth, (_req: Request, res: Response) => {
  const orders = db.getOrders();
  res.json({ success: true, count: orders.length, data: orders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customerName, phone, address, city, items, total } = req.body;
    if (!customerName || !phone || !address || !city || !items || !items.length) {
      return res.status(400).json({ error: 'Please provide full delivery details and cart items.' });
    }

    const order = db.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/orders/:id/status', checkAdminAuth, (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, data: updated });
});

// 4. Customers API
app.get('/api/customers', checkAdminAuth, (_req: Request, res: Response) => {
  const customers = db.getCustomers();
  res.json({ success: true, count: customers.length, data: customers });
});

// 5. Contact Inquiries API
app.get('/api/contact', checkAdminAuth, (_req: Request, res: Response) => {
  const contacts = db.getContacts();
  res.json({ success: true, data: contacts });
});

app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone, and message are required.' });
    }
    const created = db.addContact(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Newsletter API
app.get('/api/newsletter', checkAdminAuth, (_req: Request, res: Response) => {
  const subscribers = db.getSubscribers();
  res.json({ success: true, data: subscribers });
});

app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const result = db.addSubscriber(email);
  res.json(result);
});

// 7. Blog Posts API
app.get('/api/blog', (_req: Request, res: Response) => {
  const posts = db.getBlogPosts();
  res.json({ success: true, data: posts });
});

app.get('/api/blog/:slug', (req: Request, res: Response) => {
  const post = db.getBlogPostBySlug(req.params.slug);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Article not found' });
  }
  res.json({ success: true, data: post });
});

app.post('/api/blog', checkAdminAuth, (req: Request, res: Response) => {
  const created = db.addBlogPost(req.body);
  res.status(201).json({ success: true, data: created });
});

app.put('/api/blog/:id', checkAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateBlogPost(req.params.id, req.body);
  res.json({ success: !!updated, data: updated });
});

app.delete('/api/blog/:id', checkAdminAuth, (req: Request, res: Response) => {
  const ok = db.deleteBlogPost(req.params.id);
  res.json({ success: ok });
});

// 8. Site Config API
app.get('/api/site-config', (_req: Request, res: Response) => {
  const config = db.getSiteConfig();
  res.json({ success: true, data: config });
});

app.put('/api/site-config', checkAdminAuth, (req: Request, res: Response) => {
  db.saveSiteConfig(req.body);
  res.json({ success: true, data: req.body });
});

// 9. Admin Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  const result = db.verifyAdmin(password);
  if (!result.success) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  res.json({ success: true, token: result.token });
});

app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ valid: false });
  }
  const token = authHeader.split(' ')[1];
  res.json({ valid: db.isTokenValid(token) });
});

app.post('/api/admin/reset-database', checkAdminAuth, (_req: Request, res: Response) => {
  db.resetToDefaults();
  res.json({ success: true, message: 'Database reset to default products and articles' });
});

// ==========================================
// Dynamic SEO Sitemap & Robots.txt
// ==========================================
app.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://zk.pk/sitemap.xml
`);
});

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const products = db.getProducts();
  const posts = db.getBlogPosts();
  const categories = db.getCategories();

  const productUrls = products
    .map(p => `  <url><loc>https://zk.pk/products/${p.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
    .join('\n');

  const postUrls = posts
    .map(p => `  <url><loc>https://zk.pk/blog/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`)
    .join('\n');

  const categoryUrls = categories
    .map(c => `  <url><loc>https://zk.pk/categories/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`)
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://zk.pk/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://zk.pk/products</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://zk.pk/categories</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://zk.pk/blog</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://zk.pk/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://zk.pk/contact</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://zk.pk/privacy-policy</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>https://zk.pk/shipping-policy</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>https://zk.pk/refund-policy</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>https://zk.pk/terms</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
${categoryUrls}
${productUrls}
${postUrls}
</urlset>`;

  res.type('application/xml');
  res.send(sitemap);
});

// ==========================================
// Vite Middleware / Static Frontend Mounting
// ==========================================
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ZK.pk Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
