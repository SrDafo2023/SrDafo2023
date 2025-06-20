import { db } from '@/config/firebase/firebase'; // Import the Firestore instance
import { collection, getDocs, addDoc, doc, setDoc, getDoc, query, where, deleteDoc, updateDoc, serverTimestamp, type Timestamp } from 'firebase/firestore'; // Import Firestore functions
import { Pet } from './pet-storage';

export interface AdoptionForm {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  petId: string;
  petName: string;
  adoptionCenterId: string;
  status: 'pending' | 'approved' | 'rejected';
  answers: Record<string, string>;
  createdAt?: any;
}

// We will no longer use a class for storage, but rather functions

const formsCollection = collection(db, 'adoption-forms');

// Guardar un nuevo formulario de adopción
export const saveAdoptionForm = async (formData: Omit<AdoptionForm, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'adoptionForms'), {
      ...formData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving adoption form:', error);
    throw new Error('Could not save adoption form.');
  }
};

// Obtener todos los formularios de adopción
export async function getAdoptionForms(): Promise<AdoptionForm[]> {
    try {
        const snapshot = await getDocs(formsCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdoptionForm));
    } catch (error) {
        console.error("Error fetching adoption forms: ", error);
        throw new Error("Could not fetch adoption forms.");
    }
}

// Actualizar el estado de un formulario
export const updateAdoptionFormStatus = async (formId: string, status: 'approved' | 'rejected') => {
    try {
        const formRef = doc(db, 'adoptionForms', formId);
        await updateDoc(formRef, { status });
    } catch (error) {
        console.error("Error updating adoption form status:", error);
        throw new Error("Could not update adoption form status.");
    }
};

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
  const q = query(formsCollection, where("petId", "==", petId));
  const querySnapshot = await getDocs(q);

  const formsList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as any
  })) as AdoptionForm[];

  return formsList;
}

// Function to get forms by adoption center ID from Firestore
export const getAdoptionFormsByAdoptionCenter = async (adoptionCenterId: string): Promise<AdoptionForm[]> => {
    try {
        const formsRef = collection(db, 'adoptionForms');
        const q = query(formsRef, where("adoptionCenterId", "==", adoptionCenterId));
        const querySnapshot = await getDocs(q);

        const forms: AdoptionForm[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as AdoptionForm));

        return forms;
    } catch (error) {
        console.error("Error fetching adoption forms by center:", error);
        throw new Error("Could not fetch adoption forms.");
    }
};

// Function to delete a form by ID from Firestore
export async function deleteForm(id: string): Promise<boolean> {
  try {
    const formDocRef = doc(db, 'adoption-forms', id);
    await deleteDoc(formDocRef);
    return true; // Deletion successful
  } catch (error) {
    console.error("Error deleting form:", error);
    return false; // Deletion failed
  }
} 