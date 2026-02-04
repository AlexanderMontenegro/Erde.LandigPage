import { db } from "../config/firebase"
import { collection, getDocs } from "firebase/firestore"

export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"))

  const products = []

  querySnapshot.forEach((doc) => {
    products.push({
      id: doc.id,
      ...doc.data(),
    })
  })

  return products
}
