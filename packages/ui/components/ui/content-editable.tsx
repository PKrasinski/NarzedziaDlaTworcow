import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface ContentEditableProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
}

export const ContentEditable = React.forwardRef<HTMLDivElement, ContentEditableProps>(
  ({ value, onChange, placeholder, className, disabled, rows = 3 }, ref) => {
    const contentEditableRef = useRef<HTMLDivElement>(null);

    // Sync state with contentEditable
    useEffect(() => {
      if (contentEditableRef.current && contentEditableRef.current.textContent !== value) {
        contentEditableRef.current.textContent = value;
      }
    }, [value]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const newValue = e.currentTarget.textContent || "";
      onChange(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey && rows === 1) {
        e.preventDefault();
      }
    };

    const handleFocus = () => {
      if (contentEditableRef.current && contentEditableRef.current.textContent === placeholder) {
        contentEditableRef.current.textContent = "";
      }
    };

    const handleBlur = () => {
      if (contentEditableRef.current && !contentEditableRef.current.textContent?.trim()) {
        contentEditableRef.current.textContent = "";
      }
    };

    const minHeight = rows ? `${rows * 1.5}rem` : "auto";

    return (
      <div
        ref={ref || contentEditableRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "w-full px-4 py-3 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm border-0",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400",
          disabled && "bg-gray-50 cursor-not-allowed opacity-60",
          className
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    );
  }
);

ContentEditable.displayName = "ContentEditable";