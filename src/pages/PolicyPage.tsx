import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, FileText, AlertCircle } from 'lucide-react';

interface PolicyPageProps {
  initialTab?: string;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'refund' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'refund', label: 'Refund & Return Policy', icon: RotateCcw },
    { id: 'shipping', label: 'Shipping & Delivery (COD)', icon: Truck },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertCircle },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Consumer Protection</span>
        <h1 className="text-3xl sm:text-4xl font-bold font-luxury text-stone-900">Policies & Guarantees</h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Transparent, fair terms designed to protect Pakistani online shoppers and provide complete peace of mind.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2 text-xs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors font-semibold ${
                isActive
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-xs text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
        {activeTab === 'refund' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-luxury text-stone-900">7-Day Checking & Replacement Warranty</h2>
            <p>
              At <strong>ZK.pk</strong>, customer satisfaction is paramount. We understand that buying watches online requires trust. Therefore, every parcel dispatched from our hub is covered by our official <strong>7-Day Checking Warranty</strong>.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">Eligibility for Return & Replacement:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Product has any manufacturing flaw, non-functional movement, or cosmetic defect upon delivery.</li>
              <li>Product delivered does not match the model, color, or specifications ordered.</li>
              <li>Damage incurred during transit with courier riders.</li>
              <li>Claim must be initiated within 7 calendar days of parcel delivery date.</li>
            </ul>

            <h3 className="text-sm font-bold text-stone-900 pt-2">How to Initiate an Exchange:</h3>
            <p>
              Simply capture a short 10-second video of the watch showing the issue and message our official WhatsApp support at <strong>0311-1089742</strong> along with your Order ID (e.g. ZK-1048). Our team will book a reverse pickup or arrange immediate dispatch of a fresh inspected piece.
            </p>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-luxury text-stone-900">Nationwide Shipping & Cash on Delivery Policy</h2>
            <p>
              We ship across all cities, tehsils, and districts in Pakistan via premier courier networks including <strong>TCS Express</strong>, <strong>Leopards Courier</strong>, and <strong>Trax Logistics</strong>.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">Delivery Timeframes:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Major Cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad):</strong> 2 to 3 business days.</li>
              <li><strong>Secondary Cities & Districts (Multan, Peshawar, Gujranwala, Sialkot, Quetta):</strong> 3 to 4 business days.</li>
              <li><strong>Rural & Remote Tehsils:</strong> 4 to 5 business days.</li>
            </ul>

            <h3 className="text-sm font-bold text-stone-900 pt-2">Delivery Charges:</h3>
            <p>
              Orders above <strong>Rs. 2,500</strong> enjoy <strong>FREE Nationwide Delivery</strong>. For orders below Rs. 2,500, a nominal flat courier fee of <strong>Rs. 199</strong> applies regardless of your city.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">Parcel Inspection:</h3>
            <p>
              You may check your parcel upon arrival in accordance with standard Pakistani courier regulations.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-luxury text-stone-900">Privacy Policy</h2>
            <p>
              ZK.pk values your privacy. We only collect the minimal information necessary to fulfill your watch orders safely and efficiently.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">Information We Collect:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Full Name, Contact Phone/WhatsApp number, and complete delivery address for courier booking.</li>
              <li>Email address for sending order receipts and optional discount newsletters.</li>
              <li>We <strong>NEVER</strong> store credit card numbers or banking passwords on our servers.</li>
            </ul>

            <h3 className="text-sm font-bold text-stone-900 pt-2">Third-Party Sharing:</h3>
            <p>
              Your contact details are shared exclusively with our licensed delivery partners (TCS, Leopards, Trax) for the sole purpose of delivering your parcel. We do not sell or rent customer data to external telemarketers.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-luxury text-stone-900">Terms & Conditions</h2>
            <p>
              By browsing or placing an order on ZK.pk, you agree to our standard terms of trade:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All prices are stated in Pakistani Rupees (PKR / Rs.) and include product packaging.</li>
              <li>Placing a Cash on Delivery order constitutes a genuine purchase intent. Please ensure an authorized recipient is available at the provided address to pay the courier.</li>
              <li>Orders placed with bogus contact details or non-responsive phone numbers will be cancelled after 2 verification attempts.</li>
              <li>ZK.pk reserves the right to update product stock, descriptions, and pricing in the event of manufacturing modifications.</li>
            </ul>
          </div>
        )}

        {activeTab === 'disclaimer' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-luxury text-stone-900">Product Disclaimer & Water Resistance Guidance</h2>
            <p>
              All watches presented on ZK.pk are curated timepieces designed for style, performance, and everyday durability.
            </p>
            <h3 className="text-sm font-bold text-stone-900 pt-2">Water Resistance Truth:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>3ATM:</strong> Splash proof for daily hand washing and light rain. Do NOT submerge or wear in hot showers or steam saunas.</li>
              <li><strong>5ATM:</strong> Resistant to heavy rain, car washing, and brief water immersion.</li>
              <li>Leather straps are made from natural organic materials and should not be soaked in water or exposed to heavy perfumes.</li>
            </ul>
            <p className="text-stone-500 text-xs pt-2">
              ZK.pk is an independent Pakistani online retailer. Any references to classic design styles (such as "Diver", "Pilot", "Fluted Bezel", "Octagonal") describe visual horology traditions and aesthetic forms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
