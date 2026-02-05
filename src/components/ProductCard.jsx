import  useProductStore  from "../store/productStore"

export default function ProductCard({ product }) {
  const openProduct = useProductStore((s) => s.openProduct)

  if (!product) return null

  return (
    <div className="product-card" onClick={() => openProduct(product)}>
      <div className="product-img-wrapper">
        <img src={product.image} alt={product.name} />
      </div>

      <h3>{product.name}</h3>
      <p className="price">${product.basePrice}</p>
    </div>
  )
}
