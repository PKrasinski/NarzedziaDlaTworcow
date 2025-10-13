import { useRef } from "react";
import { ChatMessage } from "./chat-message";
import { MessageInput } from "./message-input";
import type { ToolViews } from "./types";

interface ChatProps {
  // Arc command functions (from useCommands hook) - use any to avoid type conflicts
  sendMessage: any;
  transcribeVoice: any;

  // Data from Arc queries - use any to avoid type conflicts with Arc framework types
  messages: any[];
  chatId: string;

  // Optional customization
  className?: string;
  placeholder?: string;
  onRevalidate?: () => void;
  toolViews?: ToolViews;
  aboveChat?: React.ReactNode;
}

export const Chat = ({
  sendMessage,
  transcribeVoice,
  messages = [],
  chatId,
  className,
  placeholder,
  onRevalidate,
  toolViews,
  aboveChat,
}: ChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const handleSendMessage = async (
    message: string,
    options: { searchInternet: boolean }
  ) => {
    if (!message.trim()) return;

    // Get the last assistant message to continue the conversation thread
    const assistantMessages = messages?.filter(
      (msg: any) => msg.author.type === "assistant"
    );
    const lastAssistantMessage =
      assistantMessages?.[assistantMessages.length - 1];

    // Convert message to parts structure
    const parts = [{ type: "text", value: message }];
    const enabledTools = options.searchInternet ? ["web_search"] : [];

    const result = await sendMessage({
      chatId,
      parts,
      enabledTools,
      previousResponseId: lastAssistantMessage?._id || null,
    });

    // Revalidate immediately after sending to show user message
    if (onRevalidate) {
      onRevalidate();
    }

    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  };

  if (!messages) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ""}`}>
      {/* Messages Container */}
      <div className="space-y-4 pb-60 sm:pb-80">
        {messages.map((message: any) => (
          <ChatMessage
            key={message._id}
            message={message}
            toolViews={toolViews}
            onRevalidate={onRevalidate}
          />
        ))}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Input Container */}
      <div
        className="fixed bottom-0 sm:bottom-6 left-0 sm:px-4 z-10 right-0"
        style={{
          right: "var(--removed-body-scroll-bar-size, 0px)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Offset for video column */}
            <div className="col-span-12 lg:col-span-3 lg:col-start-1"></div>

            {/* Input section aligned with content */}
            <div className="col-span-12 lg:col-span-9 space-y-3">
              {/* Above Chat Content */}
              {aboveChat && (
                <div className="flex justify-end mr-4">{aboveChat}</div>
              )}

              {/* Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                transcribeVoice={transcribeVoice}
                placeholder={placeholder}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
