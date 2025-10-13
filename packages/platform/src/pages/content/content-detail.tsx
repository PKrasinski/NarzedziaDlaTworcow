import { useCustomToast } from "@/hooks/use-toast-custom";
import { useContent } from "@/providers/content-provider";
import { Chat } from "@narzedziadlatworcow.pl/ui/components/chat/chat";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function ContentDetailPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const { showDevelopmentToast } = useCustomToast();
  const { getContentWithFormat } = useContent();
  const [messages] = useState<any[]>([]);

  const contentData = getContentWithFormat(contentId!);
  const content = contentData?.content;

  // Mock welcome message
  const welcomeMessage = {
    _id: "welcome-message",
    chatId: contentId,
    createdAt: new Date(0).toISOString(),
    author: {
      type: "assistant",
    },
    parts: [
      {
        type: "text",
        value: `Cześć! 👋

Jestem Twoim asystentem AI do pracy z treścią "${content?.title || 'treścią'}".

Mogę Ci pomóc w:
• **Edytowaniu** istniejących elementów treści
• **Tworzeniu nowych** elementów (scenariusze, posty, filmy)
• **Optymalizacji** treści pod konkretne platformy
• **Planowaniu** harmonogramu publikacji

Napisz, nad czym chcesz dziś popracować!`,
      },
    ],
  };

  // Mock send message function
  const handleSendMessage = async (message: any) => {
    showDevelopmentToast();
    return Promise.resolve();
  };

  // Mock transcribe function
  const handleTranscribeVoice = async (audio: any) => {
    showDevelopmentToast();
    return Promise.resolve();
  };

  // Combine welcome message with actual messages
  const allMessages = [welcomeMessage, ...messages];

  return (
    <div className="h-full flex flex-col justify-end">
      <Chat
        sendMessage={handleSendMessage}
        transcribeVoice={handleTranscribeVoice}
        messages={allMessages}
        chatId={contentId || 'mock-chat'}
        placeholder="Opisz, co chcesz zrobić z tą treścią..."
        onRevalidate={() => {}}
        toolViews={{}}
      />
    </div>
  );
}