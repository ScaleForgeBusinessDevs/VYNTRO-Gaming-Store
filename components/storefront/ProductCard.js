'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';

function getProductIcon(category = '', name = '') {
  const text = `${category} ${name}`.toLowerCase();
  if (text.includes('mouse') || text.includes('mice')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="3" width="12" height="18" rx="6" />
        <line x1="12" y1="3" x2="12" y2="9" />
        <path d="M6 9h12" />
      </svg>
    );
  }
  if (text.includes('keyboard')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
      </svg>
    );
  }
  if (text.includes('iem') || text.includes('audio') || text.includes('headphone')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
      </svg>
    );
  }
  if (text.includes('bundle') || text.includes('accessory') || text.includes('wrist')) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  // Default deskmat / mousepad icon
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
}

const FALLBACK_ARTWORKS = [
  '/red_mousepad.jpg',
  '/sakura-mousepad.jpg',
  '/dragon-wave-mousepad.jpg',
  '/jjk_mousepad.jpg',
  '/tactical-mousepad.jpg',
];

function getProductImage(product) {
  if (product.images && product.images.length > 0 && product.images[0]) {
    let img = product.images[0];
    if (img.includes('Sakura Landscape')) return '/sakura-mousepad.jpg';
    if (img.includes('Wave MTG')) return '/dragon-wave-mousepad.jpg';
    if (img.includes('Zindoo XXL')) return '/tactical-mousepad.jpg';
    if (img.toLowerCase().includes('hero_upscaled')) return '/hero-upscaled.jpeg';
    return img;
  }
  const key = `${product.slug || ''} ${product.name || ''} ${product.id || ''}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return FALLBACK_ARTWORKS[Math.abs(hash) % FALLBACK_ARTWORKS.length];
}

export default function ProductCard({ product }) {
  const discountedPrice = product.discount_percentage
    ? product.selling_price * (1 - product.discount_percentage / 100)
    : null;

  const isOutOfStock = (product.stock_quantity ?? 0) === 0;
  const displayPrice = discountedPrice ?? product.selling_price;
  const imageUrl = getProductImage(product);

  const icon = getProductIcon(product.category, product.name);

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`${styles.card} ${isOutOfStock ? styles.cardOutOfStock : ''}`}
      id={`product-card-${product.id}`}
    >
      {/* Background Image — Exactly matching CategoryGrid */}
      <div className={styles.imgWrapper}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className={styles.bgImg}
        />
        {/* Dark overlay so text is readable */}
        <div className={styles.overlay} />

        {/* Out of Stock Banner across top */}
        {isOutOfStock && (
          <div className={styles.outOfStockBanner}>
            <span className={styles.outOfStockDot} />
            OUT OF STOCK
          </div>
        )}
      </div>

      {/* Centered / Pinned Bottom Content */}
      <div className={styles.cardContent}>
        <div className={styles.iconWrap}>
          {icon}
        </div>
        <h3 className={styles.categoryName}>{product.name}</h3>
        <div className={styles.shopNowWrap}>
          <div className={styles.priceRow}>
            <span className={styles.priceText}>
              PKR {Math.round(displayPrice).toLocaleString()}
            </span>
            {discountedPrice && (
              <span className={styles.originalPrice}>
                PKR {product.selling_price.toLocaleString()}
              </span>
            )}
            <span className={styles.sep}>//</span>
            <span className={isOutOfStock ? styles.outOfStockText : styles.shopNowText}>
              {isOutOfStock ? 'OUT OF STOCK' : 'SHOP NOW'}
            </span>
          </div>
          <div className={styles.accentLine} />
        </div>
      </div>
    </Link>
  );
}
