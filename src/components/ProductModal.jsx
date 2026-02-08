import { useState } from "react";
import useProductStore from "../store/productStore";

export default function ProductModal() {
  const {
    selectedProduct,
    isModalOpen,
    closeModal,
    addToCart,
  } = useProductStore();

  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  if (!isModalOpen || !selectedProduct) return null;

  const variants = selectedProduct.variants || {};

  const materialOptions = variants.material
    ? Object.keys(variants.material)
    : [];

  const colorOptions = variants.Colores || [];
  const sizeOptions = variants.size || [];

  const price =
    material && variants.material
      ? variants.material[material]
      : selectedProduct.basePrice;

  const handleAdd = () => {
    addToCart(
      selectedProduct,
      { material, color, size },
      price
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-[#111] text-white p-6 rounded-xl w-[700px] relative">

        {/* Cerrar */}
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 neon">
          {selectedProduct.name}
        </h2>

        {/* Imagen */}
        <img
          src={selectedProduct.image}
          className="w-full h-[300px] object-contain mb-4"
        />

        {/* Video opcional */}
        {selectedProduct.video && (
          <video
            src={selectedProduct.video}
            controls
            className="w-full mb-4"
          />
        )}

        {/* Material  
        <div className="mb-3">
          <p>Material</p>
          <select
            onChange={(e) => setMaterial(e.target.value)}
            className="bg-black p-2"
          >
            <option>Seleccionar</option>
            {materialOptions.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div className="mb-3">
          <p>Color</p>
          <select
            onChange={(e) => setColor(e.target.value)}
            className="bg-black p-2"
          >
            <option>Seleccionar</option>
            {colorOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tamaño */}
        <div className="mb-3">
          <p>Tamaño</p>
          <select
            onChange={(e) => setSize(e.target.value)}
            className="bg-black p-2"
          >
            <option>Seleccionar</option>
            {sizeOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <h3 className="text-xl mb-4">
          ${price}
        </h3>

        <button
          onClick={handleAdd}
          className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
