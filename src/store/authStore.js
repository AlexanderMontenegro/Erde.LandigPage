import { create } from 'zustand';
import { auth, googleProvider } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isAuthModalOpen: false,

  toggleAuthModal: () => set(state => ({ isAuthModalOpen: !state.isAuthModalOpen })),

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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
        createdAt: new Date(),
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
          createdAt: new Date(),
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

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (err) {
      set({ error: err.message });
    }
  },
}));

export default useAuthStore;