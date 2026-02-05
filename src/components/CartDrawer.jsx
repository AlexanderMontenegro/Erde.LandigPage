import useProductStore from "../store/productStore";
import { useState } from "react";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    toggleCart,
    removeFromCart,
    totalPrice,
    applyCoupon,
  } = useProductStore();

  const [code, setCode] = useState("");

  if (!cartOpen) return null;

  const total = totalPrice();

  const whatsappLink = `https://wa.me/549XXXXXXXXXX?text=Hola quiero comprar por $${total}`;

  return (
    <div className="fixed right-0 top-0 h-full w-[350px] bg-[#0a0a0a] text-white p-5 z-50 overflow-auto">

      <button onClick={toggleCart}>Cerrar ✖</button>

      <h2 className="text-xl mb-4">Carrito</h2>

      {cart.map((item) => (
        <div key={item.id} className="border-b py-3">
          <p>{item.product.name}</p>
          <p>${item.price}</p>
          <button onClick={() => removeFromCart(item.id)}>
            Eliminar
          </button>
        </div>
      ))}

      <div className="mt-4">
        <input
          placeholder="Cupón"
          onChange={(e) => setCode(e.target.value)}
          className="bg-black p-2"
        />
        <button
          onClick={() => applyCoupon(code)}
          className="ml-2 bg-purple-600 px-3 py-1"
        >
          Aplicar
        </button>
      </div>

      <h3 className="mt-4 text-lg">Total: ${total}</h3>

      <a
        href={whatsappLink}
        target="_blank"
        className="block mt-4 bg-green-500 p-2 text-center rounded"
      >
        Comprar por WhatsApp
      </a>

      <button className="mt-2 bg-blue-600 p-2 w-full rounded">
        Pagar con MercadoPago
      </button>

      <button className="mt-2 bg-gray-600 p-2 w-full rounded">
        Transferencia Bancaria
      </button>
    </div>
  );
}
