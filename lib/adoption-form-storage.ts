import { db } from './firebase'; // Import the Firestore instance
import { collection, getDocs, addDoc, doc, setDoc, getDoc, query, where, deleteDoc } from 'firebase/firestore'; // Import Firestore functions
import { Pet } from './pet-storage';

export interface AdoptionForm {
  id: string;
  petId: string; // ID of the pet being applied for
  userId: string; // ID of the user who submitted the form (Firebase Auth UID or Firestore Doc ID)
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantRUT: string;
  answers: Record<string, string>; // Or a more structured type for answers
  submittedAt: Date;
  // We might also want to store the adoptionCenterId here for easier querying
  adoptionCenterId?: string; // Add this for easier querying from adoption center side
}

// We will no longer use a class for storage, but rather functions

const adoptionFormsCollection = collection(db, 'adoptionForms'); // Reference to the 'adoptionForms' collection

// Function to get all adoption forms from Firestore
export async function getForms(): Promise<AdoptionForm[]> {
  const formsSnapshot = await getDocs(adoptionFormsCollection);
  const formsList = formsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as any // Cast to any for now, proper typing needed
  })) as AdoptionForm[]; // Cast the result to AdoptionForm[]
  return formsList;
}

// Function to save a new adoption form to Firestore
// Note: Ensure userId and petId are valid IDs from your users and pets collections.
export async function saveForm(form: Omit<AdoptionForm, "id" | "submittedAt"> & { submittedAt?: Date }): Promise<AdoptionForm> {
   // Before saving the form, we need the adoptionCenterId from the pet
   const pet = await getPetById(form.petId); // Assuming getPetById function exists or fetching pet here
   if (!pet) {
       throw new Error("Pet not found for this form.");
   }

  // Use addDoc to let Firestore generate an ID
  const newFormRef = await addDoc(adoptionFormsCollection, {
    ...form,
    adoptionCenterId: pet.adoptionCenterId, // Add adoptionCenterId from the pet
    submittedAt: form.submittedAt || new Date(), // Use provided date or current date
  });

  const newFormDoc = await getDoc(newFormRef);
  const newForm = { id: newFormDoc.id, ...newFormDoc.data() as any } as AdoptionForm;
  return newForm;
}

// Helper function to get a pet by ID (needed for saveForm)
// This should ideally be imported from lib/pet-storage, but defined here for self-containment in the edit.
async function getPetById(petId: string): Promise<Pet | null> {
   const petDocRef = doc(db, 'pets', petId);
   const petDocSnap = await getDoc(petDocRef);
   if (!petDocSnap.exists()) {
     return null;
   }
   return { id: petDocSnap.id, ...petDocSnap.data() as any } as Pet;
}

// Function to get forms by pet ID from Firestore
export async function getFormsByPetId(petId: string): Promise<AdoptionForm[]> {
  const q = query(adoptionFormsCollection, where("petId", "==", petId));
  const querySnapshot = await getDocs(q);

  const formsList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as any
  })) as AdoptionForm[];

  return formsList;
}

// Function to get forms by adoption center ID from Firestore
export async function getFormsByAdoptionCenterId(adoptionCenterId: string): Promise<AdoptionForm[]> {
   // Query forms where the adoptionCenterId matches
   const q = query(adoptionFormsCollection, where("adoptionCenterId", "==", adoptionCenterId));
   const querySnapshot = await getDocs(q);

   const formsList = querySnapshot.docs.map(doc => ({
     id: doc.id,
     ...doc.data() as any
   })) as AdoptionForm[];

   return formsList;
}

// Function to delete a form by ID from Firestore
export async function deleteForm(id: string): Promise<boolean> {
  try {
    const formDocRef = doc(db, 'adoptionForms', id);
    await deleteDoc(formDocRef);
    return true; // Deletion successful
  } catch (error) {
    console.error("Error deleting form:", error);
    return false; // Deletion failed
  }
} 