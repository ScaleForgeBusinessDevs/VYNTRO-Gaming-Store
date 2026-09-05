'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import styles from './AdminNav.module.css';

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/admin',          icon: <DashIcon /> },
  { label: 'Orders',     href: '/admin/orders',   icon: <OrderIcon /> },
  { label: 'Products',   href: '/admin/products', icon: <ProductIcon /> },
  { label: 'Customers',  href: '/admin/customers',icon: <CustomerIcon /> },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    document.cookie = 'vyntro_admin_session=; path=/; max-age=0';
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } catch {}
    router.push('/admin/login');
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoWrap}>
        <Link href="/admin" className={styles.logo}>
          <span className={styles.logoV}>V</span>YNTRO
        </Link>
        <span className={styles.adminBadge}>Admin</span>
      </div>

      {/* Nav */}
      <nav className={styles.nav} aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              id={`admin-nav-${item.label.toLowerCase()}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={styles.bottom}>
        <Link href="/" className={styles.storeLinkBtn} target="_blank">
          <ExternalIcon /> View Store
        </Link>
        <button
          className={styles.signOutBtn}
          onClick={handleSignOut}
          disabled={signingOut}
          id="admin-sign-out"
        >
          <LogoutIcon /> {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}

function DashIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function OrderIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>; }
function ProductIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="1" y="5" width="22" height="14" rx="2"/><rect x="4" y="8" width="16" height="8" rx="1"/></svg>; }
function CustomerIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function ExternalIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }
function LogoutIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
