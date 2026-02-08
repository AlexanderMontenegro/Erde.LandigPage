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
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-green-400">Productos ERDE Personalizados</h1>

      {products.length === 0 ? (
        <p className="text-center text-xl">Cargando productos... o no hay productos en Firestore.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <ProductModal />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}