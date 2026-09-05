'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';
import styles from './CollectionSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function CollectionSection({
  id,
  collectionKey,
  eyebrowText,
  titlePrefix,
  titleAccent,
  subtitle,
  placeholderProducts = [],
  viewAllHref = '/shop',
}) {
  const [products, setProducts] = useState(placeholderProducts);
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();
        let query = supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (collectionKey) {
          query = query.contains('collections', [collectionKey]);
        }

        const { data } = await query
          .order('created_at', { ascending: false })
          .limit(5);

        if (isMounted && data && data.length > 0) {
          const combined = [...data];
          for (const p of placeholderProducts) {
            if (combined.length >= 5) break;
            if (!combined.some((item) => item.slug === p.slug || item.id === p.id)) {
              combined.push(p);
            }
          }
          setProducts(combined.slice(0, 5));
        }
      } catch {
        // Fallback to placeholder products
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [collectionKey]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('[id^="product-card"]') ?? [],
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [products]);

  return (
    <section className={styles.section} ref={sectionRef} id={id || `collection-${collectionKey}`}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          {eyebrowText && (
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              <span className={styles.eyebrowText}>{eyebrowText}</span>
              <span className={styles.eyebrowLine} />
            </div>
          )}
          <h2 className={styles.title}>
            {titlePrefix} <span className={styles.titleAccent}>{titleAccent}</span>
          </h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* Product Grid */}
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Action button */}
        {viewAllHref && (
          <div className={styles.footerAction}>
            <Link href={viewAllHref} className={styles.viewAllBtn}>
              EXPLORE {titlePrefix} {titleAccent}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
