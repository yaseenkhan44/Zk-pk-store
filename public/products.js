/**
 * ===================================================================================
 *  ZK.pk — EASY PRODUCT DATA REPLACEMENT FILE (products.js)
 * ===================================================================================
 *  If you want to quickly edit, add, or replace watches without touching complex code:
 * 
 *  1. REPLACE IMAGE:
 *     Drop your photo into the `/public/images/` folder as `watch-01.jpg`, `watch-02.jpg`, etc.
 *     Or change the `"image"` field to `"images/your-watch.jpg"`.
 * 
 *  2. EDIT NAME & PRICE:
 *     Change `"name": "Your Watch Name"`
 *     Change `"price": 1499` (Price in PKR)
 *     Change `"oldPrice": 2200` (Discounted from)
 * 
 *  3. EDIT STOCK & SKU:
 *     Change `"stock": 25`
 *     Change `"sku": "ZK-999-01"`
 * 
 *  4. EDIT DESCRIPTION & CATEGORY:
 *     Change `"category": "Luxury Watches"` or `"Men's Watches"`
 *     Change `"description": "Detailed description here..."`
 * ===================================================================================
 */

window.ZK_PRODUCTS = [
  {
    id: 1,
    name: "ZK Classic Minimalist Black Quartz",
    price: 999,
    oldPrice: 1599,
    category: "Casual Watches",
    brand: "ZK Classic",
    image: "images/watch-01.jpg",
    sku: "ZK-999-01",
    stock: 28,
    shortDescription: "Ultra-sleek black dial with fine silver indices and comfortable faux leather strap.",
    specs: {
      movement: "Precision Japanese Quartz",
      caseDiameter: "40mm",
      strapMaterial: "Comfort Faux Leather",
      waterResistance: "3ATM Splashproof",
      warranty: "7-Day Checking Warranty"
    }
  },
  {
    id: 2,
    name: "ZK Royal Silver Link Clean Dial",
    price: 999,
    oldPrice: 1499,
    category: "Men's Watches",
    brand: "ZK Royal",
    image: "images/watch-02.jpg",
    sku: "ZK-999-02",
    stock: 19,
    shortDescription: "Polished stainless steel finish with clean white dial and folding safety clasp.",
    specs: {
      movement: "Quartz Caliber 2035",
      caseDiameter: "41mm",
      strapMaterial: "Polished Stainless Steel",
      waterResistance: "3ATM Splashproof",
      warranty: "7-Day Checking Warranty"
    }
  },
  {
    id: 3,
    name: "ZK Stealth Matte Black Digital Sport",
    price: 999,
    oldPrice: 1650,
    category: "Sports Watches",
    brand: "ZK Tactical",
    image: "images/watch-03.jpg",
    sku: "ZK-999-03",
    stock: 35,
    shortDescription: "Rugged military-inspired digital watch with EL backlight, stopwatch, and alarm.",
    specs: {
      movement: "Digital Multi-Function Quartz",
      caseDiameter: "44mm",
      strapMaterial: "Shock-Proof Silicone",
      waterResistance: "5ATM Safe",
      warranty: "7-Day Checking Warranty"
    }
  }
  // All 35 watches are also saved in database and can be edited in Admin at /admin!
];
