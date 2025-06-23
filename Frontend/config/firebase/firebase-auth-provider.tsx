"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth, onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from './firebase';

// Obtener la instancia de Auth directamente aquí
const auth = getAuth(app);

// Define el tipo para el contexto
interface FirebaseAuthContextType {
    auth: Auth;
    loadingAuth: boolean;
    isAuthenticated: boolean;
}

// Crea el contexto con un valor inicial que cumple el tipo
const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
    auth: auth,
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
        // La comprobación de !auth ya no es necesaria, porque siempre está disponible.

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