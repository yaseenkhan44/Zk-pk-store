import React from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, ShieldCheck, Phone } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { siteConfig } = useStore();

  return (
    <div className="bg-stone-900 text-stone-100 text-xs py-2 px-4 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center">
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-medium tracking-tight">
            Free Nationwide Delivery on Orders Over Rs. {siteConfig.freeShippingThreshold.toLocaleString()}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-stone-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>7-Day Checking Warranty</span>
          </div>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <span>Cash on Delivery Across Pakistan</span>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <a
            href={`https://wa.me/${siteConfig.whatsappInternational}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>WhatsApp: {siteConfig.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
