import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form.email, form.password, {
      name: form.name,
      phone: form.phone,
      address: form.address,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>

      <input name="name" placeholder="Nombre completo" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
      <input name="phone" placeholder="Teléfono" onChange={handleChange} />
      <input name="address" placeholder="Dirección de envío" onChange={handleChange} />

      <button>Crear cuenta</button>
    </form>
  );
}
