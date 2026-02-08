import { useEffect } from 'react';
import useProductStore from '../store/productStore.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import FloatingCartButton from '../components/FloatingCartButton.jsx';

export default function Home() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
      <ProductModal />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}