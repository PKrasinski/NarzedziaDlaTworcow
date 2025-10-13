import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { ContentEditable } from "@narzedziadlatworcow.pl/ui/components/content-editable";
import { FormMessage } from "@narzedziadlatworcow.pl/ui/components/form-message";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { useEditMode } from "./entity-form-view";
import { Label } from "./label";

export function LabeledText({
  label,
  placeholder,
  rows = 3,
  className,
  multiline = false,
  onChange,
  value,
  name,
  defaultValue,
  subFields, // Destructure to exclude from spread
  ...props
}: FormFieldData<any> & {
  label: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  multiline?: boolean;
}) {
  const { errors } = useFormField();
  const { isEditing, mode, hasValue } = useEditMode();

  // In tool mode, don't render if no value
  if (mode === "tool" && !hasValue(name)) {
    return null;
  }

  const displayValue = value || "";
  const showPlaceholder = !value && mode === "summary";

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label */}
      <Label hasError={!!errors}>{label}</Label>

      {/* Content */}
      <div
        className={cn(
          "min-h-[36px] flex items-center px-3 py-2 text-sm rounded-md border transition-colors",
          isEditing
            ? "border-gray-200 hover:border-gray-300"
            : "border-transparent",
          errors && "border-red-600"
        )}
      >
        {!isEditing && !displayValue ? (
          <span className="text-gray-500 italic">brak</span>
        ) : (
          <ContentEditable
            value={displayValue}
            onChange={onChange}
            placeholder={placeholder}
            variant="text"
            multiline={multiline}
            isEditing={isEditing}
            className="w-full px-0 py-0 whitespace-pre-wrap"
          />
        )}
      </div>
      <FormMessage />
    </div>
  );
}
