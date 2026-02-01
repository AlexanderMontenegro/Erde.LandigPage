import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, variant) => {
        const items = get().items;

        const existing = items.find(
          (item) =>
            item.id === product.id &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
        );

        if (existing) {
          if (existing.quantity >= variant.stock) return;

          set({
            items: items.map((item) =>
              item === existing
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                price: variant.price,
                variant,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeFromCart: (index) => {
        const items = get().items;
        items.splice(index, 1);
        set({ items: [...items] });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "erde-cart",
    }
  )
);
