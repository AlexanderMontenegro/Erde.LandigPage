import { useEffect } from "react";
import useProductStore from "../store/productStore";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products, loadProducts, loading } = useProductStore();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return <p style={{ padding: 20 }}>Cargando productos...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Productos</h1>

      {products.length === 0 && (
        <p>No hay productos disponibles</p>
      )}

      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
