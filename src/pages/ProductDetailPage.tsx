import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  ShoppingBag,
  Zap,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
  onBuyNow: (p: Product, qty: number) => void;
  onNavigateCategory: (categoryName: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onSelectProduct,
  onBuyNow,
  onNavigateCategory,
}) => {
  const { addToCart } = useCart();
  const { products, siteConfig } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image || `/images/watch-${String(product.id).padStart(2, '0')}.jpg`);
  const [addedToast, setAddedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState([
    {
      author: 'Shahid Mehmood',
      city: 'Rawalpindi',
      rating: 5,
      date: '3 days ago',
      text: 'Received in 2 days. The crystal is crystal clear and the date changes sharply at midnight. Looks 100% premium.',
    },
    {
      author: 'Khurram Jamil',
      city: 'Lahore (Johar Town)',
      rating: 5,
      date: '1 week ago',
      text: 'The weight of the watch is substantial. Packaging was secure with bubbles and warranty card. Excellent service by ZK.pk.',
    },
  ]);

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  const handleWhatsAppOrder = () => {
    const total = product.price * quantity;
    const message = `Assalam-o-Alaikum ZK.pk, I want to order this watch via WhatsApp:\n\n*Product:* ${product.name}\n*SKU:* ${product.sku}\n*Quantity:* ${quantity}\n*Price:* Rs. ${product.price.toLocaleString()} each\n*Total:* Rs. ${total.toLocaleString()} (Cash on Delivery)\n\nPlease confirm my parcel and send to my delivery address.`;
    const url = `https://wa.me/${siteConfig.whatsappInternational}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setReviewsList([
      {
        author: reviewName,
        city: 'Verified Buyer',
        rating: reviewRating,
        date: 'Just now',
        text: reviewComment,
      },
      ...reviewsList,
    ]);
    setReviewName('');
    setReviewComment('');
  };

  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image, '/images/watch_gold.jpg', '/images/watch_silver.jpg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => onNavigateCategory('All')} className="hover:text-stone-900 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <button
          onClick={() => onNavigateCategory(product.category)}
          className="hover:text-stone-900 transition-colors font-medium text-stone-700"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: Sticky Image Showcase */}
        <div className="space-y-4">
          <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-stone-200">
            {product.discountBadge && (
              <span className="absolute top-4 left-4 z-10 bg-amber-800 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-xs">
                {product.discountBadge}
              </span>
            )}
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImage === img
                    ? 'border-stone-900 ring-2 ring-stone-900/10'
                    : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="font-bold text-amber-800 uppercase tracking-widest">{product.brand}</span>
              <span className="font-mono text-stone-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-luxury text-stone-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars & Share */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-800 font-mono">{product.rating}</span>
                <span className="text-xs text-stone-500">({product.reviewsCount} customer reviews)</span>
              </div>

              <button
                onClick={handleShare}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium transition-colors"
                title="Share Watch Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-stone-100/70 border border-stone-200 rounded-xl flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-stone-950 font-mono tabular-nums">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-base text-stone-400 line-through font-mono tabular-nums">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
              Cash on Delivery (COD)
            </span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-stone-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Stock availability */}
          <div className="flex items-center gap-2 text-xs font-medium">
            {product.isAvailable && product.stock > 0 ? (
              <span className="text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                In Stock ({product.stock} units ready for immediate dispatch)
              </span>
            ) : (
              <span className="text-rose-600 font-bold">Currently Sold Out</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-stone-300 rounded-lg bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-stone-600 hover:text-stone-950 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-stone-900 font-mono tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-stone-600 hover:text-stone-950 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="py-3.5 px-6 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {addedToast ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.isAvailable}
                className="py-3.5 px-6 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (Cash on Delivery)</span>
              </button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Order Directly on WhatsApp: {siteConfig.phone}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200 text-center">
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <ShieldCheck className="w-4 h-4 text-amber-800 mx-auto" />
              <span className="text-[11px] font-bold text-stone-900 block">7-Day Warranty</span>
              <span className="text-[10px] text-stone-500 block">Checking & Swap</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <Truck className="w-4 h-4 text-amber-800 mx-auto" />
              <span className="text-[11px] font-bold text-stone-900 block">Nationwide COD</span>
              <span className="text-[10px] text-stone-500 block">2–4 Work Days</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <RotateCcw className="w-4 h-4 text-amber-800 mx-auto" />
              <span className="text-[11px] font-bold text-stone-900 block">Zero Risk</span>
              <span className="text-[10px] text-stone-500 block">Inspect on Arrival</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Horology Details Section */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Engineering & Craftsmanship</span>
          <h2 className="text-2xl font-bold font-luxury text-stone-900 mt-1">Product Details & Specifications</h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Feature Highlights */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Key Features:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical Specs Table */}
        <div className="space-y-3 pt-4 border-t border-stone-200">
          <h3 className="text-sm font-bold text-stone-900">Technical Specifications:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Movement Caliber</span>
              <span className="font-semibold text-stone-900">{product.specs.movement}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Case Diameter</span>
              <span className="font-semibold text-stone-900">{product.specs.caseDiameter}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Strap Material</span>
              <span className="font-semibold text-stone-900">{product.specs.strapMaterial}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Water Resistance</span>
              <span className="font-semibold text-stone-900">{product.specs.waterResistance}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Crystal / Glass Type</span>
              <span className="font-semibold text-stone-900">{product.specs.glassType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Warranty Coverage</span>
              <span className="font-semibold text-emerald-800">{product.specs.warranty}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section with Submission */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h2 className="text-xl font-bold font-luxury text-stone-900">Customer Reviews & Ratings</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-900 font-mono">{product.rating} out of 5</span>
              <span className="text-xs text-stone-500">· Based on verified buyers</span>
            </div>
          </div>
        </div>

        {/* Existing Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsList.map((rev, idx) => (
            <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{rev.author}</span>
                <span className="text-stone-400">{rev.date}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{rev.text}</p>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-stone-200 space-y-4">
          <h3 className="text-sm font-bold text-stone-900">Write a Review for this Watch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="Your Name (e.g. Asad Khan)"
              required
              className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
            />
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span>Your Rating:</span>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={3}
            placeholder="Describe the build quality, strap feel, delivery experience, etc."
            required
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Submit Review
          </button>
        </form>
      </section>

      {/* Related Watches */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Recommended Pairings</span>
              <h2 className="text-2xl font-bold font-luxury text-stone-900 mt-1">Related Timepieces</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectProduct}
                onBuyNow={(prod) => onBuyNow(prod, 1)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
