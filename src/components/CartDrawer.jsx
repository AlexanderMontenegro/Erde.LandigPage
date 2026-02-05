import { useState } from 'react';
import useProductStore from '../store/productStore.js';

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, removeFromCart, updateQty, totalPrice, applyCoupon } = useProductStore();
  const [code, setCode] = useState('');

  if (!cartOpen) return null;

  const total = totalPrice();
  const whatsappMsg = encodeURIComponent(`Hola, quiero comprar estos items: ${cart.map(i => i.product.name).join(', ')} por $${total}`);
  const whatsappLink = `https://wa.me/549XXXXXXXXXX?text=${whatsappMsg}`;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-dark-bg text-white p-4 z-50 overflow-auto glow-border md:w-96">
      <button onClick={toggleCart} className="mb-4">Cerrar ✖</button>
      <h2 className="text-xl mb-4">Carrito</h2>
      {cart.map(item => (
        <div key={item.id} className="flex justify-between mb-4 border-b pb-2">
          <div>
            <p>{item.product.name}</p>
            <p>${item.price} x {item.qty}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => updateQty(item.id, -1)}>-</button>
            <button onClick={() => updateQty(item.id, 1)}>+</button>
            <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
          </div>
        </div>
      ))}
      <input value={code} onChange={e => setCode(e.target.value)} placeholder="Cupón" className="p-2 bg-dark-input w-full" />
      <button onClick={() => applyCoupon(code)} className="mt-2 bg-neon-purple p-2 w-full rounded glow-hover">Aplicar</button>
      <h3 className="mt-4 text-lg">Subtotal: ${total}</h3>
      <a href={whatsappLink} target="_blank" className="block mt-4 bg-neon-green p-2 rounded text-center glow-hover">Checkout WhatsApp</a>
    </div>
  );
}