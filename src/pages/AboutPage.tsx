import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, Clock, Award, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { siteConfig } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">About Our Brand</span>
        <h1 className="text-3xl sm:text-5xl font-bold font-luxury text-stone-900 leading-tight">
          Craftsmanship, Precision & Pakistani Trust
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Founded with a clear conviction: to offer refined, durable, and masculine timepieces to watch enthusiasts across Pakistan without exorbitant luxury markups.
        </p>
      </div>

      {/* Story & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white p-8 sm:p-12 border border-stone-200 rounded-3xl shadow-xs">
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <h2 className="text-2xl font-bold font-luxury text-stone-900">The ZK.pk Story</h2>
          <p>
            For years, purchasing watches online in Pakistan was fraught with uncertainty — poor photography, flimsy alloy replicas, and sellers who disappeared after delivering a defective parcel.
          </p>
          <p>
            <strong>ZK.pk</strong> was established to change that narrative. We operate with radical transparency: every watch on our website is photographed authentically, categorized with genuine specifications (movement calibers, water ratings, strap compositions), and backed by a strict <strong>7-Day Checking Warranty</strong>.
          </p>
          <p>
            Whether you choose our Rs. 999 daily minimalist or our Rs. 4,599 mechanical automatic, you receive an individually QC-inspected timepiece ready for formal, festive, or everyday wear.
          </p>
        </div>

        <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-stone-200">
          <img
            src="/images/watch-02.jpg"
            alt="ZK.pk Watch Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Pillars of Trust */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold font-luxury text-stone-900">Why Pakistani Customers Trust Us</h2>
          <p className="text-xs text-stone-500 mt-1">Our four core operating commitments</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-3">
            <ShieldCheck className="w-6 h-6 text-amber-800" />
            <h3 className="text-sm font-bold text-stone-900">Individual QC Testing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Before packing, our technicians test movement accuracy, date cycle change, and crown resistance.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-3">
            <Truck className="w-6 h-6 text-amber-800" />
            <h3 className="text-sm font-bold text-stone-900">Cash on Delivery</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Zero advance payment necessary. Pay cash directly to the TCS, Leopards, or Trax courier rider at your door.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-3">
            <Clock className="w-6 h-6 text-amber-800" />
            <h3 className="text-sm font-bold text-stone-900">2–4 Days Transit</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Express dispatch from our commercial Lahore hub to all major cities and rural districts across Pakistan.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-3">
            <Award className="w-6 h-6 text-amber-800" />
            <h3 className="text-sm font-bold text-stone-900">Human Support</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No bots. Direct WhatsApp contact with our horology coordinators for sizing, guidance, or order tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Physical Hub & Contact */}
      <div className="p-8 bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 space-y-6">
        <h2 className="text-2xl font-bold font-luxury text-white">Direct Operations & Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white text-sm">Commercial Hub:</strong>
              <span>{siteConfig.address}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white text-sm">WhatsApp / Phone:</strong>
              <span>{siteConfig.phone}</span>
              <span className="block text-stone-400">Mon–Sat: 10:00 AM – 10:00 PM</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white text-sm">Inquiries Email:</strong>
              <span>{siteConfig.email}</span>
              <span className="block text-stone-400">Response within 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
