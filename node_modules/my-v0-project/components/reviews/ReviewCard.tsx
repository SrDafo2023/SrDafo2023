import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export interface Review {
  id: string;
  clientName: string;
  petName: string;
  imageUrl: string;
  rating: number;
  feedbackText: string;
  date: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="bg-slate-800 text-white border-slate-700 shadow-lg transform hover:scale-105 transition-transform duration-300">
      <CardContent className="flex flex-col items-center text-center p-6">
        <Avatar className="w-24 h-24 mb-4 border-4 border-amber-400">
          <AvatarImage src={review.imageUrl} alt={review.clientName} />
          <AvatarFallback>{review.clientName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold text-amber-400">{review.clientName}</h3>
        <p className="text-sm text-slate-400 mb-2">Dueño/a de {review.petName}</p>
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
            />
          ))}
        </div>
        <blockquote className="mt-4 border-l-4 border-amber-400 pl-4 italic text-slate-300">
          <p>"{review.feedbackText}"</p>
        </blockquote>
         <p className="text-xs text-slate-500 mt-6 font-mono">{review.date}</p>
      </CardContent>
    </Card>
  );
} 