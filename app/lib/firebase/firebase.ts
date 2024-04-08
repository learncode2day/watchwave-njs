import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseApp = {
apiKey: "AIzaSyCukOk3mtyK52rtfncfCh43CmCIeJfz9Og",
  authDomain: "streamstarnode.firebaseapp.com",
  projectId: "streamstarnode",
  storageBucket: "streamstarnode.appspot.com",
  messagingSenderId: "563639367279",
  appId: "1:563639367279:web:b30145b5e176fe01b17f9a",
  measurementId: "G-J6Z0Q25N8N",
};

export const app = initializeApp(firebaseApp);
export const auth = getAuth(app);
export const db = getFirestore(app);
