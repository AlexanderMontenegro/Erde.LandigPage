import { useEffect } from "react";
import useProductStore from "../store/productStore";
import ProductCard from "../components/products/ProductCard";

export default function Home() {
  const { products, loadProducts, loading } = useProductStore();

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Productos</h1>

      {products.length === 0 && <p>No hay productos disponibles</p>}

      <div style={{ display: "grid", gap: "16px" }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
