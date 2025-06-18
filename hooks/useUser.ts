"use client";

import { useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, Auth } from 'firebase/auth'; // Import Auth and onAuthStateChanged
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Import db directly
import { useFirebaseAuth } from "@/components/firebase-auth-provider"; // Import the context hook

// Define a type for the user including custom fields from Firestore
interface AppUser {
  id: string; // Firebase Auth UID
  email: string | null;
  userName: string; // Assuming userName is stored in Firestore
  userType: 'user' | 'admin' | 'petshop' | 'grooming' | 'adoption-center'; // Custom field
  // Add other custom fields as needed
  rut?: string; // Add RUT field
  firstName?: string; // Add firstName field
  lastName?: string; // Add lastName field
  phone?: string; // Add phone field
  // Also ensure email can be null, which is already handled
}

export function useUser() {
  const { auth, loadingAuth: loadingFirebaseAuth } = useFirebaseAuth(); // Get auth and its loading state from context
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only proceed if Firebase Auth is loaded from the context
    if (loadingFirebaseAuth || !auth) {
      setLoading(true); // Keep loading if auth is not ready
      return;
    }

    // Use onAuthStateChanged from Firebase, with the auth instance from context
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase Auth user detected:", firebaseUser.uid);
        // User is signed in, now fetch their profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const profileData = userDocSnap.data();
            console.log("Firestore profile data for user:", profileData);
            // Combine Firebase Auth data with Firestore profile data
            const appUser: AppUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              userName: profileData.userName || 'N/A', // Get userName from Firestore, provide fallback
              userType: profileData.userType,
              // Map other profile fields here
              rut: profileData.rut || '', // Get RUT from Firestore, provide fallback
              firstName: profileData.firstName || '', // Get firstName from Firestore, provide fallback
              lastName: profileData.lastName || '', // Get lastName from Firestore, provide fallback
              phone: profileData.phone || '', // Get phone from Firestore, provide fallback
            };
            setUser(appUser);
          } else {
            // User document not found in Firestore
            console.error("User profile not found in Firestore for UID:", firebaseUser.uid);
            setUser(null); // Treat as not logged in if profile is missing
          }
        } catch (error) {
          console.error("Error fetching user profile from Firestore:", error);
          setUser(null); // Set user to null on error
        }
      } else {
        // User is signed out
        console.log("Firebase Auth user signed out.");
        setUser(null);
      }
      setLoading(false); // Set loading to false once auth state and profile are checked
    });

    // Clean up the subscription
    return () => unsubscribe();

  }, [auth, loadingFirebaseAuth]); // Re-run effect if auth or its loading state changes

  // Return loading state based on both Firebase Auth loading and profile fetching
  return { user, loading };
} 