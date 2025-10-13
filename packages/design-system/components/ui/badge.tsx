import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        dashed: "border-dashed border-2 border-gray-300 bg-transparent text-gray-600 hover:border-gray-400 hover:text-gray-700",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs", 
        lg: "px-4 py-2 text-sm",
        xl: "px-6 py-3 text-base",
      },
      clickable: {
        true: "cursor-pointer hover:opacity-80 active:scale-95",
        false: "cursor-default",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      clickable: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, clickable, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant, size, clickable }), className)} 
      {...props} 
    />
  );
}

export { Badge, badgeVariants };
