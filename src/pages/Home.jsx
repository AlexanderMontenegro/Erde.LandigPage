import { useEffect } from "react"
import { useProductStore } from "../store/productStore"
import ProductCard from "../components/ProductCard"
import ProductModal from "../components/ProductModal"
import Cart from "../components/Cart"

export default function Home() {
  const { products, fetchProducts } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="container">

      <h1>Catálogo</h1>

      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <ProductModal />
      <Cart />
    </div>
  )
}
