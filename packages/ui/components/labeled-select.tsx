import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { FormMessage } from "./form-message";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const labeledSelectVariants = cva("", {
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

const selectTriggerVariants = cva("h-12 text-base rounded-full mt-2", {
  variants: {
    size: {
      default: "h-12 text-base rounded-full mt-2",
      sm: "h-9 text-sm rounded-full mt-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type LabeledSelectSize = VariantProps<
  typeof labeledSelectVariants
>["size"];

export function LabeledSelect({
  label,
  asideLabel,
  options,
  size = "default",
  position = "item-aligned",
  ...props
}: FormFieldData<any> & {
  label: string;
  asideLabel?: React.ReactNode;
  options: { id: string; name: string }[];
  size?: LabeledSelectSize;
  position?: "item-aligned" | "popper";
}) {
  const { errors } = useFormField();
  return (
    <div className={labeledSelectVariants({ size })}>
      <div className="flex items-center">
        <Label
          className={cn(labelVariants({ size }), errors && "text-red-600")}
        >
          {label}:
        </Label>
        {asideLabel && <div className="ml-auto">{asideLabel}</div>}
      </div>
      <Select
        defaultValue={props.defaultValue}
        value={props.value}
        onValueChange={props.onChange}
      >
        <SelectTrigger className={selectTriggerVariants({ size })}>
          <SelectValue placeholder={`Wybierz ${label.toLowerCase()}...`} />
        </SelectTrigger>
        <SelectContent position={position}>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage className="ml-4" />
    </div>
  );
}
