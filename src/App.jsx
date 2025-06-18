import React from "react";
import Header from "./components/Header";
import Nosotros from "./components/Nosotros";
import Servicios from "./components/Servicios";
import InstagramWidget from "./components/InstagramWidget";
import Contacto from "./components/Contacto";

function App() {
  return (
    <main>
      <Header />
      <div style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
        <div style={{ flex: 1 }}>
          <Nosotros />
          <Servicios />
          <Contacto />
        </div>
        <InstagramWidget />
      </div>
    </main>
  );
}

export default App;
