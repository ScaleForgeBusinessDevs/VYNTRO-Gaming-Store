'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './orders.module.css';

const STATUSES = ['All','Pending','Confirmed','Shipped','Delivered','Cancelled','Returned'];

const STATUS_COLORS = {
  Pending:   'badge-gold',
  Confirmed: 'badge-cyan',
  Shipped:   'badge-cyan',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
  Returned:  'badge-danger',
};

export default function AdminOrdersPage() {
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [updating,  setUpdating]  = useState(null); // order id being updated

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { getSupabase } = await import('@/lib/supabase');
      const supabase = getSupabase();
      let q = supabase
        .from('orders')
        .select('id, order_number, status, total_amount, total_cogs, profit_margin, created_at, customers(id, name, phone, email)')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'All') q = q.eq('status', filterStatus);

      const { data } = await q;
      const list = data || [];

      // Detect returning customers (email appears more than once)
      const emailCounts = {};
      list.forEach((o) => {
        const email = o.customers?.email;
        if (email) emailCounts[email] = (emailCounts[email] || 0) + 1;
      });

      setOrders(list.map((o) => ({
        ...o,
        isReturning: (emailCounts[o.customers?.email] ?? 0) > 1,
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { load(); }, [load]);

  const filtered = search.trim()
    ? orders.filter((o) =>
        o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        o.customers?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.customers?.phone?.includes(search)
      )
    : orders;

  async function handleStatusChange(orderId, newStatus) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="heading-lg">Orders</h1>
        <p className="body-sm muted">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters + search */}
      <div className={styles.toolbar}>
        <input
          type="search"
          className={`form-input ${styles.search}`}
          placeholder="Search by order #, name, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="orders-search"
        />
        <div className={styles.statusFilters}>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`${styles.statusBtn} ${filterStatus === s ? styles.active : ''}`}
              onClick={() => setFilterStatus(s)}
              id={`orders-filter-${s.toLowerCase()}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`glass-light ${styles.tableWrap}`}>
        {loading ? (
          <div className={styles.loading}><div className="spinner" /></div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Status</th>
                <th>COGS</th>
                <th>Total</th>
                <th>Margin</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>No orders found.</td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className={styles.row}>
                    <td>
                      <div className={styles.orderCell}>
                        <span className={styles.orderNum}>{o.order_number}</span>
                        {o.isReturning && (
                          <span className="badge badge-cyan" style={{ fontSize: '0.58rem' }}>Returning</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.customerCell}>
                        <span className={styles.custName}>{o.customers?.name ?? '—'}</span>
                        <span className="body-sm muted">{o.customers?.phone}</span>
                      </div>
                    </td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        disabled={updating === o.id}
                        aria-label={`Change status for order ${o.order_number}`}
                      >
                        {['Pending','Confirmed','Shipped','Delivered','Cancelled','Returned'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.cogs}>PKR {(o.total_cogs ?? 0).toLocaleString()}</td>
                    <td className={styles.total}>PKR {(o.total_amount ?? 0).toLocaleString()}</td>
                    <td>
                      <span className={styles.margin} style={{ color: (o.profit_margin ?? 0) > 30 ? 'var(--success)' : 'var(--warning)' }}>
                        {(o.profit_margin ?? 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className={styles.date}>
                      {new Date(o.created_at).toLocaleDateString('en-PK')}
                    </td>
                    <td>
                      <Link href={`/admin/orders/${o.id}`} className={styles.viewBtn}>
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
