import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { useEffect, useState } from "react";
import { MessagePartComponent } from "./message-part";
import type { ToolViews } from "./types";

interface ChatMessageProps {
  message: any; // Use any to handle Arc framework types flexibly
  className?: string;
  toolViews?: ToolViews;
  onRevalidate?: () => void;
}

export const ChatMessage = ({
  message,
  className,
  toolViews,
  onRevalidate,
}: ChatMessageProps) => {
  const [streamingParts, setStreamingParts] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const isAssistant = message.author.type === "assistant";
  const originalParts = message.parts || [];
  const isGenerating = message.generation?.status === "generating";

  // Use streaming parts if streaming, otherwise use original parts
  const parts = isStreaming ? streamingParts : originalParts;

  // Handle streaming connection for generating messages
  useEffect(() => {
    if (isGenerating && message.generation?.streamUrl) {
      setIsStreaming(true);
      // Start with original parts as base
      setStreamingParts([...originalParts]);

      const eventSource = new EventSource(message.generation.streamUrl);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "start") {
          // Just acknowledge start, no content to set
        } else if (data.type === "chunk") {
          setStreamingParts((currentParts) => {
            const newParts = [...currentParts];
            const lastPartIndex = newParts.length - 1;
            const lastPart = newParts[lastPartIndex];

            // If last part is text, append chunk to it
            if (lastPart && lastPart.type === "text") {
              newParts[lastPartIndex] = {
                ...lastPart,
                value: lastPart.value + data.chunk,
              };
            } else {
              // Otherwise, create new text part
              newParts.push({ type: "text", value: data.chunk });
            }
            return newParts;
          });
        } else if (data.type === "replay") {
          setStreamingParts((currentParts) => {
            const newParts = [...currentParts];
            const lastPartIndex = newParts.length - 1;
            const lastPart = newParts[lastPartIndex];

            // If last part is text, replace its content
            if (lastPart && lastPart.type === "text") {
              newParts[lastPartIndex] = {
                ...lastPart,
                value: data.content,
              };
            } else {
              // Otherwise, create new text part
              newParts.push({ type: "text", value: data.content });
            }
            return newParts;
          });
        } else if (data.type === "tool") {
          setStreamingParts((currentParts) => [
            ...currentParts,
            data.toolResult,
          ]);
        } else if (data.type === "done") {
          setIsStreaming(false);
          eventSource.close();
          if (onRevalidate) {
            onRevalidate();
          }
        } else if (data.type === "ping") {
          // Keep-alive ping, no action needed
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error in ChatMessage:", error);
        setIsStreaming(false);
        setStreamingParts([]);
        eventSource.close();
      };

      // Clean up on unmount or when generation stops
      return () => {
        eventSource.close();
        setIsStreaming(false);
        setStreamingParts([]);
      };
    }
  }, [
    isGenerating,
    message.generation?.streamUrl,
    onRevalidate,
    originalParts,
  ]);

  return (
    <div
      className={cn(
        "w-full flex",
        isAssistant ? "justify-start" : "justify-end",
        className
      )}
    >
      <div
        className={cn(
          "rounded-xl p-4 backdrop-blur-sm border border-white/20 shadow-lg",
          isAssistant ? "bg-white/60 max-w-4xl" : "bg-blue-50/60 max-w-3xl"
        )}
      >
        {isAssistant ? (
          <div className="space-y-2">
            {/* Show generation status if generating but no content */}
            {isGenerating && parts.length === 0 && (
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="relative">
                  <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-r-blue-300 rounded-full animate-spin animation-delay-150"></div>
                </div>
                <span className="text-sm font-medium animate-pulse">
                  Generowanie odpowiedzi...
                </span>
              </div>
            )}

            {/* Render all parts (both permanent and streaming) */}
            {parts.map((part: any, index: number) => (
              <MessagePartComponent
                key={index}
                part={part}
                toolViews={toolViews}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Render user message parts */}
            {parts.map((part: any, index: number) => (
              <MessagePartComponent
                key={index}
                part={part}
                toolViews={toolViews}
              />
            ))}

            {/* Fallback for empty parts */}
            {parts.length === 0 && (
              <div className="text-gray-800 text-sm">No content</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
