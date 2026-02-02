import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CartFloating from "./components/CartFloating";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      {/* 🛒 Siempre visible */}
      <CartFloating />
    </>
  );
}
