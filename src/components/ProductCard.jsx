import useProductStore from '../store/productStore.js';

export default function ProductCard({ product }) {
  const openModal = useProductStore(s => s.openModal);

  return (
    <div onClick={() => openModal(product)} className="cursor-pointer">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
      <h3 className="font-bold">{product.name}</h3>
      <p>${product.basePrice}</p>
    </div>
  );
}