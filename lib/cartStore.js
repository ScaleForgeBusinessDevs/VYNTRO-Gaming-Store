'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, selectedVariant = null, selectedColor = null) => {
        const { items } = get();
        const parts = [product.id];
        if (selectedColor?.id) parts.push(`col-${selectedColor.id.toLowerCase()}`);
        if (selectedVariant?.id) parts.push(`sz-${selectedVariant.id.toLowerCase()}`);
        const itemId = parts.length > 1 ? parts.join('-') : product.id;

        const colorDiff = Number(selectedColor?.priceDiff) || 0;
        const baseOriginalPrice = (selectedVariant ? selectedVariant.price : product.selling_price) + colorDiff;
        const effectivePrice = product.discount_percentage
          ? Math.round(baseOriginalPrice * (1 - product.discount_percentage / 100))
          : baseOriginalPrice;

        const chosenImage = selectedColor?.image || selectedColor?.images?.[0] || product.images?.[0] || null;

        const existing = items.find((i) => i.id === itemId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === itemId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: itemId,
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: effectivePrice,
                originalPrice: baseOriginalPrice,
                discount: product.discount_percentage,
                image: chosenImage,
                quantity,
                variant: selectedVariant ? selectedVariant.id : null,
                variantLabel: selectedVariant ? selectedVariant.label : null,
                variantDims: selectedVariant ? selectedVariant.dims : null,
                color: selectedColor ? selectedColor.name : null,
                colorId: selectedColor ? selectedColor.id : null,
                colorHex: selectedColor ? selectedColor.hex : null,
              },
            ],
          });
        }
      },

      /**
       * Add an entire bundle as ONE cart line item.
       * @param {object} bundle  - from lib/bundles.js (id, slug, name, bundlePrice, image)
       * @param {string[]} itemNames - display names of included products
       */
      addBundle: (bundle, itemNames = []) => {
        const { items } = get();
        const itemId = `bundle-${bundle.slug}`;

        const existing = items.find((i) => i.id === itemId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === itemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: itemId,
                productId: bundle.id,
                name: bundle.name,
                slug: bundle.slug,
                price: bundle.bundlePrice,
                originalPrice: bundle.bundlePrice,
                discount: 0,
                image: bundle.image ?? null,
                quantity: 1,
                variant: null,
                variantLabel: null,
                variantDims: null,
                isBundle: true,
                bundleItems: itemNames,
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQty: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: 'vyntro-cart',
      version: 1,
    }
  )
);

export default useCartStore;
