import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useStore } from './StoreContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  freeShippingRemaining: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'zk_pk_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { siteConfig, products } = useStore();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [items]);

  // Ensure items retain valid images even if modified
  useEffect(() => {
    if (products.length > 0 && items.length > 0) {
      let changed = false;
      const updated = items.map(item => {
        const currentProd = products.find(p => p.id === item.product.id);
        if (currentProd && (!item.product.image || item.product.image !== currentProd.image)) {
          changed = true;
          return {
            ...item,
            product: {
              ...item.product,
              image: currentProd.image || `/images/watch-${String(currentProd.id).padStart(2, '0')}.jpg`,
            }
          };
        }
        return item;
      });
      if (changed) {
        setItems(updated);
      }
    }
  }, [products]);

  const addToCart = (product: Product, quantity: number = 1) => {
    // Fallback ensure image is guaranteed to never disappear
    const safeProduct = {
      ...product,
      image: product.image || `/images/watch-${String(product.id).padStart(2, '0')}.jpg`,
    };

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.product.id === safeProduct.id);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prevItems, { product: safeProduct, quantity }];
      }
    });

    setToastMessage(`Added "${safeProduct.name}" to your cart!`);
    setIsCartOpen(true);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const clearToast = () => setToastMessage(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const shippingFee = subtotal >= siteConfig.freeShippingThreshold || subtotal === 0 ? 0 : siteConfig.standardShippingFee;
  const grandTotal = subtotal + shippingFee;
  const freeShippingRemaining = Math.max(0, siteConfig.freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        grandTotal,
        freeShippingRemaining,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        clearToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
