import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const google = useAuthStore((s) => s.loginWithGoogle);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2>Iniciar sesión</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={() => login(email, password)}>Ingresar</button>

      <hr />

      <button onClick={google}>Ingresar con Google</button>
    </div>
  );
}
