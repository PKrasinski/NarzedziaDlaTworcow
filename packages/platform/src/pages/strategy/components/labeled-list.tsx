import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { ContentEditable } from "@narzedziadlatworcow.pl/ui/components/content-editable";
import { FormMessage } from "@narzedziadlatworcow.pl/ui/components/form-message";
import { useDesignSystem } from "design-system";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { Plus, X } from "lucide-react";
import * as React from "react";
import { useEditMode } from "./entity-form-view";
import { Label } from "./label";

export function LabeledList({
  label,
  icon,
  placeholder = "Wprowadź element...",
  addButtonText = "Dodaj nowy element",
  className,
  ...props
}: FormFieldData<any> & {
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  addButtonText?: string;
  className?: string;
}) {
  const { Button } = useDesignSystem();
  const { errors } = useFormField();
  const { isEditing, mode, hasValue } = useEditMode();
  const items = props.value || [];

  // In tool mode, don't render if no value
  if (mode === "tool" && !hasValue(props.name)) {
    return null;
  }

  const addItem = () => {
    const newItems = [...items, ""];
    props.onChange(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    props.onChange(newItems);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    props.onChange(newItems);
  };

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label */}
      <Label hasError={!!errors}>
        {label}
        {items.length > 0 && (
          <span className="text-xs text-gray-400">({items.length})</span>
        )}
      </Label>

      {/* Content */}
      <div className="space-y-1">
        {/* List items */}
        {items.map((item: any, index: number) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 min-h-[36px] px-3  text-sm rounded-md border transition-colors",
              isEditing
                ? "border-gray-200 hover:border-gray-300"
                : "border-transparent"
            )}
          >
            {/* Show icon for each item */}
            {icon ? (
              <div className="text-blue-600 w-4 h-4 flex-shrink-0">{icon}</div>
            ) : (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
            )}
            <ContentEditable
              value={item}
              onChange={(value) => updateItem(index, value)}
              placeholder={placeholder}
              variant="listItem"
              isEditing={isEditing}
              className="flex-1 px-0 py-0"
            />
            {/* Always reserve space for remove button to maintain consistent height */}
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add new item button - only in edit mode */}
        {isEditing && (
          <div className="border border-transparent">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addItem}
              className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto p-0 px-3 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="text-sm">{addButtonText}</span>
            </Button>
          </div>
        )}

        {/* Empty state for view mode - show "brak" in italic */}
        {!isEditing && items.length === 0 && (
          <div className="min-h-[36px] flex items-center px-3  text-sm border border-transparent rounded-md">
            <span className="text-gray-500 italic">brak</span>
          </div>
        )}
      </div>
      <FormMessage />
    </div>
  );
}
