import { useState } from 'react';
import useProductStore from '../store/productStore.js';

export default function ProductModal() {
  const { selectedProduct, closeModal, addToCart } = useProductStore();

  // TODOS LOS HOOKS SIEMPRE PRIMERO - sin if/return antes
  const [currentImage, setCurrentImage] = useState(0);

  // Lógica de inicialización (no es hook)
  const variants = selectedProduct?.variants || {};
  const initialSelections = {};
  Object.keys(variants).forEach(key => {
    const value = variants[key];
    if (Array.isArray(value) && value.length > 0) {
      initialSelections[key] = value[0];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const firstKey = Object.keys(value)[0];
      initialSelections[key] = firstKey || '';
    }
  });

  const [selectedVariants, setSelectedVariants] = useState(initialSelections);

  // AHORA sí chequeamos si hay producto (después de hooks)
  if (!selectedProduct) {
    return null;
  }

  // Precio dinámico
  let displayPrice = Number(selectedProduct.basePrice) || 0;
  const materialOptions = variants.material || {};
  const selectedMaterial = selectedVariants.material || '';

  if (selectedMaterial) {
    if (selectedMaterial.toUpperCase().includes('PLA')) {
      displayPrice = Number(selectedProduct.basePrice);
    } else if (materialOptions[selectedMaterial] !== undefined) {
      displayPrice = Number(materialOptions[selectedMaterial]);
    }
  }

  // Detectar "a cotizar"
  const isCotizar = Object.values(selectedVariants).some(val =>
    String(val).toLowerCase().includes('a cotizar')
  );

  const handleVariantChange = (key, value) => {
    setSelectedVariants(prev => ({ ...prev, [key]: value }));
  };

  const variantsText = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ') || 'Sin variantes';

  const whatsappMsg = encodeURIComponent(
    isCotizar
      ? `¡Hola! Quiero cotizar: ${selectedProduct.name}\nVariantes: ${variantsText}\nPrecio base: $${selectedProduct.basePrice || 'N/A'}\nDescripción: ${selectedProduct.description || 'N/A'}`
      : `¡Hola! Quiero comprar: ${selectedProduct.name}\nVariantes: ${variantsText}\nPrecio: $${displayPrice}\nDescripción: ${selectedProduct.description || 'N/A'}`
  );
  const whatsappLink = `https://wa.me/549TU_NUMERO_REAL?text=${whatsappMsg}`; // CAMBIA ESTO

  const images = selectedProduct.images || [selectedProduct.image || 'https://via.placeholder.com/400?text=Sin+Imagen'];
  const videos = selectedProduct.videos || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative glow-border">
        <button
          onClick={closeModal}
          className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-red-500"
        >
          ×
        </button>

        {/* Galería */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Mini ${idx + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${
                  currentImage === idx ? 'border-green-400' : 'border-transparent'
                } hover:border-green-400`}
                onClick={() => setCurrentImage(idx)}
              />
            ))}
          </div>
          <img
            src={images[currentImage]}
            alt={selectedProduct.name}
            className="flex-1 max-h-80 object-contain rounded-lg bg-black/30"
          />
        </div>

        {videos.length > 0 && <video src={videos[0]} controls className="w-full rounded-lg mb-6" />}

        <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
        <p className="text-gray-400 mb-4">{selectedProduct.description || 'Sin descripción disponible'}</p>

        <div className="text-3xl font-bold text-green-400 mb-6">
          ${displayPrice.toLocaleString('es-AR')}
        </div>

        {Object.keys(variants).length > 0 && (
          <div className="space-y-5 mb-8">
            {Object.entries(variants).map(([key, options]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-2 capitalize text-gray-300">
                  {key}
                </label>
                <select
                  value={selectedVariants[key] || ''}
                  onChange={e => handleVariantChange(key, e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-green-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  {Array.isArray(options) &&
                    options.map(opt => <option key={opt} value={opt}>{opt}</option>)}

                  {typeof options === 'object' && options !== null && !Array.isArray(options) &&
                    Object.entries(options).map(([optKey, val]) => (
                      <option key={optKey} value={optKey}>
                        {optKey} — ${Number(val).toLocaleString('es-AR')}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {isCotizar ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-orange-600 hover:bg-orange-700 py-4 px-6 rounded-lg text-center font-bold text-white"
            >
              Cotizar por WhatsApp
            </a>
          ) : (
            <>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-700 py-4 px-6 rounded-lg text-center font-bold text-white"
              >
                Comprar por WhatsApp
              </a>
              <button
                onClick={() => addToCart(selectedProduct, selectedVariants, displayPrice)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-4 px-6 rounded-lg font-bold text-white"
              >
                Agregar al carrito
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}