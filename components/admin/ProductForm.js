'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { MOUSEPAD_SIZES } from '@/lib/sizeVariants';
import styles from './product-form.module.css';

const PRODUCT_TYPES = [
  { id: 'Mice', label: 'Gaming Mice', icon: '🖱️', defaultCat: 'Mice' },
  { id: 'Mousepads', label: 'Mousepads', icon: '🟦', defaultCat: 'Mousepads' },
  { id: 'Keyboards', label: 'Keyboards', icon: '⌨️', defaultCat: 'Keyboards' },
  { id: 'IEMs', label: 'Gaming IEMs', icon: '🎧', defaultCat: 'IEMs' },
  { id: 'Headphones', label: 'Headphones', icon: '🎙️', defaultCat: 'Headphones' },
  { id: 'Accessories', label: 'Accessories', icon: '⚡', defaultCat: 'Accessories' },
];

const EMPTY_FORM = {
  name: '',
  slug: '',
  category: 'Mousepads',
  description: '',
  cost_price: '',
  selling_price: '',
  discount_percentage: '',
  stock_quantity: '',
  is_active: true,
  collections: [],
  delivery_time: '3–5 business days',
  warranty_period: '6 months',
  care_instructions: 'Wipe clean with a damp microfiber cloth',
  material_specs: '',
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProductFormPage({ isEdit = false }) {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [activeType, setActiveType] = useState('Mousepads');
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Mousepad Size Pricing (PKR) state
  const [sizePricing, setSizePricing] = useState({
    Basic: '',
    Large: '',
    XL: '',
    XXL: '',
    XXXL: '',
  });

  function handleSizePriceChange(sizeId, value) {
    setSizePricing((prev) => ({
      ...prev,
      [sizeId]: value,
    }));
  }

  function autoCalculateSizePrices() {
    const base = Number(form.selling_price) || 2999;
    setSizePricing({
      Basic: String(Math.max(999, base - 1000)),
      Large: String(Math.max(999, base - 500)),
      XL: String(Math.max(999, base - 200)),
      XXL: String(base),
      XXXL: String(base + 800),
    });
  }

  // Category-specific specifications state
  const [specs, setSpecs] = useState({
    // Mice
    mouse_connectivity: ['wireless'], // wireless, wired, bluetooth
    mouse_grip: ['claw'], // claw, fingertip, palm
    mouse_sensor: 'PAW3395 (26,000 DPI)',
    mouse_polling: '8000Hz', // 8000Hz, 4000Hz, 1000Hz
    mouse_weight: '49g',
    mouse_switches: 'Optical Micro-switches (90M clicks)',
    mouse_battery: '90 Hours',

    // Mousepads
    mousepad_theme: ['fps'], // minimalistic, fps, abstract, fantasy, anime
    mousepad_rgb: false,

    // Keyboards
    kb_size: '75%', // 60%, 70%, 75%, 80%, 100%

    // IEMs
    iem_driver: 'Hybrid Multi-Driver (1DD + 2BA)',
    iem_tuning: ['fps-tuning'], // fps-tuning, harman, bass
    iem_cable: '0.78mm 2-Pin Detachable (Silver-Plated)',
    iem_shell: 'Medical-Grade 3D Printed Resin',
    iem_mic: 'Detachable Boom Mic Included',

    // Headphones
    hp_acoustic: 'Open-Back Studio Reference', // open-back, closed-back
    hp_connectivity: '2.4GHz Wireless Low-Latency',
    hp_drivers: '53mm Neodymium Dynamic Drivers',
    hp_pads: 'Breathable Memory Foam Velour',
    hp_mic: 'Detachable Cardioid Boom Mic',

    // Accessories
    acc_type: 'cables', // cables, wrist-rests, skates, bundles
    acc_material: 'Double-Sleeved Paracord + GX16 Aviator',
    acc_compatibility: 'Universal USB-C / Mechanical Keyboards',
  });

  // Load existing product if editing
  useEffect(() => {
    if (!isEdit || !productId) return;
    (async () => {
      try {
        const { getSupabase } = await import('@/lib/supabase');
        const supabase = getSupabase();
        const { data } = await supabase.from('products').select('*').eq('id', productId).single();
        if (data) {
          const rawCat = data.category || 'Mousepads';
          // Determine active type
          let matchedType = 'Mousepads';
          if (rawCat.toLowerCase().includes('mouse') && !rawCat.toLowerCase().includes('pad')) {
            matchedType = 'Mice';
          } else if (rawCat.toLowerCase().includes('keyboard')) {
            matchedType = 'Keyboards';
          } else if (rawCat.toLowerCase().includes('iem')) {
            matchedType = 'IEMs';
          } else if (rawCat.toLowerCase().includes('headphone')) {
            matchedType = 'Headphones';
          } else if (rawCat.toLowerCase().includes('access') || rawCat.toLowerCase().includes('wrist') || rawCat.toLowerCase().includes('bundle')) {
            matchedType = 'Accessories';
          }
          setActiveType(matchedType);

          setForm({
            name: data.name ?? '',
            slug: data.slug ?? '',
            category: data.category ?? matchedType,
            description: data.description ?? '',
            cost_price: data.cost_price ?? '',
            selling_price: data.selling_price ?? '',
            discount_percentage: data.discount_percentage ?? '',
            stock_quantity: data.stock_quantity ?? '',
            is_active: data.is_active ?? true,
            collections: data.collections ?? [],
            delivery_time: data.delivery_time ?? '3–5 business days',
            warranty_period: data.warranty_period ?? '6 months',
            care_instructions: data.care_instructions ?? 'Wipe clean with a damp microfiber cloth',
            material_specs: data.material_specs ?? '',
          });
          setImages(data.images ?? []);

          // Parse size pricing if available
          let loadedSizePricing = data.size_pricing;
          if (typeof loadedSizePricing === 'string') {
            try { loadedSizePricing = JSON.parse(loadedSizePricing); } catch {}
          }
          if (!loadedSizePricing && data.material_specs && data.material_specs.includes('__SIZES__')) {
            try {
              const match = data.material_specs.match(/__SIZES__(.*?)__SIZES__/);
              if (match && match[1]) loadedSizePricing = JSON.parse(match[1]);
            } catch {}
          }
          if (loadedSizePricing && typeof loadedSizePricing === 'object') {
            const stringifiedPrices = {};
            Object.entries(loadedSizePricing).forEach(([k, v]) => {
              stringifiedPrices[k] = String(v);
            });
            setSizePricing((prev) => ({ ...prev, ...stringifiedPrices }));
          }

          const isRgb = (data.category || '').toLowerCase().includes('rgb') ||
                        (data.collections || []).includes('rgb') ||
                        (data.name || '').toLowerCase().includes('rgb') ||
                        (data.material_specs || '').toLowerCase().includes('rgb');

          let matchedKbSize = '75%';
          const searchTargets = [
            ...(data.collections || []),
            data.name || '',
            data.material_specs || '',
            data.description || '',
          ].join(' ').toLowerCase();

          if (searchTargets.includes('60%') || searchTargets.includes('60he') || searchTargets.includes(' 60')) {
            matchedKbSize = '60%';
          } else if (searchTargets.includes('70%') || searchTargets.includes(' 68') || searchTargets.includes(' 70')) {
            matchedKbSize = '70%';
          } else if (searchTargets.includes('75%') || searchTargets.includes(' 75')) {
            matchedKbSize = '75%';
          } else if (searchTargets.includes('80%') || searchTargets.includes(' 80') || searchTargets.includes('tkl')) {
            matchedKbSize = '80%';
          } else if (searchTargets.includes('100%') || searchTargets.includes(' 100') || searchTargets.includes('full')) {
            matchedKbSize = '100%';
          }

          setSpecs((prev) => ({ ...prev, mousepad_rgb: isRgb, kb_size: matchedKbSize }));
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, productId]);

  function handleTypeChange(typeId) {
    setActiveType(typeId);
    setForm((prev) => ({
      ...prev,
      category: typeId,
    }));
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm((prev) => {
      const next = { ...prev, [name]: val };
      if (name === 'name' && !isEdit) next.slug = slugify(val);
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSpecChange(specKey, value) {
    setSpecs((prev) => ({
      ...prev,
      [specKey]: value,
    }));
  }

  function toggleSpecArray(specKey, item) {
    setSpecs((prev) => {
      const current = prev[specKey] || [];
      const next = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      return { ...prev, [specKey]: next };
    });
  }

  function toggleStoreCollection(colId) {
    setForm((prev) => {
      const current = prev.collections || [];
      const next = current.includes(colId)
        ? current.filter((id) => id !== colId)
        : [...current, colId];
      return { ...prev, collections: next };
    });
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
  }

  function removeNewFile(idx) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeExistingImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  // Auto-generate specs string based on active category if field is blank
  const generatedSpecs = useMemo(() => {
    switch (activeType) {
      case 'Mice':
        return `${specs.mouse_weight}, ${specs.mouse_sensor}, ${specs.mouse_polling} Polling, ${specs.mouse_switches}, ${specs.mouse_connectivity.join('/')}, ${specs.mouse_grip.join('/')} Grip`;
      case 'Mousepads':
        return `Multi-Size Tournament Deskmat (Basic, Large, XL, XXL, XXXL), ${specs.mousepad_rgb ? '14-Mode Optical RGB Edge-Lit' : 'Standard Non-RGB'}`;
      case 'Keyboards':
        return `${specs.kb_size || '75%'} Form Factor Mechanical Gaming Keyboard`;
      case 'IEMs':
        return `${specs.iem_driver}, ${specs.iem_cable}, ${specs.iem_shell}, ${specs.iem_mic}`;
      case 'Headphones':
        return `${specs.hp_acoustic}, ${specs.hp_drivers}, ${specs.hp_connectivity}, ${specs.hp_pads}`;
      case 'Accessories':
        return `${specs.acc_material}, ${specs.acc_compatibility}`;
      default:
        return '';
    }
  }, [activeType, specs]);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.cost_price) errs.cost_price = 'Cost price is required';
    if (!form.selling_price) errs.selling_price = 'Selling price is required';
    if (form.stock_quantity === '') errs.stock_quantity = 'Stock quantity is required';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      // 1. Upload any new images via admin API
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        const formData = new FormData();
        formData.append('slug', form.slug.trim());
        newFiles.forEach((file) => formData.append('files', file));

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Failed to upload images');
        }
        uploadedUrls = uploadData.urls || [];
      }

      const allImages = [...images, ...uploadedUrls];

      // Assemble automatic tags/collections for storefront filtering
      const compiledCollections = new Set(form.collections || []);

      if (activeType === 'Mice') {
        specs.mouse_connectivity.forEach((c) => compiledCollections.add(c));
        specs.mouse_grip.forEach((g) => compiledCollections.add(g));
        if (specs.mouse_polling.includes('8000') || specs.mouse_polling.includes('8K')) compiledCollections.add('8k');
        if (specs.mouse_weight && parseInt(specs.mouse_weight) < 55) compiledCollections.add('ultralight');
      } else if (activeType === 'Mousepads') {
        specs.mousepad_theme.forEach((t) => compiledCollections.add(t));
        if (specs.mousepad_rgb) compiledCollections.add('rgb');
        else compiledCollections.delete('rgb');
        ['basic', 'large', 'xl', 'xxl', 'xxxl'].forEach((sz) => compiledCollections.add(sz));
      } else if (activeType === 'Keyboards') {
        const sz = (specs.kb_size || '75%').replace('%', '');
        compiledCollections.add(specs.kb_size || '75%');
        compiledCollections.add(sz);
        if (sz === '80') compiledCollections.add('tkl');
        if (sz === '60' || sz === '70') compiledCollections.add('65');
        if (sz === '100') compiledCollections.add('full');
      } else if (activeType === 'IEMs') {
        if (specs.iem_driver.toLowerCase().includes('hybrid')) compiledCollections.add('hybrid');
        if (specs.iem_driver.toLowerCase().includes('planar')) compiledCollections.add('planar');
        if (specs.iem_driver.toLowerCase().includes('dynamic')) compiledCollections.add('dynamic');
        specs.iem_tuning.forEach((t) => compiledCollections.add(t));
        compiledCollections.add('detachable');
      } else if (activeType === 'Headphones') {
        if (specs.hp_acoustic.toLowerCase().includes('open')) compiledCollections.add('open-back');
        if (specs.hp_acoustic.toLowerCase().includes('closed')) compiledCollections.add('closed-back');
        if (specs.hp_connectivity.toLowerCase().includes('wireless')) compiledCollections.add('wireless');
        else compiledCollections.add('wired');
      } else if (activeType === 'Accessories') {
        compiledCollections.add(specs.acc_type);
        if (specs.acc_material.toLowerCase().includes('acrylic')) compiledCollections.add('acrylic');
        if (specs.acc_material.toLowerCase().includes('wood')) compiledCollections.add('wood');
        if (specs.acc_material.toLowerCase().includes('metal')) compiledCollections.add('metal');
      }

      // Process mousepad size pricing
      const cleanSizePricing = {};
      if (activeType === 'Mousepads') {
        ['Basic', 'Large', 'XL', 'XXL', 'XXXL'].forEach((s) => {
          if (sizePricing[s]) {
            const num = Number(sizePricing[s]);
            if (!isNaN(num) && num > 0) {
              cleanSizePricing[s] = num;
            }
          }
        });
      }

      let finalMaterialSpecs = form.material_specs.trim() || generatedSpecs;
      if (Object.keys(cleanSizePricing).length > 0) {
        // Strip any existing __SIZES__ block
        finalMaterialSpecs = finalMaterialSpecs.replace(/__SIZES__.*?__SIZES__/g, '').trim();
        finalMaterialSpecs = `${finalMaterialSpecs} __SIZES__${JSON.stringify(cleanSizePricing)}__SIZES__`.trim();
      }

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category: form.category,
        description: form.description.trim(),
        cost_price: parseFloat(form.cost_price) || 0,
        selling_price: parseFloat(form.selling_price) || 0,
        discount_percentage: parseFloat(form.discount_percentage) || 0,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        is_active: form.is_active,
        collections: Array.from(compiledCollections),
        delivery_time: form.delivery_time.trim(),
        warranty_period: form.warranty_period.trim(),
        care_instructions: form.care_instructions.trim(),
        material_specs: finalMaterialSpecs,
        images: allImages,
        size_pricing: Object.keys(cleanSizePricing).length > 0 ? cleanSizePricing : null,
      };

      const url = isEdit && productId ? `/api/admin/products/${productId}` : '/api/admin/products';
      const method = isEdit && productId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setSaved(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 800);
    } catch (err) {
      setErrors({ _global: err.message });
      setSaving(false);
    }
  }

  async function handleDeleteProduct() {
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${form.name}"?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete product');
        setDeleting(false);
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting product');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
      </div>
    );
  }

  const discountedPreview = form.selling_price && form.discount_percentage
    ? Math.round(parseFloat(form.selling_price) * (1 - parseFloat(form.discount_percentage) / 100))
    : null;

  return (
    <div className={styles.page}>
      {/* Top Header */}
      <div className={styles.header}>
        <div>
          <h1 className="h2">{isEdit ? `Edit Product: ${form.name}` : 'Create New Product'}</h1>
          <p className="body-sm muted">
            {isEdit
              ? 'Update specifications, pricing, imagery, and store filters'
              : 'Select a product category to load its customized hardware specification form.'}
          </p>
        </div>

        <div className={styles.activeToggle}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              id="product-is-active"
            />
            <span className={styles.toggleSlider} />
          </label>
          <span className="body-sm" style={{ color: form.is_active ? 'var(--success)' : 'var(--text-muted)' }}>
            {form.is_active ? 'Active (visible in store)' : 'Inactive (hidden from store)'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} id="product-form" noValidate>
        {/* Step 1: Category Type Selector Tabs */}
        <div className={`glass-light ${styles.typeSelectorSection}`}>
          <div className={styles.specSectionHeader}>
            <h2 className={styles.sectionTitle}>1. Select Product Category</h2>
            <span className={styles.specBadge}>Dedicated Form Active</span>
          </div>
          <p className="body-sm muted" style={{ margin: 0 }}>
            Choose the item type to reveal its exact tailored specs (e.g. Grip & Polling for Mice, Themes for Mousepads, Switches for Keyboards):
          </p>

          <div className={styles.typeCardsRow}>
            {PRODUCT_TYPES.map((pt) => {
              const isSelected = activeType === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  className={`${styles.typeCard} ${isSelected ? styles.typeCardActive : ''}`}
                  onClick={() => handleTypeChange(pt.id)}
                  id={`cat-select-${pt.id.toLowerCase()}`}
                >
                  <span className={styles.typeIcon}>{pt.icon}</span>
                  <span className={styles.typeLabel}>{pt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.grid}>
          {/* Left column */}
          <div className={styles.col}>
            {/* 2. Category-Specific Specifications Form */}
            <div className={`glass-light ${styles.section}`}>
              <div className={styles.specSectionHeader}>
                <h2 className={styles.sectionTitle}>2. {activeType.toUpperCase()} SPECIFICATIONS</h2>
                <span className={styles.specBadge}>{activeType} Mode</span>
              </div>

              {/* MICE FORM */}
              {activeType === 'Mice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.categoryNotice}>
                    ⚡ <strong>Mice Storefront Filters:</strong> Customers will be able to filter by Connectivity (Wireless vs Wired), Grip Style (Claw, Fingertip, Palm), and 8000Hz Polling.
                  </div>

                  <div>
                    <label className={styles.subgroupTitle}>Connectivity (Multi-Select)</label>
                    <div className={styles.collectionsGrid}>
                      {[
                        { id: 'wireless', label: 'Wireless 2.4GHz' },
                        { id: 'wired', label: 'Wired Speed' },
                        { id: 'bluetooth', label: 'Bluetooth 5.3' },
                      ].map((item) => {
                        const isChecked = specs.mouse_connectivity.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`${styles.collectionPill} ${isChecked ? styles.collectionPillActive : ''}`}
                            onClick={() => toggleSpecArray('mouse_connectivity', item.id)}
                          >
                            <span className={styles.checkIcon}>{isChecked ? '✓' : '+'}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={styles.subgroupTitle}>Compatible Grip Styles (Multi-Select)</label>
                    <div className={styles.collectionsGrid}>
                      {[
                        { id: 'claw', label: 'Claw Grip' },
                        { id: 'fingertip', label: 'Fingertip Grip' },
                        { id: 'palm', label: 'Palm Grip' },
                      ].map((item) => {
                        const isChecked = specs.mouse_grip.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`${styles.collectionPill} ${isChecked ? styles.collectionPillActive : ''}`}
                            onClick={() => toggleSpecArray('mouse_grip', item.id)}
                          >
                            <span className={styles.checkIcon}>{isChecked ? '✓' : '+'}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.specGrid}>
                    <div className="form-group">
                      <label className="form-label">Polling Rate</label>
                      <select
                        className="form-input"
                        value={specs.mouse_polling}
                        onChange={(e) => handleSpecChange('mouse_polling', e.target.value)}
                      >
                        <option value="8000Hz">8000Hz (0.125ms Tournament Polling)</option>
                        <option value="4000Hz">4000Hz (0.25ms Polling)</option>
                        <option value="1000Hz">1000Hz (Standard Esports)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mouse Weight (e.g. 49g)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={specs.mouse_weight}
                        onChange={(e) => handleSpecChange('mouse_weight', e.target.value)}
                        placeholder="49g Ultra-Light"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Optical Sensor Model</label>
                      <input
                        type="text"
                        className="form-input"
                        value={specs.mouse_sensor}
                        onChange={(e) => handleSpecChange('mouse_sensor', e.target.value)}
                        placeholder="PAW3395 (26,000 DPI)"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Micro-Switches</label>
                      <input
                        type="text"
                        className="form-input"
                        value={specs.mouse_switches}
                        onChange={(e) => handleSpecChange('mouse_switches', e.target.value)}
                        placeholder="Optical Micro-switches (Zero debounce)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MOUSEPADS FORM */}
              {activeType === 'Mousepads' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.categoryNotice}>
                    🎨 <strong>Mousepad Specifications:</strong> Configure artwork theme, sizes (Basic, Large, XL, XXL, XXXL), custom price points, and RGB lighting.
                  </div>

                  <div>
                    <label className={styles.subgroupTitle}>Theme & Artwork Style (Multi-Select)</label>
                    <div className={styles.collectionsGrid}>
                      {[
                        { id: 'minimalistic', label: 'Minimalistic' },
                        { id: 'fps', label: 'FPS Tactical' },
                        { id: 'abstract', label: 'Abstract & Waves' },
                        { id: 'fantasy', label: 'Fantasy & Mythic' },
                        { id: 'anime', label: 'Anime & Manga' },
                      ].map((item) => {
                        const isChecked = specs.mousepad_theme.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`${styles.collectionPill} ${isChecked ? styles.collectionPillActive : ''}`}
                            onClick={() => toggleSpecArray('mousepad_theme', item.id)}
                          >
                            <span className={styles.checkIcon}>{isChecked ? '✓' : '+'}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* RGB Lighting Yes / No */}
                  <div>
                    <label className={styles.subgroupTitle}>RGB Lighting (Yes / No)</label>
                    <p className="body-xs muted" style={{ margin: '2px 0 8px' }}>
                      Does this mousepad feature RGB edge-lit illumination?
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        className={`${styles.collectionPill} ${specs.mousepad_rgb ? styles.collectionPillActive : ''}`}
                        onClick={() => handleSpecChange('mousepad_rgb', true)}
                      >
                        <span className={styles.checkIcon}>{specs.mousepad_rgb ? '✓' : '+'}</span>
                        <span>YES — RGB Edge-Lit</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.collectionPill} ${!specs.mousepad_rgb ? styles.collectionPillActive : ''}`}
                        onClick={() => handleSpecChange('mousepad_rgb', false)}
                      >
                        <span className={styles.checkIcon}>{!specs.mousepad_rgb ? '✓' : '+'}</span>
                        <span>NO — Non-RGB (Standard)</span>
                      </button>
                    </div>
                  </div>

                  {/* Size Pricing Matrix */}
                  <div className={styles.sizePricingSection}>
                    <div className={styles.sizePricingHeader}>
                      <div>
                        <span className={styles.subgroupTitle}>MOUSEPAD SIZES & PRICEPOINTS (PKR)</span>
                        <p className="body-xs muted" style={{ margin: '2px 0 0' }}>
                          Set prices for Basic, Large, XL, XXL, and XXXL sizes. The customer picks their size on the product page.
                        </p>
                      </div>
                      <button
                        type="button"
                        className={styles.autoCalcBtn}
                        onClick={autoCalculateSizePrices}
                        title="Calculate proportional prices from base selling price"
                      >
                        ⚡ Auto-Calculate Tiered Prices
                      </button>
                    </div>

                    <div className={styles.sizePricingGrid}>
                      {MOUSEPAD_SIZES.map((sz) => (
                        <div key={sz.id} className={styles.sizePricingCard}>
                          <div className={styles.sizeCardHeader}>
                            <span className={styles.sizeCardName}>{sz.label}</span>
                            <span className={styles.sizeCardDims}>{sz.dims}</span>
                          </div>
                          <div className={styles.sizeInputWrap}>
                            <span className={styles.sizeCurrency}>PKR</span>
                            <input
                              type="number"
                              min="0"
                              step="100"
                              placeholder={
                                form.selling_price
                                  ? String(Math.max(999, (Number(form.selling_price) || 2999) + sz.defaultDiff))
                                  : '2499'
                              }
                              value={sizePricing[sz.id] || ''}
                              onChange={(e) => handleSizePriceChange(sz.id, e.target.value)}
                              className={styles.sizeInputField}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* KEYBOARDS FORM */}
              {activeType === 'Keyboards' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.categoryNotice}>
                    ⌨️ <strong>Keyboard Size & Layout:</strong> Choose the size percentage for this keyboard (60%, 70%, 75%, 80%, or 100%).
                  </div>

                  <div>
                    <label className={styles.subgroupTitle}>SIZE PERCENTAGE</label>
                    <p className="body-xs muted" style={{ margin: '2px 0 10px' }}>
                      Select the keyboard size percentage:
                    </p>
                    <div className={styles.collectionsGrid}>
                      {[
                        { id: '60%', label: '60%' },
                        { id: '70%', label: '70%' },
                        { id: '75%', label: '75%' },
                        { id: '80%', label: '80%' },
                        { id: '100%', label: '100%' },
                      ].map((item) => {
                        const isSelected = specs.kb_size === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`${styles.collectionPill} ${isSelected ? styles.collectionPillActive : ''}`}
                            onClick={() => handleSpecChange('kb_size', item.id)}
                            style={{ minWidth: '96px', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 700 }}
                          >
                            <span className={styles.checkIcon}>{isSelected ? '✓' : '+'}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* IEMS FORM */}
              {activeType === 'IEMs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.categoryNotice}>
                    🎧 <strong>IEM Storefront Filters:</strong> Customers will be able to filter by Hybrid Multi-Driver vs Single Dynamic, FPS Footstep Tuning, and Detachable Cable.
                  </div>

                  <div className={styles.specGrid}>
                    <div className="form-group">
                      <label className="form-label">Driver Architecture</label>
                      <select
                        className="form-input"
                        value={specs.iem_driver}
                        onChange={(e) => handleSpecChange('iem_driver', e.target.value)}
                      >
                        <option value="Hybrid Multi-Driver (1DD + 2BA)">Hybrid (Dynamic Driver + Balanced Armatures)</option>
                        <option value="Planar Magnetic High-Resolution">Planar Magnetic High-Resolution</option>
                        <option value="Single Dynamic Driver (10mm Carbon)">Single Dynamic Driver (10mm Carbon)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Cable Connector</label>
                      <select
                        className="form-input"
                        value={specs.iem_cable}
                        onChange={(e) => handleSpecChange('iem_cable', e.target.value)}
                      >
                        <option value="0.78mm 2-Pin Detachable (Silver-Plated)">0.78mm 2-Pin Detachable (Silver-Plated OFC)</option>
                        <option value="MMCX Detachable Cable">MMCX Detachable Cable</option>
                        <option value="DSP USB-C Integrated DAC">DSP USB-C Integrated DAC</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Housing & Shell Material</label>
                      <input
                        type="text"
                        className="form-input"
                        value={specs.iem_shell}
                        onChange={(e) => handleSpecChange('iem_shell', e.target.value)}
                        placeholder="Medical-Grade 3D Printed Resin"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Microphone Configuration</label>
                      <input
                        type="text"
                        className="form-input"
                        value={specs.iem_mic}
                        onChange={(e) => handleSpecChange('iem_mic', e.target.value)}
                        placeholder="Detachable Boom Mic / Inline Mic"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* HEADPHONES FORM */}
              {activeType === 'Headphones' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.categoryNotice}>
                    🎙️ <strong>Headphone Storefront Filters:</strong> Customers will be able to filter by Open-Back Studio Reference vs Closed-Back Isolation and Wireless vs Wired.
                  </div>

                  <div className={styles.specGrid}>
                    <div className="form-group">
                      <label className="form-label">Acoustic Architecture</label>
                      <select
                        className="form-input"
                        value={specs.hp_acoustic}
                        onChange={(e) => handleSpecChange('hp_acoustic', e.target.value)}
                      >
                        <option value="Open-Back Studio Reference">Open-Back Studio Reference (Vast Soundstage)</option>
                        <option value="Closed-Back Isolation">Closed-Back Isolation (Competitive Bass & Seal)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Connectivity</label>
                      <select
                        className="form-input"
                        value={specs.hp_connectivity}
                        onChange={(e) => handleSpecChange('hp_connectivity', e.target.value)}
                      >
                        <option value="2.4GHz Wireless Low-Latency">2.4GHz Wireless Low-Latency</option>
                        <option value="Studio Wired (3.5mm / 6.35mm)">Studio Wired (3.5mm / 6.35mm gold adapter)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Transducer / Driver Size</label>
                      <input
                        type="text"
                        className="form-input"
                        value={specs.hp_drivers}
                        onChange={(e) => handleSpecChange('hp_drivers', e.target.value)}
                        placeholder="53mm Neodymium Drivers"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ear Cushion Material</label>
                      <input
                        type="text"
                        className="form-input"
                        value={specs.hp_pads}
                        onChange={(e) => handleSpecChange('hp_pads', e.target.value)}
                        placeholder="Breathable Memory Foam Velour"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ACCESSORIES FORM */}
              {activeType === 'Accessories' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.categoryNotice}>
                    ⚡ <strong>Accessory Storefront Filters:</strong> Customers will be able to filter by Accessory Type (Cables, Wrist Rests, Skates, Bundles) and Material.
                  </div>

                  <div className={styles.specGrid}>
                    <div className="form-group">
                      <label className="form-label">Accessory Type</label>
                      <select
                        className="form-input"
                        value={specs.acc_type}
                        onChange={(e) => handleSpecChange('acc_type', e.target.value)}
                      >
                        <option value="cables">Custom Coiled Aviator Cable</option>
                        <option value="wrist-rests">Artisan Ergonomic Wrist Rest</option>
                        <option value="skates">Glass Mouse Skates</option>
                        <option value="bundles">Battlestation Desk Bundle / Bungee</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Material & Finish</label>
                      <input
                        type="text"
                        className="form-input"
                        value={specs.acc_material}
                        onChange={(e) => handleSpecChange('acc_material', e.target.value)}
                        placeholder="Double-Sleeved Paracord + GX16 Aviator"
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Rig Compatibility</label>
                      <input
                        type="text"
                        className="form-input"
                        value={specs.acc_compatibility}
                        onChange={(e) => handleSpecChange('acc_compatibility', e.target.value)}
                        placeholder="Universal USB-C / 65% & 75% Mechanical Keyboards"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Basic Information */}
            <div className={`glass-light ${styles.section}`}>
              <h2 className={styles.sectionTitle}>3. Basic Information</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="product-name">Product Name *</label>
                <input
                  id="product-name"
                  name="name"
                  type="text"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder={
                    activeType === 'Mice'
                      ? 'VYNTRO Apex 8K Wireless'
                      : activeType === 'Keyboards'
                      ? 'VYNTRO Forge 65% HE Rapid Trigger'
                      : 'Red Void Precision Deskmat XXL'
                  }
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="product-slug">Slug (URL) *</label>
                <input
                  id="product-slug"
                  name="slug"
                  type="text"
                  className={`form-input ${errors.slug ? 'error' : ''}`}
                  placeholder="vyntro-apex-8k-wireless"
                  value={form.slug}
                  onChange={handleChange}
                />
                {errors.slug && <p className="form-error">{errors.slug}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  name="description"
                  className="form-input"
                  rows={4}
                  placeholder={`Describe the ${activeType.toLowerCase()} specifications, performance in competitive games, and feel...`}
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 4. Pricing & Stock */}
            <div className={`glass-light ${styles.section}`}>
              <h2 className={styles.sectionTitle}>4. Pricing & Stock</h2>

              <div className={styles.priceGrid}>
                <div className="form-group">
                  <label className="form-label" htmlFor="product-cost">Cost Price (COGS) *</label>
                  <input
                    id="product-cost"
                    name="cost_price"
                    type="number"
                    min="0"
                    step="1"
                    className={`form-input ${errors.cost_price ? 'error' : ''}`}
                    placeholder="900"
                    value={form.cost_price}
                    onChange={handleChange}
                  />
                  {errors.cost_price && <p className="form-error">{errors.cost_price}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="product-price">Selling Price (PKR) *</label>
                  <input
                    id="product-price"
                    name="selling_price"
                    type="number"
                    min="0"
                    step="1"
                    className={`form-input ${errors.selling_price ? 'error' : ''}`}
                    placeholder="3499"
                    value={form.selling_price}
                    onChange={handleChange}
                  />
                  {errors.selling_price && <p className="form-error">{errors.selling_price}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="product-discount">Discount %</label>
                  <input
                    id="product-discount"
                    name="discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    className="form-input"
                    placeholder="0"
                    value={form.discount_percentage}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="product-stock">Stock Quantity *</label>
                  <input
                    id="product-stock"
                    name="stock_quantity"
                    type="number"
                    min="0"
                    step="1"
                    className={`form-input ${errors.stock_quantity ? 'error' : ''}`}
                    placeholder="25"
                    value={form.stock_quantity}
                    onChange={handleChange}
                  />
                  {errors.stock_quantity && <p className="form-error">{errors.stock_quantity}</p>}
                </div>
              </div>

              {/* Live Margin Preview */}
              {form.selling_price && (
                <div className={styles.pricePreview}>
                  <span className="label muted">Customer sees:</span>
                  <span className="price-current">
                    PKR {discountedPreview?.toLocaleString() ?? parseFloat(form.selling_price).toLocaleString()}
                  </span>
                  {discountedPreview && (
                    <span className="price-original">
                      PKR {parseFloat(form.selling_price).toLocaleString()}
                    </span>
                  )}
                  {form.cost_price && form.selling_price && (
                    <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                      Margin: {(((parseFloat(form.selling_price) - parseFloat(form.cost_price)) / parseFloat(form.selling_price)) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 5. Featured Badges & Store Placement */}
            <div className={`glass-light ${styles.section}`}>
              <h2 className={styles.sectionTitle}>5. Featured Store Badges</h2>
              <p className="body-sm muted" style={{ marginTop: -8 }}>
                Tag this product to display in homepage carousels and highlight sections:
              </p>
              <div className={styles.collectionsGrid}>
                {[
                  { id: 'best-sellers', label: '★ Best Sellers' },
                  { id: 'hot-picks', label: '🔥 Hot Picks' },
                  { id: 'featured', label: '⚡ Featured Item' },
                ].map((c) => {
                  const isChecked = form.collections?.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`${styles.collectionPill} ${isChecked ? styles.collectionPillActive : ''}`}
                      onClick={() => toggleStoreCollection(c.id)}
                    >
                      <span className={styles.checkIcon}>{isChecked ? '✓' : '+'}</span>
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Structured Info Blocks */}
            <div className={`glass-light ${styles.section}`}>
              <h2 className={styles.sectionTitle}>6. Product Info & Shipping Blocks</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="product-material_specs">
                  Material & Technical Specs (Displayed on Product Details Page)
                </label>
                <input
                  id="product-material_specs"
                  name="material_specs"
                  type="text"
                  className="form-input"
                  placeholder={generatedSpecs}
                  value={form.material_specs}
                  onChange={handleChange}
                />
                <span className="body-xs muted" style={{ marginTop: 4, display: 'block' }}>
                  Auto-preview: <em>{generatedSpecs}</em>
                </span>
              </div>

              {[
                { name: 'delivery_time', label: 'Delivery Time', placeholder: '3–5 business days' },
                { name: 'warranty_period', label: 'Warranty Period', placeholder: '6 months replacement' },
                { name: 'care_instructions', label: 'Care Instructions', placeholder: 'Wipe clean with a damp microfiber cloth' },
              ].map((f) => (
                <div className="form-group" key={f.name}>
                  <label className="form-label" htmlFor={`product-${f.name}`}>{f.label}</label>
                  <input
                    id={`product-${f.name}`}
                    name={f.name}
                    type="text"
                    className="form-input"
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right column — Images */}
          <div className={styles.col}>
            <div className={`glass-light ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Product Images</h2>

              {/* Upload area */}
              <label className={styles.uploadArea} htmlFor="product-images">
                <input
                  id="product-images"
                  type="file"
                  accept="image/*"
                  multiple
                  className={styles.fileInput}
                  onChange={handleFileChange}
                />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div>
                  <p className="body-sm" style={{ fontWeight: 700, margin: 0 }}>Click or drop product photos</p>
                  <p className="body-xs muted" style={{ margin: 0 }}>PNG, JPG, WebP up to 10MB each</p>
                </div>
              </label>

              {/* Image previews */}
              {(images.length > 0 || previews.length > 0) && (
                <div className={styles.imageGrid}>
                  {images.map((url, idx) => (
                    <div key={`existing-${idx}`} className={styles.imageWrap}>
                      <Image src={url} alt={`Product ${idx + 1}`} fill style={{ objectFit: 'cover' }} sizes="110px" />
                      <button
                        type="button"
                        className={styles.removeImg}
                        onClick={() => removeExistingImage(idx)}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {previews.map((src, idx) => (
                    <div key={`new-${idx}`} className={`${styles.imageWrap} ${styles.newImg}`}>
                      <Image src={src} alt={`New upload ${idx + 1}`} fill style={{ objectFit: 'cover' }} sizes="110px" />
                      <button
                        type="button"
                        className={styles.removeImg}
                        onClick={() => removeNewFile(idx)}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit / Action Panel */}
            <div className={`glass-light ${styles.section}`}>
              {errors._global && <div className={styles.globalError}>{errors._global}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={saving || saved}
                id="save-product-btn"
                style={{ padding: '14px 20px', fontSize: '0.85rem' }}
              >
                {saved ? '✓ Product Saved!' : saving ? 'Saving Product...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>

              {isEdit && (
                <button
                  type="button"
                  className={styles.deleteFormBtn}
                  onClick={handleDeleteProduct}
                  disabled={deleting}
                  id="delete-product-form-btn"
                  style={{ width: '100%' }}
                >
                  {deleting ? 'Deleting...' : '🗑️ Delete Product'}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
