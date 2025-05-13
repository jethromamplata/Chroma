import { initializeApp } from 'firebase/app';
import {
    initializeAuth,
    getReactNativePersistence,
    getAuth
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Firebase config
const firebaseConfig = {
    apiKey: 'AIzaSyAYdc4U98DdE-wWRl5i_FwfIYRZIlOoUso',
    authDomain: 'chroma-784f6.firebaseapp.com',
    projectId: 'chroma-784f6',
    storageBucket: 'chroma-784f6.firebasestorage.app',
    messagingSenderId: '128717838182',
    appId: '1:128717838182:web:0df3eabb3a611287321aa7',
    measurementId: 'G-6RTJ0LJ729',
};

// ✅ Initialize Firebase & Auth with persistence
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

// 🔹 Saved Images (Outfits / Accessories)
export const saveItem = async (item) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    await addDoc(collection(db, 'users', userId, 'saved'), item);
};

export const fetchSavedItems = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snapshot = await getDocs(collection(db, 'users', userId, 'saved'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteSavedItem = async (itemId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const itemRef = doc(db, 'users', userId, 'saved', itemId);
    await deleteDoc(itemRef);
};

// 🔹 Virtual Closet Items
export const saveClosetItem = async (item) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not logged in.");
    const docRef = await addDoc(collection(db, 'users', userId, 'closet'), item);
    return docRef.id;
};

export const fetchClosetItems = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const q = query(collection(db, 'users', userId, 'closet'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteClosetItem = async (itemId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const itemRef = doc(db, 'users', userId, 'closet', itemId);
    await deleteDoc(itemRef);
};

// ✅ Export main instances
export { auth, db };
