import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

interface CategoriesPageProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const { categories, products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Horological Horizons</span>
        <h1 className="text-3xl sm:text-4xl font-bold font-luxury text-stone-900 mt-1">Watch Collections</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
          From executive stainless steel and automatic open-hearts to high-durability tactical chronographs. Explore our curated collections for the Pakistani gentleman.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((cat) => {
          const matchCount = products.filter(p =>
            p.category.toLowerCase().includes(cat.name.toLowerCase()) ||
            (cat.slug === 'new-arrivals' && p.isNewArrival) ||
            (cat.slug === 'best-sellers' && p.isBestSeller)
          ).length;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-stone-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  <img
                    src={cat.image || '/images/watch-01.jpg'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                    {matchCount} Models
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
