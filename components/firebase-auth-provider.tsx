"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase'; // Import the initialized auth instance
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
    // Check if the firebaseAuth instance is available from our initialization
    if (firebaseAuth) {
      setAuth(firebaseAuth);
      setLoadingAuth(false);
    } else {
      console.error("Firebase Auth instance is not available from @/lib/firebase");
      setLoadingAuth(false); // Stop loading even on error
    }
  }, []); // Empty dependency array means this runs once on mount

  // You could potentially add a loading spinner here while loadingAuth is true
  if (loadingAuth) {
      return (
          <div className="min-h-screen flex items-center justify-center">
               <Loader2Icon className="h-10 w-10 animate-spin text-purple-600" />
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