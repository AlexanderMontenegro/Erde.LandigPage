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
    <div className="min-h-screen bg-bg p-6 relative">
      <h1 className="text-4xl font-bold text-center mb-12 text-neon-green">
        Productos Personalizados 3D - ERDE
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-xl text-text-muted">Cargando productos...</p>
      ) : (
        <div className="grid-products">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Componentes emergentes */}
      <ProductModal />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}