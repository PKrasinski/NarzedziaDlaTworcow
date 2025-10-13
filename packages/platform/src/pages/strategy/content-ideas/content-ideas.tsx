import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { object } from "@arcote.tech/arc";
import { ideaSchema } from "@narzedziadlatworcow.pl/context";
import { Chat } from "@narzedziadlatworcow.pl/ui/components/chat/chat";
import { useDesignSystem } from "design-system";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntityList } from "../components/entity-list";
import { NextStepButton } from "../components/next-step-button";
import { StrategyStepLayout } from "../components/strategy-step-layout";
import { formatCount } from "../utils/pluralization";
import { ContentIdeasFormFields } from "./content-ideas-form-fields";
import { CreateIdeaToolView, UpdateIdeaToolView, RemoveIdeaToolView } from "./content-ideas-tool-views";

const ideaObject = object(ideaSchema);

// Calculate completion percentage
const calculateCompletionPercentage = (ideas: any[], formats: any[]) => {
  if (!formats || formats.length === 0) return 0;
  if (!ideas || ideas.length === 0) return 0;
  const expectedIdeas = Math.min(formats.length * 2, 10);
  return Math.min(Math.round((ideas.length / expectedIdeas) * 100), 100);
};

const ChatView = ({
  messages,
  ideas,
  formats,
  onRevalidate,
  aboveChatComponent,
}: {
  messages: any[];
  ideas: any[];
  formats: any[];
  onRevalidate: () => void;
  aboveChatComponent: React.ReactNode;
}) => {
  const { sendContentIdeasMessage, transcribeVoice } = useCommands();
  const { currentAccount } = useAccountWorkspaces();

  // Use messages directly without welcome message
  const allMessages = Array.isArray(messages) ? messages : [];

  return (
    <Chat
      sendMessage={sendContentIdeasMessage}
      transcribeVoice={transcribeVoice}
      messages={allMessages}
      chatId={currentAccount._id}
      placeholder="Opisz jakie pomysły na treści chciałbyś stworzyć..."
      onRevalidate={onRevalidate}
      toolViews={{
        createIdea: CreateIdeaToolView,
        updateIdea: UpdateIdeaToolView,
        removeIdea: RemoveIdeaToolView,
      }}
      aboveChat={aboveChatComponent}
    />
  );
};


export const ContentIdeasPage = () => {
  const { Button } = useDesignSystem();
  const { completeContentIdeasStep, createIdeaForm, updateIdeaForm, removeIdea } = useCommands();
  const { currentAccount } = useAccountWorkspaces();
  const navigate = useNavigate();
  const revalidate = useRevalidate();
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch data at page level
  const [messages] = useQuery(
    (q) =>
      q.contentIdeasMessages.find({
        where: {
          chatId: currentAccount._id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    [currentAccount._id],
    "content-ideas-messages"
  );

  const [ideas] = useQuery(
    (q) =>
      q.contentIdeas.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
        orderBy: {
          _id: "asc",
        },
      }),
    [messages]
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
    [currentAccount._id]
  );

  const userIdeas = ideas || [];
  const userFormats = formats || [];

  // Handle entity list operations
  const handleCreate = async (ideaData: any) => {
    await createIdeaForm({
      idea: ideaData,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("content-ideas-messages");
  };

  const handleUpdate = async (ideaId: string, ideaData: any) => {
    await updateIdeaForm({
      ideaId: ideaId as any,
      ideaUpdate: ideaData,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("content-ideas-messages");
  };

  const handleRemove = async (ideaId: string) => {
    await removeIdea({
      ideaId: ideaId as any,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("content-ideas-messages");
  };


  // Single Button Component - used in both places
  const completionPercentage = calculateCompletionPercentage(userIdeas, userFormats);

  const stepButton = (() => {
    if (completionPercentage < 30) return null;

    const handleNextStep = async () => {
      setIsCompleting(true);
      try {
        await completeContentIdeasStep({ accountWorkspaceId: currentAccount._id });
        navigate("/content/calendar");
      } catch (error) {
        console.error("Error completing content ideas step:", error);
      } finally {
        setIsCompleting(false);
      }
    };

    return (
      <NextStepButton
        onNext={handleNextStep}
        isLoading={isCompleting}
        completionText={userIdeas.length > 0 ? formatCount(userIdeas.length, "idea") : undefined}
        loadingText="Finalizowanie kroku..."
        buttonText="Przejdź dalej"
      />
    );
  })();

  return (
    <StrategyStepLayout
      showModeSwitch={true}
      currentStep={6}
      totalSteps={7}
      title="Wygeneruj pomysły na treści"
      description="Stwórz konkretne pomysły na treści oparte na Twoich formatach"
      videoId="88QBKsZzcEU"
      horizontalThumbnailUrl="https://i.ytimg.com/vi/BZs8lviumDs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDgl5-ura1okRZqru-m73QGTD8Kdw"
      verticalThumbnailUrl="https://i.ytimg.com/vi/88QBKsZzcEU/oar2.jpg"
      chatView={
        <ChatView
          messages={messages || []}
          ideas={userIdeas}
          formats={userFormats}
          onRevalidate={() => revalidate("content-ideas-messages")}
          aboveChatComponent={stepButton}
        />
      }
      summaryView={
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/70 p-6">
          <div className="space-y-6">
            <EntityList
              title="Pomysły na treści"
              icon={<Lightbulb className="w-5 h-5" />}
              entities={userIdeas}
              schema={ideaObject}
              addButtonText="Dodaj pomysł"
              emptyStateTitle="Brak pomysłów"
              emptyStateDescription="Dodaj swój pierwszy pomysł na treść"
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              getEntityId={(idea) => idea.ideaId || idea._id}
              getEntityDisplayName={(idea) => idea.title || "Nowy pomysł"}
              renderFormFields={(Fields, { onRemove, entity } = {}) => (
                <ContentIdeasFormFields 
                  Fields={Fields} 
                  onRemove={onRemove} 
                  ideaId={entity?.ideaId || entity?._id}
                />
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

export default ContentIdeasPage;