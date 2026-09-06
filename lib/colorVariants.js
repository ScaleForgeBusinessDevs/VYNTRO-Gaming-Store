/**
 * Color Variants helper
 * Parses the `color_variants` JSONB column stored on a product.
 *
 * Each variant shape:
 * {
 *   id: string,           // e.g. "cloud-black"
 *   name: string,         // e.g. "Cloud Black"
 *   hex: string,          // e.g. "#1a1a1a"  (swatch fallback)
 *   image: string,        // thumbnail URL shown in swatch
 *   images: string[],     // full gallery URLs for this color
 *   priceDiff: number,    // price offset from base (0 = same price)
 * }
 */

export function getColorVariants(product) {
  if (!product) return [];
  let cv = product.color_variants;
  if (!cv && product.material_specs && product.material_specs.includes('__COLORS__')) {
    try {
      const match = product.material_specs.match(/__COLORS__(.*?)__COLORS__/);
      if (match && match[1]) cv = JSON.parse(match[1]);
    } catch {}
  }
  if (!cv) return [];
  if (typeof cv === 'string') {
    try { cv = JSON.parse(cv); } catch { return []; }
  }
  if (!Array.isArray(cv)) return [];
  return cv.filter((v) => v && v.id && v.name);
}

/** Returns an empty variant template for the admin form */
export function emptyColorVariant() {
  return {
    id: '',
    name: '',
    hex: '#1a1a1a',
    image: '',
    images: [],
    priceDiff: 0,
  };
}
