import { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orders";

export default function Checkout() {
  const { cart, clearCart, totalPrice } = useCart();

  const [buyer, setBuyer] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBuyer({
      ...buyer,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = await createOrder(cart, buyer);
      setOrderId(id);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Error creando la orden");
    }

    setLoading(false);
  };

  if (orderId) {
    return (
      <div className="text-center">
        <h2>✅ Compra realizada</h2>
        <p>ID Orden: {orderId}</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Finalizar compra</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Teléfono"
          onChange={handleChange}
          required
        />

        <h3>Total: ${totalPrice()}</h3>

        <button disabled={loading}>
          {loading ? "Procesando..." : "Confirmar compra"}
        </button>
      </form>
    </div>
  );
}
