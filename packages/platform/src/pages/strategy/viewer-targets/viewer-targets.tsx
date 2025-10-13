import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { object } from "@arcote.tech/arc";
import { personaSchema } from "@narzedziadlatworcow.pl/context";
import { Chat } from "@narzedziadlatworcow.pl/ui/components/chat/chat";
import { useDesignSystem } from "design-system";
import { ArrowLeft, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntityList } from "../components/entity-list";
import { NextStepButton } from "../components/next-step-button";
import { StrategyStepLayout } from "../components/strategy-step-layout";
import { formatCount } from "../utils/pluralization";
import {
  CreatePersonaToolView,
  RemovePersonaToolView,
  SetViewerTargetsToolView,
  UpdatePersonaToolView,
} from "./viewer-targets-tool-views";
import { ViewerTargetsFormFields } from "./viewer-targets-form-fields";

const personaObject = object(personaSchema);

// Calculate completion percentage of viewer targets
const calculateCompletionPercentage = (personas: any[]) => {
  if (!personas || personas.length === 0) return 0;

  const importantFields = [
    "name",
    "lifestyle",
    "motivations",
    "challenges",
    "knowledgeLevel",
  ];
  let completedFields = 0;
  let totalFields = personas.length * importantFields.length;

  personas.forEach((persona: any) => {
    importantFields.forEach((field) => {
      if (field === "challenges" && persona[field]?.length > 0)
        completedFields++;
      else if (field !== "challenges" && persona[field]) completedFields++;
    });
  });

  return Math.round((completedFields / totalFields) * 100);
};


const ChatView = ({
  messages,
  viewerTargets,
  onRevalidate,
  aboveChatComponent,
}: {
  messages: any[];
  viewerTargets: any[];
  onRevalidate: () => void;
  aboveChatComponent: React.ReactNode;
}) => {
  const { sendViewerTargetsMessage, transcribeVoice } = useCommands();
  const { currentAccount } = useAccountWorkspaces();

  // Use messages directly without welcome message
  const allMessages = Array.isArray(messages) ? messages : [];

  return (
    <Chat
      sendMessage={sendViewerTargetsMessage}
      transcribeVoice={transcribeVoice}
      messages={allMessages}
      chatId={currentAccount._id}
      placeholder="Opisz swoich odbiorców..."
      onRevalidate={onRevalidate}
      toolViews={{
        createPersona: CreatePersonaToolView,
        updatePersona: UpdatePersonaToolView,
        removePersona: RemovePersonaToolView,
        setViewerTargets: SetViewerTargetsToolView,
      }}
      aboveChat={aboveChatComponent}
    />
  );
};

export const ViewerTargetsPage = () => {
  const { Button } = useDesignSystem();
  const { completeViewerTargetsStep, createPersonaForm, updatePersonaForm, removePersona } = useCommands();
  const { currentAccount } = useAccountWorkspaces();
  const navigate = useNavigate();
  const revalidate = useRevalidate();
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch data at page level
  const [messages] = useQuery(
    (q) =>
      q.viewerTargetsMessages.find({
        where: {
          chatId: currentAccount._id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    [currentAccount._id],
    "viewerTargets-messages"
  );

  const [viewerTargets] = useQuery(
    (q) =>
      q.viewerTargets.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
        orderBy: {
          _id: "asc",
        },
      }),
    [messages]
  );

  const userPersonas = viewerTargets || [];

  // Handle entity list operations
  const handleCreate = async (persona: any) => {
    await createPersonaForm({
      persona,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("viewerTargets-messages");
  };

  const handleUpdate = async (personaId: any, persona: any) => {
    await updatePersonaForm({
      personaId,
      personaUpdate: persona,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("viewerTargets-messages");
  };

  const handleRemove = async (personaId: any) => {
    await removePersona({
      personaId,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("viewerTargets-messages");
  };


  // Single Button Component - used in both places
  const completionPercentage = calculateCompletionPercentage(userPersonas);

  const stepButton = (() => {
    if (completionPercentage < 40) return null;

    const handleNextStep = async () => {
      setIsCompleting(true);
      try {
        await completeViewerTargetsStep({
          accountWorkspaceId: currentAccount._id,
        });
        navigate("/strategy/creator-style");
      } catch (error) {
        console.error("Error completing viewer targets step:", error);
      } finally {
        setIsCompleting(false);
      }
    };

    return (
      <NextStepButton
        onNext={handleNextStep}
        isLoading={isCompleting}
        completionText={userPersonas.length > 0 ? formatCount(userPersonas.length, "persona") : undefined}
      />
    );
  })();

  return (
    <StrategyStepLayout
      currentStep={3}
      totalSteps={7}
      title="Kim są Twoi odbiorcy?"
      description="Stwórz szczegółowe persony swoich odbiorców. To podstawa skutecznej strategii treści."
      videoId="88QBKsZzcEU"
      horizontalThumbnailUrl="https://i.ytimg.com/vi/BZs8lviumDs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDgl5-ura1okRZqru-m73QGTD8Kdw"
      verticalThumbnailUrl="https://i.ytimg.com/vi/88QBKsZzcEU/oar2.jpg"
      showModeSwitch={true}
      chatView={
        <ChatView
          messages={messages || []}
          viewerTargets={userPersonas}
          onRevalidate={() => revalidate("viewerTargets-messages")}
          aboveChatComponent={stepButton}
        />
      }
      summaryView={
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/70 p-6">
          <div className="space-y-6">
            <EntityList
              title="Grupy docelowe"
              icon={<Users className="w-5 h-5" />}
              entities={userPersonas}
              schema={personaObject}
              addButtonText="Dodaj personę"
              emptyStateTitle="Brak person"
              emptyStateDescription="Dodaj swoją pierwszą personę odbiorcy"
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              getEntityId={(persona) => persona._id || persona.personaId}
              getEntityDisplayName={(persona) => persona.name || "Nowa persona"}
              renderFormFields={(Fields, { onRemove } = {}) => (
                <ViewerTargetsFormFields Fields={Fields} onRemove={onRemove} />
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
