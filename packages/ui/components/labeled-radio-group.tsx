import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { FormMessage } from "./form-message";
import { Label } from "./ui/label";

const labeledRadioGroupVariants = cva("", {
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

const radioContainerVariants = cva("grid gap-3 mt-2", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    },
    size: {
      default: "gap-3",
      sm: "gap-2",
    },
  },
  defaultVariants: {
    columns: 2,
    size: "default",
  },
});

const radioItemVariants = cva(
  "flex items-center space-x-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors",
  {
    variants: {
      size: {
        default: "p-3",
        sm: "p-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type LabeledRadioGroupSize = VariantProps<
  typeof labeledRadioGroupVariants
>["size"];

export type LabeledRadioGroupColumns = VariantProps<
  typeof radioContainerVariants
>["columns"];

export interface RadioOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export function LabeledRadioGroup({
  label,
  asideLabel,
  options,
  size = "default",
  columns = 2,
  name,
  ...props
}: FormFieldData<any> & {
  label: string;
  asideLabel?: React.ReactNode;
  options: RadioOption[];
  size?: LabeledRadioGroupSize;
  columns?: LabeledRadioGroupColumns;
  name: string;
}) {
  const { errors } = useFormField();

  return (
    <div className={labeledRadioGroupVariants({ size })}>
      <div className="flex items-center">
        <Label
          className={cn(labelVariants({ size }), errors && "text-red-600")}
        >
          {label}:
        </Label>
        {asideLabel && <div className="ml-auto">{asideLabel}</div>}
      </div>
      <div className={radioContainerVariants({ columns, size })}>
        {options.map((option) => (
          <label
            key={option.value}
            className={radioItemVariants({ size })}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={props.value === option.value}
              onChange={(e) => props.onChange?.(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            {option.icon && (
              <span className="w-4 h-4 text-gray-500">{option.icon}</span>
            )}
            <span className="text-sm font-medium text-gray-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      <FormMessage className="ml-4" />
    </div>
  );
}