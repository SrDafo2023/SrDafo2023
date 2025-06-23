import { collection, getDocs, orderBy, query, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase/firebase";
import { Review } from "@/components/reviews/ReviewCard";

export async function getGroomingReviews(): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, "groomingReviews");
    const q = query(reviewsRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No reviews found in 'groomingReviews' collection.");
      return [];
    }

    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        clientName: data.clientName,
        petName: data.petName,
        imageUrl: data.imageUrl,
        rating: data.rating,
        feedbackText: data.feedbackText,
        date: data.date,
      });
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching grooming reviews:", error);
    // En un caso real, podrías lanzar el error o manejarlo de otra forma
    return [];
  }
}

export async function getPetshopReviews(): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, "petshopReviews");
    const q = query(reviewsRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No reviews found in 'petshopReviews' collection.");
      return [];
    }

    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        clientName: data.clientName,
        petName: data.petName,
        imageUrl: data.imageUrl,
        rating: data.rating,
        feedbackText: data.feedbackText,
        date: data.date,
      });
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching petshop reviews:", error);
    return [];
  }
}

type NewReviewData = Omit<Review, 'id' | 'date'>;

export async function addReview(
  reviewData: NewReviewData, 
  service: 'grooming' | 'petshop'
): Promise<{ success: boolean; id?: string; error?: unknown }> {
  try {
    const collectionName = service === 'grooming' ? 'groomingReviews' : 'petshopReviews';
    const docData = {
      ...reviewData,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    
    const docRef = await addDoc(collection(db, collectionName), docData);
    
    console.log("Review document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding review document: ", error);
    return { success: false, error };
  }
} 