import Link from 'next/link';
import styles from './Footer.module.css';

const SHOP_LINKS = [
  { label: 'Precision Mousepads', href: '/mousepads' },
  { label: 'Competitive Mice',     href: '/mice' },
  { label: 'Mechanical Keyboards', href: '/keyboards' },
  { label: 'Gaming IEMs',          href: '/iems' },
  { label: 'Studio Headphones',    href: '/headphones' },
  { label: 'Desk Accessories',     href: '/accessories' },
];

const SUPPORT_LINKS = [
  { label: 'Order Tracking', href: '#' },
  { label: 'WhatsApp Us',    href: 'https://wa.me/923000000000' },
  { label: 'Returns Policy', href: '#' },
  { label: 'FAQ',            href: '#' },
];

export default function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      <div className="container">
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <p className={styles.logo}>
              <span className={styles.logoV}>V</span>YNTRO
            </p>
            <p className={styles.tagline}>
              Premium custom-printed gaming deskmats, made to order in Karachi.
              Your desk, your vibe.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Instagram" className={styles.socialLink} id="footer-instagram">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="TikTok" className={styles.socialLink} id="footer-tiktok">
                <TikTokIcon />
              </a>
              <a href="https://wa.me/923000000000" aria-label="WhatsApp" className={styles.socialLink} id="footer-whatsapp">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div className={styles.linkGroup}>
            <p className={styles.linkGroupTitle}>Shop</p>
            <ul className={styles.links}>
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.link}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className={styles.linkGroup}>
            <p className={styles.linkGroupTitle}>Support</p>
            <ul className={styles.links}>
              {SUPPORT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={styles.link}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COD note */}
          <div className={styles.codBox}>
            <p className={styles.codTitle}>Cash on Delivery</p>
            <p className={styles.codText}>
              No online payment required. Pay when your order arrives at your door.
            </p>
            <p className={styles.location}>📍 Karachi, Pakistan</p>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.bottomText}>
            © {new Date().getFullYear()} VYNTRO. All rights reserved.
          </p>
          <p className={styles.bottomText}>Made in Karachi 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l.01-7.27a8.17 8.17 0 0 0 4.78 1.52V6.12a4.85 4.85 0 0 1-1.02-.43z"/>
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}
