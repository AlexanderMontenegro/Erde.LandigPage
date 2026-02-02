import { create } from "zustand";
import { getProducts } from "../services/productService";

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  loadProducts: async () => {
    set({ loading: true });

    try {
      const products = await getProducts();
      set({ products, loading: false });
    } catch (error) {
      console.error("Error cargando productos:", error);
      set({ loading: false });
    }
  },
}));

export default useProductStore;
