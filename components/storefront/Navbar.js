'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useCartStore from '@/lib/cartStore';
import CartDrawer from './CartDrawer';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'MOUSEPADS', href: '/mousepads' },
  { label: 'MICE', href: '/mice' },
  { label: 'KEYBOARDS', href: '/keyboards' },
  { label: 'IEMS', href: '/iems' },
  { label: 'HEADPHONES', href: '/headphones' },
  { label: 'ACCESSORIES', href: '/accessories' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <svg className={styles.logoMark} viewBox="0 0 28 24" fill="none">
              <path d="M2 3L14 21L26 3H20L14 13L8 3H2Z" fill="#E60012" />
              <path d="M7 3L14 15L21 3H17L14 8L11 3H7Z" fill="#FF334B" />
            </svg>
            <span className={styles.logoText}>VYNTRO</span>
          </Link>

          {/* Center Navigation Links */}
          <nav className={styles.navLinks} aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className={styles.actions}>
            {/* Search Icon */}
            <Link href="/shop" className={styles.iconBtn} aria-label="Search">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>

            {/* Cart Icon */}
            <button
              className={`${styles.iconBtn} ${styles.cartBtn}`}
              onClick={() => setDrawerOpen(true)}
              aria-label={`Cart - ${count} items`}
              id="nav-cart-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {count > 0 && (
                <span className={styles.badge}>{count > 99 ? '99+' : count}</span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className={styles.mobileNav}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
