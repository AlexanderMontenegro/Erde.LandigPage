import { useEffect } from "react";
import { useProductStore } from "../store/productStore";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="catalog">
      <h1>Catálogo</h1>

      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
