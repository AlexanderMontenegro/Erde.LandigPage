import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore.js';
import useProductStore from '../store/productStore.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ProfileModal() {
  const { user, isProfileModalOpen, toggleProfileModal, updateUser, addFavorite, removeFavorite, error } = useAuthStore();
  const { products } = useProductStore();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [apellido, setApellido] = useState(user?.apellido || '');
  const [direccion, setDireccion] = useState(user?.direccion || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [email, setEmail] = useState(user?.email || '');
  const [imagen, setImagen] = useState(user?.imagen || '');
  const [orders, setOrders] = useState([]);
  const favorites = user?.favorites || [];

  useEffect(() => {
    if (isProfileModalOpen && user) {
      const fetchOrders = async () => {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
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
      // Error manejado en store
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

  // Imágenes predefinidas en src/img/Usuarios/
  const predefinedImages = [
    "/src/img/Usuarios/U1.jpg",
    "/src/img/Usuarios/U2.jpg",
    "/src/img/Usuarios/U3.jpg", 
    "/src/img/Usuarios/U4.jpg",
    

   
  ];

  if (!isProfileModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggleProfileModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={toggleProfileModal}>×</button>

        <h1 className="modal-title">Mi Perfil</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="auth-input" required />
          <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} className="auth-input" required />
          <input type="text" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} className="auth-input" required />
          <input type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} className="auth-input" required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="auth-input" required />

          <div className="mt-4">
            <label className="block text-text-muted mb-2">Imagen de perfil</label>
            <div className="grid grid-cols-3 gap-4">
              {predefinedImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImagen(imgSrc)}
                  className={`border-2 rounded-lg overflow-hidden ${imagen === imgSrc ? 'border-neon-green' : 'border-transparent'}`}
                >
                  <img src={imgSrc} alt={`Perfil ${idx + 1}`} className="u w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-6">
            Guardar Cambios
          </button>
        </form>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-neon-green">Historial de Compras</h2>
        {orders.length === 0 ? (
          <p className="text-text-muted">No hay compras realizadas</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-input p-4 rounded-lg mb-4">
              <p>Orden ID: {order.id}</p>
              <p>Total: ${order.total.toLocaleString('es-AR')}</p>
              <p>Fecha: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
            </div>
          ))
        )}

        <h2 className="text-2xl font-bold mt-8 mb-4 text-neon-green">Favoritos</h2>
        {favorites.length === 0 ? (
          <p className="text-text-muted">No hay favoritos</p>
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