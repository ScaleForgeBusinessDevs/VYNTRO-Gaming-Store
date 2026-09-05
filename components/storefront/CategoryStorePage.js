'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ProductCard from '@/components/storefront/ProductCard';
import styles from './CategoryStorePage.module.css';

export default function CategoryStorePage({
  eyebrow,
  titlePrefix,
  titleAccent,
  description,
  matchingCategories = [],
  filterGroups = [],
  initialPlaceholders = [],
}) {
  const [products, setProducts] = useState(initialPlaceholders);
  const [loading, setLoading] = useState(false);

  // Active filters: { [groupId]: [selectedOptionId, ...] }
  const [selectedFilters, setSelectedFilters] = useState({});

  // Compute overall min & max price from products
  const { minPriceBound, maxPriceBound } = useMemo(() => {
    if (products.length === 0) return { minPriceBound: 0, maxPriceBound: 50000 };
    const prices = products.map((p) => {
      if (p.discount_percentage) {
        return Math.round(p.selling_price * (1 - p.discount_percentage / 100));
      }
      return p.selling_price;
    });
    return {
      minPriceBound: Math.floor(Math.min(...prices) / 100) * 100,
      maxPriceBound: Math.ceil(Math.max(...prices) / 100) * 100,
    };
  }, [products]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);

  // Initialize prices once products load
  useEffect(() => {
    setMinPrice(minPriceBound);
    setMaxPrice(maxPriceBound);
  }, [minPriceBound, maxPriceBound]);

  // Fetch products from Supabase
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();

        let query = supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (matchingCategories.length > 0) {
          query = query.in('category', matchingCategories);
        }

        const { data } = await query.order('created_at', { ascending: false });

        if (isMounted && data && data.length > 0) {
          // Combine with placeholders if fewer than 5 items
          const combined = [...data];
          for (const p of initialPlaceholders) {
            if (combined.length >= 5) break;
            if (!combined.some((item) => item.slug === p.slug || item.id === p.id)) {
              combined.push(p);
            }
          }
          setProducts(combined);
        }
      } catch {
        // Keep initialPlaceholders
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [matchingCategories, initialPlaceholders]);

  // Toggle a filter option in a group
  function toggleFilter(groupId, optionId) {
    setSelectedFilters((prev) => {
      const current = prev[groupId] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];

      const next = { ...prev };
      if (updated.length === 0) {
        delete next[groupId];
      } else {
        next[groupId] = updated;
      }
      return next;
    });
  }

  // Clear all filters & reset price meter
  function clearAllFilters() {
    setSelectedFilters({});
    setMinPrice(minPriceBound);
    setMaxPrice(maxPriceBound);
  }

  // Total active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    Object.values(selectedFilters).forEach((arr) => {
      count += arr.length;
    });
    if (minPrice > minPriceBound || maxPrice < maxPriceBound) {
      count += 1;
    }
    return count;
  }, [selectedFilters, minPrice, maxPrice, minPriceBound, maxPriceBound]);

  // Filter products by independent criteria
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Price check
      const effectivePrice = p.discount_percentage
        ? Math.round(p.selling_price * (1 - p.discount_percentage / 100))
        : p.selling_price;

      if (effectivePrice < minPrice || effectivePrice > maxPrice) {
        return false;
      }

      // 2. Check each active filter group independently (AND across groups, OR within group)
      for (const [groupId, selectedOptions] of Object.entries(selectedFilters)) {
        if (!selectedOptions || selectedOptions.length === 0) continue;

        const productSearchText = [
          p.name,
          p.category,
          p.description,
          p.material_specs,
          ...(p.collections || []),
          ...(p.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        // Product must match AT LEAST ONE option in this group
        const matchesAnyOption = selectedOptions.some((optId) => {
          const optLower = optId.toLowerCase().replace(/-/g, ' ');

          // Size filter group: All custom mousepads support Basic, Large, XL, XXL, XXXL sizes
          if (groupId === 'size') {
            const isPad =
              (p.category || '').toLowerCase().includes('mouse') ||
              (p.category || '').toLowerCase().includes('pad') ||
              (p.category || '').toLowerCase().includes('deskmat') ||
              (p.name || '').toLowerCase().includes('mat') ||
              (p.name || '').toLowerCase().includes('pad');
            if (isPad) return true;
          }

          // Lighting filter group (RGB / Non-RGB)
          if (groupId === 'lighting') {
            const hasRgb =
              (p.collections || []).includes('rgb') ||
              (p.category || '').toLowerCase().includes('rgb') ||
              (p.name || '').toLowerCase().includes('rgb') ||
              productSearchText.includes('rgb');
            if (optId === 'rgb') return hasRgb;
            if (optId === 'non-rgb') return !hasRgb;
          }

          // Check collections/tags array first
          const inCollections = (p.collections || []).some(
            (c) => c.toLowerCase() === optId.toLowerCase()
          );
          const inTags = (p.tags || []).some(
            (t) => t.toLowerCase() === optId.toLowerCase()
          );
          if (inCollections || inTags) return true;

          // Keyboard size percentage matching e.g. 60%, 70%, 75%, 80%, 100%
          if (optId.endsWith('%')) {
            const numPart = optId.replace('%', '');
            if ((p.collections || []).some((c) => c.toLowerCase() === numPart.toLowerCase())) return true;
            if (numPart === '80' && ((p.collections || []).includes('tkl') || productSearchText.includes('tkl'))) return true;
            if (numPart === '70' && ((p.collections || []).includes('65') || (p.collections || []).includes('68') || productSearchText.includes('68') || productSearchText.includes('65%'))) return true;
            if (numPart === '100' && ((p.collections || []).includes('full') || productSearchText.includes('full size') || productSearchText.includes('104 keys'))) return true;
          }

          // Check text search
          return productSearchText.includes(optLower);
        });

        if (!matchesAnyOption) {
          return false;
        }
      }

      return true;
    });
  }, [products, minPrice, maxPrice, selectedFilters]);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header Block */}
          <div className={styles.header}>
            {eyebrow && (
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowLine} />
                <span className={styles.eyebrowText}>{eyebrow}</span>
                <span className={styles.eyebrowLine} />
              </div>
            )}
            <h1 className={styles.title}>
              {titlePrefix} <span className={styles.titleAccent}>{titleAccent}</span>
            </h1>
            {description && <p className={styles.subtitle}>{description}</p>}
          </div>

          {/* Filter Panel */}
          <div className={styles.filterSection}>
            {/* Filter Groups */}
            <div className={styles.groupsContainer}>
              {filterGroups.map((group) => {
                const groupSelected = selectedFilters[group.id] || [];
                return (
                  <div key={group.id} className={styles.filterGroup}>
                    <span className={styles.groupTitle}>{group.title}</span>
                    <div className={styles.pillsRow}>
                      {group.options.map((opt) => {
                        const isSelected = groupSelected.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            className={`${styles.filterPill} ${isSelected ? styles.filterPillActive : ''}`}
                            onClick={() => toggleFilter(group.id, opt.id)}
                          >
                            <span className={styles.pillCheck}>{isSelected ? '✓' : '+'}</span>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Price Range Meter */}
              <div className={styles.filterGroup}>
                <div className={styles.priceMeterHeader}>
                  <span className={styles.groupTitle}>PRICE RANGE (PKR)</span>
                  {(minPrice > minPriceBound || maxPrice < maxPriceBound) && (
                    <button
                      type="button"
                      className={styles.resetPriceBtn}
                      onClick={() => {
                        setMinPrice(minPriceBound);
                        setMaxPrice(maxPriceBound);
                      }}
                    >
                      Reset Price
                    </button>
                  )}
                </div>

                <div className={styles.priceMeterWrap}>
                  <div className={styles.priceInputsRow}>
                    <div className={styles.priceInputBox}>
                      <span className={styles.currencyPrefix}>PKR</span>
                      <input
                        type="number"
                        min={minPriceBound}
                        max={maxPrice}
                        step="100"
                        value={minPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val <= maxPrice) setMinPrice(val);
                        }}
                        className={styles.numInput}
                      />
                    </div>
                    <span className={styles.priceRangeDash}>—</span>
                    <div className={styles.priceInputBox}>
                      <span className={styles.currencyPrefix}>PKR</span>
                      <input
                        type="number"
                        min={minPrice}
                        max={maxPriceBound}
                        step="100"
                        value={maxPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= minPrice) setMaxPrice(val);
                        }}
                        className={styles.numInput}
                      />
                    </div>
                  </div>

                  {/* Dual Slider Control */}
                  <div className={styles.sliderContainer}>
                    <input
                      type="range"
                      min={minPriceBound}
                      max={maxPriceBound}
                      step="100"
                      value={minPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val <= maxPrice) setMinPrice(val);
                      }}
                      className={`${styles.rangeInput} ${styles.rangeMin}`}
                    />
                    <input
                      type="range"
                      min={minPriceBound}
                      max={maxPriceBound}
                      step="100"
                      value={maxPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= minPrice) setMaxPrice(val);
                      }}
                      className={`${styles.rangeInput} ${styles.rangeMax}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Status Bar */}
            <div className={styles.statusBar}>
              <div className={styles.statusCount}>
                Showing <span className={styles.countBold}>{filteredProducts.length}</span> of{' '}
                <span className={styles.countTotal}>{products.length}</span> products
              </div>
              {activeCount > 0 && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={clearAllFilters}
                >
                  Clear All Filters ({activeCount}) ✕
                </button>
              )}
            </div>
          </div>

          {/* 5-Column Grid */}
          {loading ? (
            <div className={styles.loading}>
              <div className="spinner" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>NO PRODUCTS FOUND</h3>
              <p className={styles.emptyDesc}>
                No products match all the selected filters and price range.
              </p>
              <button
                type="button"
                className={styles.emptyResetBtn}
                onClick={clearAllFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
