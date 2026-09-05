'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, selectedVariant = null) => {
        const { items } = get();
        const itemId = selectedVariant
          ? `${product.id}-${selectedVariant.id.toLowerCase()}`
          : product.id;

        const effectivePrice = selectedVariant
          ? (product.discount_percentage
              ? Math.round(selectedVariant.price * (1 - product.discount_percentage / 100))
              : selectedVariant.price)
          : (product.discount_percentage
              ? Math.round(product.selling_price * (1 - product.discount_percentage / 100))
              : product.selling_price);

        const baseOriginalPrice = selectedVariant ? selectedVariant.price : product.selling_price;

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
                image: product.images?.[0] ?? null,
                quantity,
                variant: selectedVariant ? selectedVariant.id : null,
                variantLabel: selectedVariant ? selectedVariant.label : null,
                variantDims: selectedVariant ? selectedVariant.dims : null,
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
