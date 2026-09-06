'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import useCartStore from '@/lib/cartStore';
import { getBundleBySlug } from '@/lib/bundles';
import styles from './bundle.module.css';

/* ── Fallback product catalog (mirrors shop/page.js) ── */
const PLACEHOLDER_PRODUCTS = [
  { id: '1', name: 'Midnight Black XL', slug: 'midnight-black-xl', selling_price: 2499, discount_percentage: 0, stock_quantity: 12, images: ['/red_mousepad.jpg'], category: 'XXL Deskmats', description: 'The Midnight Black XL is our flagship deskmat.' },
  { id: '2', name: 'Arctic White Pro', slug: 'arctic-white-pro', selling_price: 2999, discount_percentage: 20, stock_quantity: 4, images: ['/tactical-mousepad.jpg'], category: 'XXL Deskmats', description: 'Clean, minimal, and built for precision.' },
  { id: '3', name: 'RGB Horizon Mat', slug: 'rgb-horizon-mat', selling_price: 3499, discount_percentage: 0, stock_quantity: 8, images: ['/dragon-wave-mousepad.jpg'], category: 'RGB Deskmats', description: 'Vivid RGB lighting meets premium surface.' },
  { id: '5', name: 'Stealth Grey XXL', slug: 'stealth-grey-xxl', selling_price: 2799, discount_percentage: 0, stock_quantity: 20, images: ['/tactical-mousepad.jpg'], category: 'XXL Deskmats', description: 'Low-profile, matte-grey stealth aesthetic.' },
  { id: '6', name: 'Cyber Violet RGB', slug: 'cyber-violet-rgb', selling_price: 3799, discount_percentage: 10, stock_quantity: 6, images: ['/dragon-wave-mousepad.jpg'], category: 'RGB Deskmats', description: 'Electric violet RGB with buttery smooth surface.' },
  { id: '7', name: 'Cloud Ergonomic Wrist Rest', slug: 'wrist-comfort-pro', selling_price: 1299, discount_percentage: 0, stock_quantity: 15, images: ['/sakura-mousepad.jpg'], category: 'Wrist Rests', description: 'Memory-foam wrist rest for all-day sessions.' },
  { id: '9', name: 'Vortex Ultra-Light Mouse', slug: 'vortex-wireless-mouse', selling_price: 7999, discount_percentage: 10, stock_quantity: 8, images: ['/mouse_cat.jpg'], category: 'Mice', description: '58g wireless mouse built for speed.' },
  { id: '10', name: 'Spectre 65% HE Keyboard', slug: 'spectre-he-keyboard', selling_price: 14999, discount_percentage: 0, stock_quantity: 5, images: ['/keyboard_cat.jpg'], category: 'Keyboards', description: 'Hall-Effect switches, magnetic actuation.' },
  { id: '11', name: 'Aether Gaming IEMs', slug: 'aether-gaming-iems', selling_price: 4999, discount_percentage: 15, stock_quantity: 10, images: ['/IEMs_cat.jpg'], category: 'IEMs', description: 'Dual-driver IEMs for audiophile-grade gaming audio.' },
  { id: '12', name: 'Coiled Aviator USB-C Cable', slug: 'coiled-aviator-cable', selling_price: 1899, discount_percentage: 0, stock_quantity: 25, images: ['/ARM_cat.jpg'], category: 'Accessories', description: 'Premium braided coiled cable with aviator connector.' },
];

function getProductImage(p) {
  if (p.images?.[0]) {
    const img = p.images[0];
    if (img.includes('Sakura Landscape')) return '/sakura-mousepad.jpg';
    if (img.includes('Wave MTG')) return '/dragon-wave-mousepad.jpg';
    if (img.includes('Zindoo XXL')) return '/tactical-mousepad.jpg';
    return img;
  }
  return '/red_mousepad.jpg';
}

function resolveProductsBySlug(slugs, allProducts) {
  return slugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter(Boolean);
}

export default function BundlePage() {
  const { slug } = useParams();
  const bundle = getBundleBySlug(slug);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const addBundle = useCartStore((s) => s.addBundle);

  /* Load products — try Supabase, fall back to placeholders */
  useEffect(() => {
    if (!bundle) { setLoading(false); return; }

    const load = async () => {
      try {
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();
        const { data } = await supabase
          .from('products')
          .select('*')
          .in('slug', bundle.productSlugs)
          .eq('is_active', true);

        if (data && data.length > 0) {
          // Preserve bundle order
          const ordered = bundle.productSlugs
            .map((s) => data.find((p) => p.slug === s))
            .filter(Boolean);
          setProducts(ordered);
        } else {
          setProducts(resolveProductsBySlug(bundle.productSlugs, PLACEHOLDER_PRODUCTS));
        }
      } catch {
        setProducts(resolveProductsBySlug(bundle.productSlugs, PLACEHOLDER_PRODUCTS));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bundle]);

  /* ── Add the whole bundle as ONE cart item ── */
  function handleAddBundle() {
    const itemNames = products.map((p) => p.name);
    addBundle(bundle, itemNames);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  /* ── 404 ── */
  if (!bundle && !loading) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <h1 style={{ color: '#fff', fontSize: '2rem' }}>Bundle Not Found</h1>
          <Link href="/bundles" style={{ color: '#E60012' }}>← Back to Bundles</Link>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Loading ── */
  if (loading || !bundle) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
        <Footer />
      </>
    );
  }

  /* ── Pricing calculations ── */
  const retailTotal = products.reduce((sum, p) => sum + p.selling_price, 0);
  const savings = retailTotal - bundle.bundlePrice;
  const savingsPct = Math.round((savings / retailTotal) * 100);

  const waMessage = `Hi VYNTRO! I want to order the "${bundle.name}" bundle for PKR ${bundle.bundlePrice.toLocaleString()}. Items: ${products.map((p) => p.name).join(', ')}.`;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* ── Hero Banner ── */}
        <div className={styles.heroBanner}>
          <div className={styles.heroImgWrapper}>
            <Image
              src={bundle.image}
              alt={bundle.name}
              fill
              priority
              className={styles.heroImg}
            />
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.heroContent}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSep}>›</span>
              <Link href="/bundles" className={styles.breadcrumbLink}>Bundles</Link>
              <span className={styles.breadcrumbSep}>›</span>
              <span className={styles.breadcrumbCurrent}>{bundle.name}</span>
            </nav>

            <span className={styles.bundleLabel}>BUNDLE DEAL</span>
            <h1 className={styles.heroTitle}>{bundle.name}</h1>
            <p className={styles.heroTagline}>{bundle.tagline}</p>

            {/* Savings pill */}
            {savings > 0 && (
              <div className={styles.savingsPill}>
                <span className={styles.savingsIcon}>✦</span>
                Save PKR {savings.toLocaleString()} ({savingsPct}% off retail)
              </div>
            )}
          </div>
        </div>

        <div className="container">
          {/* ── Bundle description ── */}
          <p className={styles.bundleDesc}>{bundle.description}</p>

          {/* ── What's Included ── */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              WHAT'S <span className={styles.accent}>INCLUDED</span>
            </h2>
            <p className={styles.sectionSub}>
              {products.length} items — individual retail prices shown below
            </p>
          </div>

          <div className={styles.itemsGrid}>
            {products.map((product) => {
              const img = getProductImage(product);
              return (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  className={styles.itemCard}
                  id={`bundle-item-${product.slug}`}
                  target="_blank"
                >
                  <div className={styles.itemImgWrapper}>
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className={styles.itemImg}
                    />
                    <div className={styles.itemOverlay} />
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemCategory}>{product.category}</span>
                    <h3 className={styles.itemName}>{product.name}</h3>
                    <p className={styles.itemDesc}>{product.description}</p>
                    <div className={styles.itemPriceRow}>
                      <span className={styles.itemRetailLabel}>Retail</span>
                      <span className={styles.itemRetailPrice}>
                        PKR {product.selling_price.toLocaleString()}
                      </span>
                    </div>
                    <span className={styles.itemViewLink}>View Product →</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Pricing Breakdown ── */}
          <div className={styles.pricingCard}>
            <div className={styles.pricingLeft}>
              <h2 className={styles.pricingTitle}>Bundle Pricing</h2>
              <p className={styles.pricingNote}>All items shipped together. COD available.</p>
            </div>

            <div className={styles.pricingBreakdown}>
              {/* Individual line items */}
              {products.map((p) => (
                <div key={p.slug} className={styles.pricingRow}>
                  <span className={styles.pricingItem}>{p.name}</span>
                  <span className={styles.pricingItemPrice}>PKR {p.selling_price.toLocaleString()}</span>
                </div>
              ))}

              <div className={styles.pricingDivider} />

              {/* Retail subtotal */}
              <div className={styles.pricingRow}>
                <span className={styles.pricingRetailLabel}>Retail Value</span>
                <span className={styles.pricingRetailTotal}>PKR {retailTotal.toLocaleString()}</span>
              </div>

              {/* Savings */}
              {savings > 0 && (
                <div className={`${styles.pricingRow} ${styles.pricingSavingsRow}`}>
                  <span className={styles.pricingSavingsLabel}>Bundle Discount</span>
                  <span className={styles.pricingSavingsAmount}>− PKR {savings.toLocaleString()}</span>
                </div>
              )}

              <div className={styles.pricingDivider} />

              {/* Final bundle price */}
              <div className={`${styles.pricingRow} ${styles.pricingFinalRow}`}>
                <span className={styles.pricingFinalLabel}>Bundle Price</span>
                <span className={styles.pricingFinalPrice}>PKR {bundle.bundlePrice.toLocaleString()}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className={styles.pricingCtas}>
              <button
                className={`btn ${added ? 'btn-rgb' : 'btn-gold'} ${styles.addBtn}`}
                onClick={handleAddBundle}
                id="bundle-add-to-cart"
              >
                {added
                  ? `✓ ${products.length} Items Added to Cart`
                  : `Add Bundle to Cart — PKR ${bundle.bundlePrice.toLocaleString()}`}
              </button>

              <a
                href={`https://wa.me/923363791538?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                id="bundle-whatsapp-btn"
              >
                <WAIcon /> Order via WhatsApp
              </a>

              <div className={styles.codNote}>
                <span style={{ color: 'var(--success, #22c55e)' }}>✓</span>{' '}
                Cash on Delivery — pay when your order arrives
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function WAIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
