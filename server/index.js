import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

app.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No hay items para pagar" });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map(item => ({
          title: String(item.title),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          currency_id: "ARS"
        })),
        back_urls: {
          success: "http://localhost:5173",
          failure: "http://localhost:5173",
          pending: "http://localhost:5173",
        },
        auto_return: "approved" // 🔥 ESTA LÍNEA ES LA CLAVE
      }
    });

    console.log("Preferencia creada:", response.id);

    res.json({ id: response.id });

  } catch (error) {
    console.error("Error creando preferencia:", error);
    res.status(500).json({ error: "Error creando preferencia" });
  }
});

app.listen(5000, () => {
  console.log("Servidor Mercado Pago corriendo en puerto 5000");
});