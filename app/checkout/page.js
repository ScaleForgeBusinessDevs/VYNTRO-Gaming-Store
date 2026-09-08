'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import useCartStore from '@/lib/cartStore';
import styles from './checkout.module.css';

const PAKISTAN_CITIES = [
  'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan',
  'Peshawar','Quetta','Sialkot','Hyderabad','Gujranwala','Bahawalpur',
];

function validate(form) {
  const errors = {};
  if (!form.name.trim())    errors.name    = 'Full name is required';
  if (!form.email.trim())   errors.email   = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address';
  if (!form.phone.trim())   errors.phone   = 'Phone number is required';
  else if (!/^(\+92|0)3\d{9}$/.test(form.phone.replace(/\s/g, '')))
    errors.phone = 'Enter a valid Pakistani mobile number (e.g. 03001234567)';
  if (!form.address.trim()) errors.address = 'Delivery address is required';
  if (!form.city)           errors.city    = 'City is required';
  return errors;
}

export default function CheckoutPage() {
  const router   = useRouter();
  const items    = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const total    = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', notes: '',
  });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: form, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Order failed');
      clearCart();
      router.push(`/order-confirmation?order=${data.order_number}`);
    } catch (err) {
      setErrors({ _global: err.message || 'Something went wrong. Please try again.' });
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={`container ${styles.emptyWrap}`}>
            <h1 className="display-md">Checkout</h1>
            <p className="body-lg muted">Your cart is empty.</p>
            <Link href="/shop" className="btn btn-gold" style={{ marginTop: 16 }}>
              Go Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              <span className={styles.eyebrowText}>CASH ON DELIVERY // FAST SHIPPING</span>
              <span className={styles.eyebrowLine} />
            </div>
            <h1 className={styles.title}>
              FINAL <span className={styles.titleAccent}>CHECKOUT</span>
            </h1>
          </div>

          <div className={styles.layout}>
            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form} id="checkout-form" noValidate>
              <div className={`glass-light ${styles.formSection}`}>
                <h2 className={styles.sectionTitle}>Contact Information</h2>

                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-name">Full Name *</label>
                    <input
                      id="checkout-name"
                      name="name"
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Ahmed Khan"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-email">Email Address *</label>
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-phone">Phone Number *</label>
                    <input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="03001234567"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="form-error">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className={`glass-light ${styles.formSection}`}>
                <h2 className={styles.sectionTitle}>Delivery Address</h2>

                <div className={styles.formGrid}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" htmlFor="checkout-address">Street Address *</label>
                    <input
                      id="checkout-address"
                      name="address"
                      type="text"
                      className={`form-input ${errors.address ? 'error' : ''}`}
                      placeholder="House 12, Block B, DHA Phase 5"
                      value={form.address}
                      onChange={handleChange}
                      autoComplete="street-address"
                    />
                    {errors.address && <p className="form-error">{errors.address}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-city">City *</label>
                    <select
                      id="checkout-city"
                      name="city"
                      className={`form-input ${errors.city ? 'error' : ''}`}
                      value={form.city}
                      onChange={handleChange}
                    >
                      <option value="">Select city</option>
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.city && <p className="form-error">{errors.city}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-notes">Order Notes (optional)</label>
                    <textarea
                      id="checkout-notes"
                      name="notes"
                      className="form-input"
                      placeholder="Any special instructions..."
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Payment method — COD only */}
              <div className={`glass-light ${styles.formSection}`}>
                <h2 className={styles.sectionTitle}>Payment Method</h2>
                <div className={styles.codOption}>
                  <div className={styles.codRadio}>
                    <div className={styles.codDot} />
                  </div>
                  <div>
                    <p className={styles.codLabel}>Cash on Delivery</p>
                    <p className="body-sm muted">Pay in cash when your order is delivered.</p>
                  </div>
                </div>
              </div>

              {errors._global && (
                <div className={styles.globalError}>{errors._global}</div>
              )}

              <button
                type="submit"
                className={`btn btn-gold ${styles.submitBtn}`}
                disabled={submitting}
                id="checkout-submit"
              >
                {submitting ? (
                  <><div className="spinner" style={{ width: 16, height: 16 }} />  Placing Order...</>
                ) : (
                  'Place Order →'
                )}
              </button>
            </form>

            {/* Order summary */}
            <div className={`glass ${styles.summary}`}>
              <h2 className="heading-md">Order Summary</h2>
              <div className="divider" style={{ margin: '16px 0' }} />

              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <div>
                    <p className="body-sm">{item.name}</p>
                    {item.color && (
                      <p style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '2px 0 1px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {item.colorHex && (
                          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: item.colorHex, border: '1px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
                        )}
                        COLOR: {item.color}
                      </p>
                    )}
                    {item.variant && (
                      <p style={{ fontSize: '0.72rem', color: '#FF334B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '1px 0' }}>
                        SIZE: {item.variant} {item.variantDims ? `(${item.variantDims})` : ''}
                      </p>
                    )}
                    <p className="body-sm muted">× {item.quantity}</p>
                  </div>
                  <p className="body-sm" style={{ fontWeight: 600 }}>
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="divider" style={{ margin: '16px 0' }} />
              <div className={styles.totalRow}>
                <span className="heading-md">Total</span>
                <span className="price-current">PKR {total.toLocaleString()}</span>
              </div>

              <div className={styles.codNote}>
                <span style={{ color: 'var(--success)', fontSize: '1rem' }}>✓</span>
                Cash on Delivery
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
