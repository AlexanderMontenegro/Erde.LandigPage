import { create } from "zustand";
import { getProducts } from "../services/productService";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  loadProducts: async () => {
    set({ loading: true, error: null });

    try {
      const products = await getProducts();
      set({ products, loading: false });
    } catch (error) {
      console.error("Error cargando productos:", error);
      set({ loading: false, error });
    }
  },
}));

export default useProductStore;
export { useProductStore };
