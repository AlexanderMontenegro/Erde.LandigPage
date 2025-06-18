import "../styles/header.css";
import React from "react";
export default function Header() {
  return (
    <header style={{ textAlign: 'center', padding: '2rem', background: '#fff0f5' }}>
      <img src="/LOGO2.png" alt="ERDE Logo" style={{ width: '150px' }} />
      <h1 style={{ fontSize: '2.5rem', color: '#d72638' }}>ERDE Diseño & Creación</h1>
      <p style={{ fontStyle: 'italic', color: '#276fbf' }}>Personalizando tu vida</p>
    </header>
  );
}
