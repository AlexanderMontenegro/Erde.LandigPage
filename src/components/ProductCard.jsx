import useProductStore from '../store/productStore.js';

export default function ProductCard({ product }) {
  const openModal = useProductStore(s => s.openModal);

  return (
    <div className="product-card glow-border hover:glow-hover" onClick={() => openModal(product)}>
      <img src={product.image} alt={product.name} className="product-img" style={{ height: '260px', objectFit: 'contain' }} />
      <h3 className="text-lg font-bold">{product.name}</h3>
      <p className="price">${product.basePrice}</p>
      {product.discount > 0 && <span className="badge-oferta">OFERTA</span>}
    </div>
  );
}