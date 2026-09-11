export const MOUSEPAD_SIZES = [
  { id: 'Basic', label: 'Basic', dims: '300×250mm', desc: 'Compact Setup', defaultDiff: -1000 },
  { id: 'Large', label: 'Large', dims: '450×400mm', desc: 'Esports Tournament', defaultDiff: -500 },
  { id: 'XL',    label: 'XL',    dims: '800×300mm', desc: 'Extended Rig', defaultDiff: -200 },
  { id: 'XXL',   label: 'XXL',   dims: '900×400mm', desc: 'Flagship Battlemat', defaultDiff: 0, popular: true },
  { id: 'XXXL',  label: 'XXXL',  dims: '1000×500mm', desc: 'Colossal Desk', defaultDiff: 800 },
];

/**
 * Checks whether a product qualifies as a mousepad / deskmat
 */
export function isMousepadProduct(product) {
  if (!product) return false;
  const cat = (product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  return (
    cat.includes('mousepad') ||
    cat.includes('deskmat') ||
    cat.includes('xxl') ||
    cat.includes('rgb') ||
    name.includes('deskmat') ||
    name.includes('mousepad') ||
    name.includes('mouse pad') ||
    name.includes('cybermat') ||
    Boolean(product.size_pricing && Object.keys(product.size_pricing).length > 0)
  );
}

/**
 * Returns all size definitions with their calculated and custom prices.
 * If price is 0, negative, or not configured in customPricing, isAvailable is false.
 */
export function getAllProductSizeVariants(product) {
  if (!product) return [];

  const basePrice = Number(product.selling_price) || 2999;
  const discountPct = Number(product.discount_percentage) || 0;

  // Check if size_pricing exists as object, or encoded in material_specs
  let customPricing = product.size_pricing;
  if (typeof customPricing === 'string') {
    try {
      customPricing = JSON.parse(customPricing);
    } catch {
      customPricing = null;
    }
  }

  // Fallback: check if encoded in material_specs string e.g. __SIZES__{...}__
  if (!customPricing && product.material_specs && product.material_specs.includes('__SIZES__')) {
    try {
      const match = product.material_specs.match(/__SIZES__(.*?)__SIZES__/);
      if (match && match[1]) {
        customPricing = JSON.parse(match[1]);
      }
    } catch {
      // ignore
    }
  }

  const hasCustomPricing = Boolean(customPricing && typeof customPricing === 'object' && Object.keys(customPricing).length > 0);

  return MOUSEPAD_SIZES.map((sizeDef) => {
    let rawPrice = 0;
    let isAvailable = false;

    if (hasCustomPricing) {
      // Product has custom size configuration.
      // If a size variant is set to 0, negative, or omitted, it is NOT available.
      if (customPricing[sizeDef.id] !== undefined) {
        const p = Number(customPricing[sizeDef.id]);
        if (!isNaN(p) && p > 0) {
          isAvailable = true;
          rawPrice = p;
        } else {
          // Explicitly 0 or negative => unavailable
          isAvailable = false;
          rawPrice = 0;
        }
      } else {
        // Omitted from custom pricing => unavailable
        isAvailable = false;
        rawPrice = 0;
      }
    } else {
      // Default formula pricing when product has no custom size pricing
      rawPrice = Math.max(500, Math.round(basePrice + sizeDef.defaultDiff));
      isAvailable = rawPrice > 0;
    }

    const discountedPrice = isAvailable && discountPct > 0
      ? Math.round(rawPrice * (1 - discountPct / 100))
      : null;

    return {
      ...sizeDef,
      price: rawPrice,
      discountedPrice,
      effectivePrice: isAvailable ? (discountedPrice ?? rawPrice) : 0,
      isAvailable,
      available: isAvailable,
    };
  });
}

/**
 * Returns only the available size variants for the storefront.
 * If a size's price is 0, negative, or not configured, it is completely excluded so it is NOT an option on the store.
 */
export function getProductSizeVariants(product) {
  return getAllProductSizeVariants(product).filter((s) => s.isAvailable && s.effectivePrice > 0);
}

/**
 * Alias for getProductSizeVariants
 */
export function getAvailableProductSizeVariants(product) {
  return getProductSizeVariants(product);
}
