import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { SlidersHorizontal, RotateCcw, Search, ChevronDown } from 'lucide-react';

interface ProductsPageProps {
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  initialCategory?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialSort?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onSelectProduct,
  onBuyNow,
  initialCategory = 'All',
  initialMinPrice,
  initialMaxPrice,
  initialSort = 'featured',
}) => {
  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [priceTier, setPriceTier] = useState<string>(
    initialMinPrice && initialMaxPrice && initialMinPrice === initialMaxPrice ? `${initialMinPrice}` : 'all'
  );
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [localSearch, setLocalSearch] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.brand)));
    return ['All', ...list];
  }, [products]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'All') {
        const cat = selectedCategory.toLowerCase();
        if (cat === 'new arrivals' && !product.isNewArrival) return false;
        if (cat === 'best sellers' && !product.isBestSeller) return false;
        if (cat !== 'new arrivals' && cat !== 'best sellers' && !product.category.toLowerCase().includes(cat)) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrand !== 'All' && product.brand !== selectedBrand) {
        return false;
      }

      // Price tier filter
      if (priceTier !== 'all') {
        const targetPrice = parseInt(priceTier);
        if (!isNaN(targetPrice) && product.price !== targetPrice) {
          return false;
        }
      }

      // Search
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q) ||
          product.shortDescription.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === 'best_seller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return 0; // default featured
    });
  }, [products, selectedCategory, selectedBrand, priceTier, sortBy, localSearch]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setPriceTier('all');
    setSortBy('featured');
    setLocalSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Official Catalog ({products.length} Models)
          </span>
          <h1 className="text-3xl font-bold font-luxury text-stone-900 mt-1">
            {selectedCategory === 'All' ? 'All Watches' : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Hand-inspected, genuine timepieces with Cash on Delivery and 7-day checking warranty across Pakistan.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex-1 py-2.5 px-4 bg-white border border-stone-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({filteredProducts.length} Results)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS (DESKTOP + MOBILE COLLAPSIBLE) */}
        <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-800" />
                Filter Watches
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-stone-500 hover:text-amber-800 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Model, brand, or SKU..."
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Category</label>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {['All', ...categories.map(c => c.name)].map(catName => (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === catName
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{catName}</span>
                    {catName === 'All' && <span className="text-[10px] opacity-70">({products.length})</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Tier Filter (Exact Customer Specification) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Price Tier</label>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: '999', label: 'Rs. 999 (Tier 1)' },
                  { id: '1199', label: 'Rs. 1,199 (Tier 2)' },
                  { id: '1499', label: 'Rs. 1,499 (Tier 3)' },
                  { id: '1999', label: 'Rs. 1,999 (Tier 4)' },
                  { id: '2499', label: 'Rs. 2,499 (Tier 5)' },
                  { id: '3499', label: 'Rs. 3,499 (Tier 6)' },
                  { id: '4599', label: 'Rs. 4,599 (Tier 7)' },
                ].map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setPriceTier(tier.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-mono tabular-nums transition-colors ${
                      priceTier === tier.id
                        ? 'bg-amber-800 text-white font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Brand</label>
              <div className="space-y-1">
                {brands.map(brandName => (
                  <button
                    key={brandName}
                    onClick={() => setSelectedBrand(brandName)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                      selectedBrand === brandName
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {brandName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID AREA */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar */}
          <div className="bg-white p-3 px-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-stone-500 font-medium">
              Showing <strong className="text-stone-900 font-mono">{filteredProducts.length}</strong> watches
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-stone-500">Sort by:</span>
              <div className="relative inline-block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-hidden font-medium pr-8 appearance-none cursor-pointer"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="best_seller">Best Sellers</option>
                  <option value="newest">New Arrivals</option>
                  <option value="rating">Highest Customer Rating</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <p className="text-base font-bold text-stone-800">No timepieces matched your filters</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try selecting a different category or price tier, or clear your search term.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onBuyNow={onBuyNow}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
