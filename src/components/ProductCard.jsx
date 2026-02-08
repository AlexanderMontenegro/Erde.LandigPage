import useProductStore from '../store/productStore.js';

export default function ProductCard({ product }) {
  const openModal = useProductStore(s => s.openModal);

  return (
    <div className="product-card bg-dark-card p-4 rounded-lg glow-border hover:glow-hover cursor-pointer" onClick={() => openModal(product)}>
      <img src={product.image} alt={product.name} className="w-full h-64 object-contain mb-4" />
      <h3 className="text-lg font-bold text-white">{product.name}</h3>
      <p className="text-neon-green">${product.basePrice}</p>
      {product.discount > 0 && <span className="badge-oferta bg-neon-pink text-black px-2 py-1 rounded absolute top-2 right-2">OFERTA</span>}
    </div>
  );
}