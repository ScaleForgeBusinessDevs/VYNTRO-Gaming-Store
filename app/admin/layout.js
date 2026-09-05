import AdminNav from '@/components/admin/AdminNav';
import styles from './admin-layout.module.css';

export const metadata = {
  title: { default: 'Admin — VYNTRO', template: '%s | Admin VYNTRO' },
};

export default function AdminLayout({ children }) {
  return (
    <div className={styles.shell}>
      <AdminNav />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
