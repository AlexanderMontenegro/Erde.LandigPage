import { useEffect, useState } from "react";
import useProductStore from "../store/productStore.js";
import ProductCard from "../components/ProductCard.jsx";
import ProductModal from "../components/ProductModal.jsx";
import CartDrawer from "../components/CartDrawer.jsx";
import FloatingCartButton from "../components/FloatingCartButton.jsx";

export default function Home() {
  const { products, fetchProducts } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("todos");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (categoryFilter === "todos") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase(),
        ),
      );
    }
  }, [products, categoryFilter]);

  const categories = [
    "todos",
    ...new Set(products.map((p) => p.category || "Otros")),
  ];

  // Cambio mínimo: Ofertas ahora usa el campo 'featured' (seleccionable desde panel admin)
  const offers = products.filter((p) => p.featured === true);

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero - Inicio */}
      <section id="inicio" className="hero">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="hero-title">
            ¡Personaliza tu mundo con impresión 3D!
          </h1>
          <p className="hero-subtitle">
            “Creamos regalos que marcan la diferencia 🎁
Tazas ☕, remeras 👕, buzos 🧥
y productos exclusivos en 3D 🖨️✨”
          </p>
         
        </div>
      </section>

      {/* Ofertas destacadas - solo productos con featured: true */}
      {offers.length > 0 && (
        <section id="ofertas" className="offers-section">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="offers-title">Ofertas Especiales</h2>
            <div className="grid-products">
              {offers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo de productos con filtro (sin cambios) */}
      <section id="productos" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="offers-oferts">
          Catálogo de Productos
        </h2>

        <div className="filter-container">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`filter-btn ${categoryFilter === cat ? "active" : ""}`}
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
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Contacto en footer (sin cambios) */}
      <footer id="contacto" className="footer-contact">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="footer-title">Contactanos</h2>

          <div className="footer-info">
            <div className="footer-item">
              <h4>Dirección</h4>
              <p>
                Benvenuto Cellini 817 Moreno, Buenos Aires, Argentina
                <a
                  href="https://maps.app.goo.gl/mFpqq3vwWo1v9VhB9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/Iconos/ubicaciones.png"
                    alt="Ver ubicación en Maps"
                    className="social-icon"
                  />
                </a>
              </p>
            </div>

            <div className="footer-item">
              <h4>WhatsApp</h4>
              <a
                href="https://wa.me/5491170504193"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/img/Iconos/whatsapp.png"
                  alt="Whatsapp"
                  className="social-icon"
                />
              </a>
            </div>

            <div className="footer-item">
              <h4>Redes Sociales</h4>
              <div className="footer-links">
                <a
                  href="https://www.instagram.com/erde.personalizados/"
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/Iconos/instagram.png"
                    alt="Instagram"
                    className="social-icon"
                  />
                </a>

                <a
                  href="https://www.facebook.com/Erde.Personalizados"
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/Iconos/facebook.png"
                    alt="Facebook"
                    className="social-icon"
                  />
                </a>
                <a
                  href="https://www.tiktok.com/@erde.personalizad"
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/Iconos/tiktok.png"
                    alt="TikTok"
                    className="social-icon"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-text-muted">
              © 2026 ERDE Personalizados - Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* Componentes emergentes (sin cambios) */}
      <ProductModal />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}