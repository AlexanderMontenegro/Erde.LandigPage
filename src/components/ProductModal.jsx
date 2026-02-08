import useProductStore from '../store/productStore.js';

export default function ProductModal() {
  const { selectedProduct, closeModal } = useProductStore();

  if (!selectedProduct) return null;

  const whatsappMsg = encodeURIComponent(
    `Hola! Estoy interesado en: ${selectedProduct.name}\n` +
    `Precio: $${selectedProduct.basePrice}\n` +
    `Descripción: ${selectedProduct.description || 'Sin descripción'}`
  );
  const whatsappLink = `https://wa.me/549TU_NUMERO?text=${whatsappMsg}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-white"
        >
          ×
        </button>

        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          className="w-full h-80 object-cover rounded-t-xl"
        />

        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
          <p className="text-gray-300 mb-6">{selectedProduct.description}</p>

          <div className="flex items-center justify-between mb-6">
            <span className="text-4xl font-bold text-green-400">
              ${selectedProduct.basePrice.toLocaleString('es-AR')}
            </span>
            <span className="text-lg text-gray-400">Stock: {selectedProduct.stock}</span>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-lg font-bold text-lg transition-colors"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}