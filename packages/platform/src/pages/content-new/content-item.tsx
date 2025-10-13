import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { useDesignSystem } from "design-system";
import { Chat } from "@narzedziadlatworcow.pl/ui/components/chat/chat";
import { useParams } from "react-router-dom";
import { ContentItemSidebar } from "./components/content-item-sidebar";
import { useContent } from "./content-provider";
import { UpdateContentToolView } from "./content-tool-views";

export function ContentItemPage() {
  const { itemId } = useParams<{ itemId: any }>();
  const { content, isLoading } = useContent();
  const { sendContentMessage, transcribeVoice } = useCommands();
  const { currentAccount } = useAccountWorkspaces();
  const revalidate = useRevalidate();
  const { SidebarLayout } = useDesignSystem();

  // Find the current content item
  const currentContent = content.find((item) => item._id === itemId);

  // Fetch messages for this specific content item
  const [messagesResult] = useQuery(
    (q) =>
      q.contentMessages.find({
        where: {
          chatId: itemId,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    [itemId],
    `content-messages-${itemId}`
  );

  const messages = Array.isArray(messagesResult) ? messagesResult : [];

  if (isLoading) {
    return (
      <SidebarLayout 
        sidebar={<ContentItemSidebar />}
        sidebarSize="compact"
        defaultSidebarSize={30}
        storageKey="content-item-sidebar"
        sticky={true}
        stickyOffset={80}
        className="min-h-screen"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ładowanie treści...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!currentContent) {
    return (
      <SidebarLayout 
        sidebar={<ContentItemSidebar />}
        sidebarSize="compact"
        defaultSidebarSize={30}
        storageKey="content-item-sidebar"
        sticky={true}
        stickyOffset={80}
        className="min-h-screen"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Treść nie znaleziona
            </h2>
            <p className="text-gray-600">
              Nie można znaleźć treści o podanym ID.
            </p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout 
      sidebar={<ContentItemSidebar />}
      sidebarSize="compact"
      defaultSidebarSize={30}
      storageKey="content-item-sidebar"
      sticky={true}
      stickyOffset={80}
      className="min-h-screen"
    >
      {/* Main Content Area */}
      <div className="h-full p-4 md:p-8">
        <div className="w-full">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Chat z treścią
            </h1>
            <p className="text-gray-600">
              Rozmawiaj z AI o treści "
              {currentContent?.title || "Bez tytułu"}"
            </p>
          </div>

          {/* Chat Component */}
          <Chat
            sendMessage={
              (sendContentMessage as any) || (() => Promise.resolve())
            }
            transcribeVoice={transcribeVoice}
            messages={messages || []}
            chatId={itemId}
            placeholder={`Zapytaj AI o treść "${
              currentContent?.title || "tę treść"
            }"...`}
            onRevalidate={() => revalidate(`content-messages-${itemId}`)}
            toolViews={{
              updateContentByAi: UpdateContentToolView,
            }}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
