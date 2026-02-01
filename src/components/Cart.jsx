import { useCartStore } from "../store/cartStore";

export default function Cart() {
  const { items, removeFromCart } = useCartStore();

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-3">🛒 Carrito</h2>

      {items.length === 0 && (
        <p className="text-zinc-400">Carrito vacío</p>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center mb-2"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-zinc-400">
              {item.variant.material} | {item.variant.color}
            </p>
            <p>x{item.quantity}</p>
          </div>

          <button
            onClick={() => removeFromCart(index)}
            className="text-red-500"
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
}
