'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ProductCard from '@/components/storefront/ProductCard';
import styles from './shop.module.css';

const CATEGORIES = [
  'All',
  'XXL Deskmats',
  'RGB Deskmats',
  'Bundles',
  'Wrist Rests',
  'Mice',
  'Keyboards',
  'IEMs',
  'Accessories',
  'Sale',
];

const CAT_SLUG_MAP = {
  'xxl': 'XXL Deskmats',
  'xxl-deskmats': 'XXL Deskmats',
  'rgb': 'RGB Deskmats',
  'rgb-deskmats': 'RGB Deskmats',
  'bundles': 'Bundles',
  'wrist': 'Wrist Rests',
  'wrist-rests': 'Wrist Rests',
  'mice': 'Mice',
  'mousepads': 'XXL Deskmats',
  'keyboards': 'Keyboards',
  'iems': 'IEMs',
  'accessories': 'Accessories',
  'sale': 'Sale',
};

const PLACEHOLDER_PRODUCTS = [
  { id: '1', name: 'Midnight Black XL', slug: 'midnight-black-xl', selling_price: 2499, discount_percentage: 0, stock_quantity: 12, images: ['/red_mousepad.jpg'], category: 'XXL Deskmats' },
  { id: '2', name: 'Arctic White Pro', slug: 'arctic-white-pro', selling_price: 2999, discount_percentage: 20, stock_quantity: 4, images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'], category: 'XXL Deskmats' },
  { id: '3', name: 'RGB Horizon Mat', slug: 'rgb-horizon-mat', selling_price: 3499, discount_percentage: 0, stock_quantity: 8, images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'], category: 'RGB Deskmats' },
  { id: '4', name: 'Galaxy Deskmat Bundle', slug: 'galaxy-bundle', selling_price: 4999, discount_percentage: 15, stock_quantity: 5, images: ['/jjk_mousepad.jpg'], category: 'Bundles' },
  { id: '5', name: 'Stealth Grey XXL', slug: 'stealth-grey-xxl', selling_price: 2799, discount_percentage: 0, stock_quantity: 20, images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg'], category: 'XXL Deskmats' },
  { id: '6', name: 'Cyber Violet RGB', slug: 'cyber-violet-rgb', selling_price: 3799, discount_percentage: 10, stock_quantity: 6, images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'], category: 'RGB Deskmats' },
  { id: '7', name: 'Cloud Ergonomic Wrist Rest', slug: 'wrist-comfort-pro', selling_price: 1299, discount_percentage: 0, stock_quantity: 15, images: ['/red_mousepad.jpg'], category: 'Wrist Rests' },
  { id: '8', name: 'Sunset Edition XL', slug: 'sunset-edition-xl', selling_price: 2599, discount_percentage: 30, stock_quantity: 3, images: ['/red_mousepad.jpg'], category: 'Sale' },
  { id: '9', name: 'Vortex Ultra-Light Wireless Mouse', slug: 'vortex-wireless-mouse', selling_price: 7999, discount_percentage: 10, stock_quantity: 8, images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'], category: 'Mice' },
  { id: '10', name: 'Spectre 65% Magnetic HE Keyboard', slug: 'spectre-he-keyboard', selling_price: 14999, discount_percentage: 0, stock_quantity: 5, images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'], category: 'Keyboards' },
  { id: '11', name: 'Aether Dual-Driver Gaming IEMs', slug: 'aether-gaming-iems', selling_price: 4999, discount_percentage: 15, stock_quantity: 10, images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg'], category: 'IEMs' },
  { id: '12', name: 'Coiled Aviator USB-C Cable', slug: 'coiled-aviator-cable', selling_price: 1899, discount_percentage: 0, stock_quantity: 25, images: ['/jjk_mousepad.jpg'], category: 'Accessories' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat')?.toLowerCase();

  const [products, setProducts] = useState(PLACEHOLDER_PRODUCTS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (catParam && CAT_SLUG_MAP[catParam]) {
      setActiveFilter(CAT_SLUG_MAP[catParam]);
    } else if (catParam) {
      const match = CATEGORIES.find((c) => c.toLowerCase() === catParam);
      if (match) setActiveFilter(match);
    }
  }, [catParam]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch {
        // Supabase not yet seeded, keep rich placeholders
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = activeFilter === 'All'
    ? products
    : products.filter((p) => {
        if (activeFilter === 'Sale') {
          return p.discount_percentage > 0 || p.category === 'Sale';
        }
        return p.category?.toLowerCase() === activeFilter.toLowerCase();
      });

  return (
    <div className="container">
      {/* Page header — Centered, Big, Bold */}
      <div className={styles.header}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          <span className={styles.eyebrowText}>VYNTRO ARSENAL // CATALOG</span>
          <span className={styles.eyebrowLine} />
        </div>
        <h1 className={styles.title}>
          OUR <span className={styles.titleAccent}>COLLECTION</span>
        </h1>
        <p className={styles.subtitle}>
          High-performance gaming deskmats and peripheral gear built for competitive precision and clean desktop aesthetics.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filters} role="tablist" aria-label="Filter products">
        {CATEGORIES.map((cat) => {
          const count = cat === 'All'
            ? products.length
            : cat === 'Sale'
              ? products.filter((p) => p.discount_percentage > 0 || p.category === 'Sale').length
              : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;

          return (
            <button
              key={cat}
              role="tab"
              aria-selected={activeFilter === cat}
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
              onClick={() => setActiveFilter(cat)}
              id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
              <span className={styles.filterCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.loading}>
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className="heading-md muted">No products found in this category.</p>
          <button
            onClick={() => setActiveFilter('All')}
            className="btn btn-gold"
            style={{ marginTop: 12 }}
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: '100px 0' }}><div className="spinner" /></div>}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
