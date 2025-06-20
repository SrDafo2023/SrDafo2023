import { db } from '@/config/firebase/firebase'; // Import the Firestore instance
import { collection, getDocs, addDoc, doc, setDoc, getDoc, query, where, deleteDoc, Timestamp, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Pet {
  id: string
  name: string
  species: string // e.g., 'dog', 'cat'
  breed: string
  age: number // in years or months, specify unit in description
  gender: 'Macho' | 'Hembra'
  status: 'available' | 'adopted' | 'pending'
  description: string
  imageUrl: string | null; // URL to a photo of the pet, allow null
  adoptionCenterId: string // Link to the user ID of the adoption center (Firebase Auth UID or Firestore Doc ID)
  createdAt: Timestamp
  updatedAt?: Timestamp
}

// We will no longer use a class for storage, but rather functions

const petsCollection = collection(db, 'pets'); // Reference to the 'pets' collection
const storage = getStorage();

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
export const savePet = async (petData: Omit<Pet, 'id'>, imageFile: File | null) => {
  try {
    let imageUrl = petData.imageUrl || '';

    // If an image file is provided, upload it and get the URL
    if (imageFile) {
      const storageRef = ref(storage, `pet-images/${Date.now()}-${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(uploadResult.ref);
    }

    const docRef = await addDoc(petsCollection, {
      ...petData,
      imageUrl, // Use the new URL from storage or the one from the form
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving pet:', error);
    throw new Error('Could not save pet data.');
  }
};

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

// Function to update an existing pet in Firestore
export async function updatePet(petId: string, petData: Partial<Omit<Pet, 'id' | 'createdAt'>>) {
  const petRef = doc(db, 'pets', petId);
  await updateDoc(petRef, {
    ...petData,
    updatedAt: Timestamp.now(),
  });
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
         gender: 'Macho',
         status: 'disponible',
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
         gender: 'Hembra',
         status: 'disponible',
         description: "Calm and affectionate. Enjoys naps in sunny spots.",
         imageUrl: "https://via.placeholder.com/150",
         // IMPORTANT: Replace with a real adoption center user ID from your Firestore 'users' collection
         adoptionCenterId: "REPLACE_WITH_ADOPTION_CENTER_USER_ID",
       },
     ];

     for (const defaultPet of defaultPets) {
        await addDoc(petsCollection, { // Use addDoc for new documents with auto-generated ID
          ...defaultPet,
          createdAt: Timestamp.fromDate(new Date())
        });
     }
   }
} 