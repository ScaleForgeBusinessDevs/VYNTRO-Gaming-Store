'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TrustBadges.module.css';

gsap.registerPlugin(ScrollTrigger);

const BADGES = [
  {
    id: 'cod',
    icon: <CodIcon />,
    title: 'Cash on Delivery',
    sub: 'Pay when your order arrives. Zero online pre-payment required.',
  },
  {
    id: 'custom',
    icon: <CustomIcon />,
    title: 'Precision Print',
    sub: 'Ultra-HD sublimation with zero bleed and stitched anti-fray edges.',
  },
  {
    id: 'delivery',
    icon: <DeliveryIcon />,
    title: 'Nationwide Delivery',
    sub: 'Fast and reliable 3–5 business day shipping across Pakistan.',
  },
  {
    id: 'support',
    icon: <WhatsAppIcon />,
    title: 'Direct WhatsApp Care',
    sub: 'Fast human support for setup advice, tracking, and custom inquiries.',
  },
];

export default function TrustBadges() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current?.querySelectorAll('[data-badge]') ?? [],
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={ref} id="trust-badges">
      <div className="container">
        {/* Centered header */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrowText}>THE VYNTRO STANDARD</span>
            <span className={styles.eyebrowLine} />
          </div>
          <h2 className={styles.title}>
            WHY GAMERS CHOOSE <span className={styles.titleAccent}>VYNTRO</span>
          </h2>
        </div>

        {/* 4 Cards */}
        <div className={styles.grid}>
          {BADGES.map((b) => (
            <div key={b.id} data-badge={b.id} className={styles.card}>
              <div className={styles.iconWrap}>{b.icon}</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardSub}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function CustomIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
