import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Watch } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }
    const term = searchTerm.toLowerCase().trim();
    const results = products.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term)
    );
    setFilteredProducts(results.slice(0, 8));
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50">
          <Search className="w-5 h-5 text-stone-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search watches by name, category, brand (e.g. Chrono, Gold, 999, Sports)..."
            className="w-full bg-transparent text-stone-900 placeholder-stone-400 text-sm sm:text-base focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 text-stone-500 hover:text-stone-900 bg-stone-200/70 rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        <div className="px-4 py-2.5 bg-stone-100/60 border-b border-stone-200 text-xs flex items-center gap-2 overflow-x-auto text-stone-600">
          <span className="font-semibold text-stone-500 text-[11px] uppercase tracking-wider">Quick:</span>
          {['Rs. 999', 'Chronograph', 'Luxury', 'Sports', 'Smart Watch', 'Automatic'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag.replace('Rs. ', ''))}
              className="px-2.5 py-1 bg-white hover:bg-stone-200 rounded-md text-[11px] font-medium border border-stone-200 text-stone-700 shrink-0 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto divide-y divide-stone-100 p-2">
          {searchTerm.trim() === '' ? (
            <div className="p-8 text-center text-stone-500 space-y-2">
              <Watch className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm font-medium text-stone-700">Type anything to search the ZK.pk catalog</p>
              <p className="text-xs text-stone-400">Over 35 premium watches available with nationwide Cash on Delivery.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-stone-500 space-y-1">
              <p className="text-sm font-semibold text-stone-800">No watches matching "{searchTerm}"</p>
              <p className="text-xs text-stone-400">Try searching for "Rs 999", "Chronograph", "Gold", or "Leather".</p>
            </div>
          ) : (
            filteredProducts.map(product => {
              const imgUrl = product.image || `/images/watch-${String(product.id).padStart(2, '0')}.jpg`;
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                      <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-stone-500">{product.brand} · {product.category}</p>
                      <h4 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-mono font-bold text-stone-950 tabular-nums">
                        Rs. {product.price.toLocaleString()}
                        {product.oldPrice && (
                          <span className="ml-1.5 text-[11px] text-stone-400 line-through font-normal">
                            Rs. {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
