import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage } from './pages/PolicyPage';
import { AdminPage } from './pages/AdminPage';
import { Product, BlogPost } from './types';

function StoreApp() {
  const { products, blogPosts } = useStore();
  const { addToCart, toastMessage, clearToast } = useCart();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [filterParams, setFilterParams] = useState<{
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    tab?: string;
  }>({});

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView, selectedProduct, selectedPost]);

  const handleNavigate = (view: string, params: any = {}) => {
    setFilterParams(params);
    if (view === 'products' && params.category) {
      setFilterParams(params);
    }
    setCurrentView(view);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleBuyNow = (product: Product, qty: number = 1) => {
    addToCart(product, qty);
    setCurrentView('checkout');
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('blog-post');
  };

  const handleViewProductFromCart = (productId: number) => {
    const found = products.find(p => p.id === productId);
    if (found) {
      setSelectedProduct(found);
      setCurrentView('product-detail');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span>{toastMessage}</span>
          <button onClick={clearToast} className="text-stone-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Main Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onBuyNow={handleBuyNow}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'products' && (
          <ProductsPage
            key={JSON.stringify(filterParams)}
            onSelectProduct={handleSelectProduct}
            onBuyNow={handleBuyNow}
            initialCategory={filterParams.category || 'All'}
            initialMinPrice={filterParams.minPrice}
            initialMaxPrice={filterParams.maxPrice}
            initialSort={filterParams.sort || 'featured'}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage
            onSelectCategory={(catName) => handleNavigate('products', { category: catName })}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onSelectProduct={handleSelectProduct}
            onBuyNow={handleBuyNow}
            onNavigateCategory={(cat) => handleNavigate('products', { category: cat })}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => handleNavigate('home')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'blog' && (
          <BlogPage onSelectPost={handleSelectPost} />
        )}

        {currentView === 'blog-post' && selectedPost && (
          <BlogPostPage
            post={selectedPost}
            onBack={() => setCurrentView('blog')}
            onSelectPost={handleSelectPost}
          />
        )}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'policy' && (
          <PolicyPage initialTab={filterParams.tab || 'refund'} />
        )}

        {currentView === 'admin' && <AdminPage />}
      </main>

      {/* Shopify-style Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        onCheckout={() => setCurrentView('checkout')}
        onViewProduct={handleViewProductFromCart}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <StoreApp />
      </CartProvider>
    </StoreProvider>
  );
}
