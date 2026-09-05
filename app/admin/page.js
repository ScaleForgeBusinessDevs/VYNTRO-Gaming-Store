'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';

const FILTER_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today',    value: 'today' },
  { label: 'This Week',value: 'week' },
];

export default function AdminDashboard() {
  const [filter, setFilter] = useState('all');
  const [stats,  setStats]  = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();

        // Build date filter
        let dateFilter = null;
        const now = new Date();
        if (filter === 'today') {
          dateFilter = new Date(now.setHours(0,0,0,0)).toISOString();
        } else if (filter === 'week') {
          const d = new Date(); d.setDate(d.getDate() - 7);
          dateFilter = d.toISOString();
        }

        // Orders query
        let ordersQ = supabase.from('orders').select('total_amount, total_cogs, profit_margin, status, customer_id, created_at');
        if (dateFilter) ordersQ = ordersQ.gte('created_at', dateFilter);
        const { data: ordersData } = await ordersQ;
        const orders = ordersData || [];

        // Compute stats
        const totalRevenue  = orders.reduce((s, o) => s + (o.total_amount ?? 0), 0);
        const totalCogs     = orders.reduce((s, o) => s + (o.total_cogs ?? 0), 0);
        const totalProfit   = totalRevenue - totalCogs;
        const blendedMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        // Unique customers + repeat rate
        const custIds = orders.map((o) => o.customer_id);
        const unique  = new Set(custIds).size;
        const repeat  = custIds.length > unique
          ? Math.round(((custIds.length - unique) / custIds.length) * 100)
          : 0;

        setStats({
          totalOrders:  orders.length,
          totalRevenue,
          totalCogs,
          totalProfit,
          blendedMargin,
          repeatRate: repeat,
        });

        // Low stock
        const { data: lsData } = await supabase
          .from('products')
          .select('id, name, stock_quantity')
          .lte('stock_quantity', 5)
          .eq('is_active', true)
          .order('stock_quantity');
        setLowStock(lsData || []);

        // Recent orders
        const { data: recentData } = await supabase
          .from('orders')
          .select('id, order_number, status, total_amount, created_at, customers(name)')
          .order('created_at', { ascending: false })
          .limit(5);
        setRecentOrders(recentData || []);
      } catch (e) {
        console.error(e);
        setStats({
          totalOrders: 0,
          totalRevenue: 0,
          totalCogs: 0,
          totalProfit: 0,
          blendedMargin: 0,
          repeatRate: 0,
        });
        setLowStock([]);
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className="heading-lg">Dashboard</h1>
          <p className="body-sm muted">Welcome back, boss.</p>
        </div>
        <div className={styles.filterGroup} role="group" aria-label="Time filter">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${filter === f.value ? styles.active : ''}`}
              onClick={() => setFilter(f.value)}
              id={`dash-filter-${f.value}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}><div className="spinner" /></div>
      ) : (
        <>
          {/* Stats grid */}
          <div className={styles.statsGrid}>
            <StatCard label="Total Orders"   value={stats?.totalOrders ?? 0}           suffix=""   />
            <StatCard label="Revenue"        value={`PKR ${(stats?.totalRevenue ?? 0).toLocaleString()}`} raw />
            <StatCard label="Total COGS"     value={`PKR ${(stats?.totalCogs ?? 0).toLocaleString()}`}    raw color="muted" />
            <StatCard label="Profit"         value={`PKR ${(stats?.totalProfit ?? 0).toLocaleString()}`}  raw color="success" />
            <StatCard label="Profit Margin"  value={`${(stats?.blendedMargin ?? 0).toFixed(1)}%`}         raw color={(stats?.blendedMargin ?? 0) > 30 ? 'success' : 'warning'} />
            <StatCard label="Repeat Customers" value={`${stats?.repeatRate ?? 0}%`}                       raw />
          </div>

          {/* Low stock alert */}
          {lowStock.length > 0 && (
            <div className={`glass-light ${styles.alertBox}`}>
              <div className={styles.alertHeader}>
                <span className={styles.alertIcon}>⚠</span>
                <h2 className="heading-md" style={{ color: 'var(--warning)' }}>Low Stock Alerts</h2>
              </div>
              <div className={styles.alertItems}>
                {lowStock.map((p) => (
                  <div key={p.id} className={styles.alertItem}>
                    <span className="body-sm">{p.name}</span>
                    <span className={`badge ${p.stock_quantity === 0 ? 'badge-danger' : 'badge-gold'}`}>
                      {p.stock_quantity === 0 ? 'Out of Stock' : `${p.stock_quantity} left`}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/admin/products" className="btn btn-ghost" style={{ marginTop: 12, width: 'fit-content' }}>
                Manage Products →
              </Link>
            </div>
          )}

          {/* Recent orders */}
          <div className={styles.recentSection}>
            <div className={styles.recentHeader}>
              <h2 className="heading-md">Recent Orders</h2>
              <Link href="/admin/orders" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                View All →
              </Link>
            </div>
            <div className={`glass-light ${styles.table}`}>
              <table className={styles.tableEl}>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={6} className={styles.emptyRow}>No orders yet.</td></tr>
                  ) : (
                    recentOrders.map((o) => (
                      <tr key={o.id}>
                        <td className={styles.orderNum}>{o.order_number}</td>
                        <td>{o.customers?.name ?? '—'}</td>
                        <td><StatusBadge status={o.status} /></td>
                        <td className={styles.amount}>PKR {o.total_amount?.toLocaleString()}</td>
                        <td className={styles.date}>{new Date(o.created_at).toLocaleDateString('en-PK')}</td>
                        <td>
                          <Link href={`/admin/orders/${o.id}`} className={styles.viewLink}>View →</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color, raw }) {
  const colorMap = {
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger:  'var(--danger)',
    muted:   'var(--text-secondary)',
  };
  const valueColor = colorMap[color] ?? 'var(--gold)';

  return (
    <div className={`glass-light ${styles.statCard}`}>
      <p className={`label ${styles.statLabel}`}>{label}</p>
      <p className={styles.statValue} style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Pending:   'badge-gold',
    Confirmed: 'badge-cyan',
    Shipped:   'badge-cyan',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
    Returned:  'badge-danger',
  };
  return <span className={`badge ${map[status] ?? 'badge-gold'}`}>{status}</span>;
}
