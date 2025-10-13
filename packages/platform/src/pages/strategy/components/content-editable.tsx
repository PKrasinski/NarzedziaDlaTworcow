import { FormMessage } from "@arcote.tech/arc-react";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ContentEditableProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

export function ContentEditable({
  value = "",
  onChange,
  onBlur,
  placeholder,
  className,
  maxLength = 1000,
}: ContentEditableProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== value) {
      contentRef.current.textContent = value;
      setCharCount(value.length);
      setIsEmpty(!value);
    }
  }, [value]);

  const handleInput = () => {
    const content = contentRef.current?.textContent || "";
    const isContentEmpty = !content || content.trim().length === 0;

    if (isContentEmpty) {
      contentRef.current!.textContent = "";
      onChange?.("");
      setCharCount(0);
      setIsEmpty(true);
      return;
    }

    setIsEmpty(false);

    if (content.length <= maxLength) {
      onChange?.(content);
      setCharCount(content.length);
    } else {
      const truncated = content.slice(0, maxLength);
      if (contentRef.current) {
        contentRef.current.textContent = truncated;
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(contentRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      onChange?.(truncated);
      setCharCount(maxLength);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const currentContent = contentRef.current?.textContent || "";

    const selection = window.getSelection();
    const selectedLength = selection?.toString().length || 0;
    const availableSpace = maxLength - (currentContent.length - selectedLength);
    const textToInsert = text.slice(0, availableSpace);

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(textToInsert));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      contentRef.current?.appendChild(document.createTextNode(textToInsert));
    }

    handleInput();
  };

  const counterClasses = cn(
    "text-muted-foreground transition-colors duration-200",
    charCount >= maxLength && "text-destructive",
    charCount >= maxLength * 0.9 && charCount < maxLength && "text-amber-500"
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        {isEmpty && (
          <div className="absolute inset-0 pointer-events-none p-4 text-muted-foreground/40">
            {placeholder}
          </div>
        )}
        <div
          ref={contentRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onBlur={onBlur}
          className={cn(
            "min-h-[200px] p-4 rounded-lg outline-none",
            "border-2 border-gray-100 hover:border-gray-200",
            "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10",
            "transition-all duration-200",
            className
          )}
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
        />
      </div>
      <div className="flex justify-between items-center text-sm">
        <div className="text-destructive">
          <FormMessage />
        </div>
        <div className={counterClasses}>
          {charCount}/{maxLength}
        </div>
      </div>
    </div>
  );
}
