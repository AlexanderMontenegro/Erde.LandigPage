export default function ProductModal({ product, onClose }) {
  if (!product) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-zinc-900 text-white p-6 rounded-xl w-[90%] max-w-lg shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl"
        >
          ✕
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-lg mb-4"
        />

        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <p className="text-sm opacity-80 mb-4">{product.description}</p>

        <div className="text-lg font-semibold">
          ${product.basePrice}
        </div>
      </div>
    </div>
  )
}
