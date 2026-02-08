import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.details?.description,
      basePrice: data.pricing?.basePrice,
      image: data.media?.image,
    };
  });
};