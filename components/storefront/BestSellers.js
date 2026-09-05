'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';
import styles from './BestSellers.module.css';

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER_PRODUCTS = [
  { id: '1', name: 'Midnight Black XL', slug: 'midnight-black-xl', selling_price: 2499, discount_percentage: 0, stock_quantity: 12, images: ['/red_mousepad.jpg'], category: 'XXL Deskmats' },
  { id: '2', name: 'Arctic White Pro', slug: 'arctic-white-pro', selling_price: 2999, discount_percentage: 20, stock_quantity: 4, images: ['/sakura-mousepad.jpg'], category: 'XXL Deskmats' },
  { id: '3', name: 'RGB Horizon Mat', slug: 'rgb-horizon-mat', selling_price: 3499, discount_percentage: 0, stock_quantity: 8, images: ['/dragon-wave-mousepad.jpg'], category: 'RGB Deskmats' },
  { id: '4', name: 'Galaxy Dragon Bundle', slug: 'galaxy-bundle', selling_price: 4999, discount_percentage: 15, stock_quantity: 5, images: ['/jjk_mousepad.jpg'], category: 'Bundles' },
  { id: '5', name: 'Stealth Tactical XXL', slug: 'stealth-tactical-xxl', selling_price: 2799, discount_percentage: 0, stock_quantity: 14, images: ['/tactical-mousepad.jpg'], category: 'XXL Deskmats' },
];

export default function BestSellers() {
  const [products, setProducts] = useState(PLACEHOLDER_PRODUCTS);
  const sectionRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (data && data.length > 0) {
          const combined = [...data];
          for (const p of PLACEHOLDER_PRODUCTS) {
            if (combined.length >= 5) break;
            if (!combined.some((item) => item.slug === p.slug || item.id === p.id)) {
              combined.push(p);
            }
          }
          setProducts(combined.slice(0, 5));
        }
      } catch {
        // Supabase not yet configured — use placeholders
      }
    };
    load();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('[id^="product-card"]') ?? [],
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [products]);

  return (
    <section className={styles.section} ref={sectionRef} id="best-sellers">
      <div className={styles.container}>

        {/* Section Header — centered */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrowText}>CUSTOMER FAVOURITES</span>
            <span className={styles.eyebrowLine} />
          </div>
          <h2 className={styles.title}>
            BEST <span className={styles.titleAccent}>SELLERS</span>
          </h2>

        </div>

        {/* Product Grid */}
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
