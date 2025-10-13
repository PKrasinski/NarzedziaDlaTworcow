import { FormMessage as ArcFormMessage } from "@arcote.tech/arc-react";
import { cn } from "../lib/utils";
export function FormMessage({ className }: { className?: string }) {
  return <ArcFormMessage className={cn("text-xs text-red-600", className)} />;
}
