import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="auth-container">
        <h1 className="auth-title">Iniciar Sesión</h1>

        <form className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="auth-input"
            required
          />
          <button type="submit" className="auth-btn">
            Entrar
          </button>
        </form>

        <div className="auth-toggle">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-accent-blue hover:underline">
            Registrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}