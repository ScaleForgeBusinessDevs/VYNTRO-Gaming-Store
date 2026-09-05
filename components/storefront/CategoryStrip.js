'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CategoryStrip.module.css';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  {
    id: 'xxl',       label: 'XXL Deskmats',  href: '/shop/xxl-deskmats',
    icon: <MatIcon />,
  },
  {
    id: 'rgb',       label: 'RGB Deskmats',  href: '/shop/rgb-deskmats',
    icon: <RgbIcon />,
  },
  {
    id: 'bundles',   label: 'Bundles',       href: '/shop/bundles',
    icon: <BundleIcon />,
  },
  {
    id: 'wrist',     label: 'Wrist Rests',   href: '/shop/wrist-rests',
    icon: <WristIcon />,
  },
  {
    id: 'sale',      label: 'Sale',          href: '/shop/sale',
    icon: <SaleIcon />,
    accent: true,
  },
];

export default function CategoryStrip() {
  const stripRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stripRef.current?.querySelectorAll('[data-cat]') ?? [],
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stripRef.current,
            start: 'top 88%',
          },
        }
      );
    }, stripRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={`section ${styles.strip}`} ref={stripRef} id="categories">
      <div className="container">
        <div className={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              data-cat={cat.id}
              className={`${styles.catItem} ${cat.accent ? styles.accent : ''}`}
              id={`cat-strip-${cat.id}`}
            >
              <span className={styles.iconWrap}>{cat.icon}</span>
              <span className={styles.catLabel}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function MatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="5" width="22" height="14" rx="2"/>
      <rect x="4" y="8" width="16" height="8" rx="1"/>
    </svg>
  );
}
function RgbIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="5" width="22" height="14" rx="2"/>
      <circle cx="7" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="17" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  );
}
function BundleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="8" width="20" height="12" rx="2"/>
      <rect x="6" y="4" width="12" height="4" rx="1"/>
    </svg>
  );
}
function WristIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="14" width="20" height="6" rx="3"/>
      <path d="M6 14 Q7 9 12 9 Q17 9 18 14"/>
    </svg>
  );
}
function SaleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 21 12 16.5 5.8 21l2.4-7.1L2 9.4h7.6z"/>
    </svg>
  );
}
