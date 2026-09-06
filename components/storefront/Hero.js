'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (visualRef.current) {
        gsap.fromTo(
          visualRef.current,
          { scale: 0.98, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
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

        {/* Semantic Content for SEO / Accessibility */}
        <div className={styles.srOnly}>
          <h1>VYNTRO — YOUR SETUP. YOUR ADVANTAGE.</h1>
          <p>CUSTOM MOUSEPADS, PREMIUM GEAR.</p>
        </div>
      </div>
    </section>
  );
}
