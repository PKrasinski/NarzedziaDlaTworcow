import { Check, Circle } from "lucide-react";
import { cn } from "../lib/utils";

export interface ProgressIndicatorProps {
  isCompleted?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function ProgressIndicator({
  isCompleted = false,
  size = "default",
  className,
}: ProgressIndicatorProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (isCompleted) {
    return (
      <div
        className={cn(
          "rounded-full bg-green-100 text-green-600 flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        <Check className={cn(sizeClasses[size])} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-orange-100 text-orange-600 flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <Circle className={cn(sizeClasses[size])} />
    </div>
  );
}