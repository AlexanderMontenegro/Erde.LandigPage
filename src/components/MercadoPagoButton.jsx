import React, { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);

export default function MercadoPagoButton({ item }) {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    async function createPreference() {
      const res = await fetch("http://localhost:5000/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      setPreferenceId(data.id);
    }
    createPreference();
  }, []);

  if (!preferenceId) return <p>Cargando pago…</p>;

  return (
    <div>
      <Wallet initialization={{ preferenceId }} />
    </div>
  );
}S