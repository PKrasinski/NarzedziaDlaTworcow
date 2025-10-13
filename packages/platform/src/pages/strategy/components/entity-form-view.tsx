import { type $type, type ArcObjectAny } from "@arcote.tech/arc";
import { Form, FormRef } from "@arcote.tech/arc-react";
import { useDesignSystem } from "design-system";
import {
  Card,
  CardContent,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { Loader2, Save } from "lucide-react";
import * as React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type EntityFormMode = "tool" | "summary";

interface EntityFormViewProps<T extends ArcObjectAny> {
  schema: T;
  data: $type<T> | null | undefined;
  onUpdate: (data: $type<T>) => Promise<void>;
  mode: EntityFormMode;
  render: (Fields: any) => React.ReactNode;
  className?: string;
  startInEditMode?: boolean;
  onEditStateChange?: (isEditing: boolean) => void;
}

interface EditModeContextType {
  isEditing: boolean;
  mode: EntityFormMode;
  setIsEditing: (editing: boolean) => void;
  hasValue: (fieldName: string) => boolean;
  save: () => Promise<void>;
}

const EditModeContext = createContext<EditModeContextType | null>(null);

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within EntityFormView");
  }
  return context;
};

export function EntityFormView<T extends ArcObjectAny>({
  schema,
  data,
  onUpdate,
  mode,
  render,
  className,
  startInEditMode = false,
  onEditStateChange,
}: EntityFormViewProps<T>) {
  const { Button } = useDesignSystem();
  const [isEditing, setIsEditing] = useState(startInEditMode);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormRef<T>>(null);

  // Notify parent about edit state changes
  useEffect(() => {
    onEditStateChange?.(isEditing);
  }, [isEditing, onEditStateChange]);

  // Create hasValue function for current data (supports dot notation for nested fields)
  const hasValue = (fieldName: string) => {
    if (!data) return false;

    // Handle dot notation for nested fields (e.g., "instagramCarousel.descriptionRules")
    if (fieldName.includes(".")) {
      const keys = fieldName.split(".");
      let current: any = data;

      for (const key of keys) {
        if (current?.[key] === undefined) {
          return false;
        }
        current = current[key];
      }

      return current !== undefined && current !== null && current !== "";
    }

    // Handle top-level fields
    const value = data[fieldName];
    return value !== undefined && value !== null && value !== "";
  };

  const handleSave = async (formData: $type<T>) => {
    setIsLoading(true);
    try {
      await onUpdate(formData);
      // Always reset editing state after successful save, regardless of mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving entity:", error);
      // Keep editing mode on error so user can retry
    } finally {
      setIsLoading(false);
    }
  };

  const save = async () => {
    if (formRef.current?.submit) {
      try {
        await formRef.current.submit();
        // Form submission completed successfully
        // The handleSave function should have set setIsEditing(false) already
      } catch (error) {
        console.error("Error saving from label:", error);
        // Keep editing mode on error
      }
    }
  };

  const editModeValue: EditModeContextType = {
    isEditing,
    mode,
    setIsEditing,
    hasValue,
    save,
  };

  // Don't render anything in tool mode if no data
  if (mode === "tool" && !data) {
    return null;
  }

  return (
    <EditModeContext.Provider value={editModeValue}>
      <div className={cn("relative", className)}>
        <Card className="bg-white/60 backdrop-blur-sm border border-white/70 transition-all duration-200">
          <CardContent className="p-4">
            <Form
              schema={schema}
              defaults={data || {}}
              onSubmit={handleSave}
              ref={formRef}
              render={(Fields) => (
                <div className="space-y-4">
                  {render(Fields)}

                  {/* Save/Cancel buttons for summary mode when editing */}
                  {isEditing && (
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-blue-200">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        Anuluj
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Zapisywanie...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Zapisz
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </EditModeContext.Provider>
  );
}
