import { useState } from 'react';
import useAuthStore from '../store/authStore.js';

export default function AuthModal() {
  const { isAuthModalOpen, toggleAuthModal, registerWithEmail, loginWithEmail, loginWithGoogle, error } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, nombre, apellido, direccion, telefono);
      }
    } catch (err) {
      // Error ya manejado en store
    }
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="modal-overlay" onClick={toggleAuthModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={toggleAuthModal}>×</button>

        <h2 className="modal-title text-center">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>

        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="auth-input"
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={e => setApellido(e.target.value)}
                className="auth-input"
                required
              />
              <input
                type="text"
                placeholder="Dirección"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                className="auth-input"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                className="auth-input"
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-input"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          <button type="submit" className="btn btn-primary w-full py-3">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>


        <button onClick={handleGoogle} className="btn btn-outline w-full py-3">
          Continuar con Google
        </button>

        <p className="text-center mt-6 text-text-muted">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-accent-blue hover:underline font-semibold">
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}