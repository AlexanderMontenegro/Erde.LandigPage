import useProductStore from '../store/productStore.js';
import useAuthStore from '../store/authStore.js';

export default function ProductModal() {
  const { selectedProduct, isModalOpen, closeModal, addToCart } = useProductStore();
  const { user, toggleAuthModal } = useAuthStore();

  if (!isModalOpen || !selectedProduct) return null;

  const handleAdd = () => {
    if (!user) {
      toggleAuthModal(); // Abre modal de auth si no está logueado
      return;
    }
    addToCart(selectedProduct);
  };

  const whatsappMsg = encodeURIComponent(
    `Hola! Estoy interesado en: ${selectedProduct.name}\nPrecio: $${selectedProduct.basePrice.toLocaleString('es-AR')}\nDescripción: ${selectedProduct.description || 'N/A'}`
  );
  const whatsappLink = `https://wa.me/549TU_NUMERO?text=${whatsappMsg}`; // ← CAMBIA TU NÚMERO REAL

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={closeModal}>×</button>

        <div className="modal-grid">
          <div className="modal-image-container">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="modal-main-image"
              onError={e => e.target.src = 'https://via.placeholder.com/600?text=Sin+Imagen'}
            />
          </div>

          <div className="modal-info-container">
            <h1 className="modal-title">{selectedProduct.name}</h1>

            <p className="modal-description">
              {selectedProduct.description || 'Sin descripción disponible'}
            </p>

            <div className="modal-price">
              ${selectedProduct.basePrice.toLocaleString('es-AR')}
            </div>

            <div className="modal-actions">
              <button className="btn-add-cart" onClick={handleAdd}>
                Agregar al carrito
              </button>

              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                Comprar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}