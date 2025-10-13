import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import * as React from "react";
import { useEffect, useRef } from "react";

interface ContentEditableProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isEditing?: boolean;
  className?: string;
  variant?: "title" | "text" | "listItem";
  multiline?: boolean;
}

export const ContentEditable: React.FC<ContentEditableProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  isEditing = true,
  className,
  variant = "text",
  multiline = false,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Update content when value prop changes and is different from current content
  useEffect(() => {
    if (contentRef.current) {
      const currentText = contentRef.current.textContent || "";
      if (currentText !== value) {
        contentRef.current.textContent = value;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (contentRef.current && !disabled && isEditing) {
      const newValue = contentRef.current.textContent || "";
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.blur();
    }
  };

  return (
    <div
      ref={contentRef}
      contentEditable={!disabled && isEditing}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={cn(
        // Make it behave like content
        isEditing ? "cursor-text" : "cursor-default",
        // Remove default outline
        "outline-none",
        // Rounded corners for better visual
        "rounded-sm",
        // Padding controlled by parent component
        "px-0 py-0",
        // Prevent default browser styling
        "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400",
        // Custom className
        className
      )}
      data-placeholder={!value && placeholder && isEditing ? placeholder : ""}
      suppressContentEditableWarning={true}
    />
  );
};
