import { create } from "zustand"
import { getProducts } from "../services/productService"

export const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  loading: false,

  // variantes seleccionadas
  selectedVariants: {
    material: "",
    color: "",
    size: "",
    quality: "",
  },

  // cargar productos desde FIREBASE
  fetchProducts: async () => {
    try {
      set({ loading: true })

      const data = await getProducts()

      set({
        products: data,
        loading: false,
      })
    } catch (error) {
      console.error("Error cargando productos:", error)
      set({ loading: false })
    }
  },

  // abrir modal
  openProduct: (product) => {
    set({
      selectedProduct: product,
      selectedVariants: {
        material: "",
        color: "",
        size: "",
        quality: "",
      },
    })
  },

  // cerrar modal
  closeProduct: () => {
    set({ selectedProduct: null })
  },

  // seleccionar variante
  setVariant: (type, value) => {
    set((state) => ({
      selectedVariants: {
        ...state.selectedVariants,
        [type]: value,
      },
    }))
  },

  // calcular precio FINAL (FASE 5.2)
  getFinalPrice: () => {
    const { selectedProduct, selectedVariants } = get()

    if (!selectedProduct) return 0

    let price = selectedProduct.basePrice

    // ✔ calidad suma costo FIJO
    if (selectedVariants.quality === "Premium") {
      price += 5000
    }

    // ✔ tamaño NO cambia precio (como pediste)
    // ✔ material y color tampoco por ahora

    return price
  },
}))
