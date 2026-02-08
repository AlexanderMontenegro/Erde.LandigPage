import { useEffect } from "react"
import useProductStore from "../store/productStore"
import ProductCard from "../components/ProductCard"

export default function Home() {
  const { products = [], fetchProducts, loading } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="text-center mt-10 text-white">
        Cargando productos...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
