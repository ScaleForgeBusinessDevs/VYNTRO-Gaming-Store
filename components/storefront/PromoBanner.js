'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PromoBanner.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function PromoBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: bannerRef.current, start: 'top 90%' },
        }
      );
    }, bannerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.banner} ref={bannerRef} id="promo-banner">
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className={styles.shimmer} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.textGroup}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>LIMITED RIG UPGRADE // 20% OFF</span>
          </div>
          <h2 className={styles.headline}>
            COMPLETE THE SETUP. <span className={styles.headlineAccent}>SAVE 20%.</span>
          </h2>
          <p className={styles.sub}>
            Match your XXL deskmat with an ergonomic cloud wrist rest and coiled aviator cable. Everything your battle station needs in one bundle.
          </p>
        </div>

        <Link
          href="/shop?cat=bundles"
          className={styles.ctaBtn}
          id="promo-bundle-btn"
        >
          CLAIM BUNDLE DEAL
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
