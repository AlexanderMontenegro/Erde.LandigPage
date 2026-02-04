import { useProductStore } from "../store/productStore"
import { useCartStore } from "../store/cartStore"

export default function ProductModal() {
  const {
    selectedProduct,
    closeProduct,
    selectedVariants,
    setVariant,
    getFinalPrice,
  } = useProductStore()

  const addToCart = useCartStore((s) => s.addToCart)

  if (!selectedProduct) return null

  const handleAdd = () => {
    const price = getFinalPrice()
    addToCart(selectedProduct, selectedVariants, price)
    closeProduct()
  }

  return (
    <div className="modal-overlay">
      <div className="modal">

        <button className="close-btn" onClick={closeProduct}>✕</button>

        <div className="modal-img">
          <img src={selectedProduct.image} alt={selectedProduct.name} />
        </div>

        <h2>{selectedProduct.name}</h2>

        {/* MATERIAL */}
        <select onChange={(e)=>setVariant("material",e.target.value)}>
          <option>Material</option>
          {selectedProduct.variants?.material?.map(v=>(
            <option key={v}>{v}</option>
          ))}
        </select>

        {/* COLOR */}
        <select onChange={(e)=>setVariant("color",e.target.value)}>
          <option>Color</option>
          {selectedProduct.variants?.color?.map(v=>(
            <option key={v}>{v}</option>
          ))}
        </select>

        {/* SIZE */}
        <select onChange={(e)=>setVariant("size",e.target.value)}>
          <option>Tamaño</option>
          {selectedProduct.variants?.size?.map(v=>(
            <option key={v}>{v}</option>
          ))}
        </select>

        {/* QUALITY */}
        <select onChange={(e)=>setVariant("quality",e.target.value)}>
          <option>Calidad</option>
          {selectedProduct.variants?.quality?.map(v=>(
            <option key={v}>{v}</option>
          ))}
        </select>

        <h3 className="final-price">
          Precio Final: ${getFinalPrice()}
        </h3>

        <button className="add-cart-btn" onClick={handleAdd}>
          Agregar al carrito 🛒
        </button>

      </div>
    </div>
  )
}
