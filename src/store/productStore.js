import { create } from "zustand"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../config/firebase" // ✅ ruta correcta

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    try {
      set({ loading: true })

      const querySnapshot = await getDocs(collection(db, "products"))

      const products = []
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      set({ products, loading: false })
    } catch (error) {
      console.error("Error cargando productos:", error)
      set({ loading: false })
    }
  },
}))

export default useProductStore
