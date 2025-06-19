"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Define el tipo para el contexto
interface FirebaseAuthContextType {
    auth: Auth | null;
    loadingAuth: boolean;
    isAuthenticated: boolean;
}

// Crea el contexto
const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
    auth: null,
    loadingAuth: true,
    isAuthenticated: false,
});

// Hook personalizado para usar el contexto
export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

// Proveedor del contexto
export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verificar que auth esté disponible
        if (!auth) {
            console.error('Firebase Auth no está inicializado correctamente');
            setLoadingAuth(false);
            return;
        }

        // Suscribirse a cambios en el estado de autenticación
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setLoadingAuth(false);
        }, (error) => {
            console.error('Error en la autenticación:', error);
            setLoadingAuth(false);
        });

        // Limpiar la suscripción cuando el componente se desmonte
        return () => unsubscribe();
    }, []);

    const value = {
        auth,
        loadingAuth,
        isAuthenticated,
    };

    return (
        <FirebaseAuthContext.Provider value={value}>
            {children}
        </FirebaseAuthContext.Provider>
    );
} 