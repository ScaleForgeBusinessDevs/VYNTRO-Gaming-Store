'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CyberpunkPageHeader from '@/components/storefront/CyberpunkPageHeader';
import useCartStore from '@/lib/cartStore';
import styles from './cart.module.css';

export default function CartPage() {
  const items     = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty  = useCartStore((s) => s.updateQty);
  const total      = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          {/* Cyberpunk Modern Header */}
          <CyberpunkPageHeader
            eyebrow="TRANSACTION TERMINAL // LOADOUT"
            titlePrefix="YOUR"
            titleAccent="CART"
            description="Review your tactical hardware selection before proceeding to secure checkout dispatch."
            code="LOADOUT CONFIRM"
          />

          {items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <BagIcon />
              </div>
              <h2 className="heading-md">Your cart is empty</h2>
              <p className="body-md muted">Looks like you haven&apos;t added anything yet.</p>
              <Link href="/shop" className="btn btn-gold" style={{ marginTop: 8 }}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div className={styles.layout}>
              {/* Items */}
              <div className={styles.items}>
                {items.map((item) => (
                  <div key={item.id} className={`glass-light ${styles.item}`}>
                    {/* Image */}
                    <div className={styles.itemImg}>
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="placeholder-img">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="1" y="5" width="22" height="14" rx="2"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className={styles.itemInfo}>
                      <Link href={`/product/${item.slug ?? '#'}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      {(item.color || item.variant) && (
                        <div style={{ margin: '2px 0 6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {item.color && (
                            <p style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {item.colorHex && (
                                <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: item.colorHex, border: '1px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
                              )}
                              COLOR: {item.color}
                            </p>
                          )}
                          {item.variant && (
                            <p style={{ fontSize: '0.75rem', color: '#FF334B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                              SIZE: {item.variant} {item.variantDims ? `(${item.variantDims})` : ''}
                            </p>
                          )}
                        </div>
                      )}
                      <p className={styles.itemUnitPrice}>
                        PKR {item.price.toLocaleString()} each
                      </p>

                      {/* Qty + remove */}
                      <div className={styles.itemActions}>
                        <div className={styles.qtyControl}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease"
                          >−</button>
                          <span className={styles.qtyNum}>{item.quantity}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            aria-label="Increase"
                          >+</button>
                        </div>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <p className={styles.lineTotal}>
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className={`glass ${styles.summary}`}>
                <h2 className="heading-md">Order Summary</h2>
                <div className="divider" style={{ margin: '16px 0' }} />

                <div className={styles.summaryRows}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.summaryRow}>
                      <div className="body-sm muted" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{item.name} × {item.quantity}</span>
                        {(item.color || item.variant) && (
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                            {[item.color && `Color: ${item.color}`, item.variant && `Size: ${item.variant}`].filter(Boolean).join(' | ')}
                          </span>
                        )}
                      </div>
                      <span className="body-sm">PKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="divider" style={{ margin: '16px 0' }} />
                <div className={styles.totalRow}>
                  <span className="heading-md">Total</span>
                  <span className="price-current">PKR {total.toLocaleString()}</span>
                </div>

                <div className={styles.codNote}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  Cash on Delivery — pay on arrival
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-gold"
                  style={{ width: '100%', padding: '16px', marginTop: '4px' }}
                  id="cart-proceed-checkout"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="btn btn-ghost"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function BagIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
