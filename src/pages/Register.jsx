import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const { registerWithEmail, loginWithGoogle, user, loading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerWithEmail(email, password, nombre, apellido, direccion, telefono);
    } catch (err) {
      // Error ya está en el store
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      // Error ya está en el store
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-2xl text-neon-green">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="auth-container">
        <h1 className="auth-title">Crear Cuenta</h1>

        {error && <p className="text-red-500 mb-6 text-center font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="auth-btn">
            Registrarse
          </button>
        </form>

        <div className="my-6 text-center text-text-muted font-medium">o</div>

        <button onClick={handleGoogle} className="w-full bg-accent-blue text-black py-3 rounded-lg font-bold hover:bg-opacity-90 transition">
          Registrarse con Google
        </button>

        <p className="text-center text-text-muted mt-8">
          ¿Ya tenés cuenta?{' '}
          <a href="/login" className="text-accent-blue hover:underline font-semibold">
            Iniciá sesión
          </a>
        </p>
      </div>
    </div>
  );
}