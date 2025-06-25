'use client'

import { ReviewCard, type Review } from "@/components/reviews/ReviewCard";
import { getGroomingReviews } from "@/lib/review-service";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function GroomingReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const fetchedReviews = await getGroomingReviews();
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        // Opcional: podrías mostrar un mensaje de error en la UI
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.header 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Feedback de Clientes</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Esto es lo que nuestros valiosos clientes opinan sobre nuestros servicios de grooming.
        </p>
      </motion.header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-muted-foreground mt-16">
          <p>Aún no hay reseñas disponibles.</p>
          <p className="text-sm">¡Vuelve pronto!</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index + 0.3 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 