import useProductStore from '../store/productStore.js';

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, removeFromCart, updateQty, getTotalItems, getTotalPrice } = useProductStore();

  if (!cartOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      <div className="cart-drawer-backdrop" onClick={toggleCart} />

      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">Mi carrito ({totalItems})</h2>
          <button className="cart-close-btn" onClick={toggleCart}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>${item.basePrice.toLocaleString('es-AR')} x {item.qty}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQty(item.id, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                    <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="cart-total-price">${totalPrice}</span>
            </div>
            <button className="btn-checkout">Iniciar compra</button>
          </div>
        )}
      </div>
    </>
  );
}