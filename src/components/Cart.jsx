import { useCartStore } from "../store/cartStore"

export default function Cart() {
  const { cart, removeFromCart } = useCartStore()

  return (
    <div className="cart">
      <h3>Carrito</h3>

      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} />

          <div>
            <p>{item.name}</p>
            <small>{item.variants?.material}</small>
            <p>${item.price}</p>
          </div>

          <button onClick={() => removeFromCart(item.id)}>X</button>
        </div>
      ))}
    </div>
  )
}
