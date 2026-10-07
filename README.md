# ZK.pk — Premium Watch E-Commerce Platform

A professional, Shopify-style watch e-commerce website engineered for the Pakistani market with Cash on Delivery (COD), WhatsApp 1-click ordering, real Node.js/Express REST backend, and persistent database storage.

---

## 🇵🇰 Key Features & Pakistani Market Customization

- **Target Currency**: PKR / Rs. (Tabular numbers)
- **Official WhatsApp Hotline**: `03111089742` (International: `+923111089742`)
- **Payment Method**: Cash on Delivery (COD) across Pakistan, Bank Transfer / JazzCash / EasyPaisa notes
- **Courier Logistics**: Integrated for TCS, Leopards Courier, Trax, and M&P (2–4 working days nationwide)
- **7-Day Checking Warranty**: Open parcel inspection guarantee
- **35+ Watch Catalog**: Strict conformance to required pricing tiers:
  - Products 1–5: Rs. 999
  - Products 6–10: Rs. 1,199
  - Products 11–15: Rs. 1,499
  - Products 16–20: Rs. 1,999
  - Products 21–25: Rs. 3,499
  - Products 26–30: Rs. 4,599
  - Products 31–35: Rs. 2,499

---

## 📁 Project Structure

```text
├── public/
│   ├── images/              # High-res product images (watch-01.jpg ... watch-35.jpg, hero-banner.jpg)
│   ├── products.js          # User-friendly standalone product data file for easy replacement
│   └── robots.txt           # SEO robots directives
├── data/
│   └── db/                  # Persistent JSON document database (mirrors MongoDB collections)
│       ├── products.json
│       ├── orders.json
│       ├── categories.json
│       ├── customers.json
│       ├── blog_posts.json
│       ├── contacts.json
│       ├── subscribers.json
│       └── site_config.json
├── server/
│   └── db.ts                # Database engine & persistence layer
├── src/
│   ├── assets/              # Generated high-resolution horology assets
│   ├── components/          # Reusable UI components
│   │   ├── AnnouncementBar.tsx # Top promotional banner
│   │   ├── Navbar.tsx          # Sticky 3-zone Top Bar Contract navigation
│   │   ├── ProductCard.tsx     # Shopify-style product card with hover quick-actions
│   │   ├── CartDrawer.tsx      # Slide-out shopping bag with free shipping tracker
│   │   ├── SearchModal.tsx     # Fast real-time watch search
│   │   └── Footer.tsx          # Comprehensive footer with policies & trust badges
│   ├── context/
│   │   ├── CartContext.tsx     # Shopping bag & persistent state
│   │   └── StoreContext.tsx    # Catalog, categories, articles, and site config state
│   ├── data/
│   │   ├── products.ts         # All 35 watches with full specs & pricing tiers
│   │   ├── categories.ts       # Watch categories
│   │   ├── blogPosts.ts        # 8 original, authoritative watch guides
│   │   └── siteConfig.ts       # Editable store contact & branding
│   ├── pages/
│   │   ├── HomePage.tsx        # Hero banner, featured tiers, reviews, testimonials
│   │   ├── ProductsPage.tsx    # Filterable catalog (price, category, brand, sorting)
│   │   ├── CategoriesPage.tsx  # Collection showcase
│   │   ├── ProductDetailPage.tsx # PDP with image gallery, specs, and WhatsApp order
│   │   ├── CheckoutPage.tsx    # Pakistani delivery form, COD & WhatsApp confirmation
│   │   ├── BlogPage.tsx        # 8 watch articles
│   │   ├── BlogPostPage.tsx    # Full article reader
│   │   ├── AboutPage.tsx       # Brand story & quality control
│   │   ├── ContactPage.tsx     # Form connected to database & map placeholder
│   │   ├── PolicyPage.tsx      # Refund (7-day), Shipping, Privacy, Terms & Disclaimer
│   │   └── AdminPage.tsx       # Live Admin Dashboard
│   ├── types.ts             # TypeScript interfaces
│   ├── App.tsx              # Application root & view router
│   ├── main.tsx             # React entry point
│   └── index.css            # Tailwind CSS styling & typography
├── server.ts                # Express backend REST API + Vite dev server
├── package.json
└── vite.config.ts
```

---

## ⏱️ Easy Product Replacement Guide

You can easily replace watch images and details in **3 simple ways**:

### Method 1: Using the Live Admin Dashboard (Recommended for Beginners)
1. Go to `/admin` in your browser.
2. Log in with the default password: `admin123`.
3. Click **"Add New Watch"** or click the **Edit icon** next to any watch.
4. Update the name, price, stock, image path (`images/watch-01.jpg`), and description. Click **Save Watch** — changes take effect immediately!

### Method 2: Editing `src/data/products.ts`
1. Open `src/data/products.ts`.
2. Locate the product ID you want to modify (e.g., ID 1 for Rs. 999).
3. Change:
   - `name`: "Your New Watch Name"
   - `price`: 999
   - `image`: "/images/watch-01.jpg" (place your new image in `/public/images/`)
   - `specs`: movement, caseDiameter, strapMaterial

### Method 3: Dropping New Images
Replace any file in `public/images/watch-01.jpg` through `watch-35.jpg` with your own watch photograph. The website will immediately display your new image!

---

## 🛠️ REST API Endpoints

- `GET /api/products` — List watches with category, price, and search filters
- `GET /api/products/:id` — Single watch details
- `POST /api/products` — Add watch (Admin token required)
- `PUT /api/products/:id` — Update watch (Admin token required)
- `DELETE /api/products/:id` — Remove watch (Admin token required)
- `GET /api/categories` — List all categories
- `GET /api/orders` — List customer orders (Admin)
- `POST /api/orders` — Create Cash on Delivery order
- `PUT /api/orders/:id/status` — Update order status (Pending, Processing, Dispatched, Delivered)
- `GET /api/customers` — List registered customers
- `POST /api/contact` — Submit customer message
- `POST /api/newsletter` — Subscribe to VIP discounts
- `GET /api/blog` — List blog articles
- `POST /api/admin/login` — Authenticate admin session
- `GET /sitemap.xml` — Dynamic XML sitemap for SEO
- `GET /robots.txt` — SEO crawler rules

---

## 🚀 Running the App

```bash
# Start development server
npm run dev

# Run compilation & type check
npm run lint

# Build production bundle
npm run build
```
