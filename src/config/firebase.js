import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('🔥 Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Faltante',
  projectId: firebaseConfig.projectId ? '✅ Configurado' : '❌ Faltante',
  authDomain: firebaseConfig.authDomain ? '✅ Configurado' : '❌ Faltante'
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const tasksCollection = collection(db, "tasks");
const timelineCollection = collection(db, "timeline");

export { 
  db, 
  tasksCollection, 
  timelineCollection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where 
};