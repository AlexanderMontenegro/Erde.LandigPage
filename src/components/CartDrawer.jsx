import { useState } from "react";
import useProductStore from "../store/productStore.js";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    toggleCart,
    removeFromCart,
    updateQty,
    totalPrice,
    applyCoupon,
  } = useProductStore();

  const [code, setCode] = useState("");

  if (!cartOpen) return null;

  const total = totalPrice();

  const whatsappMsg = encodeURIComponent(
    `Hola, quiero comprar estos items: ${cart
      .map((i) => i.product.name)
      .join(", ")} por $${total}`
  );

  const whatsappLink = `https://wa.me/549XXXXXXXXXX?text=${whatsappMsg}`;

  return (
    <div className="fixed inset-0 z-50">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={toggleCart}
      />

      {/* PANEL DERECHO */}
      <div className="absolute right-0 top-0 h-full w-[360px] bg-[#050505] text-white p-5 border-l border-purple-600 shadow-2xl animate-slideLeft overflow-auto">

        <button
          onClick={toggleCart}
          className="mb-4 text-sm hover:text-purple-400"
        >
          ✖ Cerrar
        </button>

        <h2 className="text-xl mb-4 neon">Carrito</h2>

       {items.map((item) => (
  <div
    key={item.id}
    className="flex items-center gap-3 border-b border-zinc-700 py-3"
  >
    {/* ✅ MINIATURA */}
    <img
      src={item.image}
      alt={item.name}
      className="w-14 h-14 object-cover rounded-md"
    />

    <div className="flex-1">
      <p className="text-sm font-semibold">{item.name}</p>
      <p className="text-xs opacity-70">${item.basePrice}</p>
    </div>
  </div>
))}



        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Cupón"
          className="p-2 bg-black w-full border border-purple-700 rounded"
        />

        <button
          onClick={() => applyCoupon(code)}
          className="mt-2 bg-purple-600 p-2 w-full rounded hover:bg-purple-700"
        >
          Aplicar
        </button>

        <h3 className="mt-4 text-lg text-purple-400">
          Subtotal: ${total}
        </h3>

        <a
          href={whatsappLink}
          target="_blank"
          className="block mt-4 bg-green-500 text-black p-3 rounded text-center font-bold"
        >
          Checkout WhatsApp
        </a>
      </div>
    </div>
  );
}
