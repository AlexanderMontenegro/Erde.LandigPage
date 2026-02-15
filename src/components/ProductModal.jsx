import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore.js';
import useProductStore from '../store/productStore.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ProfileModal() {
  const { user, isProfileModalOpen, toggleProfileModal, updateUser, addFavorite, removeFavorite, error } = useAuthStore();
  const { products } = useProductStore();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [imagen, setImagen] = useState('');
  const [orders, setOrders] = useState([]);
  const favorites = user?.favorites || [];

  // Sincronizar estados con user cada vez que cambie
  useEffect(() => {
    if (user) {
      setNombre(user.nombre || '');
      setApellido(user.apellido || '');
      setDireccion(user.direccion || '');
      setTelefono(user.telefono || '');
      setEmail(user.email || '');
      setImagen(user.imagen || '');
    }
  }, [user]);

  useEffect(() => {
    if (isProfileModalOpen && user) {
      const fetchOrders = async () => {
        try {
          const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersData);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setOrders([]);
        }
      };
      fetchOrders();
    }
  }, [isProfileModalOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ nombre, apellido, direccion, telefono, email, imagen });
      toggleProfileModal();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const isFavorite = (productId) => favorites.includes(productId);

  const handleFavorite = (productId) => {
    if (isFavorite(productId)) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  };

  // Imágenes predefinidas – ruta desde public/img/Usuarios
  const predefinedImages = [
    '/img/Usuarios/U1.jpg',
    '/img/Usuarios/U2.jpg',
    '/img/Usuarios/U3.jpg',
    // Agrega más si tienes
  ];

  if (!isProfileModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggleProfileModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={toggleProfileModal}>×</button>

        <h1 className="modal-title text-center">Mi Perfil</h1>

        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />

          <div className="mt-6">
            <label className="block text-text-muted mb-3 text-center font-medium">Imagen de perfil</label>
            <div className="grid grid-cols-3 gap-4 justify-items-center">
              {predefinedImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImagen(imgSrc)}
                  className={`border-2 rounded-full overflow-hidden w-24 h-24 transition-all duration-300 ${imagen === imgSrc ? 'border-neon-green shadow-glow-green scale-110' : 'border-transparent hover:border-neon-green hover:shadow-glow-green'}`}
                >
                  <img
                    src={imgSrc}
                    alt={`Perfil ${idx + 1}`}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => (e.target.src = 'https://placehold.co/96x96?text=Imagen')}
                  />
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full py-4 mt-6 font-bold">
            Guardar Cambios
          </button>
        </form>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-neon-green">Historial de Compras</h2>
        {orders.length === 0 ? (
          <p className="text-text-muted text-center">No hay compras realizadas</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-input p-4 rounded-lg mb-4">
              <p className="font-medium">Orden ID: {order.id}</p>
              <p>Total: ${order.total.toLocaleString('es-AR')}</p>
              <p>Fecha: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
            </div>
          ))
        )}

        <h2 className="text-2xl font-bold mt-8 mb-4 text-neon-green">Favoritos</h2>
        {favorites.length === 0 ? (
          <p className="text-text-muted text-center">No hay favoritos</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map(productId => {
              const product = products.find(p => p.id === productId);
              if (!product) return null;
              return (
                <div key={productId} className="flex gap-4 bg-input p-4 rounded-lg">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-price">${product.basePrice.toLocaleString('es-AR')}</p>
                    <button onClick={() => handleFavorite(productId)} className="text-red-400 text-sm mt-2">
                      Eliminar de favoritos
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}