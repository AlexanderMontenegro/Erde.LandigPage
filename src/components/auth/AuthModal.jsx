import { useAuthStore } from "../../store/authStore";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal() {
  const {
    showAuthModal,
    closeAuthModal,
    authMode,
  } = useAuthStore();

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 text-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={closeAuthModal}
          className="absolute top-2 right-2 text-zinc-400 hover:text-white"
        >
          ✖
        </button>

        {authMode === "login" ? <LoginForm /> : <RegisterForm />}

        <div className="mt-4 text-center text-sm text-zinc-400">
          {authMode === "login" ? (
            <>
              ¿No tenés cuenta?{" "}
              <button
                className="text-purple-400"
                onClick={() =>
                  useAuthStore.getState().setAuthMode("register")
                }
              >
                Registrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tenés cuenta?{" "}
              <button
                className="text-purple-400"
                onClick={() =>
                  useAuthStore.getState().setAuthMode("login")
                }
              >
                Ingresar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
