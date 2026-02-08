import useProductStore from '../store/productStore.js';

export default function ProductModal() {
  const { selectedProduct, isModalOpen, closeModal, addToCart } = useProductStore();

  if (!isModalOpen || !selectedProduct) return null;

  const handleAdd = () => {
    addToCart(selectedProduct);
    // NO cerramos automáticamente → queda abierto hasta que el usuario cierre manualmente
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
      onClick={closeModal}
    >
      <div
        className="bg-dark-card p-8 rounded-xl max-w-lg w-full relative glow-border"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={closeModal} className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-white">✖</button>

        <h2 className="text-3xl font-bold mb-4 text-neon-green">{selectedProduct.name}</h2>

        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          className="w-full h-64 object-contain mb-6 rounded-lg"
        />

        <p className="text-gray-300 mb-6">{selectedProduct.description}</p>

        <p className="text-4xl font-bold text-neon-green mb-8">
          ${selectedProduct.basePrice.toLocaleString('es-AR')}
        </p>

        <div className="flex gap-4">
          <button onClick={handleAdd} className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-bold">
            Agregar al carrito
          </button>
          <a
            href={`https://wa.me/549TU_NUMERO?text=Hola!%20Quiero%20${encodeURIComponent(selectedProduct.name)}`}
            target="_blank"
            className="flex-1 bg-green-600 hover:bg-green-700 py-4 rounded-lg font-bold text-center"
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}