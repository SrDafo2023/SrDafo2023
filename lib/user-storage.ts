import { db } from './firebase'; // Import the Firestore instance
import { collection, getDocs, addDoc, doc, setDoc, getDoc, query, where } from 'firebase/firestore'; // Import Firestore functions

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password?: string // Password should generally not be stored in Firestore, especially not in plaintext.
                    // This will be handled by Firebase Authentication.
  phone: string
  userType: "user" | "petshop" | "grooming" | "admin" | "adoption-center"
  createdAt: Date
  rut?: string // Add RUT field here if you want to store it in Firestore user document
}

// We will no longer use a class for storage, but rather functions

const usersCollection = collection(db, 'users'); // Reference to the 'users' collection

// Function to get all users from Firestore
export async function getUsers(): Promise<User[]> {
  const usersSnapshot = await getDocs(usersCollection);
  const usersList = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as any // Cast to any for now, proper typing needed
  })) as User[]; // Cast the result to User[]
  return usersList;
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
        rut: "11111111-1" // Example RUT
      },
      {
        firstName: "Usuario",
        lastName: "Demo",
        email: "usuario@pethelp.com",
        password: "user123",
        phone: "+56912345679",
        userType: "user" as const,
         rut: "22222222-2" // Example RUT
      },
      {
        firstName: "PetShop",
        lastName: "Demo",
        email: "petshop@pethelp.com",
        password: "petshop123",
        phone: "+56912345680",
        userType: "petshop" as const,
         rut: "33333333-3" // Example RUT
      },
      {
        firstName: "Grooming",
        lastName: "Demo",
        email: "grooming@pethelp.com",
        password: "grooming123",
        phone: "+56912345681",
        userType: "grooming" as const,
         rut: "44444444-4" // Example RUT
      },
      {
        firstName: "Centro Adopcion",
        lastName: "Demo",
        email: "adoptioncenter@pethelp.com",
        password: "adoption123",
        phone: "+56912345682",
        userType: "adoption-center" as const,
         rut: "55555555-5" // Example RUT
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
           createdAt: new Date()
         });
      }
    }
}
