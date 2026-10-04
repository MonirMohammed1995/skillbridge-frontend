import { Star } from "lucide-react";

export function TutorReviews({ reviews }: { reviews: any[] }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-sm space-y-6">
      <h3 className="text-xl font-bold tracking-tight">Student Reviews</h3>
      
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet for this tutor.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 rounded-2xl border border-border/40 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{review.studentName}</span>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
              <span className="text-[10px] text-muted-foreground block">{review.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}