import { useEffect, useState } from 'react';
import useProductStore from '../store/productStore.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import FloatingCartButton from '../components/FloatingCartButton.jsx';

export default function Home() {
  const { products, fetchProducts } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('todos');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (categoryFilter === 'todos') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category?.toLowerCase() === categoryFilter.toLowerCase()));
    }
  }, [products, categoryFilter]);

  const categories = ['todos', ...new Set(products.map(p => p.category || 'Otros'))];

  // Productos en oferta (ejemplo: precio < 20000 o campo 'offer' true)
  const offers = products.filter(p => p.basePrice < 20000 || p.offer);

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero - Inicio */}
      <section className="hero">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="hero-title">
            ¡Personaliza tu mundo con impresión 3D!
          </h1>
          <p className="hero-subtitle">
            Soportes gamer, figuras otaku, accesorios únicos – hechos a tu medida en Merlo, Buenos Aires
          </p>
          <div className="hero-cta">
            <a href="#productos" className="btn btn-primary text-lg px-10 py-5">
              Ver Catálogo
            </a>
            <a
              href="https://wa.me/549TU_NUMERO?text=Hola!%20Quiero%20consultar%20por%20un%20producto%20personalizado"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline text-lg px-10 py-5 ml-6"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Ofertas destacadas */}
      {offers.length > 0 && (
        <section className="offers-section">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="offers-title">Ofertas Especiales</h2>
            <div className="grid-products">
              {offers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo de productos con filtro */}
      <section id="productos" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-neon-green">
          Catálogo de Productos
        </h2>

        <div className="filter-container">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-xl text-text-muted py-20">
            No hay productos en esta categoría
          </p>
        ) : (
          <div className="grid-products">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Contacto */}
      <section id="contacto" className="contact-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="contact-title">Contactanos</h2>
          <p className="contact-subtitle">
            ¿Querés un diseño personalizado o tenés dudas? Escribinos y te respondemos en minutos.
          </p>

          <form className="contact-form">
            <input type="text" placeholder="Nombre" className="contact-input" required />
            <input type="email" placeholder="Email" className="contact-input" required />
            <textarea placeholder="Mensaje" rows="5" className="contact-textarea" required></textarea>
            <button type="submit" className="contact-btn">
              Enviar mensaje
            </button>
          </form>

          <div className="mt-12">
            <p className="text-lg mb-4">O escribinos directamente:</p>
            <a
              href="https://wa.me/549TU_NUMERO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl text-white text-xl font-bold transition"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 2.14.7 4.11 1.88 5.71L2 22l4.29-1.88C7.89 21.3 9.86 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm.71 14.93c-1.48 0-2.92-.4-4.18-1.16l-.3-.18-3.12 1.37 1.37-3.12-.18-.3c-.76-1.26-1.16-2.7-1.16-4.18 0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Componentes emergentes */}
      <ProductModal />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}