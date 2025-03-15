// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot , getDocs} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "funny-chat-8ff45.firebaseapp.com",
  projectId: "funny-chat-8ff45",
  storageBucket: "funny-chat-8ff45.firebasestorage.app",
  messagingSenderId: "482355079153",
  appId: process.env.APP_ID,
  measurementId: "G-FZX7KGWZKM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
