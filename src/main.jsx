import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Success from './pages/Success.jsx'
import Failure from './pages/Failure.jsx'
import './styles/theme.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
        {/* Puedes agregar /pending si quieres */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)