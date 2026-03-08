# ERDE Store - Personalizados en 3D

ERDE Store es una tienda online especializada en **productos personalizados mediante impresión 3D**, regalos únicos y artículos exclusivos. El proyecto combina un frontend moderno con diseño atractivo y un backend ligero para procesar pagos reales mediante **Mercado Pago**.

Sitio en producción:  
🌐 https://erde-landigpage-frontend.onrender.com

## Características principales

- Catálogo de productos con filtros por categoría
- Sección de **Ofertas Especiales** (productos destacados seleccionados desde el panel admin)
- Carrusel automático continuo de imágenes destacadas en la página principal
- Sistema de carrito de compras con validación de stock en tiempo real
- Integración completa de pagos con **Mercado Pago** (producción)
- Autenticación con email/password y Google (Firebase Auth)
- Perfil de usuario con favoritos, historial de compras y edición de datos
- Panel administrativo protegido (solo rol "admin") con:
  - Gestión completa de productos (CRUD + stock + destacado)
  - Gestión de usuarios (roles, activo/inactivo)
- Botones flotantes: carrito, admin (solo admins), WhatsApp con tooltip
- Menú móvil responsive con diseño elegante
- Animaciones suaves en favoritos (corazón pop)
- Modal de perfil con carga automática de datos del usuario
- Diseño dark theme moderno y responsive

## Tecnologías utilizadas

### Frontend
- React 18/19 + Vite (build rápido y moderno)
- React Router v6 (enrutamiento)
- Zustand (gestión de estado ligera)
- Material-UI (MUI) v5 (componentes y estilos)
- Firebase (Auth + Firestore)
- Mercado Pago SDK React (botón Wallet)

### Backend (pagos)
- Node.js + Express (servicio ligero)
- Mercado Pago SDK Node.js (creación de preferencias)

### Base de datos
- Firestore (productos y usuarios)

### Despliegue
- Frontend: Render (Static Site)
- Backend: Render (Web Service)

### Estilos
- CSS puro + variables en `theme.css` (dark theme)

## Estructura del proyecto
