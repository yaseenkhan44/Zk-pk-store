export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discountBadge?: string;
  category: string;
  brand: string;
  image: string;
  gallery: string[];
  sku: string;
  stock: number;
  isAvailable: boolean;
  shortDescription: string;
  description: string;
  features: string[];
  specs: {
    movement: string;
    caseDiameter: string;
    caseThickness?: string;
    strapMaterial: string;
    waterResistance: string;
    glassType: string;
    warranty: string;
  };
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSpecialOffer?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  count?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer / JazzCash';
  status: 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  tags: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Replied';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface SiteConfig {
  siteName: string;
  logoText: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  whatsappInternational: string;
  email: string;
  address: string;
  businessHours: string;
  announcementText: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  currency: string;
}
