import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

export const createOrder = async (cart, buyer) => {
  // Validar productos desde Firebase
  for (const item of cart) {
    const ref = doc(db, "productos", item.id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error("Producto no encontrado");
    }
  }

  const order = {
    buyer,
    items: cart,
    total: cart.reduce((acc, p) => acc + p.price * p.quantity, 0),
    createdAt: serverTimestamp()
  };

  const orderRef = await addDoc(collection(db, "orders"), order);

  return orderRef.id;
};
