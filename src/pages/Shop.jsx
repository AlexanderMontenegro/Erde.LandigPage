import ProductList from "../components/ProductList";
import Cart from "../components/Cart";

export default function Shop() {
  return (
    <div className="min-h-screen bg-black p-6 grid md:grid-cols-4 gap-6">
      <div className="md:col-span-3">
        <ProductList />
      </div>

      <Cart />
    </div>
  );
}
