import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Send, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteConfig } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subMsg, setSubMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSubscribed(true);
      setSubMsg(data.message || 'Subscribed successfully!');
      setEmail('');
    } catch {
      setSubscribed(true);
      setSubMsg('Thank you for subscribing to ZK.pk updates!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800 text-stone-200">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">Cash on Delivery</h4>
              <p className="text-xs text-stone-400">Pay at your doorstep across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">7-Day Checking Warranty</h4>
              <p className="text-xs text-stone-400">Inspect parcel with zero risk</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">Easy Exchanges</h4>
              <p className="text-xs text-stone-400">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">Direct WhatsApp Support</h4>
              <p className="text-xs text-stone-400">0311-1089742 (10 AM - 10 PM)</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-left focus:outline-hidden"
            >
              <span className="font-luxury text-3xl font-bold tracking-wider text-white">
                ZK<span className="text-amber-500">.pk</span>
              </span>
            </button>
            <p className="text-xs leading-relaxed text-stone-400 max-w-sm">
              ZK.pk is Pakistan's premier destination for luxury, chronograph, sports, and executive watches. Every timepiece is individually inspected and shipped with a 7-day checking guarantee.
            </p>

            <div className="space-y-2 text-xs text-stone-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteConfig.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteConfig.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Helpline / WhatsApp: {siteConfig.phone}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${siteConfig.whatsappInternational}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Order on WhatsApp: 03111089742</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Collections</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('products', { category: 'Men\'s Watches' })} className="hover:text-white transition-colors">
                  Men's Watches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'Luxury Watches' })} className="hover:text-white transition-colors">
                  Luxury Watches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'Chronograph Watches' })} className="hover:text-white transition-colors">
                  Chronographs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'Sports Watches' })} className="hover:text-white transition-colors">
                  Sports Watches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'Smart Watches' })} className="hover:text-white transition-colors">
                  Smart Watches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { minPrice: 999, maxPrice: 999 })} className="hover:text-amber-400 transition-colors">
                  Watches Under Rs. 1000
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Policy Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About ZK.pk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy', { tab: 'refund' })} className="hover:text-white transition-colors">
                  Refund & Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy', { tab: 'shipping' })} className="hover:text-white transition-colors">
                  Shipping Policy (COD)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy', { tab: 'privacy' })} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy', { tab: 'terms' })} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy', { tab: 'disclaimer' })} className="hover:text-white transition-colors">
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">VIP Newsletter</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Subscribe for exclusive secret discount codes, flash sales, and new timepiece arrivals in Pakistan.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-stone-800 text-stone-100 placeholder-stone-500 text-xs px-3 py-2.5 rounded-lg border border-stone-700 w-full focus:outline-hidden focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2.5 rounded-lg text-xs font-semibold shrink-0 transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>{subMsg}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Logistics, Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-wrap items-center gap-3 text-stone-400">
            <span className="font-semibold text-stone-300">Courier Partners:</span>
            <span>TCS Express</span>
            <span>·</span>
            <span>Leopards Courier</span>
            <span>·</span>
            <span>Trax Logistics</span>
            <span>·</span>
            <span>M&P</span>
          </div>

          <div className="text-center md:text-right">
            <p>© {new Date().getFullYear()} ZK.pk — Official Watch Store Pakistan. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
