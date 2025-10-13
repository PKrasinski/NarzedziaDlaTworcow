import { Badge } from "@narzedziadlatworcow.pl/ui/components/ui/badge";
import { useDesignSystem } from "design-system";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { Brain, FileText, Globe, Mic, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VoiceRecorderComponent } from "./voice-recorder";

interface MessageInputProps {
  onSendMessage: (
    message: string,
    options: { searchInternet: boolean }
  ) => void;
  transcribeVoice?: (params: { voiceMessage: File }) => Promise<any>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const MessageInput = ({
  onSendMessage,
  transcribeVoice,
  disabled = false,
  placeholder = "Napisz swoją wiadomość...",
  className,
}: MessageInputProps) => {
  const { Button } = useDesignSystem();
  const [inputValue, setInputValue] = useState("");
  const [searchInternet, setSearchInternet] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;

    onSendMessage(inputValue, { searchInternet });

    setInputValue("");
    // Clear the contentEditable div
    if (contentEditableRef.current) {
      contentEditableRef.current.textContent = "";
    }
  };

  // Keep contentEditable and state in sync
  useEffect(() => {
    if (contentEditableRef.current) {
      const currentContent = contentEditableRef.current.textContent || "";
      if (currentContent !== inputValue) {
        contentEditableRef.current.textContent = inputValue;

        // Position cursor at the end
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(contentEditableRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [inputValue]);

  const handleTranscriptionComplete = (transcription: string) => {
    // Append transcription to current input value
    const currentText = inputValue.trim();
    const newText = currentText
      ? `${currentText} ${transcription}`
      : transcription;

    setInputValue(newText);

    // Focus the contentEditable div
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
  };

  const handleRecordingEnd = () => {
    setIsRecording(false);
  };

  return (
    <div
      className={cn(
        "bg-white/90 backdrop-blur-md rounded-t-2xl sm:rounded-2xl border-2 border-border/40 shadow-2xl p-3 sm:p-4",
        className
      )}
    >
      {/* Input Form or Recording Interface */}
      {isRecording && transcribeVoice ? (
        <VoiceRecorderComponent
          onTranscriptionComplete={handleTranscriptionComplete}
          onRecordingStart={handleRecordingStart}
          onRecordingEnd={handleRecordingEnd}
          autoStart={true}
          transcribeVoice={transcribeVoice}
        />
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Main Input Area */}
          <div className="mb-3">
            <div
              ref={contentEditableRef}
              contentEditable
              suppressContentEditableWarning={true}
              onInput={(e) => setInputValue(e.currentTarget.textContent || "")}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                const selection = window.getSelection();
                if (selection?.rangeCount) {
                  const range = selection.getRangeAt(0);
                  range.deleteContents();
                  range.insertNode(document.createTextNode(text));
                  range.collapse(false);
                  selection.removeAllRanges();
                  selection.addRange(range);
                  
                  // Update the state with the new content
                  setInputValue(e.currentTarget.textContent || "");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              className="w-full px-4 py-4 sm:p-0 text-sm sm:text-base  min-h-8  max-h-40 sm:max-h-48 overflow-y-auto resize-none outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:pointer-events-none"
              style={{ wordBreak: "break-word" }}
              data-placeholder={placeholder}
            />
          </div>

          {/* Bottom Row: Badges and Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: AI Tools Toggle Badges */}
            <div className="flex flex-wrap gap-2 flex-1">
              <Badge
                variant={searchInternet ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105 text-xs",
                  searchInternet
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                )}
                onClick={() => setSearchInternet(!searchInternet)}
              >
                <Globe className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Szukaj w internecie</span>
                <span className="sm:hidden">Internet</span>
              </Badge>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700 hidden sm:block"
              >
                <FileText className="w-4 h-4" />
              </button>
              {transcribeVoice && (
                <button
                  type="button"
                  onClick={handleRecordingStart}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={disabled || !inputValue.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-3 sm:px-4 py-2 text-sm"
              >
                <Send className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Wyślij</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
