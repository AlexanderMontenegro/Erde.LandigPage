import useProductStore from '../store/productStore.js';

export default function ProductModal() {
  const { selectedProduct, closeModal, addToCart } = useProductStore();

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={closeModal}>
      <div className="relative bg-zinc-900 text-white p-6 rounded-xl w-[90%] max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>

        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-white text-xl"
        >
          X
        </button>

        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          className="w-full rounded-lg mb-4"
        />

        <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
        <p className="text-sm opacity-80 mb-4">{selectedProduct.description}</p>

        <div className="text-lg font-semibold mb-4">
          ${selectedProduct.basePrice}
        </div>

        <button
          onClick={() => addToCart(selectedProduct)}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-bold"
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}