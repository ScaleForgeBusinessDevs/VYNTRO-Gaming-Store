'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import styles from './confirmation.module.css';

function ConfirmationContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order') ?? 'VYN-XXXXXX';

  return (
    <div className={styles.card}>
      <div className={styles.checkCircle}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div className={styles.orderTag}>Order #{orderNumber}</div>

      <h1 className={`display-md ${styles.headline}`}>
        Order Placed!
      </h1>

      <p className="body-lg muted" style={{ maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
        Your order has been confirmed. We&apos;ve sent a confirmation to your email —
        check your inbox (and spam just in case).
      </p>

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={`${styles.stepIcon} ${styles.stepDone}`}>1</div>
          <div>
            <p className={styles.stepTitle}>Order Confirmed</p>
            <p className="body-sm muted">We&apos;re reviewing your order</p>
          </div>
        </div>
        <div className={styles.stepLine} />
        <div className={styles.step}>
          <div className={styles.stepIcon}>2</div>
          <div>
            <p className={styles.stepTitle}>Processing</p>
            <p className="body-sm muted">Your deskmat is being prepared</p>
          </div>
        </div>
        <div className={styles.stepLine} />
        <div className={styles.step}>
          <div className={styles.stepIcon}>3</div>
          <div>
            <p className={styles.stepTitle}>On the Way</p>
            <p className="body-sm muted">3–5 business days</p>
          </div>
        </div>
        <div className={styles.stepLine} />
        <div className={styles.step}>
          <div className={styles.stepIcon}>4</div>
          <div>
            <p className={styles.stepTitle}>Delivered</p>
            <p className="body-sm muted">Pay on arrival — COD</p>
          </div>
        </div>
      </div>

      <div className={styles.waBox}>
        <p className="body-sm">Questions about your order?</p>
        <a
          href="https://wa.me/923363791538"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          id="confirmation-whatsapp"
        >
          Chat on WhatsApp
        </a>
      </div>

      <Link href="/shop" className="btn btn-gold" id="confirmation-keep-shopping">
        Keep Shopping
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <Suspense fallback={<div className="spinner" />}>
            <ConfirmationContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
