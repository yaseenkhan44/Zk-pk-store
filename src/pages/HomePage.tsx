import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { ArrowRight, ShieldCheck, Truck, Clock, Award, Star, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, onBuyNow, onNavigate }) => {
  const { products, categories, blogPosts, siteConfig } = useStore();

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 8);
  const featuredLuxury = products.filter(p => p.category === 'Luxury Watches' || p.category === 'Chronograph Watches').slice(0, 6);

  const customerReviews = [
    {
      name: "Muhammad Bilal",
      city: "Lahore (DHA Phase 5)",
      rating: 5,
      comment: "Ordered the ZK Monaco Chrono for Rs. 1,499. The parcel arrived in 2 days via TCS. I checked the watch before paying the rider. The weight and finishing is genuinely astonishing.",
      date: "2 days ago",
      verified: true,
      product: "ZK Monaco Racing Blue Dual-Dial"
    },
    {
      name: "Syed Daniyal Shah",
      city: "Karachi (Clifton)",
      rating: 5,
      comment: "Superb packaging with official warranty card. The watch looks much more expensive than 2,000 rupees. Wearing it to work every day.",
      date: "4 days ago",
      verified: true,
      product: "ZK Speedmaster Chronograph"
    },
    {
      name: "Adeel Rehman",
      city: "Islamabad (F-10)",
      rating: 5,
      comment: "WhatsApp ordering was completely seamless. Sent my address and received tracking number next morning. 100% recommended for Pakistani buyers.",
      date: "1 week ago",
      verified: true,
      product: "ZK Cosmograph Daytona Rainbow"
    },
    {
      name: "Hamza Tariq",
      city: "Faisalabad",
      rating: 5,
      comment: "Got the Rs. 999 minimalist black watch. Best 1,000 rupees I ever spent online. The strap is soft and doesn't sweat.",
      date: "1 week ago",
      verified: true,
      product: "ZK Classic Minimalist Black"
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/images/hero-banner.jpg"
            alt="ZK.pk Luxury Timepieces Showcase"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-36 flex flex-col justify-center min-h-[580px]">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Pakistani Timepiece House</span>
            </div>

            <h1 className="font-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Timeless Precision.<br />
              <span className="text-stone-300">Uncompromising Luxury.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
              Discover Pakistan's finest collection of chronographs, luxury automatics, and daily statement watches. Delivered to your doorstep with <strong>Cash on Delivery</strong> and our trusted <strong>7-Day Checking Warranty</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('products')}
                className="px-7 py-3.5 bg-white hover:bg-stone-100 text-stone-950 rounded-lg text-sm font-bold tracking-tight flex items-center gap-2 transition-all shadow-md group"
              >
                <span>Shop Catalog (From Rs. 999)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('categories')}
                className="px-6 py-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-lg text-sm font-semibold tracking-tight transition-colors backdrop-blur-xs"
              >
                Browse Categories
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Over 35 Curated Models
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Nationwide 2–4 Day Dispatch
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Open Parcel Checking Allowed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST PILLARS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border border-stone-200 rounded-2xl shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">Cash on Delivery</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Zero advance required</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">7-Day Guarantee</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Checking & replacement</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">Fast Courier</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">TCS & Leopards Express</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">100% Inspected</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Pre-dispatch QC tested</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Curated Horizons</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-luxury mt-1">Featured Categories</h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs sm:text-sm font-semibold text-stone-800 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map(category => (
            <div
              key={category.id}
              onClick={() => onNavigate('products', { category: category.name })}
              className="group relative bg-white border border-stone-200 rounded-xl overflow-hidden cursor-pointer hover:border-stone-400 hover:shadow-md transition-all duration-200"
            >
              <div className="aspect-4/3 bg-stone-100 overflow-hidden">
                <img
                  src={category.image || '/images/watch-01.jpg'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {category.name}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLING WATCHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Pakistan's Favorites</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-luxury mt-1">Best Selling Watches</h2>
          </div>
          <button
            onClick={() => onNavigate('products', { sort: 'best_seller' })}
            className="text-xs sm:text-sm font-semibold text-stone-800 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            <span>See All Best Sellers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </section>

      {/* 5. SHOP BY PRICE TIERS (CRITICAL USER PRICING SPECIFICATION) */}
      <section className="bg-stone-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Transparent Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-luxury mt-1">Shop By Price Tier</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Browse watches precisely crafted for every Pakistani budget. Fixed, honest prices with zero hidden charges.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {[
              { label: 'Rs. 999 Tier', min: 999, max: 999, desc: 'Everyday Essentials' },
              { label: 'Rs. 1,199 Tier', min: 1199, max: 1199, desc: 'Date Complications' },
              { label: 'Rs. 1,499 Tier', min: 1499, max: 1499, desc: 'Classic Link & Mesh' },
              { label: 'Rs. 1,999 Tier', min: 1999, max: 1999, desc: 'Executive & Calling' },
              { label: 'Rs. 2,499 Tier', min: 2499, max: 2499, desc: 'Titanium & Tactical' },
              { label: 'Rs. 3,499 Tier', min: 3499, max: 3499, desc: 'Automatic Mechanical' },
              { label: 'Rs. 4,599 Tier', min: 4599, max: 4599, desc: 'Flagship Luxury' },
            ].map((tier, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('products', { minPrice: tier.min, maxPrice: tier.max })}
                className="bg-white p-4 rounded-xl border border-stone-200 hover:border-amber-700 hover:shadow-md transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase">Tier {idx + 1}</span>
                  <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 font-mono mt-0.5">
                    {tier.label}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-tight">{tier.desc}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-amber-700 font-medium">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Fresh Releases</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-luxury mt-1">New Arrivals</h2>
          </div>
          <button
            onClick={() => onNavigate('products', { sort: 'newest' })}
            className="text-xs sm:text-sm font-semibold text-stone-800 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            <span>View All New Arrivals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </section>

      {/* 7. SPECIAL OFFERS / LUXURY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 relative overflow-hidden">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Masterpiece Collection</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-luxury">
              Precision Automatic & Rainbow Daytona Editions
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Explore our mechanical self-winding automatics and baguette rainbow chronographs. Hand-calibrated movements with dual sapphire crystals and genuine solid link bracelets.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('products', { category: 'Luxury Watches' })}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
              >
                Discover Luxury Suite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE ZK.PK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Our Reputation</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-luxury mt-1">Why Choose ZK.pk?</h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Built on integrity, transparent pricing, and direct customer care in Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-stone-900">Pre-Dispatch Inspection</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every watch is individually examined for time accuracy, crystal scratches, and date wheel alignment before courier handover. No surprise defects.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-stone-900">7-Day Checking Warranty</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Open your parcel upon arrival. If there is any manufacturing fault, we arrange an immediate replacement or full exchange with zero dispute.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-stone-900">Direct WhatsApp Ordering</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Prefer ordering without forms? Chat directly with our horology team on WhatsApp at <strong>{siteConfig.phone}</strong> for instant order confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS */}
      <section className="bg-stone-50 py-14 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Verified Buyers</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-luxury mt-1">What Pakistani Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerReviews.map((rev, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">"{rev.comment}"</p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">{rev.name}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">{rev.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. LATEST BLOG POSTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Horology Journal</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-luxury mt-1">Latest Watch Guides</h2>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="text-xs sm:text-sm font-semibold text-stone-800 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            <span>Read All Articles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map(post => (
            <div
              key={post.id}
              onClick={() => onNavigate('blog-post', { slug: post.slug })}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md hover:border-stone-400 transition-all cursor-pointer group flex flex-col"
            >
              <div className="aspect-16/9 bg-stone-100 overflow-hidden">
                <img
                  src={post.image || '/images/watch-01.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[11px] text-stone-500 mb-1 flex items-center gap-2">
                    <span className="text-amber-800 font-semibold">{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>{post.date}</span>
                  <span className="font-semibold text-stone-900 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Guide <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
