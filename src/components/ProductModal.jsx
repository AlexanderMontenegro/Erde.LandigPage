import useProductStore from '../store/productStore.js';
import useAuthStore from '../store/authStore.js';
import Typography from '@mui/material/Typography';

export default function ProductModal() {
  const { selectedProduct, isModalOpen, closeModal, addToCart } = useProductStore();
  const { user, toggleAuthModal } = useAuthStore();

  if (!isModalOpen || !selectedProduct) return null;

  const handleAdd = () => {
    if (!user) {
      toggleAuthModal();
      return;
    }
    addToCart(selectedProduct);
  };

  const whatsappMsg = encodeURIComponent(
    `Hola! Estoy interesado en: ${selectedProduct.name}\n` +
    `Precio: $${(selectedProduct.pricing?.basePrice || selectedProduct.basePrice || 0).toLocaleString('es-AR')}\n` +
    `Descripción: ${selectedProduct.description || 'N/A'}`
  );
  const whatsappLink = `https://wa.me/5491170504193?text=${whatsappMsg}`;

  const name = selectedProduct.name || 'Sin nombre';
  const category = selectedProduct.category || 'Sin categoría';
  const description = selectedProduct.description || 'Sin descripción disponible';
  
  const basePrice = selectedProduct.pricing?.basePrice || selectedProduct.basePrice || 0;
  const currency = selectedProduct.pricing?.currency || 'ARS';

  const stockRaw = selectedProduct.stock ?? 
                   selectedProduct.pricing?.stock ?? 
                   selectedProduct.inventory?.stock ?? 0;
  const stock = Number(stockRaw) || 0;

  const image = selectedProduct.media?.image || selectedProduct.image || 'https://via.placeholder.com/600?text=Sin+Imagen';
  const videoUrl = selectedProduct.media?.video || selectedProduct.video || '';

  let stockClass = 'stock-none';
  let stockText = 'Sin stock disponible';
  if (stock > 0) {
    stockClass = stock <= 5 ? 'stock-low' : 'stock-available';
    stockText = `${stock} unidades disponibles`;
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeModal}>×</button>

        <div className="modal-grid">
          <div className="modal-image-container">
            <img
              src={image}
              alt={name}
              className="modal-main-image"
              onError={e => e.target.src = 'https://via.placeholder.com/600?text=Sin+Imagen'}
            />

            {videoUrl && (
              <div className="modal-video-container" style={{ marginTop: '20px' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Video del producto
                </Typography>
                <iframe
                  width="100%"
                  height="315"
                  src={videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0]}
                  title="Video del producto"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          <div className="modal-info-container">
            <h1 className="modal-title">{name}</h1>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Categoría: {category}
            </Typography>

            <p className="modal-description">
              {description}
            </p>

            <div className="modal-price">
              ${basePrice.toLocaleString('es-AR')} {currency}
            </div>

            <div className={`stock-text ${stockClass}`}>
              Stock: {stockText}
            </div>

            <div className="modal-actions">
              <button className="btn-add-cart" onClick={handleAdd} disabled={stock === 0}>
                {stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>

              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp"
              >
                Comprar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}