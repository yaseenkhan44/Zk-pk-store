import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, BlogPost, SiteConfig } from '../types';
import { initialProducts } from '../data/products';
import { initialCategories } from '../data/categories';
import { initialBlogPosts } from '../data/blogPosts';
import { defaultSiteConfig } from '../data/siteConfig';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  blogPosts: BlogPost[];
  siteConfig: SiteConfig;
  isLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshProducts: () => Promise<void>;
  updateSiteConfig: (config: SiteConfig) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStoreData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, blogRes, configRes] = await Promise.all([
        fetch('/api/products').catch(() => null),
        fetch('/api/categories').catch(() => null),
        fetch('/api/blog').catch(() => null),
        fetch('/api/site-config').catch(() => null),
      ]);

      if (prodRes && prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success && prodData.data?.length > 0) {
          setProducts(prodData.data);
        }
      }
      if (catRes && catRes.ok) {
        const catData = await catRes.json();
        if (catData.success && catData.data?.length > 0) {
          setCategories(catData.data);
        }
      }
      if (blogRes && blogRes.ok) {
        const blogData = await blogRes.json();
        if (blogData.success && blogData.data?.length > 0) {
          setBlogPosts(blogData.data);
        }
      }
      if (configRes && configRes.ok) {
        const configData = await configRes.json();
        if (configData.success && configData.data) {
          setSiteConfig(configData.data);
        }
      }
    } catch (err) {
      console.warn('Backend API initial fetch fell back to local initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to refresh products:', err);
    }
  };

  const updateSiteConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        blogPosts,
        siteConfig,
        isLoading,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        refreshProducts,
        updateSiteConfig,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
