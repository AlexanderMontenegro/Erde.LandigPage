
import { useState, useEffect } from "react";
import "./styles/app.css";
import Header from "./components/Header";
import Nosotros from "./components/Nosotros";
import Servicios from "./components/Servicios";
import InstagramWidget from "./components/InstagramWidget";
import Contacto from "./components/Contacto";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      <nav className="navbar">
        <div>
          <a href="#nosotros">Nosotros</a>
          <a href="#servicios">Servicios</a>
          <a href="#instagram">Instagram</a>
          <a href="#contacto">Contacto</a>
          <a href="https://www.mercadolibre.com.ar/perfil/ALEXANDERMONTENEGRO9106" target="_blank" rel="noopener noreferrer">
            Tienda ML
          </a>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </nav>

      <main>
        <Header />
        <section id="nosotros"><Nosotros /></section>
        <section id="servicios"><Servicios /></section>
        <section id="instagram"><InstagramWidget /></section>
        <section id="contacto"><Contacto /></section>

        <a
          href="https://wa.me/5491165487034"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#25D366',
            color: 'white',
            padding: '15px',
            borderRadius: '50%',
            fontSize: '24px',
            textAlign: 'center',
            zIndex: 1000,
            textDecoration: 'none',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
          aria-label="WhatsApp"
        >
          🟢
        </a>
      </main>
    </>
  );
}

export default App;
