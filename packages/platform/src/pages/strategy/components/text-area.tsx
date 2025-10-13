import { FormMessage } from "@arcote.tech/arc-react";
import { Textarea } from "@narzedziadlatworcow.pl/ui/components/ui/textarea";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function TextArea({ className, error, ...props }: TextAreaProps) {
  return (
    <div className="space-y-2">
      <Textarea
        className={cn(
          "min-h-[80px] border-border rounded-lg bg-white/70 resize-none",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <div className="text-destructive">
          <FormMessage>{error}</FormMessage>
        </div>
      )}
    </div>
  );
}
