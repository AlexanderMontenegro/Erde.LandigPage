import { useEffect } from 'react';
import useProductStore from '../store/productStore.js'; // Sin llaves
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import FloatingCartButton from '../components/FloatingCartButton.jsx';

export default function Home() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Promo products (assume discount > 0 or active promo field)
  const promoProducts = products.filter(p => p.discount > 0);

  return (
    <div className="container mx-auto p-4">
      {/* Mini-banner promociones */}
      <section id="promociones" className="mb-8">
        <div className="bg-neon-purple p-4 rounded-lg text-center glow-border">
          <h2 className="text-2xl font-bold text-white">¡Ofertas Especiales!</h2>
          <p className="text-lg">Descuentos en productos gamer/otaku</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {promoProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Catálogo principal */}
      <section id="productos">
        <h1 className="text-3xl font-bold mb-6 text-neon-green">Catálogo Gamer/Otaku</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Quienes Somos */}
      <section id="quienes-somos" className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-neon-blue">¿Quiénes Somos?</h2>
        <p className="text-lg text-gray-300">Somos una tienda de productos impresos en 3D inspirados en gaming y anime. Personaliza tu setup otaku!</p>
      </section>

      {/* Contacto */}
      <section id="contacto" className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-neon-pink">Contacto</h2>
        <form className="flex flex-col gap-4 max-w-md">
          <input type="text" placeholder="Nombre" className="p-2 bg-dark-input border border-neon-green rounded" />
          <input type="email" placeholder="Email" className="p-2 bg-dark-input border border-neon-green rounded" />
          <textarea placeholder="Mensaje" className="p-2 bg-dark-input border border-neon-green rounded" />
          <button type="submit" className="bg-neon-green p-2 rounded glow-hover text-black font-bold">Enviar</button>
        </form>
      </section>

      <ProductModal />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}