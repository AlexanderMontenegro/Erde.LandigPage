import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Success from './pages/Success.jsx'
import Failure from './pages/Failure.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import { ToastContainer } from 'react-toastify'        // ← NUEVO
import 'react-toastify/dist/ReactToastify.css'         // ← NUEVO (estilos obligatorios)
import './styles/theme.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      {/* Contenedor global de notificaciones (siempre visible) */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"  // combina con tu tema oscuro
      />
    </BrowserRouter>
  </React.StrictMode>,
)