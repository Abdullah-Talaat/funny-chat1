// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot , getDocs} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg5ZaGoHwM6Wt1601-cHHg2l8OP5P3evg",
  authDomain: "funny-chat-8ff45.firebaseapp.com",
  projectId: "funny-chat-8ff45",
  storageBucket: "funny-chat-8ff45.firebasestorage.app",
  messagingSenderId: "482355079153",
  appId: "1:482355079153:web:0862da66199d712ad68650",
  measurementId: "G-FZX7KGWZKM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
