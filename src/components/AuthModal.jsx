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
      // Error ya en store
    }
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={toggleAuthModal}
    >
      <div
        className="bg-gray-900 p-6 rounded-xl max-w-md w-full relative border border-green-600/30"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={toggleAuthModal}
          className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-green-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                required={!isLogin}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={e => setApellido(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-green-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                required={!isLogin}
              />
              <input
                type="text"
                placeholder="Dirección"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-green-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                required={!isLogin}
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-green-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                required={!isLogin}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-green-700 rounded-lg text-white focus:outline-none focus:border-green-400"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-green-700 rounded-lg text-white focus:outline-none focus:border-green-400"
            required
          />

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold text-white">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">o</div>

        <button onClick={handleGoogle} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2">
          <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.422-5.445,3.422c-3.332,0-6.033-2.701-6.033-6.033 s2.701-6.033,6.033-6.033c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.556,15.032,1,12.545,1 C7.021,1,2.543,5.477,2.543,11s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.972l-9.426-0.789z"/>
          </svg>
          Continuar con Google
        </button>

        <p className="text-center mt-4 text-gray-400">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-green-400 hover:underline">
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}