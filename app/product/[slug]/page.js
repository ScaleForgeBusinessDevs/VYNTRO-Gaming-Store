'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import useCartStore from '@/lib/cartStore';
import { isMousepadProduct, getProductSizeVariants } from '@/lib/sizeVariants';
import { getColorVariants } from '@/lib/colorVariants';
import styles from './product.module.css';

/* ── Placeholder fallback ─────────────────────────────────────── */
const PLACEHOLDER = {
  id: '1',
  name: 'Midnight Black XL',
  slug: 'midnight-black-xl',
  selling_price: 2499,
  discount_percentage: 0,
  stock_quantity: 12,
  images: [],
  category: 'XXL Deskmats',
  description: 'The Midnight Black XL is our flagship deskmat — an expansive surface that gives you the control and precision your setup deserves.',
  delivery_time: '3–5 business days',
  warranty_period: '6 months',
  care_instructions: 'Wipe clean with a damp cloth. Do not machine wash.',
  material_specs: '900×400mm, 4mm thickness, stitched edge, non-slip rubber base',
};

/* ── Accordion component ──────────────────────────────────────── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.accordion}>
      <button
        className={styles.accordionTrigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        type="button"
      >
        <span className={styles.accordionTitle}>{title}</span>
        <span className={`${styles.accordionChevron} ${open ? styles.accordionChevronOpen : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  );
}

/* ── Image normaliser (same as shop) ─────────────────────────── */
function cleanImgSrc(src) {
  if (!src) return null;
  if (src.includes('Sakura Landscape')) return '/sakura-mousepad.jpg';
  if (src.includes('Wave MTG')) return '/dragon-wave-mousepad.jpg';
  if (src.includes('Zindoo XXL')) return '/tactical-mousepad.jpg';
  if (src.toLowerCase().includes('hero_upscaled')) return '/hero-upscaled.jpeg';
  return src;
}

function ProductBreadcrumb({ productName }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href="/" className={styles.breadcrumbLink}>Home</Link>
      <span className={styles.sep}>›</span>
      <Link href="/shop" className={styles.breadcrumbLink}>Shop</Link>
      <span className={styles.sep}>›</span>
      <span className={styles.breadcrumbCurrent}>{productName}</span>
    </nav>
  );
}

function GallerySection({ currentImg, galleryImages, gallery, setGallery, productName }) {
  return (
    <>
      <div className={styles.mainImgWrap}>
        {currentImg ? (
          <Image
            src={currentImg}
            alt={productName}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 55vw"
            className={styles.mainImg}
          />
        ) : (
          <div className={styles.imgPlaceholder}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" style={{ opacity: 0.12 }}>
              <rect x="1" y="5" width="22" height="14" rx="2" />
            </svg>
            <span>No image</span>
          </div>
        )}

        {galleryImages.length > 1 && (
          <>
            <button
              className={`${styles.arrowBtn} ${styles.arrowLeft}`}
              onClick={() => setGallery((g) => (g - 1 + galleryImages.length) % galleryImages.length)}
              aria-label="Previous image"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              className={`${styles.arrowBtn} ${styles.arrowRight}`}
              onClick={() => setGallery((g) => (g + 1) % galleryImages.length)}
              aria-label="Next image"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className={styles.thumbStrip}>
          {galleryImages.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.thumb} ${gallery === i ? styles.thumbActive : ''}`}
              onClick={() => setGallery(i)}
              aria-label={`Image ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="80px" style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/* ── Main component ───────────────────────────────────────────── */
export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [gallery, setGallery] = useState(0);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const addItem = useCartStore((s) => s.addItem);

  /* Load product */
  useEffect(() => {
    const load = async () => {
      try {
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();
        const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
        const loaded = data ?? PLACEHOLDER;
        setProduct(loaded);
        if (isMousepadProduct(loaded)) {
          const sizes = getProductSizeVariants(loaded);
          setSelectedSize(sizes.find((s) => s.id === 'XXL') || sizes[0] || null);
        }
        const colors = getColorVariants(loaded);
        if (colors.length > 0) setSelectedColor(colors[0]);
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
  const colorVariants = useMemo(() => getColorVariants(product), [product]);

  /* Gallery images — prefer selected color's images if available */
  const galleryImages = useMemo(() => {
    let colorImgs = null;
    if (selectedColor?.images && selectedColor.images.length > 0) {
      colorImgs = selectedColor.images;
    } else if (selectedColor?.image) {
      colorImgs = [selectedColor.image];
    }
    const base = (colorImgs && colorImgs.length > 0) ? colorImgs : (product?.images || []);
    return base.map(cleanImgSrc).filter(Boolean);
  }, [product, selectedColor]);

  /* Reset gallery index when images or color change */
  useEffect(() => { setGallery(0); }, [selectedColor, galleryImages.length]);

  /* Loading state */
  if (!product) {
    return (
      <>
        <Navbar />
        <div className={styles.loading}><div className="spinner" /></div>
      </>
    );
  }

  /* Pricing */
  const activeBasePrice = selectedSize ? selectedSize.price : product.selling_price;
  const colorPriceDiff = selectedColor?.priceDiff ?? 0;
  const priceWithColor = activeBasePrice + colorPriceDiff;
  const discountedPrice = product.discount_percentage
    ? Math.round(priceWithColor * (1 - product.discount_percentage / 100))
    : null;
  const displayPrice = discountedPrice ?? priceWithColor;

  function handleAddToCart() {
    addItem(product, qty, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  function getStockStatus() {
    if (product.stock_quantity === 0) return { cls: 'out-of-stock', label: 'Out of Stock' };
    if (product.stock_quantity <= 5) return { cls: 'low-stock', label: `Only ${product.stock_quantity} left` };
    return { cls: 'in-stock', label: 'In Stock' };
  }
  const stock = getStockStatus();

  const hasGallery = galleryImages.length > 0;
  const currentImg = hasGallery ? galleryImages[gallery] : null;

  function getCleanSpecValue(key, val) {
    if (!val) return '';
    return val
      .replace(/__SIZES__.*?__SIZES__/g, '')
      .replace(/__COLORS__.*?__COLORS__/g, '')
      .trim();
  }

  const waMessage = `Hi VYNTRO! I want to order "${product.name}"${selectedColor ? ` in ${selectedColor.name}` : ''}${selectedSize ? ` (Size: ${selectedSize.label} – ${selectedSize.dims})` : ''} for PKR ${(displayPrice * qty).toLocaleString()} (Qty: ${qty})`;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.pageGrid}>
          {/* ══════════════════════════════════════════════════
              LEFT — Sticky Image Gallery (Desktop)
          ═══════════════════════════════════════════════════ */}
          <div className={styles.galleryCol}>
            <ProductBreadcrumb productName={product.name} />
            <GallerySection
              currentImg={currentImg}
              galleryImages={galleryImages}
              gallery={gallery}
              setGallery={setGallery}
              productName={product.name}
            />
          </div>

          {/* ══════════════════════════════════════════════════
              RIGHT — Product Info Panel
          ═══════════════════════════════════════════════════ */}
          <div className={styles.infoCol}>
            {/* Mobile Breadcrumb (hidden on desktop) */}
            <div className={styles.mobileBreadcrumb}>
              <ProductBreadcrumb productName={product.name} />
            </div>

            {/* Category + Stock */}
            <div className={styles.topRow}>
              <span className={styles.categoryBadge}>{product.category}</span>
              <span className={`stock-badge ${stock.cls}`}>{stock.label}</span>
            </div>

            {/* Name */}
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.priceMain}>PKR {displayPrice.toLocaleString()}</span>
              {discountedPrice && (
                <>
                  <span className={styles.priceStrike}>PKR {priceWithColor.toLocaleString()}</span>
                  <span className={styles.priceBadge}>Save {product.discount_percentage}%</span>
                </>
              )}
              {colorPriceDiff !== 0 && (
                <span className={styles.colorPriceDiff}>
                  {colorPriceDiff > 0 ? `+PKR ${colorPriceDiff.toLocaleString()}` : `-PKR ${Math.abs(colorPriceDiff).toLocaleString()}`} for this color
                </span>
              )}
            </div>

            <div className={styles.divider} />

            {/* Size selector — only for mousepads */}
            {isMousepad && sizeVariants.length > 0 && (
              <div className={styles.selectorSection} id="pdp-size-selector">
                <div className={styles.selectorHeader}>
                  <span className={styles.selectorLabel}>SELECT SIZE</span>
                  <span className={styles.selectorValue}>
                    {selectedSize ? `${selectedSize.label} — ${selectedSize.dims}` : '—'}
                  </span>
                </div>
                <div className={styles.sizeGrid}>
                  {sizeVariants.map((sz) => {
                    const isActive = selectedSize?.id === sz.id;
                    return (
                      <button
                        key={sz.id}
                        type="button"
                        className={`${styles.sizeBtn} ${isActive ? styles.sizeBtnActive : ''}`}
                        onClick={() => setSelectedSize(sz)}
                        id={`size-btn-${sz.id.toLowerCase()}`}
                      >
                        {sz.popular && <span className={styles.popularDot} />}
                        <span className={styles.sizeBtnLabel}>{sz.label}</span>
                        <span className={styles.sizeBtnDims}>{sz.dims}</span>
                        <span className={styles.sizeBtnPrice}>PKR {sz.effectivePrice.toLocaleString()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color variant selector */}
            {colorVariants.length > 0 && (
              <div className={styles.selectorSection} id="pdp-color-selector">
                <div className={styles.selectorHeader}>
                  <span className={styles.selectorLabel}>AVAILABLE COLORS</span>
                  <span className={styles.selectorValue}>
                    {selectedColor ? selectedColor.name : '—'}
                  </span>
                </div>
                <div className={styles.colorSwatches}>
                  {colorVariants.map((cv) => {
                    const isActive = selectedColor?.id === cv.id;
                    return (
                      <button
                        key={cv.id}
                        type="button"
                        title={cv.name}
                        className={`${styles.swatch} ${isActive ? styles.swatchActive : ''}`}
                        onClick={() => setSelectedColor(cv)}
                        id={`color-btn-${cv.id}`}
                      >
                        {cv.image ? (
                          <Image src={cv.image} alt={cv.name} fill sizes="48px" style={{ objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                          <span className={styles.swatchColor} style={{ background: cv.hex || '#333' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mobile Image Gallery — shows immediately after available colors (hidden on desktop) */}
            <div className={styles.mobileGalleryWrap}>
              <GallerySection
                currentImg={currentImg}
                galleryImages={galleryImages}
                gallery={gallery}
                setGallery={setGallery}
                productName={product.name}
              />
            </div>

            <div className={styles.divider} />

            {/* Description accordion */}
            <Accordion title="DESCRIPTION" defaultOpen>
              <p className={styles.descText}>{product.description}</p>
            </Accordion>

            {/* Specifications accordion */}
            {(product.material_specs || product.delivery_time || product.warranty_period) && (
              <Accordion title="SPECIFICATIONS">
                <dl className={styles.specList}>
                  {product.material_specs && (
                    <>
                      <dt className={styles.specTerm}>Material & Specs</dt>
                      <dd className={styles.specDef}>{getCleanSpecValue('material_specs', product.material_specs)}</dd>
                    </>
                  )}
                  {product.delivery_time && (
                    <>
                      <dt className={styles.specTerm}>Delivery</dt>
                      <dd className={styles.specDef}>{product.delivery_time}</dd>
                    </>
                  )}
                  {product.warranty_period && (
                    <>
                      <dt className={styles.specTerm}>Warranty</dt>
                      <dd className={styles.specDef}>{product.warranty_period}</dd>
                    </>
                  )}
                  {product.care_instructions && (
                    <>
                      <dt className={styles.specTerm}>Care</dt>
                      <dd className={styles.specDef}>{product.care_instructions}</dd>
                    </>
                  )}
                </dl>
              </Accordion>
            )}

            <div className={styles.divider} />

            {/* Quantity + Add to Cart */}
            <div className={styles.ctaRow}>
              {/* Qty control */}
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >−</button>
                <span className={styles.qtyNum}>{qty}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty(qty + 1)}
                  disabled={qty >= product.stock_quantity}
                  aria-label="Increase quantity"
                >+</button>
              </div>

              {/* Add to cart */}
              <button
                className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                id="pdp-add-to-cart"
              >
                {added
                  ? '✓ ADDED'
                  : product.stock_quantity === 0
                    ? 'OUT OF STOCK'
                    : 'ADD TO CART'}
              </button>
            </div>

            {/* Price total below CTA */}
            {qty > 1 && (
              <p className={styles.totalNote}>
                Total: <strong>PKR {(displayPrice * qty).toLocaleString()}</strong>
              </p>
            )}

            {/* WhatsApp */}
            <a
              href={`https://wa.me/923363791538?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waBtn}
              id="pdp-whatsapp-btn"
            >
              <WAIcon /> ORDER VIA WHATSAPP
            </a>

            {/* COD */}
            <div className={styles.codBadge}>
              <span style={{ color: 'var(--success, #22c55e)' }}>✓</span>
              Cash on Delivery — pay when your order arrives
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
