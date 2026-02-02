import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, variants) => {
        const items = get().items;

        const existingIndex = items.findIndex(
          (item) =>
            item.id === product.id &&
            JSON.stringify(item.variants) === JSON.stringify(variants)
        );

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex].quantity += 1;
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                price: product.basePrice,
                image: product.image,
                variants,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeFromCart: (index) => {
        const items = [...get().items];
        items.splice(index, 1);
        set({ items });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "erde-cart",
    }
  )
);
