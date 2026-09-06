'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CategoryGrid.module.css';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  {
    id: 'mousepads',
    label: 'MOUSEPADS',
    href: '/mousepads',
    bg: '/red_mousepad.jpg',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    id: 'mice',
    label: 'MICE',
    href: '/mice',
    bg: '/mouse_cat.jpg',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="3" width="12" height="18" rx="6" />
        <line x1="12" y1="3" x2="12" y2="9" />
        <path d="M6 9h12" />
      </svg>
    ),
  },
  {
    id: 'keyboards',
    label: 'KEYBOARDS',
    href: '/keyboards',
    bg: '/keyboard_cat.jpg',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
      </svg>
    ),
  },
  {
    id: 'iems',
    label: 'IEMS',
    href: '/iems',
    bg: '/IEMs_cat.jpg',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
      </svg>
    ),
  },
  {
    id: 'accessories',
    label: 'ACCESSORIES',
    href: '/accessories',
    bg: '/ARM_cat.jpg',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function CategoryGrid() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef} id="category-grid">
      <div className={styles.container}>
        <div className={styles.titleBlock}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrowText}>EXPLORE OUR LINEUP</span>
            <span className={styles.eyebrowLine} />
          </div>
          <h2 className={styles.title}>
            SHOP BY{' '}
            <span className={styles.titleAccent}>CATEGORY</span>
          </h2>

        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={styles.card}
              ref={(el) => (cardsRef.current[i] = el)}
              id={`cat-card-${cat.id}`}
            >
              {/* Background Image */}
              <div className={styles.imgWrapper}>
                <Image
                  src={cat.bg}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className={styles.bgImg}
                />
                {/* Dark overlay so text is readable */}
                <div className={styles.overlay} />
              </div>

              {/* Centered Content */}
              <div className={styles.cardContent}>
                <div className={styles.iconWrap}>
                  {cat.icon}
                </div>
                <h3 className={styles.categoryName}>{cat.label}</h3>
                <div className={styles.shopNowWrap}>
                  <span className={styles.shopNowText}>SHOP NOW</span>
                  <div className={styles.accentLine} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
