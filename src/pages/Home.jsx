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

      {/* Contacto en footer */}
      <footer id="contacto" className="footer-contact">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="footer-title">Contactanos</h2>

          <div className="footer-info">
            <div className="footer-item">
              <h4>Dirección</h4>
              <p>Merlo, Buenos Aires, Argentina</p>
            </div>

            <div className="footer-item">
              <h4>WhatsApp</h4>
              <a href="https://wa.me/549TU_NUMERO" target="_blank" rel="noopener noreferrer">
                +54 9 TU_NUMERO
              </a>
            </div>

            <div className="footer-item">
              <h4>Redes Sociales</h4>
              <div className="footer-links">
                <a href="#" className="footer-link">Instagram</a>
                <a href="#" className="footer-link">Facebook</a>
                <a href="#" className="footer-link">YouTube</a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-text-muted">© 2025 ERDE Personalizados - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>

      {/* Componentes emergentes */}
      <ProductModal />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}