import { db } from '@/config/firebase/firebase'; // Import the Firestore instance
import { collection, getDocs, addDoc, doc, setDoc, getDoc, query, where, updateDoc, deleteDoc, serverTimestamp, DocumentData } from 'firebase/firestore'; // Import Firestore functions
import { type AppUser } from '@/hooks/useUser'; // Importar la interfaz unificada
import { getAuth } from 'firebase/auth';

// Tipos simplificados para este módulo
type UserRole = AppUser['userType'];
type UserStatus = 'active' | 'inactive';

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'petshop' | 'grooming' | 'user'
  status: 'active' | 'inactive'
  createdAt: Date
  firstName: string
  lastName: string
  password?: string // Password should generally not be stored in Firestore, especially not in plaintext.
                    // This will be handled by Firebase Authentication.
  phone: string
  userType: "user" | "petshop" | "grooming" | "admin" | "adoption-center"
  rut?: string // Add RUT field here if you want to store it in Firestore user document
}

export interface UserProfile {
    id: string;
    email: string;
    userType: 'admin' | 'petshop' | 'grooming' | 'adoption-center' | 'user';
    // Profile fields
    displayName?: string; // Could be user's name or center's name
    address?: string;
    phone?: string;
    description?: string;
    // Timestamps
    createdAt: any;
    updatedAt?: any;
}

// We will no longer use a class for storage, but rather functions

const usersCollection = collection(db, 'users'); // Reference to the 'users' collection

// Function to get all users from Firestore
export async function getUsers(): Promise<AppUser[]> {
  try {
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore Timestamps need to be converted to JS Date objects.
      // We also handle cases where createdAt might be missing for older documents.
      const createdAtDate = data.createdAt?.toDate ? data.createdAt.toDate() : null;

      return {
        id: doc.id,
        email: data.email,
        userType: data.userType || 'user',
        displayName: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        createdAt: createdAtDate,
        // Ensure status is also passed, default to 'inactive' if not present
        status: data.status || 'inactive'
      } as AppUser;
    });
  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('No se pudieron obtener los usuarios');
  }
}

// Function to save a new user to Firestore
// Note: For a real app, user creation should primarily go through Firebase Authentication first,
// then save additional profile data (like userType, firstName, etc.) to Firestore using the Auth UID.
// This method is simplified for demonstration, assuming user data is saved *after* Auth or for initial seeding.
export async function saveUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  // In a real scenario with Firebase Auth, the ID should be the Auth UID.
  // For now, we'll let Firestore generate an ID if we are adding data not tied to Auth yet.
  // If integrating with Auth, you would get the UID after creating the user via Auth
  // and then use setDoc(doc(db, 'users', auth.currentUser.uid), userData);

  const newUserRef = await addDoc(usersCollection, {
    ...user,
    createdAt: new Date(), // Firestore stores Dates directly
    // Password should ideally NOT be stored here. Handle via Auth.
    password: user.password ? user.password : undefined // Remove password or handle securely if needed for migration
  });

  const newUserDoc = await getDoc(newUserRef);
  const newUser = { id: newUserDoc.id, ...newUserDoc.data() as any } as User;
  return newUser;
}

// Function to find a user by email (for login/validation)
export async function findUserByEmail(email: string): Promise<User | null> {
  // Note: Querying by email might be slow or costly for large collections.
  // Using Firebase Auth's email/password sign-in is the recommended way for authentication.
  // This function can be useful for checking if an email already exists during registration.
  const q = query(usersCollection, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null; // No user found with this email
  }

  // Assuming email is unique, there should be only one document
  const userDoc = querySnapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() as any } as User;
}

// Function to validate credentials (Simplified - use Firebase Auth in a real app)
// This method is NOT secure for production as it exposes passwords.
// Use Firebase Authentication instead (signInWithEmailAndPassword).
export async function validateCredentials(email: string, password: string): Promise<User | null> {
  // In a real app, you would use Firebase Auth's signInWithEmailAndPassword
  // and then fetch the user's profile data from Firestore using the returned user.uid.

  // For this simplified example migrating from localStorage:
  const user = await findUserByEmail(email);
  if (user && user.password === password) { // Comparing plaintext password (INSECURE)
    return user;
  }
  return null;
}

// Function to initialize default users (Migrate to Firestore)
export async function initializeDefaultUsers() {
   // Check if default users already exist in Firestore
   const q = query(usersCollection, where("email", "in", ["admin@pethelp.com", "usuario@pethelp.com", "petshop@pethelp.com", "grooming@pethelp.com", "adoptioncenter@pethelp.com"]));
   const querySnapshot = await getDocs(q);

   const existingEmails = querySnapshot.docs.map(doc => doc.data().email);

   const defaultUsers = [
      {
        firstName: "Admin",
        lastName: "Sistema",
        email: "admin@pethelp.com",
        password: "admin123",
        phone: "+56912345678",
        userType: "admin" as const,
        rut: "11111111-1", // Example RUT
        status: 'active'
      },
      {
        firstName: "Usuario",
        lastName: "Demo",
        email: "usuario@pethelp.com",
        password: "user123",
        phone: "+56912345679",
        userType: "user" as const,
         rut: "22222222-2", // Example RUT
         status: 'active'
      },
      {
        firstName: "PetShop",
        lastName: "Demo",
        email: "petshop@pethelp.com",
        password: "petshop123",
        phone: "+56912345680",
        userType: "petshop" as const,
         rut: "33333333-3", // Example RUT
         status: 'active'
      },
      {
        firstName: "Grooming",
        lastName: "Demo",
        email: "grooming@pethelp.com",
        password: "grooming123",
        phone: "+56912345681",
        userType: "grooming" as const,
         rut: "44444444-4", // Example RUT
         status: 'active'
      },
      {
        firstName: "Centro Adopcion",
        lastName: "Demo",
        email: "adoptioncenter@pethelp.com",
        password: "adoption123",
        phone: "+56912345682",
        userType: "adoption-center" as const,
         rut: "55555555-5", // Example RUT
         status: 'active'
      }
    ];

    for (const defaultUser of defaultUsers) {
      if (!existingEmails.includes(defaultUser.email)) {
         // Note: Storing passwords directly like this is NOT recommended.
         // Use Firebase Authentication for user sign-up.
         await addDoc(usersCollection, { // Use addDoc for new documents with auto-generated ID
           firstName: defaultUser.firstName,
           lastName: defaultUser.lastName,
           email: defaultUser.email,
           // password: defaultUser.password, // Avoid storing passwords in Firestore
           phone: defaultUser.phone,
           userType: defaultUser.userType,
           rut: defaultUser.rut,
           createdAt: new Date(),
           status: defaultUser.status
         });
      }
    }
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('No se pudo actualizar el usuario');
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('No se pudo eliminar el usuario');
  }
}

export async function createUser(userData: Omit<User, 'id'>): Promise<string> {
  try {
    const usersCollection = collection(db, 'users');
    const docRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('No se pudo crear el usuario');
  }
}

// Obtener el perfil de un usuario
export async function getUserProfile(userId: string): Promise<AppUser | null> {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            return {
                id: userSnap.id,
                ...data
            } as AppUser;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Could not fetch user profile.");
    }
}

// Actualizar el perfil de un usuario
export async function updateUserProfile(userId: string, data: Partial<Omit<AppUser, 'id' | 'email' | 'userType'>>): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Could not update user profile.");
    }
}

/**
 * Updates a user's role by calling a secure backend endpoint.
 * This function should only be callable by an admin user from the frontend.
 * The backend endpoint will verify the caller's admin privileges.
 * @param userId - The ID of the user to update.
 * @param role - The new role to assign.
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('No hay un usuario autenticado para realizar esta acción.');
  }

  try {
    const idToken = await currentUser.getIdToken(true); // Get the JWT token
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error("La URL de la API no está configurada en las variables de entorno.");
    }

    const response = await fetch(`${apiUrl}/users/${userId}/role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
    }

  } catch (error) {
    console.error('Error updating user role via backend:', error);
    // Lanza el error para que pueda ser manejado por la UI (e.g., mostrar un toast)
    if (error instanceof Error) {
        throw new Error(`No se pudo actualizar el rol del usuario: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al actualizar el rol del usuario.');
  }
}
