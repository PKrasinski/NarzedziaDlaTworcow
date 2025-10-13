import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { FormMessage } from "@narzedziadlatworcow.pl/ui/components/form-message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@narzedziadlatworcow.pl/ui/components/ui/select";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import * as React from "react";
import { useEditMode } from "./entity-form-view";
import { Label } from "./label";

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export function LabeledSelect({
  label,
  options,
  placeholder = "Wybierz opcję...",
  icon,
  className,
  ...props
}: FormFieldData<any> & {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  const { errors } = useFormField();
  const { isEditing, mode, hasValue } = useEditMode();

  // In tool mode, don't render if no value
  if (mode === "tool" && !hasValue(props.name)) {
    return null;
  }

  const selectedOption = options.find((option) => option.value === props.value);

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label */}
      <Label hasError={!!errors}>
        {icon}
        {label}
      </Label>

      {/* Content */}
      {!isEditing ? (
        <div className="text-gray-900 min-h-[36px] h-[36px] flex items-center px-3 py-2 text-sm border border-transparent rounded-md">
          {selectedOption ? (
            <div className="flex items-center gap-2">
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            <span className="text-gray-500 italic">{placeholder}</span>
          )}
        </div>
      ) : (
        <Select value={props.value || ""} onValueChange={props.onChange}>
          <SelectTrigger
            className={cn(
              "min-h-[36px] h-[36px] border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-0 transition-colors px-3 py-2 text-sm rounded-md",
              errors && "border-red-600"
            )}
          >
            <SelectValue placeholder={placeholder}>
              {selectedOption ? (
                <div className="flex items-center gap-2">
                  {selectedOption.icon}
                  <span>{selectedOption.label}</span>
                </div>
              ) : (
                placeholder
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <FormMessage />
    </div>
  );
}
