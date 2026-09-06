'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useCartStore from '@/lib/cartStore';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ open, onClose }) {
  const items    = useCartStore((s) => s.items);
  const remove   = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const total    = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.visible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${open ? styles.open : ''}`}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
        id="cart-drawer"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Cart
            {items.length > 0 && (
              <span className={styles.countPill}>
                {items.reduce((n, i) => n + i.quantity, 0)}
              </span>
            )}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close cart"
            id="cart-close-btn"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => remove(item.id)}
                onQtyChange={(qty) => updateQty(item.id, qty)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span className="body-sm muted">Subtotal</span>
              <span className={styles.totalAmount}>
                PKR {total.toLocaleString()}
              </span>
            </div>
            <p className={styles.codNote}>
              Cash on Delivery — no payment needed now
            </p>
            <Link
              href="/checkout"
              className={`btn btn-gold ${styles.checkoutBtn}`}
              onClick={onClose}
              id="cart-checkout-btn"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              className={`btn btn-ghost ${styles.viewCartBtn}`}
              onClick={onClose}
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

function CartItem({ item, onRemove, onQtyChange }) {
  return (
    <div className={styles.item}>
      {/* Image */}
      <div className={styles.itemImg}>
        {item.image ? (
          <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
        ) : (
          <PlaceholderImg />
        )}
      </div>

      {/* Info */}
      <div className={styles.itemInfo}>
        {/* Bundle badge */}
        {item.isBundle && (
          <span style={{
            display: 'inline-block',
            fontSize: '0.58rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#fff',
            background: '#E60012',
            padding: '2px 7px',
            borderRadius: '2px',
            marginBottom: '4px',
            textTransform: 'uppercase',
          }}>
            BUNDLE
          </span>
        )}

        <p className={styles.itemName}>{item.name}</p>

        {/* Show size variant for regular products */}
        {!item.isBundle && item.variant && (
          <p className={styles.itemVariant} style={{ fontSize: '0.72rem', color: '#FF334B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '-2px 0 4px' }}>
            SIZE: {item.variant} {item.variantDims ? `(${item.variantDims})` : ''}
          </p>
        )}

        {/* Show included items for bundles */}
        {item.isBundle && item.bundleItems?.length > 0 && (
          <ul style={{ margin: '2px 0 4px', padding: 0, listStyle: 'none' }}>
            {item.bundleItems.map((name, i) => (
              <li key={i} style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em', lineHeight: 1.6 }}>
                · {name}
              </li>
            ))}
          </ul>
        )}

        <p className={styles.itemPrice}>PKR {item.price.toLocaleString()}</p>

        {/* Qty controls */}
        <div className={styles.qtyRow}>
          <button
            className={styles.qtyBtn}
            onClick={() => onQtyChange(item.quantity - 1)}
            aria-label="Decrease quantity"
            disabled={item.quantity <= 1}
          >−</button>
          <span className={styles.qty}>{item.quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => onQtyChange(item.quantity + 1)}
            aria-label="Increase quantity"
          >+</button>
        </div>
      </div>

      {/* Remove */}
      <button
        className={styles.removeBtn}
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <BagIcon />
      <p className={styles.emptyTitle}>Your cart is empty</p>
      <p className="body-sm muted">Add some products to get started</p>
    </div>
  );
}

function PlaceholderImg() {
  return (
    <div className={styles.imgPlaceholder}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    </div>
  );
}

function CloseIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
