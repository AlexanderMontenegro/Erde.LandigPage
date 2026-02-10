import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProductStore from '../store/productStore.js';
import useAuthStore from '../store/authStore.js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Success() {
  const { cart, clearCart } = useProductStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && cart.length > 0) {
      const saveOrder = async () => {
        try {
          await addDoc(collection(db, 'orders'), {
            userId: user.uid,
            items: cart,
            total: cart.reduce((sum, item) => sum + item.basePrice * item.qty, 0),
            createdAt: new Date(),
            status: 'paid',
          });
          clearCart(); // Limpia el carrito después de guardar
        } catch (err) {
          console.error('Error guardando orden:', err);
        }
      };
      saveOrder();
    }
  }, [user, cart, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-bold text-neon-green mb-6">¡Pago Exitoso!</h1>
        <p className="text-xl text-text-muted mb-8">
          Gracias por tu compra. Tu orden ha sido registrada y tu carrito ha sido limpiado.
        </p>
        <a href="/" className="btn btn-primary px-10 py-5 text-xl font-bold">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}