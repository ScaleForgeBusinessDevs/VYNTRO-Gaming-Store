import Navbar from '@/components/storefront/Navbar';
import Hero from '@/components/storefront/Hero';
import CategoryGrid from '@/components/storefront/CategoryGrid';
import PromoBanner from '@/components/storefront/PromoBanner';
import BestSellers from '@/components/storefront/BestSellers';
import CollectionSection from '@/components/storefront/CollectionSection';
import TrustBadges from '@/components/storefront/TrustBadges';
import Newsletter from '@/components/storefront/Newsletter';
import Footer from '@/components/storefront/Footer';

export const metadata = {
  title: 'VYNTRO — Premium Custom Gaming Deskmats & Setup Gear',
  description:
    'Shop premium custom-printed XXL gaming deskmats, Anime series, FPS tactical mats, and minimalist desk pads. Cash on Delivery across Pakistan.',
};

const HOT_PICKS_PLACEHOLDERS = [
  { id: 'hp-1', name: 'Midnight Black XL', slug: 'midnight-black-xl', selling_price: 2499, discount_percentage: 0, stock_quantity: 12, images: ['/red_mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'hp-2', name: 'Wave Dragon King', slug: 'wave-dragon-king', selling_price: 3499, discount_percentage: 15, stock_quantity: 8, images: ['/dragon-wave-mousepad.jpg'], category: 'RGB Deskmats' },
  { id: 'hp-3', name: 'Sakura Horizon Pro', slug: 'sakura-horizon-pro', selling_price: 2999, discount_percentage: 20, stock_quantity: 5, images: ['/sakura-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'hp-4', name: 'Stealth Tactical XXL', slug: 'stealth-tactical-xxl', selling_price: 2799, discount_percentage: 0, stock_quantity: 14, images: ['/tactical-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'hp-5', name: 'Domain Sorcery XL', slug: 'domain-sorcery-xl', selling_price: 3299, discount_percentage: 10, stock_quantity: 9, images: ['/jjk_mousepad.jpg'], category: 'XXL Deskmats' },
];

const ANIME_PLACEHOLDERS = [
  { id: 'an-1', name: 'Domain Sorcery XL', slug: 'domain-sorcery-xl', selling_price: 3299, discount_percentage: 10, stock_quantity: 9, images: ['/jjk_mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'an-2', name: 'Dragon Wave Mythic', slug: 'dragon-wave-mythic', selling_price: 3499, discount_percentage: 0, stock_quantity: 6, images: ['/dragon-wave-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'an-3', name: 'Sakura Mountain Spirit', slug: 'sakura-mountain-spirit', selling_price: 2999, discount_percentage: 15, stock_quantity: 11, images: ['/sakura-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'an-4', name: 'Crimson Samurai XXL', slug: 'crimson-samurai-xxl', selling_price: 3199, discount_percentage: 0, stock_quantity: 7, images: ['/red_mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'an-5', name: 'Phantom Ronin Pro', slug: 'phantom-ronin-pro', selling_price: 2899, discount_percentage: 10, stock_quantity: 4, images: ['/tactical-mousepad.jpg'], category: 'XXL Deskmats' },
];

const FPS_PLACEHOLDERS = [
  { id: 'fps-1', name: 'Apex Tactical Radar', slug: 'apex-tactical-radar', selling_price: 2799, discount_percentage: 0, stock_quantity: 15, images: ['/tactical-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'fps-2', name: 'Crimson Crosshair Control', slug: 'crimson-crosshair-control', selling_price: 2999, discount_percentage: 10, stock_quantity: 8, images: ['/red_mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'fps-3', name: 'Hyper-Glide Dragon Edition', slug: 'hyper-glide-dragon-edition', selling_price: 3399, discount_percentage: 0, stock_quantity: 5, images: ['/dragon-wave-mousepad.jpg'], category: 'RGB Deskmats' },
  { id: 'fps-4', name: 'Zero Recoil Balance', slug: 'zero-recoil-balance', selling_price: 2899, discount_percentage: 20, stock_quantity: 4, images: ['/sakura-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'fps-5', name: 'Vortex Precision HE', slug: 'vortex-precision-he', selling_price: 3199, discount_percentage: 0, stock_quantity: 6, images: ['/jjk_mousepad.jpg'], category: 'XXL Deskmats' },
];

const MINIMALISTIC_PLACEHOLDERS = [
  { id: 'min-1', name: 'Stealth Monochrome XL', slug: 'stealth-monochrome-xl', selling_price: 2499, discount_percentage: 0, stock_quantity: 18, images: ['/tactical-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'min-2', name: 'Arctic White Clean Pro', slug: 'arctic-white-clean-pro', selling_price: 2999, discount_percentage: 15, stock_quantity: 6, images: ['/sakura-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'min-3', name: 'Obsidian Velvet Control', slug: 'obsidian-velvet-control', selling_price: 2699, discount_percentage: 0, stock_quantity: 12, images: ['/red_mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'min-4', name: 'Slate Matrix Subtle', slug: 'slate-matrix-subtle', selling_price: 2799, discount_percentage: 0, stock_quantity: 10, images: ['/dragon-wave-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: 'min-5', name: 'Shadow Weave Carbon', slug: 'shadow-weave-carbon', selling_price: 2899, discount_percentage: 0, stock_quantity: 8, images: ['/jjk_mousepad.jpg'], category: 'XXL Deskmats' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 5. 20% Bundle Promo Banner */}
        <PromoBanner />

        {/* 2. Category Grid */}
        <CategoryGrid />

        {/* 4. Best Sellers */}
        <BestSellers />

        {/* 3. Hot Picks Section */}
        <CollectionSection
          id="hot-picks"
          collectionKey="hot-picks"
          eyebrowText="CURATED DROPS // TRENDING NOW"
          titlePrefix="HOT"
          titleAccent="PICKS"
          subtitle="This week's most wanted surface prints and competitive control mats."
          placeholderProducts={HOT_PICKS_PLACEHOLDERS}
          viewAllHref="/shop"
        />




        {/* 6. Anime Collection */}
        <CollectionSection
          id="anime-collection"
          collectionKey="anime"
          eyebrowText="OTAKU & MANGA SERIES // LIMITED DROP"
          titlePrefix="ANIME"
          titleAccent="COLLECTION"
          subtitle="Iconic anime character artwork, intense manga panel spreads, and vivid high-definition sublimation."
          placeholderProducts={ANIME_PLACEHOLDERS}
          viewAllHref="/shop"
        />

        {/* 7. FPS Theme Collection */}
        <CollectionSection
          id="fps-collection"
          collectionKey="fps"
          eyebrowText="COMPETITIVE ESPORTS // TACTICAL TRACKING"
          titlePrefix="FPS"
          titleAccent="SERIES"
          subtitle="Low-friction micro-weave surface engineered for micro-adjustments, fast flicks, and zero sensor skip."
          placeholderProducts={FPS_PLACEHOLDERS}
          viewAllHref="/shop"
        />

        {/* 8. Minimalistic Collection */}
        <CollectionSection
          id="minimalistic-collection"
          collectionKey="minimalistic"
          eyebrowText="MONOCHROME MONOLITH // CLEAN SETUP"
          titlePrefix="MINIMALISTIC"
          titleAccent="COLLECTION"
          subtitle="Pure stealth aesthetics without distracting graphics. Clean dark borders and timeless desktop elegance."
          placeholderProducts={MINIMALISTIC_PLACEHOLDERS}
          viewAllHref="/shop"
        />



        {/* 9. Trust Badges */}
        <TrustBadges />

        {/* 10. Newsletter */}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
