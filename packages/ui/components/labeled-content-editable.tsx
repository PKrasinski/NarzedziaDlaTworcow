import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { FormMessage } from "./form-message";
import { Label } from "./ui/label";

const labeledContentEditableVariants = cva("", {
  variants: {
    size: {
      default: "",
      sm: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const labelVariants = cva("text-base font-medium ml-4", {
  variants: {
    size: {
      default: "text-base ml-4",
      sm: "text-sm ml-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const contentEditableVariants = cva(
  "w-full px-4 py-3 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm border-0 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400",
  {
    variants: {
      size: {
        default: "px-4 py-3 text-base rounded-lg mt-2",
        sm: "px-3 py-2 text-sm rounded-lg mt-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type LabeledContentEditableSize = VariantProps<
  typeof labeledContentEditableVariants
>["size"];

export function LabeledContentEditable({
  label,
  asideLabel,
  placeholder,
  rows = 3,
  size = "default",
  className,
  disabled,
  ...props
}: FormFieldData<any> & {
  label: string;
  asideLabel?: React.ReactNode;
  placeholder?: string;
  rows?: number;
  size?: LabeledContentEditableSize;
  className?: string;
  disabled?: boolean;
}) {
  const { errors } = useFormField();
  const minHeight = rows ? `${rows * 1.5}rem` : "auto";

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || "";
    props.onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey && rows === 1) {
      e.preventDefault();
    }
  };

  return (
    <div className={labeledContentEditableVariants({ size })}>
      <div className="flex items-center">
        <Label
          className={cn(labelVariants({ size }), errors && "text-red-600")}
        >
          {label}:
        </Label>
        {asideLabel && <div className="ml-auto">{asideLabel}</div>}
      </div>
      <div
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          contentEditableVariants({ size }),
          disabled && "bg-gray-50 cursor-not-allowed opacity-60",
          errors && "border-red-600",
          className
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: props.value || "" }}
      />
      <FormMessage className="ml-4" />
    </div>
  );
}