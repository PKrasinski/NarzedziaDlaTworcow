import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { object } from "@arcote.tech/arc";
import { formatSchema } from "@narzedziadlatworcow.pl/context";
import { Chat } from "@narzedziadlatworcow.pl/ui/components/chat/chat";
import { useDesignSystem } from "design-system";
import { ArrowLeft, Layout } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntityList } from "../components/entity-list";
import { NextStepButton } from "../components/next-step-button";
import { StrategyStepLayout } from "../components/strategy-step-layout";
import { formatCount } from "../utils/pluralization";
import { ContentFormatsFormFields } from "./content-formats-form-fields";
import {
  CreateFormatToolView,
  RemoveFormatToolView,
  UpdateFormatToolView,
} from "./content-formats-tool-views";

const formatObject = object(formatSchema);

const ChatView = ({
  messages,
  formats,
  onRevalidate,
  aboveChatComponent,
}: {
  messages: any[];
  formats: any[];
  onRevalidate: () => void;
  aboveChatComponent: React.ReactNode;
}) => {
  const { sendContentFormatsMessage, transcribeVoice } = useCommands();
  const { currentAccount } = useAccountWorkspaces();

  // Use messages directly without welcome message
  const allMessages = Array.isArray(messages) ? messages : [];

  return (
    <Chat
      sendMessage={sendContentFormatsMessage}
      transcribeVoice={transcribeVoice}
      messages={allMessages}
      chatId={currentAccount._id}
      placeholder="Opisz jakie formaty treści chciałbyś tworzyć..."
      onRevalidate={onRevalidate}
      toolViews={{
        createFormat: CreateFormatToolView,
        updateFormat: UpdateFormatToolView,
        removeFormat: RemoveFormatToolView,
      }}
      aboveChat={aboveChatComponent}
    />
  );
};

export const ContentFormatsPage = () => {
  const { Button } = useDesignSystem();
  const {
    completeContentFormatsStep,
    createFormatForm,
    updateFormatForm,
    removeFormat,
  } = useCommands();
  const { currentAccount } = useAccountWorkspaces();
  const navigate = useNavigate();
  const revalidate = useRevalidate();
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch data at page level
  const [messages] = useQuery(
    (q) =>
      q.contentFormatsMessages.find({
        where: {
          chatId: currentAccount._id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    [currentAccount._id],
    "content-formats-messages"
  );

  const [formats] = useQuery(
    (q) =>
      q.contentFormats.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
        orderBy: {
          _id: "asc",
        },
      }),
    [messages]
  );

  const userFormats = formats || [];

  // Handle entity list operations
  const handleCreate = async (formatData: any) => {
    await createFormatForm({
      format: formatData,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("content-formats-messages");
  };

  const handleUpdate = async (formatId: string, formatData: any) => {
    await updateFormatForm({
      formatId: formatId as any,
      formatUpdate: formatData,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("content-formats-messages");
  };

  const handleRemove = async (formatId: string) => {
    await removeFormat({
      formatId: formatId as any,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("content-formats-messages");
  };

  // Single Button Component - used in both places
  const stepButton = (() => {
    // Show button if there's at least one format
    if (!userFormats || userFormats.length === 0) return null;

    const handleNextStep = async () => {
      setIsCompleting(true);
      try {
        await completeContentFormatsStep({
          accountWorkspaceId: currentAccount._id,
        });
        navigate("/strategy/content-ideas");
      } catch (error) {
        console.error("Error completing content formats step:", error);
      } finally {
        setIsCompleting(false);
      }
    };

    return (
      <NextStepButton
        onNext={handleNextStep}
        isLoading={isCompleting}
        completionText={
          userFormats.length > 0
            ? formatCount(userFormats.length, "format")
            : undefined
        }
        loadingText="Finalizowanie kroku..."
        buttonText="Przejdź dalej"
      />
    );
  })();

  return (
    <StrategyStepLayout
      showModeSwitch={true}
      currentStep={5}
      totalSteps={7}
      title="Dobierz formaty treści"
      description="Wybierz formaty treści, które najlepiej sprawdzą się w Twojej strategii"
      videoId="88QBKsZzcEU"
      horizontalThumbnailUrl="https://i.ytimg.com/vi/BZs8lviumDs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDgl5-ura1okRZqru-m73QGTD8Kdw"
      verticalThumbnailUrl="https://i.ytimg.com/vi/88QBKsZzcEU/oar2.jpg"
      chatView={
        <ChatView
          messages={messages || []}
          formats={userFormats}
          onRevalidate={() => revalidate("content-formats-messages")}
          aboveChatComponent={stepButton}
        />
      }
      summaryView={
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/70 p-6">
          <div className="space-y-6">
            <EntityList
              title="Formaty treści"
              icon={<Layout className="w-5 h-5" />}
              entities={userFormats}
              schema={formatObject}
              addButtonText="Dodaj format"
              emptyStateTitle="Brak formatów"
              emptyStateDescription="Dodaj swój pierwszy format treści"
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              getEntityId={(format) => format.formatId || format._id}
              getEntityDisplayName={(format) =>
                format.nameAndIdea || "Nowy format"
              }
              renderFormFields={(Fields, { onRemove } = {}) => (
                <ContentFormatsFormFields Fields={Fields} onRemove={onRemove} />
              )}
            />
          </div>
          <div className="mt-6 flex justify-between items-center">
            <Button
              onClick={() => navigate("/strategy")}
              size="sm"
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-lg px-3 sm:px-4 py-2 text-sm font-semibold group"
            >
              <div className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Wstecz</span>
              </div>
            </Button>
            {stepButton}
          </div>
        </div>
      }
    />
  );
};

export default ContentFormatsPage;
