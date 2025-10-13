import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@narzedziadlatworcow.pl/ui/components/ui/tooltip";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { Pencil, Save } from "lucide-react";
import { useEditMode } from "./entity-form-view";

interface LabelProps {
  hasError?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Label({ hasError, className, children }: LabelProps) {
  const { isEditing, setIsEditing, save } = useEditMode();

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    await save();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2",
          hasError && "text-red-600"
        )}
      >
        {children}
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={isEditing ? handleSave : toggleEditMode}
              className="hover:bg-gray-100 p-0.5 rounded transition-colors cursor-pointer"
            >
              {isEditing ? (
                <Save className="w-3 h-3 text-gray-400 hover:text-gray-800" />
              ) : (
                <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-800" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isEditing ? "Zapisz zmiany" : "Edytuj"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
