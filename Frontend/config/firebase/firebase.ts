// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Commented out as not currently used
import { getAuth, connectAuthEmulator } from "firebase/auth"; // Importamos Auth
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"; // Importamos Firestore

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

// Initialize Firebase
let app;
try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
}

// Initialize Firebase services
let auth;
let db;

try {
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase services initialized successfully');

    // Connect to emulators in development
    if (process.env.NODE_ENV === 'development') {
        // Uncomment these lines if you want to use Firebase emulators
        // connectAuthEmulator(auth, 'http://localhost:9099');
        // connectFirestoreEmulator(db, 'localhost', 8080);
    }
} catch (error) {
    console.error('Error initializing Firebase services:', error);
    throw error;
}

export {
    app,
    auth,
    db,
    // analytics, // Exportamos Analytics si lo vas a usar
}; 