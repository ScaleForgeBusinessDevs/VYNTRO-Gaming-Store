'use client';
import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';

const FILTER_OPTIONS = [
  { label: 'All Time',  value: 'all' },
  { label: 'Today',     value: 'today' },
  { label: '7 Days',    value: 'week' },
  { label: '30 Days',   value: 'month' },
];

export default function AdminDashboard() {
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [pipeline, setPipeline] = useState({});
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);

    try {
      // 1. Build date filter without mutating Date instances
      let dateFilter = null;
      if (filter === 'today') {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        dateFilter = start.toISOString();
      } else if (filter === 'week') {
        const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = start.toISOString();
      } else if (filter === 'month') {
        const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = start.toISOString();
      }

      // 2. Fetch orders
      const ordersUrl = dateFilter
        ? `/api/orders?dateFrom=${encodeURIComponent(dateFilter)}`
        : '/api/orders';
      const ordersRes = await fetch(ordersUrl);
      const ordersJson = await ordersRes.json();
      const orders = ordersJson.orders || [];

      // 3. SEPARATE VALID ORDERS FROM CANCELLED / RETURNED
      // Orders that are cancelled or returned are NOT considered as profit or revenue!
      const validOrders = orders.filter(
        (o) => o.status !== 'Cancelled' && o.status !== 'Returned'
      );
      const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');
      const returnedOrders  = orders.filter((o) => o.status === 'Returned');

      // 4. COMPUTE FINANCIAL STATS (Accurate net accounting)
      const totalRevenue     = validOrders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
      const totalCogs        = validOrders.reduce((s, o) => s + (Number(o.total_cogs) || 0), 0);
      const totalProfit      = totalRevenue - totalCogs;
      const blendedMargin    = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
      const avgOrderValue    = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

      // Track gross vs cancelled volume for full transparency
      const grossRevenue     = orders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
      const cancelledRevenue = cancelledOrders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
      const returnedRevenue  = returnedOrders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);

      // Repeat customers rate based on valid completed/in-progress orders
      const validCustIds = validOrders
        .map((o) => o.customer_id || o.customers?.id || o.customers?.email)
        .filter(Boolean);
      const uniqueCust = new Set(validCustIds).size;
      const repeatRate = validCustIds.length > uniqueCust
        ? Math.round(((validCustIds.length - uniqueCust) / validCustIds.length) * 100)
        : 0;

      // Pipeline distribution counts
      const counts = {
        Pending:   orders.filter((o) => o.status === 'Pending').length,
        Confirmed: orders.filter((o) => o.status === 'Confirmed').length,
        Shipped:   orders.filter((o) => o.status === 'Shipped').length,
        Delivered: orders.filter((o) => o.status === 'Delivered').length,
        Cancelled: cancelledOrders.length,
        Returned:  returnedOrders.length,
      };

      setStats({
        totalOrders: orders.length,
        validOrdersCount: validOrders.length,
        cancelledOrdersCount: cancelledOrders.length,
        returnedOrdersCount: returnedOrders.length,
        totalRevenue,
        totalCogs,
        totalProfit,
        blendedMargin,
        avgOrderValue,
        grossRevenue,
        cancelledRevenue,
        returnedRevenue,
        repeatRate,
        uniqueCustomers: uniqueCust,
      });

      setPipeline(counts);

      // 5. Fetch low stock items via products API
      const prodRes = await fetch('/api/admin/products');
      const prodJson = await prodRes.json();
      const allProds = prodJson.products || [];
      const lsData = allProds
        .filter((p) => p.is_active && (p.stock_quantity ?? 0) <= 5)
        .sort((a, b) => (a.stock_quantity ?? 0) - (b.stock_quantity ?? 0));
      setLowStock(lsData);

      // 6. Recent orders (latest 8)
      setRecentOrders(orders.slice(0, 8));
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
      setStats({
        totalOrders: 0,
        validOrdersCount: 0,
        cancelledOrdersCount: 0,
        returnedOrdersCount: 0,
        totalRevenue: 0,
        totalCogs: 0,
        totalProfit: 0,
        blendedMargin: 0,
        avgOrderValue: 0,
        grossRevenue: 0,
        cancelledRevenue: 0,
        returnedRevenue: 0,
        repeatRate: 0,
        uniqueCustomers: 0,
      });
      setPipeline({});
      setLowStock([]);
      setRecentOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [filter]);

  // Filter recent orders in table via search
  const filteredRecentOrders = recentOrders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const orderNum = (o.order_number || '').toLowerCase();
    const custName = (o.customers?.name || '').toLowerCase();
    const phone = (o.customers?.phone || '').toLowerCase();
    const status = (o.status || '').toLowerCase();
    return orderNum.includes(q) || custName.includes(q) || phone.includes(q) || status.includes(q);
  });

  return (
    <div className={styles.page}>
      {/* Modern Operations Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleRow}>
            <h1 className="heading-lg" style={{ letterSpacing: '0.02em', margin: 0 }}>
              Operations Hub
            </h1>
            <div className={styles.liveBadge}>
              <span className={styles.pulseDot} />
              Live Store Sync
            </div>
          </div>
          <p className="body-sm muted" style={{ margin: 0 }}>
            Real-time financial metrics, inventory radar & fulfillment tracking.
          </p>
        </div>

        <div className={styles.headerActions}>
          {/* Time range selector */}
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

          {/* Refresh button */}
          <button
            className={styles.refreshBtn}
            onClick={() => loadData(false)}
            title="Refresh dashboard metrics"
            id="dash-refresh-btn"
          >
            <RefreshIcon className={refreshing ? styles.spinning : ''} />
            <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Quick Action: New Product */}
          <Link href="/admin/products/new" className={styles.newProductBtn}>
            <PlusIcon /> New Product
          </Link>
        </div>
      </header>

      {loading ? (
        <>
          {/* Skeleton Loaders */}
          <div className={styles.statsGrid}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className={styles.skeletonCard} />
            ))}
          </div>
          <div className={styles.mainLayout}>
            <div className={styles.skeletonTable} />
            <div className={styles.skeletonTable} />
          </div>
        </>
      ) : (
        <>
          {/* 6 Hero KPI Metric Cards */}
          <section className={styles.statsGrid} aria-label="Key Performance Indicators">
            {/* 1. Net Revenue */}
            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <div className={styles.statMeta}>
                  <span className={styles.statLabel}>Net Revenue</span>
                  <span className={styles.statValue} style={{ color: '#FFFFFF' }}>
                    PKR {(stats?.totalRevenue ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className={`${styles.iconWrap} ${styles.iconRevenue}`}>
                  <DollarIcon />
                </div>
              </div>
              <div className={styles.statFooter}>
                <span>{stats?.validOrdersCount ?? 0} active orders</span>
                <span className={`${styles.statBadge} badge-gold`}>
                  Cancelled excluded
                </span>
              </div>
            </div>

            {/* 2. Net Profit */}
            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <div className={styles.statMeta}>
                  <span className={styles.statLabel}>Net Realized Profit</span>
                  <span className={styles.statValue} style={{ color: 'var(--success)' }}>
                    PKR {(stats?.totalProfit ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className={`${styles.iconWrap} ${styles.iconProfit}`}>
                  <TrendingUpIcon />
                </div>
              </div>
              <div className={styles.statFooter}>
                <span>COGS: PKR {(stats?.totalCogs ?? 0).toLocaleString()}</span>
                <span className={`${styles.statBadge} badge-success`}>
                  {(stats?.blendedMargin ?? 0).toFixed(1)}% margin
                </span>
              </div>
            </div>

            {/* 3. Profit Margin */}
            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <div className={styles.statMeta}>
                  <span className={styles.statLabel}>Blended Margin</span>
                  <span className={styles.statValue} style={{ color: 'var(--violet)' }}>
                    {(stats?.blendedMargin ?? 0).toFixed(1)}%
                  </span>
                </div>
                <div className={`${styles.iconWrap} ${styles.iconMargin}`}>
                  <PercentIcon />
                </div>
              </div>
              <div className={styles.statFooter}>
                <span>Target: &gt;30.0%</span>
                <span
                  className={`${styles.statBadge} ${
                    (stats?.blendedMargin ?? 0) >= 30 ? 'badge-success' : 'badge-gold'
                  }`}
                >
                  {(stats?.blendedMargin ?? 0) >= 30 ? 'Target Met' : 'Needs Boost'}
                </span>
              </div>
            </div>

            {/* 4. Active Orders */}
            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <div className={styles.statMeta}>
                  <span className={styles.statLabel}>Total Orders</span>
                  <span className={styles.statValue} style={{ color: 'var(--cyan)' }}>
                    {stats?.validOrdersCount ?? 0}
                  </span>
                </div>
                <div className={`${styles.iconWrap} ${styles.iconOrders}`}>
                  <PackageIcon />
                </div>
              </div>
              <div className={styles.statFooter}>
                <span>{stats?.totalOrders ?? 0} total placed</span>
                {(stats?.cancelledOrdersCount ?? 0) > 0 ? (
                  <span className={`${styles.statBadge} badge-danger`}>
                    {stats.cancelledOrdersCount} cancelled
                  </span>
                ) : (
                  <span className={`${styles.statBadge} badge-cyan`}>0 cancelled</span>
                )}
              </div>
            </div>

            {/* 5. Average Order Value (AOV) */}
            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <div className={styles.statMeta}>
                  <span className={styles.statLabel}>Avg Order Value (AOV)</span>
                  <span className={styles.statValue} style={{ color: 'var(--warning)' }}>
                    PKR {(stats?.avgOrderValue ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className={`${styles.iconWrap} ${styles.iconAov}`}>
                  <CartIcon />
                </div>
              </div>
              <div className={styles.statFooter}>
                <span>Per completed order</span>
                <span className={`${styles.statBadge} badge-gold`}>Realized</span>
              </div>
            </div>

            {/* 6. Repeat Customer Rate */}
            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <div className={styles.statMeta}>
                  <span className={styles.statLabel}>Repeat Buyers</span>
                  <span className={styles.statValue} style={{ color: '#64B4FF' }}>
                    {stats?.repeatRate ?? 0}%
                  </span>
                </div>
                <div className={`${styles.iconWrap} ${styles.iconCustomers}`}>
                  <UsersIcon />
                </div>
              </div>
              <div className={styles.statFooter}>
                <span>{stats?.uniqueCustomers ?? 0} unique customer{stats?.uniqueCustomers !== 1 ? 's' : ''}</span>
                <span className={`${styles.statBadge} badge-cyan`}>Retention</span>
              </div>
            </div>
          </section>

          {/* Order Lifecycle Pipeline Strip */}
          <section className={styles.pipelineSection} aria-label="Fulfillment Pipeline">
            <div className={styles.pipelineHeader}>
              <span className={styles.pipelineTitle}>Fulfillment Pipeline</span>
              <span className="body-sm muted">Click stage to filter orders</span>
            </div>
            <div className={styles.pipelineTrack}>
              <Link href="/admin/orders?status=Pending" className={styles.pipelineCard}>
                <div className={styles.pipelineStage}>
                  <span className={`${styles.statusDot} ${styles.dotPending}`} />
                  <span>Pending</span>
                </div>
                <span className={styles.pipelineCount}>{pipeline.Pending ?? 0}</span>
              </Link>

              <Link href="/admin/orders?status=Confirmed" className={styles.pipelineCard}>
                <div className={styles.pipelineStage}>
                  <span className={`${styles.statusDot} ${styles.dotConfirmed}`} />
                  <span>Confirmed</span>
                </div>
                <span className={styles.pipelineCount}>{pipeline.Confirmed ?? 0}</span>
              </Link>

              <Link href="/admin/orders?status=Shipped" className={styles.pipelineCard}>
                <div className={styles.pipelineStage}>
                  <span className={`${styles.statusDot} ${styles.dotShipped}`} />
                  <span>Shipped</span>
                </div>
                <span className={styles.pipelineCount}>{pipeline.Shipped ?? 0}</span>
              </Link>

              <Link href="/admin/orders?status=Delivered" className={styles.pipelineCard}>
                <div className={styles.pipelineStage}>
                  <span className={`${styles.statusDot} ${styles.dotDelivered}`} />
                  <span>Delivered</span>
                </div>
                <span className={styles.pipelineCount}>{pipeline.Delivered ?? 0}</span>
              </Link>

              <Link href="/admin/orders?status=Cancelled" className={styles.pipelineCard}>
                <div className={styles.pipelineStage}>
                  <span className={`${styles.statusDot} ${styles.dotCancelled}`} />
                  <span>Cancelled</span>
                </div>
                <span className={styles.pipelineCount} style={{ color: 'var(--danger)' }}>
                  {pipeline.Cancelled ?? 0}
                </span>
              </Link>

              <Link href="/admin/orders?status=Returned" className={styles.pipelineCard}>
                <div className={styles.pipelineStage}>
                  <span className={`${styles.statusDot} ${styles.dotReturned}`} />
                  <span>Returned</span>
                </div>
                <span className={styles.pipelineCount}>{pipeline.Returned ?? 0}</span>
              </Link>
            </div>
          </section>

          {/* Two-Column Operational Section */}
          <div className={styles.mainLayout}>
            {/* Left / Main Column: Recent Orders */}
            <div className={styles.recentCard}>
              <div className={styles.recentCardHeader}>
                <div className={styles.recentTitleGroup}>
                  <h2 className="heading-md" style={{ margin: 0, fontSize: '1.05rem' }}>
                    Recent Orders
                  </h2>
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                    {recentOrders.length} Latest
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={styles.searchBox}>
                    <SearchIcon />
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="Quick search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Link
                    href="/admin/orders"
                    className="btn btn-ghost"
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    View All →
                  </Link>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.orderTable}>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Order #</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={styles.emptyState}>
                          {searchQuery ? 'No matching orders found.' : 'No orders recorded yet.'}
                        </td>
                      </tr>
                    ) : (
                      filteredRecentOrders.map((o) => {
                        const isCancelled = o.status === 'Cancelled';
                        const isReturned  = o.status === 'Returned';
                        const initials = (o.customers?.name || 'V')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase();

                        return (
                          <tr key={o.id}>
                            {/* Customer */}
                            <td>
                              <div className={styles.customerCell}>
                                <div className={styles.avatarCircle}>{initials}</div>
                                <div className={styles.custInfo}>
                                  <span className={styles.custName}>
                                    {o.customers?.name || 'Walk-in Customer'}
                                  </span>
                                  <span className={styles.custLocation}>
                                    {o.customers?.city ? `${o.customers.city} • ` : ''}
                                    {o.customers?.phone || 'No phone'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Order Number */}
                            <td>
                              <span className={styles.orderNumber}>{o.order_number}</span>
                            </td>

                            {/* Status */}
                            <td>
                              <StatusBadge status={o.status} />
                            </td>

                            {/* Amount (Strikethrough / voided notice if cancelled) */}
                            <td>
                              {isCancelled ? (
                                <div className={styles.amountVoided}>
                                  <span>PKR {(o.total_amount ?? 0).toLocaleString()}</span>
                                  <span className={styles.voidedBadge}>Voided (Cancelled)</span>
                                </div>
                              ) : isReturned ? (
                                <div className={styles.amountVoided}>
                                  <span>PKR {(o.total_amount ?? 0).toLocaleString()}</span>
                                  <span className={styles.voidedBadge}>Refunded (Returned)</span>
                                </div>
                              ) : (
                                <span className={styles.amountNormal}>
                                  PKR {(o.total_amount ?? 0).toLocaleString()}
                                </span>
                              )}
                            </td>

                            {/* Date */}
                            <td style={{ fontSize: '0.78rem' }}>
                              {new Date(o.created_at).toLocaleDateString('en-PK', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>

                            {/* Action */}
                            <td>
                              <Link href={`/admin/orders/${o.id}`} className={styles.viewAction}>
                                View →
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right / Sidebar Column */}
            <div className={styles.sidebarCol}>
              {/* Financial Realization Card */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardTitle}>
                  <span>Financial Breakdown</span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>
                    Net Ledger
                  </span>
                </div>

                <div className={styles.waterfallList}>
                  <div className={styles.waterfallRow}>
                    <span>Gross Placed Volume</span>
                    <span style={{ fontWeight: 600 }}>
                      PKR {(stats?.grossRevenue ?? 0).toLocaleString()}
                    </span>
                  </div>

                  {(stats?.cancelledRevenue ?? 0) > 0 && (
                    <div className={`${styles.waterfallRow} ${styles.waterfallDeduction}`}>
                      <span>− Cancelled Orders ({stats?.cancelledOrdersCount})</span>
                      <span style={{ fontWeight: 600 }}>
                        − PKR {(stats?.cancelledRevenue ?? 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {(stats?.returnedRevenue ?? 0) > 0 && (
                    <div className={`${styles.waterfallRow} ${styles.waterfallDeduction}`}>
                      <span>− Returned Orders ({stats?.returnedOrdersCount})</span>
                      <span style={{ fontWeight: 600 }}>
                        − PKR {(stats?.returnedRevenue ?? 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className={styles.waterfallRowBold}>
                    <span>= Realized Net Revenue</span>
                    <span style={{ color: '#FFFFFF' }}>
                      PKR {(stats?.totalRevenue ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className={styles.waterfallRow} style={{ color: 'var(--text-muted)' }}>
                    <span>− Cost of Goods (COGS)</span>
                    <span>− PKR {(stats?.totalCogs ?? 0).toLocaleString()}</span>
                  </div>

                  <div className={styles.waterfallRowBold} style={{ borderColor: 'rgba(124, 217, 140, 0.2)' }}>
                    <span style={{ color: 'var(--success)' }}>= Net Realized Profit</span>
                    <span className={styles.waterfallSuccess} style={{ fontSize: '1.05rem' }}>
                      PKR {(stats?.totalProfit ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Low Stock Radar Widget */}
              <div className={`${styles.sideCard} ${lowStock.length > 0 ? styles.alertBox : ''}`}>
                <div className={styles.sideCardTitle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: lowStock.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
                      {lowStock.length > 0 ? '⚠' : '✓'}
                    </span>
                    Inventory Radar
                  </span>
                  <span
                    className={`badge ${lowStock.length > 0 ? 'badge-gold' : 'badge-success'}`}
                    style={{ fontSize: '0.62rem' }}
                  >
                    {lowStock.length} Low Stock
                  </span>
                </div>

                {lowStock.length === 0 ? (
                  <div className={styles.allStockHealthy}>
                    <span>All active products maintain healthy inventory reserves.</span>
                  </div>
                ) : (
                  <div className={styles.stockList}>
                    {lowStock.slice(0, 5).map((p) => {
                      const isOut = p.stock_quantity === 0;
                      const percentage = Math.min(100, Math.max(0, (p.stock_quantity / 10) * 100));
                      const barColor = isOut ? 'var(--danger)' : 'var(--warning)';

                      return (
                        <div key={p.id} className={styles.stockItem}>
                          <div className={styles.stockItemTop}>
                            <span className={styles.stockItemName} title={p.name}>
                              {p.name}
                            </span>
                            <span
                              className={`badge ${isOut ? 'badge-danger' : 'badge-gold'}`}
                              style={{ fontSize: '0.62rem', flexShrink: 0 }}
                            >
                              {isOut ? 'Out of Stock' : `${p.stock_quantity} remaining`}
                            </span>
                          </div>
                          <div className={styles.stockProgress}>
                            <div
                              className={styles.stockProgressBar}
                              style={{
                                width: isOut ? '100%' : `${percentage}%`,
                                background: barColor,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Link
                  href="/admin/products"
                  className="btn btn-ghost"
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    textAlign: 'center',
                    justifyContent: 'center',
                    marginTop: 4,
                  }}
                >
                  Manage Inventory Catalog →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Helper Components & Icons
// ------------------------------------------------------------

function StatusBadge({ status }) {
  const map = {
    Pending:   { cls: 'badge-gold',    dot: styles.dotPending },
    Confirmed: { cls: 'badge-cyan',    dot: styles.dotConfirmed },
    Shipped:   { cls: 'badge-cyan',    dot: styles.dotShipped },
    Delivered: { cls: 'badge-success', dot: styles.dotDelivered },
    Cancelled: { cls: 'badge-danger',  dot: styles.dotCancelled },
    Returned:  { cls: 'badge-danger',  dot: styles.dotReturned },
  };
  const item = map[status] ?? { cls: 'badge-gold', dot: styles.dotPending };

  return (
    <span className={`badge ${item.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span className={`${styles.statusDot} ${item.dot}`} style={{ width: 5, height: 5 }} />
      {status}
    </span>
  );
}

function DollarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function RefreshIcon({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
