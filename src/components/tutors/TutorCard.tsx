import Link from "next/link";
import { Star, GraduationCap, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TutorCardProps {
  tutor: {
    id: string;
    name: string;
    bio?: string;
    category?: { name: string };
    hourlyRate?: number;
    rating?: number;
  };
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 font-bold text-xl uppercase">
            {tutor.name?.charAt(0) || "T"}
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{tutor.name}</h3>
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
              {tutor.category?.name || "General Tutor"}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {tutor.bio || "Passionate educator ready to help you master new skills."}
        </p>

        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-2 border-t border-border/40">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="size-4 fill-amber-500" />
            <span>{tutor.rating || "4.9"} (Reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-foreground font-bold">
            <DollarSign className="size-3.5 text-indigo-600" />
            <span>{tutor.hourlyRate || "50"} / hr</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href={`/tutors/${tutor.id}`} className="w-full">
          <Button className="w-full rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
            View Profile & Book
          </Button>
        </Link>
      </div>
    </div>
  );
}