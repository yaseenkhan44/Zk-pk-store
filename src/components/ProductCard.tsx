import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Zap, Check, Watch } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onBuyNow }) => {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1400);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product);
  };

  const displayImage = product.image || `/images/watch-${String(product.id).padStart(2, '0')}.jpg`;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white border border-stone-200/90 rounded-xl overflow-hidden hover:border-stone-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Discount badge */}
      {product.discountBadge && (
        <div className="absolute top-3 left-3 z-10 bg-amber-800/95 text-white text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase shadow-xs">
          {product.discountBadge}
        </div>
      )}

      {/* Stock status indicator */}
      {!product.isAvailable || product.stock <= 0 ? (
        <div className="absolute top-3 right-3 z-10 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          Sold Out
        </div>
      ) : product.stock <= 5 ? (
        <div className="absolute top-3 right-3 z-10 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          Only {product.stock} Left
        </div>
      ) : null}

      {/* Product Image Stage (65-75% visual weight) */}
      <div className="relative aspect-4/3 sm:aspect-square w-full bg-stone-100 overflow-hidden flex items-center justify-center">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
            <Watch className="w-8 h-8 text-stone-400" />
          </div>
        )}

        {imageError ? (
          <div className="flex flex-col items-center justify-center p-6 text-stone-400">
            <Watch className="w-12 h-12 stroke-1 mb-2 text-stone-500" />
            <span className="text-xs font-medium text-stone-600">{product.name}</span>
          </div>
        ) : (
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-300"
          />
        )}

        {/* Quick action overlay on desktop hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            disabled={!product.isAvailable}
            className="flex-1 bg-stone-900/90 hover:bg-stone-900 text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 backdrop-blur-xs transition-colors shadow-sm disabled:opacity-50"
            title="Add to Shopping Cart"
          >
            {addedAnim ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
          <button
            onClick={handleQuickBuy}
            disabled={!product.isAvailable}
            className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-sm disabled:opacity-50"
            title="Instant Checkout"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium text-stone-600 uppercase tracking-wider text-[11px]">{product.brand}</span>
            <span className="text-[11px] text-stone-400">{product.category}</span>
          </div>

          <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1 mt-1">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing Row */}
        <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-950 font-mono tabular-nums">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                Rs. {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            COD
          </span>
        </div>

        {/* Mobile Buttons (Visible on mobile/tablet) */}
        <div className="sm:hidden grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleQuickAdd}
            disabled={!product.isAvailable}
            className="w-full bg-stone-900 text-white py-2 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 disabled:opacity-50"
          >
            {addedAnim ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>Add</span>
          </button>
          <button
            onClick={handleQuickBuy}
            disabled={!product.isAvailable}
            className="w-full bg-amber-700 text-white py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
