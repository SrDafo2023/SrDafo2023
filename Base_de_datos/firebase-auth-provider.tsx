"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth } from 'firebase/auth';
import { auth as firebaseAuth } from './firebase';
import { Loader2Icon } from 'lucide-react';

interface FirebaseAuthContextType {
  auth: Auth | null;
  loadingAuth: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (firebaseAuth) {
        setAuth(firebaseAuth);
      } else {
        console.error("Firebase Auth instance is not available");
      }
      setLoadingAuth(false);
    }
  }, []);

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="h-10 w-10 animate-spin text-purple-600" aria-hidden="true" />
      </div>
    );
  }

  return (
    <FirebaseAuthContext.Provider value={{ auth, loadingAuth }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
} 