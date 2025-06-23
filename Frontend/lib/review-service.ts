import { collection, getDocs, orderBy, query } from "firebase/firestore";
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