import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // ✅ SEMANTIC VARIANTS (function-based names)
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
        cta: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white", // Call-to-action buttons
        continue:
          "bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white", // Continue/next step actions
        danger: "bg-red-500 hover:bg-red-600 text-white",
        success: "bg-green-500 hover:bg-green-600 text-white",
        outline:
          "border-2 border-gray-300 hover:border-gray-400 bg-transparent",
        ghost: "hover:bg-gray-100 text-gray-700",
        link: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-8 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        default: "shadow-md",
        lg: "shadow-lg hover:shadow-xl",
        xl: "shadow-xl hover:shadow-2xl",
      },
      animation: {
        none: "",
        scale: "transform hover:scale-105",
        lift: "transform hover:-translate-y-0.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      radius: "full",
      shadow: "none",
      animation: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      shadow,
      animation,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            radius,
            shadow,
            animation,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
