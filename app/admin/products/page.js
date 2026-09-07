'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './products.module.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [tagFilter,      setTagFilter]      = useState('ALL');
  const [stockFilter,    setStockFilter]    = useState('ALL');
  const [statusFilter,   setStatusFilter]   = useState('ALL');
  const [sortBy,         setSortBy]         = useState('newest');
  const [deletingId,     setDeletingId]     = useState(null);

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

  // Extract categories and tags with counts
  const categoriesWithCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const tagsWithCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      if (Array.isArray(p.collections)) {
        p.collections.forEach((tag) => {
          const t = tag.trim().toLowerCase();
          if (t) counts[t] = (counts[t] || 0) + 1;
        });
      }
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);

  // Filter and sort products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      // 1. Search matches name, slug, category, or collections/tags
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesSlug = p.slug?.toLowerCase().includes(q);
        const matchesCat = p.category?.toLowerCase().includes(q);
        const matchesTag = p.collections?.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesSlug && !matchesCat && !matchesTag) return false;
      }

      // 2. Category filter
      if (categoryFilter !== 'ALL') {
        if ((p.category || '').toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }
      }

      // 3. Tag / Type filter
      if (tagFilter !== 'ALL') {
        const hasTag = p.collections?.some(
          (c) => c.toLowerCase() === tagFilter.toLowerCase()
        );
        if (!hasTag) return false;
      }

      // 4. Stock filter
      if (stockFilter === 'IN_STOCK' && p.stock_quantity <= 5) return false;
      if (stockFilter === 'LOW_STOCK' && (p.stock_quantity === 0 || p.stock_quantity > 5)) return false;
      if (stockFilter === 'OUT_OF_STOCK' && p.stock_quantity > 0) return false;

      // 5. Status filter
      if (statusFilter === 'ACTIVE' && !p.is_active) return false;
      if (statusFilter === 'INACTIVE' && p.is_active) return false;

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.selling_price || 0) - (b.selling_price || 0);
        case 'price-desc':
          return (b.selling_price || 0) - (a.selling_price || 0);
        case 'stock-asc':
          return (a.stock_quantity || 0) - (b.stock_quantity || 0);
        case 'stock-desc':
          return (b.stock_quantity || 0) - (a.stock_quantity || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'discount-desc':
          return (b.discount_percentage || 0) - (a.discount_percentage || 0);
        case 'newest':
        default:
          return 0;
      }
    });
  }, [products, search, categoryFilter, tagFilter, stockFilter, statusFilter, sortBy]);

  const hasActiveFilters =
    search.trim() !== '' ||
    categoryFilter !== 'ALL' ||
    tagFilter !== 'ALL' ||
    stockFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    sortBy !== 'newest';

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('ALL');
    setTagFilter('ALL');
    setStockFilter('ALL');
    setStatusFilter('ALL');
    setSortBy('newest');
  };

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

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="heading-lg">Products</h1>
        <Link href="/admin/products/new" className="btn btn-gold" id="add-product-btn">
          + Add Product
        </Link>
      </div>

      {/* ── Filter & Search Controls ── */}
      <div className={styles.filterSection}>
        {/* Top search & sort row */}
        <div className={styles.searchAndSortRow}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className={`form-input ${styles.search}`}
              placeholder="Search products, slug, category, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="products-search"
            />
          </div>

          <div className={styles.controlsRight}>
            <p className="body-sm muted">
              {filtered.length === products.length
                ? `${products.length} product${products.length !== 1 ? 's' : ''}`
                : `Showing ${filtered.length} of ${products.length} products`}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                className={styles.resetBtn}
                onClick={resetFilters}
                title="Reset all filters"
                id="reset-filters-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className={styles.categoryPills}>
          <button
            type="button"
            className={`${styles.pillBtn} ${categoryFilter === 'ALL' ? styles.active : ''}`}
            onClick={() => setCategoryFilter('ALL')}
            id="cat-pill-all"
          >
            All Categories
            <span className={styles.pillCount}>({products.length})</span>
          </button>
          {categoriesWithCounts.map(([cat, count]) => (
            <button
              key={cat}
              type="button"
              className={`${styles.pillBtn} ${categoryFilter.toLowerCase() === cat.toLowerCase() ? styles.active : ''}`}
              onClick={() => setCategoryFilter(categoryFilter.toLowerCase() === cat.toLowerCase() ? 'ALL' : cat)}
              id={`cat-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
              <span className={styles.pillCount}>({count})</span>
            </button>
          ))}
        </div>

        {/* Secondary dropdown filters: Type / Tag, Stock, Status, Sort */}
        <div className={styles.secondaryFiltersRow}>
          <div className={styles.filterGroup}>
            {/* Tag / Type filter */}
            <select
              className={`${styles.selectInput} ${tagFilter !== 'ALL' ? styles.selectInputActive : ''}`}
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              id="tag-filter-select"
            >
              <option value="ALL">All Types / Tags ({tagsWithCounts.length})</option>
              {tagsWithCounts.map(([tag, count]) => (
                <option key={tag} value={tag}>
                  Tag: {tag.toUpperCase()} ({count})
                </option>
              ))}
            </select>

            {/* Stock filter */}
            <select
              className={`${styles.selectInput} ${stockFilter !== 'ALL' ? styles.selectInputActive : ''}`}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              id="stock-filter-select"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (&gt; 5)</option>
              <option value="LOW_STOCK">Low Stock (≤ 5)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>

            {/* Status filter */}
            <select
              className={`${styles.selectInput} ${statusFilter !== 'ALL' ? styles.selectInputActive : ''}`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              id="status-filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            {/* Sort order */}
            <select
              className={`${styles.selectInput} ${sortBy !== 'newest' ? styles.selectInputActive : ''}`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-by-select"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="stock-desc">Stock: High → Low</option>
              <option value="stock-asc">Stock: Low → High</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
              <option value="discount-desc">Highest Discount</option>
            </select>
          </div>
        </div>
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
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    <p style={{ margin: '0 0 10px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      No products match your current filters.
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={resetFilters}
                        style={{ margin: '0 auto' }}
                      >
                        Clear All Filters
                      </button>
                    )}
                  </td>
                </tr>
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
                          <button
                            type="button"
                            className={`${styles.catBadgeBtn} ${categoryFilter.toLowerCase() === (p.category || '').toLowerCase() ? styles.catBadgeActive : ''}`}
                            onClick={() => setCategoryFilter(categoryFilter.toLowerCase() === (p.category || '').toLowerCase() ? 'ALL' : p.category)}
                            title={`Click to filter by ${p.category}`}
                          >
                            {p.category}
                          </button>
                          {p.collections && p.collections.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '2px' }}>
                              {p.collections.map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  className={`${styles.tagBtn} ${tagFilter.toLowerCase() === c.toLowerCase() ? styles.tagBtnActive : ''}`}
                                  onClick={() => setTagFilter(tagFilter.toLowerCase() === c.toLowerCase() ? 'ALL' : c.toLowerCase())}
                                  title={`Click to filter by tag "${c}"`}
                                >
                                  {c}
                                </button>
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
