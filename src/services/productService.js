import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
