'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './products.module.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { getSupabase } = await import('@/lib/supabase');
      const supabase = getSupabase();
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, category, collections, selling_price, discount_percentage, stock_quantity, is_active, images, cost_price')
        .order('created_at', { ascending: false });
      setProducts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const [deletingId, setDeletingId] = useState(null);

  async function toggleActive(id, current) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !current }),
      });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p));
      }
    } catch (e) { console.error(e); }
  }

  async function handleDelete(id, name) {
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${name}"?`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting product');
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="heading-lg">Products</h1>
        <Link href="/admin/products/new" className="btn btn-gold" id="add-product-btn">
          + Add Product
        </Link>
      </div>

      <div className={styles.toolbar}>
        <input
          type="search"
          className={`form-input ${styles.search}`}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="products-search"
        />
        <p className="body-sm muted">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className={styles.loading}><div className="spinner" /></div>
      ) : (
        <div className={`glass-light ${styles.tableWrap}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className={styles.emptyRow}>No products yet. Add one above.</td></tr>
              ) : (
                filtered.map((p) => {
                  const discountedPrice = p.discount_percentage
                    ? Math.round(p.selling_price * (1 - p.discount_percentage / 100))
                    : null;

                  return (
                    <tr key={p.id} className={styles.row}>
                      <td>
                        <div className={styles.productCell}>
                          <div className={styles.thumb}>
                            {p.images?.[0] ? (
                              <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} />
                            ) : (
                              <div className={styles.thumbPlaceholder}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <rect x="1" y="5" width="22" height="14" rx="2"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className={styles.productName}>{p.name}</p>
                            <p className="body-sm muted">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{p.category}</span>
                          {p.collections && p.collections.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '2px' }}>
                              {p.collections.map((c) => (
                                <span key={c} style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: '3px', background: 'rgba(230,0,18,0.1)', color: '#FF334B', border: '1px solid rgba(230,0,18,0.22)', textTransform: 'uppercase', fontWeight: 700 }}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={styles.cost}>PKR {p.cost_price?.toLocaleString()}</td>
                      <td>
                        <div className={styles.priceCell}>
                          <span className={styles.price}>PKR {discountedPrice?.toLocaleString() ?? p.selling_price?.toLocaleString()}</span>
                          {discountedPrice && (
                            <span className="price-original" style={{ fontSize: '0.75rem' }}>
                              PKR {p.selling_price?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {p.discount_percentage > 0
                          ? <span className="badge badge-success">−{p.discount_percentage}%</span>
                          : <span className={styles.none}>—</span>}
                      </td>
                      <td>
                        <span className={`stock-badge ${
                          p.stock_quantity === 0 ? 'out-of-stock' :
                          p.stock_quantity <= 5  ? 'low-stock' : 'in-stock'
                        }`}>
                          {p.stock_quantity === 0 ? 'Out' : p.stock_quantity <= 5 ? `${p.stock_quantity} left` : p.stock_quantity}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`${styles.toggleBtn} ${p.is_active ? styles.active : styles.inactive}`}
                          onClick={() => toggleActive(p.id, p.is_active)}
                          id={`toggle-product-${p.id}`}
                        >
                          {p.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>
                        <div className={styles.actionsCell}>
                          <Link href={`/admin/products/${p.id}/edit`} className={styles.editBtn} id={`edit-product-${p.id}`}>
                            Edit →
                          </Link>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            title={`Delete ${p.name}`}
                            id={`delete-product-${p.id}`}
                          >
                            {deletingId === p.id ? (
                              'Deleting...'
                            ) : (
                              <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
