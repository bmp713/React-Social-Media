import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA5JEadZzVUBGMrn0dygRdx5t-5uqAuBKo",
  authDomain: "context-187ec.firebaseapp.com",
  projectId: "context-187ec",
  storageBucket: "context-187ec.appspot.com",
  messagingSenderId: "248587359534",
  appId: "1:248587359534:web:825b31a2224c23f67096bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);



