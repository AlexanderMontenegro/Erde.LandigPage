import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './styles/theme.css'
import Login from './pages/Login.jsx' // Crea esta página después

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        {/* Agrega /register cuando lo tengas */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)