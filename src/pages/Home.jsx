import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useProductStore } from "../store/productStore";

export default function Home() {
  const products = useProductStore((s) => s.products);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          padding: "20px",
        }}
      >
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onSelect={setSelectedProduct}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
