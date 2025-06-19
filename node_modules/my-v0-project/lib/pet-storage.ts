import { db } from '../Base_de_datos/firebase'; // Import the Firestore instance
import { collection, getDocs, addDoc, doc, setDoc, getDoc, query, where, deleteDoc } from 'firebase/firestore'; // Import Firestore functions

export interface Pet {
  id: string
  name: string
  species: string // e.g., 'dog', 'cat'
  breed?: string
  age: number // in years or months, specify unit in description
  description: string
  imageUrl: string | null; // URL to a photo of the pet, allow null
  adoptionCenterId: string // Link to the user ID of the adoption center (Firebase Auth UID or Firestore Doc ID)
  createdAt: Date
}

// We will no longer use a class for storage, but rather functions

const petsCollection = collection(db, 'pets'); // Reference to the 'pets' collection

// Function to get all pets from Firestore
export async function getPets(): Promise<Pet[]> {
  const petsSnapshot = await getDocs(petsCollection);
  const petsList = petsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as any // Cast to any for now, proper typing needed
  })) as Pet[]; // Cast the result to Pet[]
  return petsList;
}

// Function to save a new pet to Firestore
// Note: The adoptionCenterId should link to a user document's ID (ideally, the Firebase Auth UID).
export async function savePet(pet: Omit<Pet, "id" | "createdAt">): Promise<Pet> {
  // Use addDoc to let Firestore generate an ID
  const newPetRef = await addDoc(petsCollection, {
    ...pet,
    createdAt: new Date(), // Firestore stores Dates directly
  });

  const newPetDoc = await getDoc(newPetRef);
  const newPet = { id: newPetDoc.id, ...newPetDoc.data() as any } as Pet;
  return newPet;
}

// Function to get pets by adoption center ID from Firestore
export async function getPetsByAdoptionCenterId(adoptionCenterId: string): Promise<Pet[]> {
  const q = query(petsCollection, where("adoptionCenterId", "==", adoptionCenterId));
  const querySnapshot = await getDocs(q);

  const petsList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as any
  })) as Pet[];

  return petsList;
}

// Function to find a pet by ID from Firestore
export async function findPetById(id: string): Promise<Pet | null> {
  const petDocRef = doc(db, 'pets', id);
  const petDocSnap = await getDoc(petDocRef);

  if (!petDocSnap.exists()) {
    return null; // No pet found with this ID
  }

  return { id: petDocSnap.id, ...petDocSnap.data() as any } as Pet;
}

// Function to delete a pet by ID from Firestore
export async function deletePet(id: string): Promise<boolean> {
  try {
    const petDocRef = doc(db, 'pets', id);
    await deleteDoc(petDocRef);
    return true; // Deletion successful
  } catch (error) {
    console.error("Error deleting pet:", error);
    return false; // Deletion failed
  }
}

// Function to initialize default pets (Migrate to Firestore)
export async function initializeDefaultPets() {
   // Check if any pets exist in Firestore
   const q = query(petsCollection);
   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
     const defaultPets = [
       {
         name: "Buddy",
         species: "dog",
         breed: "Golden Retriever",
         age: 2,
         description: "Friendly and energetic. Loves to play fetch.",
         imageUrl: "https://via.placeholder.com/150",
         // IMPORTANT: Replace with a real adoption center user ID from your Firestore 'users' collection
         adoptionCenterId: "REPLACE_WITH_ADOPTION_CENTER_USER_ID",
       },
       {
         name: "Whiskers",
         species: "cat",
         breed: "Siamese",
         age: 1,
         description: "Calm and affectionate. Enjoys naps in sunny spots.",
         imageUrl: "https://via.placeholder.com/150",
         // IMPORTANT: Replace with a real adoption center user ID from your Firestore 'users' collection
         adoptionCenterId: "REPLACE_WITH_ADOPTION_CENTER_USER_ID",
       },
     ];

     for (const defaultPet of defaultPets) {
        await addDoc(petsCollection, { // Use addDoc for new documents with auto-generated ID
          ...defaultPet,
          createdAt: new Date()
        });
     }
   }
} 