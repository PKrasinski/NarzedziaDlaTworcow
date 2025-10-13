import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { FormMessage } from "./form-message";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function LabeledPasswordInput({
  label,
  asideLabel,
  className,
  ...props
}: FormFieldData<any> & {
  label: string;
  asideLabel?: React.ReactNode;
} & Omit<React.ComponentProps<"input">, "type">) {
  const { errors } = useFormField();
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="relative mt-2">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-12", className)}
          error={!!errors}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          disabled={props.disabled}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      <FormMessage className="ml-4" />
    </div>
  );
}
