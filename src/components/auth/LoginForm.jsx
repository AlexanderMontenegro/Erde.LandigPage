import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        className="input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn w-full">Ingresar</button>
    </form>
  );
}
