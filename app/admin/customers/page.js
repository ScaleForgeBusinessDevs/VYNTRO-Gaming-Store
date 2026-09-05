'use client';
import { useState, useEffect } from 'react';
import styles from './customers.module.css';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();

        // Fetch all customers + their order counts + total spend
        const { data } = await supabase
          .from('orders')
          .select('customer_id, total_amount, customers(id, name, email, phone, city, created_at)');
        const orders = data || [];

        // Group by customer
        const map = {};
        orders.forEach((o) => {
          const c = o.customers;
          if (!c) return;
          if (!map[c.id]) {
            map[c.id] = { ...c, orderCount: 0, totalSpend: 0 };
          }
          map[c.id].orderCount  += 1;
          map[c.id].totalSpend  += o.total_amount ?? 0;
        });

        setCustomers(
          Object.values(map).sort((a, b) => b.totalSpend - a.totalSpend)
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = search.trim()
    ? customers.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
      )
    : customers;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="heading-lg">Customers</h1>
        <p className="body-sm muted">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <input
        type="search"
        className={`form-input ${styles.search}`}
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        id="customers-search"
      />

      {loading ? (
        <div className={styles.loading}><div className="spinner" /></div>
      ) : (
        <div className={`glass-light ${styles.tableWrap}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>City</th>
                <th>Orders</th>
                <th>Lifetime Value</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className={styles.emptyRow}>No customers yet.</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className={styles.row}>
                    <td>
                      <div className={styles.customerCell}>
                        <span className={styles.custName}>{c.name}</span>
                        <span className="body-sm muted">{c.email}</span>
                      </div>
                    </td>
                    <td className="body-sm muted">{c.phone}</td>
                    <td className="body-sm muted">{c.city ?? '—'}</td>
                    <td>
                      <span className={`badge ${c.orderCount > 1 ? 'badge-cyan' : 'badge-gold'}`}>
                        {c.orderCount} order{c.orderCount !== 1 ? 's' : ''}
                      </span>
                      {c.orderCount > 1 && (
                        <span className="badge badge-success" style={{ marginLeft: 4, fontSize: '0.58rem' }}>Returning</span>
                      )}
                    </td>
                    <td className={styles.ltv}>PKR {c.totalSpend.toLocaleString()}</td>
                    <td className="body-sm muted">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-PK') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
