import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { initialProducts } from '../src/data/products';
import { initialCategories } from '../src/data/categories';
import { initialBlogPosts } from '../src/data/blogPosts';
import { defaultSiteConfig } from '../src/data/siteConfig';
import { Product, Category, Order, Customer, BlogPost, ContactMessage, NewsletterSubscriber, SiteConfig } from '../src/types';

const DB_DIR = path.resolve(process.cwd(), 'data/db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function getFilePath(collection: string): string {
  return path.join(DB_DIR, `${collection}.json`);
}

function readCollection<T>(collection: string, defaultData: T): T {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${collection}, resetting to default:`, err);
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
}

function writeCollection<T>(collection: string, data: T): void {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'zk_pk_salt_2026').digest('hex');
}

export const db = {
  // Products
  getProducts(): Product[] {
    return readCollection<Product[]>('products', initialProducts);
  },
  saveProducts(products: Product[]): void {
    writeCollection('products', products);
  },
  getProductById(id: number): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },
  addProduct(product: Omit<Product, 'id'> & { id?: number }): Product {
    const products = this.getProducts();
    const newId = product.id || (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1);
    const newProduct: Product = {
      ...product,
      id: newId,
      gallery: product.gallery && product.gallery.length > 0 ? product.gallery : [product.image],
      isAvailable: product.stock > 0,
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  },
  updateProduct(id: number, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    if (updates.stock !== undefined) {
      products[index].isAvailable = products[index].stock > 0;
    }
    this.saveProducts(products);
    return products[index];
  },
  deleteProduct(id: number): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    this.saveProducts(filtered);
    return true;
  },

  // Categories
  getCategories(): Category[] {
    return readCollection<Category[]>('categories', initialCategories);
  },
  saveCategories(categories: Category[]): void {
    writeCollection('categories', categories);
  },
  addCategory(category: Category): Category {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
    return category;
  },
  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;
    this.saveCategories(filtered);
    return true;
  },

  // Orders
  getOrders(): Order[] {
    return readCollection<Order[]>('orders', []);
  },
  saveOrders(orders: Order[]): void {
    writeCollection('orders', orders);
  },
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order {
    const orders = this.getOrders();
    const count = orders.length + 1;
    const orderNumber = `ZK-${String(1000 + count)}`;
    const newOrder: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      orderNumber,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Update customer registry
    this.recordCustomerFromOrder(newOrder);

    // Deduct stock for ordered products
    for (const item of newOrder.items) {
      const prod = this.getProductById(item.productId);
      if (prod && prod.stock > 0) {
        const remaining = Math.max(0, prod.stock - item.quantity);
        this.updateProduct(prod.id, { stock: remaining });
      }
    }

    return newOrder;
  },
  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    order.status = status;
    this.saveOrders(orders);
    return order;
  },

  // Customers
  getCustomers(): Customer[] {
    return readCollection<Customer[]>('customers', []);
  },
  saveCustomers(customers: Customer[]): void {
    writeCollection('customers', customers);
  },
  recordCustomerFromOrder(order: Order): void {
    const customers = this.getCustomers();
    const existingIndex = customers.findIndex(c => c.phone.trim() === order.phone.trim());
    if (existingIndex >= 0) {
      const current = customers[existingIndex];
      customers[existingIndex] = {
        ...current,
        name: order.customerName,
        email: order.email || current.email,
        address: order.address,
        city: order.city,
        totalOrders: current.totalOrders + 1,
        totalSpent: current.totalSpent + order.total,
        lastOrderDate: order.createdAt,
      };
    } else {
      customers.push({
        id: crypto.randomUUID(),
        name: order.customerName,
        phone: order.phone,
        email: order.email,
        city: order.city,
        address: order.address,
        totalOrders: 1,
        totalSpent: order.total,
        lastOrderDate: order.createdAt,
      });
    }
    this.saveCustomers(customers);
  },

  // Blog Posts
  getBlogPosts(): BlogPost[] {
    return readCollection<BlogPost[]>('blog_posts', initialBlogPosts);
  },
  saveBlogPosts(posts: BlogPost[]): void {
    writeCollection('blog_posts', posts);
  },
  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.getBlogPosts().find(p => p.slug === slug || p.id === slug);
  },
  addBlogPost(post: BlogPost): BlogPost {
    const posts = this.getBlogPosts();
    posts.unshift(post);
    this.saveBlogPosts(posts);
    return post;
  },
  updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const posts = this.getBlogPosts();
    const index = posts.findIndex(p => p.id === id || p.slug === id);
    if (index === -1) return null;
    posts[index] = { ...posts[index], ...updates };
    this.saveBlogPosts(posts);
    return posts[index];
  },
  deleteBlogPost(id: string): boolean {
    const posts = this.getBlogPosts();
    const filtered = posts.filter(p => p.id !== id && p.slug !== id);
    if (filtered.length === posts.length) return false;
    this.saveBlogPosts(filtered);
    return true;
  },

  // Contacts
  getContacts(): ContactMessage[] {
    return readCollection<ContactMessage[]>('contacts', []);
  },
  saveContacts(contacts: ContactMessage[]): void {
    writeCollection('contacts', contacts);
  },
  addContact(contact: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const contacts = this.getContacts();
    const newMsg: ContactMessage = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'Unread',
    };
    contacts.unshift(newMsg);
    this.saveContacts(contacts);
    return newMsg;
  },

  // Newsletter Subscribers
  getSubscribers(): NewsletterSubscriber[] {
    return readCollection<NewsletterSubscriber[]>('subscribers', []);
  },
  saveSubscribers(subscribers: NewsletterSubscriber[]): void {
    writeCollection('subscribers', subscribers);
  },
  addSubscriber(email: string): { success: boolean; message: string } {
    const subscribers = this.getSubscribers();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Invalid email address.' };
    }
    if (subscribers.some(s => s.email === cleanEmail)) {
      return { success: true, message: 'You are already subscribed to ZK.pk VIP alerts!' };
    }
    subscribers.unshift({
      id: crypto.randomUUID(),
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
    });
    this.saveSubscribers(subscribers);
    return { success: true, message: 'Successfully subscribed to ZK.pk watch updates!' };
  },

  // Site Config
  getSiteConfig(): SiteConfig {
    return readCollection<SiteConfig>('site_config', defaultSiteConfig);
  },
  saveSiteConfig(config: SiteConfig): void {
    writeCollection('site_config', config);
  },

  // Admin Auth
  getAdminCredentials(): { passwordHash: string; sessionToken: string } {
    const defaultCreds = {
      passwordHash: hashPassword('admin123'),
      sessionToken: 'zk_admin_default_token_' + Date.now(),
    };
    return readCollection('admin', defaultCreds);
  },
  verifyAdmin(password: string): { success: boolean; token?: string } {
    const creds = this.getAdminCredentials();
    const hashed = hashPassword(password);
    if (hashed === creds.passwordHash) {
      const newToken = crypto.randomBytes(32).toString('hex');
      writeCollection('admin', { passwordHash: creds.passwordHash, sessionToken: newToken });
      return { success: true, token: newToken };
    }
    return { success: false };
  },
  isTokenValid(token: string): boolean {
    if (!token) return false;
    const creds = this.getAdminCredentials();
    return creds.sessionToken === token;
  },

  // Reset database back to seed
  resetToDefaults(): void {
    writeCollection('products', initialProducts);
    writeCollection('categories', initialCategories);
    writeCollection('blog_posts', initialBlogPosts);
    writeCollection('site_config', defaultSiteConfig);
  }
};
