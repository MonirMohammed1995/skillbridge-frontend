import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
  xl: "size-12",
};

export function LoadingSpinner({
  size = "lg",
  text = "Loading...",
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3 p-6", className)}>
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Glow Ring */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping"></div>
        <Loader2 className={cn("animate-spin text-indigo-600 dark:text-indigo-400 relative z-10", sizeMap[size])} />
      </div>
      {text && (
        <p className="text-sm font-semibold tracking-wide text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}