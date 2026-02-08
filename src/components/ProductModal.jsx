import useProductStore from '../store/productStore.js';

export default function ProductModal() {
  const { selectedProduct, isModalOpen, closeModal, addToCart } = useProductStore();

  if (!isModalOpen || !selectedProduct) return null;

  const handleAdd = () => {
    addToCart(selectedProduct);
  };

  const whatsappMsg = encodeURIComponent(
    `Hola! Quiero: ${selectedProduct.name}\nPrecio: $${selectedProduct.basePrice.toLocaleString('es-AR')}\nDescripción: ${selectedProduct.description || 'N/A'}`
  );
  const whatsappLink = `https://wa.me/549TU_NUMERO?text=${whatsappMsg}`;

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
            />
          </div>

          <div className="modal-info-container">
            <h1 className="modal-title">{selectedProduct.name}</h1>

            <p className="modal-description">{selectedProduct.description || 'Sin descripción disponible'}</p>

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