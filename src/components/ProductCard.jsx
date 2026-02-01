import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const outOfStock = selectedVariant.stock === 0;

  const handleAdd = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    addToCart(product, selectedVariant);
  };

  return (
    <div className="bg-zinc-900 text-white rounded-xl p-4 shadow-lg">
      <img src={product.image} alt={product.name} className="rounded mb-3" />

      <h2 className="text-xl font-bold">{product.name}</h2>

      <select
        className="w-full mt-2 bg-zinc-800 p-2 rounded"
        onChange={(e) =>
          setSelectedVariant(product.variants[e.target.value])
        }
      >
        {product.variants.map((v, i) => (
          <option key={i} value={i}>
            {v.material} | {v.color} | {v.quality}
          </option>
        ))}
      </select>

      <p className="mt-2">💰 ${selectedVariant.price}</p>

      <p
        className={`mt-1 text-sm ${
          outOfStock ? "text-red-500" : "text-green-400"
        }`}
      >
        {outOfStock ? "Sin stock" : `Stock: ${selectedVariant.stock}`}
      </p>

      <button
        disabled={outOfStock}
        onClick={handleAdd}
        className={`w-full mt-3 py-2 rounded ${
          outOfStock
            ? "bg-zinc-700 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        🛒 Agregar al carrito
      </button>
    </div>
  );
}
