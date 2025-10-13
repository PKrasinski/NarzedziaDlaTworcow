import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { useEditMode } from "../../platform/src/pages/strategy/components/entity-form-view";
import { ContentEditable } from "./content-editable";
import { FormMessage } from "./form-message";

export function LabeledText({
  label,
  placeholder,
  rows = 3,
  className,
  multiline = false,
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
  if (mode === "tool" && !hasValue(props.value)) {
    return null;
  }

  const displayValue = props.value || "";
  const showPlaceholder = !props.value && mode === "summary";

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-xs font-medium text-gray-500 uppercase tracking-wide",
            errors && "text-red-600"
          )}
        >
          {label}
        </span>
      </div>

      {/* Content */}
      <ContentEditable
        value={displayValue}
        onChange={props.onChange}
        placeholder={placeholder}
        variant="text"
        multiline={multiline}
        isEditing={isEditing}
        className={cn("w-full", errors && "border-red-600")}
      />
      <FormMessage />
    </div>
  );
}
