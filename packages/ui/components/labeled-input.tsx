import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { cn } from "../lib/utils";
import { FormMessage } from "./form-message";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function LabeledInput({
  label,
  asideLabel,
  className,
  children,
  ...props
}: FormFieldData<any> & {
  label: string;
  asideLabel?: React.ReactNode;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<"input">, "children">) {
  const { errors } = useFormField();
  return (
    <div>
      <div className="flex items-center">
        <Label
          className={cn("text-base font-medium ml-4", errors && "text-red-600")}
        >
          {label}:
        </Label>
        {asideLabel && <div className="ml-auto">{asideLabel}</div>}
      </div>
      {children || (
        <Input
          className={cn(
            "mt-2 h-12 text-base rounded-full",
            className,
            errors && "border-red-600"
          )}
          {...props}
        />
      )}
      <FormMessage className="ml-4" />
    </div>
  );
}
