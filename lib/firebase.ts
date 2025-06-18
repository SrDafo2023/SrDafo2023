// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Commented out as not currently used
import { getAuth } from "firebase/auth"; // Importamos Auth
import { getFirestore } from "firebase/firestore"; // Importamos Firestore

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCo-0khhqb8yfqnq2byUxQ-boA_bn-nXtk",
    authDomain: "pethelp-a4e95.firebaseapp.com",
    projectId: "pethelp-a4e95",
    storageBucket: "pethelp-a4e95.firebasestorage.app",
    messagingSenderId: "775211426092",
    appId: "1:775211426092:web:30863265aa5a521c090c89",
    measurementId: "G-BXTF0Q7P3X"
};

// Initialize Firebase - Esto asegura que solo se inicialice una vez en Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize the services and export them directly
const auth = getAuth(app); // Inicializamos Autenticación
const db = getFirestore(app); // Inicializamos Firestore

export {
  app,
  auth,
  db,
  // analytics, // Exportamos Analytics si lo vas a usar
};