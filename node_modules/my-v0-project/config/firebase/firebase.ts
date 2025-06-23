// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Commented out as not currently used
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth"; // Importamos Auth
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore"; // Importamos Firestore
import { getStorage, connectStorageEmulator, FirebaseStorage } from "firebase/storage"; // Importamos Storage

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

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Estas conexiones solo se deben hacer en el lado del cliente y en desarrollo
    // Descomenta si usas los emuladores
    // try {
    //   connectAuthEmulator(auth, "http://127.0.0.1:9099");
    //   connectFirestoreEmulator(db, "127.0.0.1", 8080);
    //   connectStorageEmulator(storage, "127.0.0.1", 9199);
    //   console.log("Connected to Firebase emulators");
    // } catch (e) {
    //   console.error("Error connecting to Firebase emulators", e);
    // }
}

export { app, auth, db, storage }; 