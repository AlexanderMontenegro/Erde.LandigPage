import { create } from 'zustand';
import { auth, googleProvider } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isAuthModalOpen: false,
  isProfileModalOpen: false,

  toggleAuthModal: () => set(state => ({ isAuthModalOpen: !state.isAuthModalOpen })),

  toggleProfileModal: () => set(state => ({ isProfileModalOpen: !state.isProfileModalOpen })),

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      set({ loading: true });
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        set({ user: { ...firebaseUser, ...userData }, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    });
    return unsubscribe;
  },

  registerWithEmail: async (email, password, nombre, apellido, direccion, telefono) => {
    try {
      set({ error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        nombre,
        apellido,
        direccion,
        telefono,
        imagen: '', // Imagen predefinida inicial
        createdAt: new Date(),
        favorites: [],
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      set({ user: { ...user, ...userData }, isAuthModalOpen: false });
      return user;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  loginWithEmail: async (email, password) => {
    try {
      set({ error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      set({ user: { ...user, ...userData }, isAuthModalOpen: false });
      return user;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ error: null });
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      let userData = {};
      if (!userDoc.exists()) {
        userData = {
          uid: user.uid,
          email: user.email,
          nombre: user.displayName?.split(' ')[0] || '',
          apellido: user.displayName?.split(' ').slice(1).join(' ') || '',
          direccion: '',
          telefono: user.phoneNumber || '',
          imagen: '',
          createdAt: new Date(),
          favorites: [],
        };
        await setDoc(userDocRef, userData);
      } else {
        userData = userDoc.data();
      }

      set({ user: { ...user, ...userData }, isAuthModalOpen: false });
      return user;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateUser: async (updates) => {
    try {
      const { user } = get();
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, updates);
      set({ user: { ...user, ...updates } });
    } catch (err) {
      set({ error: err.message });
    }
  },

  addFavorite: async (productId) => {
    try {
      const { user } = get();
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { favorites: arrayUnion(productId) });
      set({ user: { ...user, favorites: [...(user.favorites || []), productId] } });
    } catch (err) {
      set({ error: err.message });
    }
  },

  removeFavorite: async (productId) => {
    try {
      const { user } = get();
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { favorites: arrayRemove(productId) });
      set({ user: { ...user, favorites: user.favorites.filter(id => id !== productId) } });
    } catch (err) {
      set({ error: err.message });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuthModalOpen: false, isProfileModalOpen: false });
    } catch (err) {
      set({ error: err.message });
    }
  },
}));

export default useAuthStore;