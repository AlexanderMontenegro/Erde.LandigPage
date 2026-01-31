import { create } from "zustand";
import { getProducts } from "../services/productService";

export const useProductStore = create((set) => ({
  products: [],
  loading: true,

  fetchProducts: async () => {
    const data = await getProducts();
    set({ products: data, loading: false });
  },
}));
