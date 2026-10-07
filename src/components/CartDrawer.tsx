import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onViewProduct: (productId: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onViewProduct }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    grandTotal,
    freeShippingRemaining,
  } = useCart();

  const { siteConfig } = useStore();

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const itemsText = items
      .map(
        i =>
          `• ${i.product.name} (Qty: ${i.quantity}) - Rs. ${(i.product.price * i.quantity).toLocaleString()}`
      )
      .join('\n');

    const message = `Assalam-o-Alaikum ZK.pk, I would like to place an order via WhatsApp:\n\n*Cart Items:*\n${itemsText}\n\n*Subtotal:* Rs. ${subtotal.toLocaleString()}\n*Shipping:* ${shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}\n*Total Amount:* Rs. ${grandTotal.toLocaleString()} (Cash on Delivery)\n\nPlease take my delivery address.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${siteConfig.whatsappInternational}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-base font-bold text-stone-900">Your Shopping Bag</h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-stone-200 text-stone-800 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping bar */}
          <div className="bg-amber-50/70 border-b border-amber-200/60 p-3 px-5 text-xs">
            {freeShippingRemaining > 0 ? (
              <div>
                <p className="text-amber-950 font-medium">
                  Add <strong className="font-mono">Rs. {freeShippingRemaining.toLocaleString()}</strong> more to unlock <span className="text-amber-800 font-bold">Free Nationwide Delivery</span>!
                </p>
                <div className="w-full bg-amber-200/80 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-700 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, ((siteConfig.freeShippingThreshold - freeShippingRemaining) / siteConfig.freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! You qualify for Free Delivery across Pakistan!</span>
              </div>
            )}
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Discover our premium watch catalog with prices starting from just Rs. 999 with Cash on Delivery.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Explore Watches
                </button>
              </div>
            ) : (
              items.map(item => {
                const imgUrl = item.product.image || `/images/watch-${String(item.product.id).padStart(2, '0')}.jpg`;
                return (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 sm:gap-4">
                    {/* Thumbnail Image */}
                    <div
                      onClick={() => {
                        onViewProduct(item.product.id);
                        setIsCartOpen(false);
                      }}
                      className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200 cursor-pointer"
                    >
                      <img
                        src={imgUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to avoid broken image frame
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() => {
                              onViewProduct(item.product.id);
                              setIsCartOpen(false);
                            }}
                            className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
                          >
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-500 font-mono">
                          SKU: {item.product.sku}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 sm:p-1.5 text-stone-600 hover:text-stone-950 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-stone-900 font-mono tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 sm:p-1.5 text-stone-600 hover:text-stone-950 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-bold text-stone-950 font-mono tabular-nums">
                            Rs. {(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery (Cash on Delivery):</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                    ) : (
                      `Rs. ${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Estimated Total:</span>
                  <span className="font-mono tabular-nums text-amber-900">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full py-3 bg-stone-900 hover:bg-stone-950 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Order via WhatsApp direct button */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Instant Order on WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span>7-Day Checking Warranty</span>
                <button
                  onClick={clearCart}
                  className="hover:text-rose-600 transition-colors underline"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
