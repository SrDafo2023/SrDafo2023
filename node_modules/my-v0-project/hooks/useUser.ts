"use client";

import { useEffect, useState, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged, Auth } from 'firebase/auth'; // Import Auth and onAuthStateChanged
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase/firebase'; // Updated import path
import { useFirebaseAuth } from "@/config/firebase/firebase-auth-provider"; // Updated import path

// Define a type for the user including custom fields from Firestore
export interface AppUser {
  id: string; // Firebase Auth UID
  email: string | null;
  userType: 'user' | 'admin' | 'petshop' | 'grooming' | 'adoption-center';
  status?: 'active' | 'inactive'; // Add status field
  createdAt?: Date | null; // Add createdAt field
  // Profile fields that can be updated
  displayName?: string; // For user's full name or center's name
  address?: string;
  phone?: string;
  description?: string;
  // Other existing fields
  userName?: string; 
  rut?: string;
  firstName?: string;
  lastName?: string;
}

export function useUser() {
  const { auth, loadingAuth: loadingFirebaseAuth } = useFirebaseAuth(); // Get auth and its loading state from context
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
    if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
    }
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const profileData = userDocSnap.data();
            const appUser: AppUser = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                userType: profileData.userType,
                status: profileData.status,
                createdAt: profileData.createdAt ? new Date(profileData.createdAt) : undefined,
                // Map all fields from Firestore
                displayName: profileData.displayName,
                address: profileData.address,
                phone: profileData.phone,
                description: profileData.description,
                userName: profileData.userName,
                rut: profileData.rut,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
            };
            setUser(appUser);
        } else {
            console.error("User profile not found in Firestore for UID:", firebaseUser.uid);
            setUser(null);
        }
    } catch (error) {
        console.error("Error fetching user profile from Firestore:", error);
        setUser(null);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loadingFirebaseAuth || !auth) {
      setLoading(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, loadingFirebaseAuth, fetchUserProfile]);

  const refreshUser = useCallback(() => {
    if (auth?.currentUser) {
        setLoading(true);
        fetchUserProfile(auth.currentUser);
    }
  }, [auth, fetchUserProfile]);

  // Return loading state based on both Firebase Auth loading and profile fetching
  return { user, loading, refreshUser };
} 