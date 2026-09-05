'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import useCartStore from '@/lib/cartStore';
import { isMousepadProduct, getProductSizeVariants } from '@/lib/sizeVariants';
import styles from './product.module.css';

const PLACEHOLDER = {
  id: '1',
  name: 'Midnight Black XL',
  slug: 'midnight-black-xl',
  selling_price: 2499,
  discount_percentage: 0,
  stock_quantity: 12,
  images: [],
  category: 'XXL Deskmats',
  description: 'The Midnight Black XL is our flagship deskmat — an expansive surface that gives you the control and precision your setup deserves. Whether you\'re gaming, coding, or just building the perfect aesthetic, this mat delivers.',
  delivery_time: '3–5 business days',
  warranty_period: '6 months',
  care_instructions: 'Wipe clean with a damp cloth. Do not machine wash.',
  material_specs: '900×400mm, 4mm thickness, stitched edge, non-slip rubber base',
};

const INFO_BLOCKS = [
  { key: 'delivery_time', label: 'Delivery Time', icon: <DeliveryIcon /> },
  { key: 'warranty_period', label: 'Warranty', icon: <ShieldIcon /> },
  { key: 'care_instructions', label: 'Care', icon: <InfoIcon /> },
  { key: 'material_specs', label: 'Specs', icon: <SpecsIcon /> },
];

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [gallery, setGallery] = useState(0);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const load = async () => {
      try {
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();
        const loadedProduct = data ?? PLACEHOLDER;
        setProduct(loadedProduct);

        // Auto-select XXL or first size if mousepad
        if (isMousepadProduct(loadedProduct)) {
          const sizes = getProductSizeVariants(loadedProduct);
          const defaultSize = sizes.find((s) => s.id === 'XXL') || sizes[0];
          setSelectedSize(defaultSize || null);
        }
      } catch {
        setProduct(PLACEHOLDER);
        const sizes = getProductSizeVariants(PLACEHOLDER);
        setSelectedSize(sizes.find((s) => s.id === 'XXL') || sizes[0]);
      }
    };
    load();
  }, [slug]);

  const isMousepad = useMemo(() => isMousepadProduct(product), [product]);
  const sizeVariants = useMemo(() => getProductSizeVariants(product), [product]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className={styles.loading}>
          <div className="spinner" />
        </div>
      </>
    );
  }

  // Active pricing considering selected size
  const activeBasePrice = selectedSize ? selectedSize.price : product.selling_price;
  const discountedPrice = product.discount_percentage
    ? Math.round(activeBasePrice * (1 - product.discount_percentage / 100))
    : null;
  const displayPrice = selectedSize ? selectedSize.effectivePrice : (discountedPrice ?? activeBasePrice);

  function handleAddToCart() {
    addItem(product, qty, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function getStockStatus() {
    if (product.stock_quantity === 0) return { cls: 'out-of-stock', label: 'Out of Stock' };
    if (product.stock_quantity <= 5) return { cls: 'low-stock', label: `Only ${product.stock_quantity} left` };
    return { cls: 'in-stock', label: 'In Stock' };
  }

  const stock = getStockStatus();

  // Clean specs string for display
  function getCleanSpecValue(key, val) {
    if (!val) return '';
    let cleaned = val.replace(/__SIZES__.*?__SIZES__/g, '').trim();
    if (key === 'material_specs' && selectedSize && selectedSize.dims) {
      if (/\d+×\d+mm/i.test(cleaned)) {
        cleaned = cleaned.replace(/\d+×\d+mm/i, selectedSize.dims);
      } else {
        cleaned = `${selectedSize.dims}, ${cleaned}`;
      }
    }
    return cleaned;
  }

  const waMessage = `Hi VYNTRO! I want to order "${product.name}"${selectedSize ? ` in Size: ${selectedSize.label} (${selectedSize.dims})` : ''} for PKR ${(displayPrice * qty).toLocaleString()} (Qty: ${qty})`;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/" className={styles.breadcrumbLink}>Home</a>
            <span className={styles.breadcrumbSep}>›</span>
            <a href="/shop" className={styles.breadcrumbLink}>Shop</a>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>{product.name}</span>
          </nav>

          <div className={styles.grid}>
            {/* Image gallery */}
            <div className={styles.gallery}>
              {/* Main image */}
              <div className={styles.mainImg}>
                {product.images?.[gallery] ? (
                  <Image
                    src={
                      product.images[gallery].includes('Sakura Landscape')
                        ? '/sakura-mousepad.jpg'
                        : product.images[gallery].includes('Wave MTG')
                        ? '/dragon-wave-mousepad.jpg'
                        : product.images[gallery].includes('Zindoo XXL')
                        ? '/tactical-mousepad.jpg'
                        : product.images[gallery].toLowerCase().includes('hero_upscaled')
                        ? '/hero-upscaled.jpeg'
                        : product.images[gallery]
                    }
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                ) : (
                  <div className="placeholder-img">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" style={{ opacity: 0.15 }}>
                      <rect x="1" y="5" width="22" height="14" rx="2"/>
                    </svg>
                    <span>Product Image</span>
                    <span style={{ fontSize: '0.65rem' }}>Place your renders here</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className={styles.thumbs}>
                  {product.images.map((img, i) => {
                    const cleanSrc = img.includes('Sakura Landscape')
                      ? '/sakura-mousepad.jpg'
                      : img.includes('Wave MTG')
                      ? '/dragon-wave-mousepad.jpg'
                      : img.includes('Zindoo XXL')
                      ? '/tactical-mousepad.jpg'
                      : img.toLowerCase().includes('hero_upscaled')
                      ? '/hero-upscaled.jpeg'
                      : img;
                    return (
                      <button
                        key={i}
                        className={`${styles.thumb} ${gallery === i ? styles.thumbActive : ''}`}
                        onClick={() => setGallery(i)}
                        aria-label={`Image ${i + 1}`}
                      >
                        <Image src={cleanSrc} alt="" fill style={{ objectFit: 'cover' }} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className={styles.info}>
              {/* Category + stock */}
              <div className={styles.topMeta}>
                <span className={styles.categoryBadge}>{product.category}</span>
                <span className={`stock-badge ${stock.cls}`}>{stock.label}</span>
              </div>

              <h1 className={`display-md ${styles.productName}`}>{product.name}</h1>

              {/* Price Row */}
              <div className={styles.priceRow}>
                <span className="price-current">PKR {displayPrice.toLocaleString()}</span>
                {discountedPrice && (
                  <>
                    <span className="price-original">
                      PKR {activeBasePrice.toLocaleString()}
                    </span>
                    <span className="badge badge-success">
                      Save {product.discount_percentage}%
                    </span>
                  </>
                )}
                {selectedSize && (
                  <span className="body-xs muted" style={{ alignSelf: 'center', marginLeft: '6px' }}>
                    // {selectedSize.label} ({selectedSize.dims})
                  </span>
                )}
              </div>

              {/* Size Selector for Mousepads */}
              {isMousepad && sizeVariants.length > 0 && (
                <div className={styles.sizeSection} id="pdp-size-selector">
                  <div className={styles.sizeHeader}>
                    <h3 className={styles.sizeTitle}>SELECT DESKMAT SIZE</h3>
                    <span className={styles.sizeHelpText}>
                      Chosen: <strong style={{ color: '#FFFFFF' }}>{selectedSize?.label} ({selectedSize?.dims})</strong>
                    </span>
                  </div>

                  <div className={styles.sizeGrid}>
                    {sizeVariants.map((sz) => {
                      const isSelected = selectedSize?.id === sz.id;
                      return (
                        <button
                          key={sz.id}
                          type="button"
                          className={`${styles.sizeCard} ${isSelected ? styles.sizeCardActive : ''}`}
                          onClick={() => setSelectedSize(sz)}
                          id={`size-btn-${sz.id.toLowerCase()}`}
                        >
                          {sz.popular && <span className={styles.popularBadge}>POPULAR</span>}
                          <span className={styles.sizeCardName}>{sz.label}</span>
                          <span className={styles.sizeCardDims}>{sz.dims}</span>
                          <span className={styles.sizeCardPrice}>PKR {sz.effectivePrice.toLocaleString()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className={`body-md muted ${styles.desc}`}>
                {product.description}
              </p>

              {/* Quantity */}
              <div className={styles.qtySection}>
                <p className="form-label">Quantity</p>
                <div className={styles.qtyControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease"
                    disabled={qty <= 1}
                  >−</button>
                  <span className={styles.qtyNum}>{qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase"
                    disabled={qty >= product.stock_quantity}
                  >+</button>
                </div>
              </div>

              {/* CTAs */}
              <div className={styles.ctas}>
                <button
                  className={`btn ${added ? 'btn-rgb' : 'btn-gold'} ${styles.addBtn}`}
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  id="pdp-add-to-cart"
                >
                  {added
                    ? '✓ Added to Cart'
                    : product.stock_quantity === 0
                    ? 'Out of Stock'
                    : `Add to Cart — PKR ${(displayPrice * qty).toLocaleString()}`}
                </button>
                <a
                  href={`https://wa.me/923000000000?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  id="pdp-whatsapp-btn"
                >
                  <WAIcon /> Order via WhatsApp
                </a>
              </div>

              {/* COD notice */}
              <div className={styles.codBadge}>
                <span style={{ color: 'var(--success)' }}>✓</span>
                Cash on Delivery — pay in cash when your order arrives
              </div>

              {/* Info blocks */}
              <div className={styles.infoBlocks}>
                {INFO_BLOCKS.map(({ key, label, icon }) => {
                  const val = getCleanSpecValue(key, product[key]);
                  return val ? (
                    <div key={key} className={styles.infoBlock}>
                      <div className={styles.infoBlockIcon}>{icon}</div>
                      <div>
                        <p className={styles.infoBlockLabel}>{label}</p>
                        <p className={styles.infoBlockValue}>{val}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function DeliveryIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
}
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function InfoIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function SpecsIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
}
function WAIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;
}
