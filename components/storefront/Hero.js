'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import styles from './Hero.module.css';

function scrollToCategories() {
  const el = document.getElementById('category-grid');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero() {
  const heroRef = useRef(null);
  const visualRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (visualRef.current) {
        gsap.fromTo(
          visualRef.current,
          { scale: 0.98, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
        );
      }
      if (overlayRef.current) {
        const children = overlayRef.current.children;
        gsap.fromTo(
          children,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.4 }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={heroRef} id="hero">
      {/* 1-to-1 Master Render Scene */}
      <div className={styles.visualContainer} ref={visualRef}>
        <div className={styles.imageWrapper}>
          <Image
            src="/maybe_notext.jpeg"
            alt="VYNTRO - YOUR SETUP. YOUR ADVANTAGE. Custom Mousepads, Premium Gear"
            fill
            priority
            unoptimized
            sizes="100vw"
            className={styles.heroImage}
          />
        </div>

        {/* Hero Text Overlay */}
        <div className={styles.heroOverlay} ref={overlayRef}>
          <h1 className={styles.heroTagline}>
            YOUR SETUP. <span className={styles.heroAccent}>YOUR ADVANTAGE.</span>
          </h1>
          <p className={styles.heroSubtitle}>CUSTOM MOUSEPADS. PREMIUM GEAR.</p>
          <button
            className={styles.shopNowBtn}
            onClick={scrollToCategories}
            id="hero-shop-now"
          >
            SHOP NOW
          </button>
        </div>
      </div>
    </section>
  );
}
