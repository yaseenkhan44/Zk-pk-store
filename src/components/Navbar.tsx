import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, Shield, Phone, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { siteConfig } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'About', view: 'about' },
    { label: 'Categories', view: 'categories' },
    { label: 'Products', view: 'products' },
    { label: 'Blog', view: 'blog' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleMobileNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single text element brand wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="group text-left flex items-center gap-2 focus:outline-hidden"
              aria-label="ZK.pk Home"
            >
              <span className="font-luxury text-2xl font-bold tracking-wider text-stone-900 group-hover:text-amber-800 transition-colors">
                ZK<span className="text-amber-700">.pk</span>
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            {navItems.map(item => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`relative py-1 text-sm font-medium tracking-tight transition-colors hover:text-stone-950 focus:outline-hidden ${
                    isActive ? 'text-stone-950 font-semibold' : 'text-stone-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Search, Cart Action, and Mobile toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onOpenSearch}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors focus:outline-hidden"
              aria-label="Search watches"
              title="Search Watches"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors focus:outline-hidden"
              aria-label={`Shopping bag with ${totalItems} items`}
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Quick Admin Access Icon */}
            <button
              onClick={() => onNavigate('admin')}
              className="hidden lg:flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 py-1.5 px-2.5 rounded-md hover:bg-stone-100 transition-colors"
              title="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors focus:outline-hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in duration-150">
          <div className="grid gap-1">
            {navItems.map(item => (
              <button
                key={item.view}
                onClick={() => handleMobileNav(item.view)}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-base font-medium rounded-lg text-left transition-colors ${
                  currentView === item.view
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}

            <button
              onClick={() => handleMobileNav('admin')}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg text-stone-600 hover:bg-stone-50"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-stone-500" />
                <span>Admin Panel</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex items-center justify-between py-1">
              <span>Customer Support:</span>
              <span className="font-medium text-stone-900">{siteConfig.phone}</span>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsappInternational}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium text-sm transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Order on WhatsApp: {siteConfig.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
