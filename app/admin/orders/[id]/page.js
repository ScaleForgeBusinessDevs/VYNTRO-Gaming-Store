'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './order-detail.module.css';

const STATUSES = ['Pending','Confirmed','Shipped','Delivered','Cancelled','Returned'];

export default function OrderDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState('');
  const [notes,   setNotes]   = useState('');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      setOrder(data);
      setStatus(data.status);
      setNotes(data.notes ?? '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      load();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={styles.loading}><div className="spinner" /></div>;
  if (!order)  return <div className={styles.loading}><p className="body-md muted">Order not found.</p></div>;

  const profit = (order.total_amount ?? 0) - (order.total_cogs ?? 0);

  return (
    <div className={styles.page}>
      {/* Back */}
      <button className={styles.backBtn} onClick={() => router.back()}>
        ← Back to Orders
      </button>

      <div className={styles.header}>
        <div>
          <p className="label muted">Order</p>
          <h1 className={styles.orderNum}>{order.order_number}</h1>
          <p className="body-sm muted">{new Date(order.created_at).toLocaleString('en-PK')}</p>
        </div>
        <div className={styles.profitPill}>
          <span className="label muted">Profit</span>
          <span style={{ color: profit >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
            PKR {profit.toLocaleString()} ({(order.profit_margin ?? 0).toFixed(1)}%)
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left — customer + items */}
        <div className={styles.left}>
          {/* Customer info */}
          <div className={`glass-light ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Customer</h2>
            <div className={styles.customerInfo}>
              <Row label="Name"    value={order.customers?.name ?? '—'} />
              <Row label="Email"   value={order.customers?.email ?? '—'} />
              <Row label="Phone"   value={order.customers?.phone ?? '—'} />
              <Row label="Address" value={order.customers?.address ?? '—'} />
              <Row label="City"    value={order.customers?.city ?? '—'} />
            </div>
          </div>

          {/* Order items */}
          <div className={`glass-light ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Line Items</h2>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Unit Cost</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.order_items ?? []).map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name_snapshot}</td>
                    <td>{item.quantity}</td>
                    <td>PKR {item.unit_price?.toLocaleString()}</td>
                    <td className={styles.costCell}>PKR {item.unit_cost?.toLocaleString()}</td>
                    <td className={styles.lineTotal}>PKR {item.line_total?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className={styles.footLabel}>Order Total</td>
                  <td className={styles.footTotal}>PKR {(order.total_amount ?? 0).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right — status + notes */}
        <div className={styles.right}>
          <div className={`glass-light ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Update Order</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="order-status">Status</label>
              <select
                id="order-status"
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label" htmlFor="order-notes">Internal Notes</label>
              <textarea
                id="order-notes"
                className="form-input"
                rows={4}
                placeholder="Private notes for this order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              className={`btn ${saved ? 'btn-rgb' : 'btn-gold'}`}
              onClick={handleSave}
              disabled={saving}
              style={{ width: '100%', marginTop: 16 }}
              id="order-save-btn"
            >
              {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>

          {/* Financials */}
          <div className={`glass-light ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Financials</h2>
            <div className={styles.financials}>
              <FinRow label="Revenue" value={`PKR ${(order.total_amount ?? 0).toLocaleString()}`} />
              <FinRow label="COGS"    value={`PKR ${(order.total_cogs ?? 0).toLocaleString()}`}   color="muted" />
              <FinRow label="Profit"  value={`PKR ${profit.toLocaleString()}`}                     color={profit >= 0 ? 'success' : 'danger'} />
              <FinRow label="Margin"  value={`${(order.profit_margin ?? 0).toFixed(1)}%`}          color={profit >= 0 ? 'success' : 'danger'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={`label ${styles.rowLabel}`}>{label}</span>
      <span className="body-sm">{value}</span>
    </div>
  );
}

function FinRow({ label, value, color }) {
  const c = { success: 'var(--success)', danger: 'var(--danger)', muted: 'var(--text-muted)' };
  return (
    <div className={styles.finRow}>
      <span className="body-sm muted">{label}</span>
      <span className="body-sm" style={{ fontWeight: 600, color: c[color] ?? 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
