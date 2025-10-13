import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { identitySchema } from "@narzedziadlatworcow.pl/context/browser";
import { Chat } from "@narzedziadlatworcow.pl/ui/components/chat/chat";
import { useDesignSystem } from "design-system";
import { ArrowLeft, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntityFormView } from "../components/entity-form-view";
import { NextStepButton } from "../components/next-step-button";
import { StepTitle } from "../components/step-title";
import { StrategyStepLayout } from "../components/strategy-step-layout";
import { CreatorIdentityFormFields } from "./creator-identity-form-fields";
import { SetCreatorIdentityToolView } from "./set-creator-identity-tool-view";

// Calculate completion percentage of creator identity
const calculateCompletionPercentage = (creatorIdentity: any) => {
  if (!creatorIdentity) return 0;

  let completedFields = 0;
  let totalFields = 11; // Total number of fields to check

  // Check basic fields
  if (creatorIdentity.entityType) completedFields++;
  if (creatorIdentity.stage) completedFields++;
  if (creatorIdentity.imageOfCreator) completedFields++;

  // Check flattened identity fields
  if (creatorIdentity.description) completedFields++;
  if (creatorIdentity.originStory) completedFields++;
  if (creatorIdentity.currentStructure) completedFields++;
  if (creatorIdentity.currentActivities) completedFields++;
  if (creatorIdentity.futureVision) completedFields++;

  // Check records (count as completed if they have at least one item)
  if (Object.keys(creatorIdentity.uniqueStrengths || {}).length > 0)
    completedFields++;
  if (Object.keys(creatorIdentity.productsOrServices || {}).length > 0)
    completedFields++;
  if (Object.keys(creatorIdentity.channelsAlreadyUsed || {}).length > 0)
    completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};

const ChatView = ({
  messages,
  creatorIdentity,
  onRevalidate,
  aboveChatComponent,
}: {
  messages: any[];
  creatorIdentity: any;
  onRevalidate: () => void;
  aboveChatComponent: React.ReactNode;
}) => {
  const { sendIdentityMessage, transcribeVoice } = useCommands();
  const { currentAccount } = useAccountWorkspaces();

  // Static welcome message
  const welcomeMessage = {
    _id: "welcome-message",
    chatId: currentAccount._id,
    createdAt: new Date(0).toISOString(), // Earliest date to appear first
    author: {
      type: "assistant",
    },
    parts: [
      {
        type: "text",
        value: `Cześć! 👋

Jestem Twoim pomocnikiem AI i wspólnie zbudujemy Twoją strategię tworzenia treści.

Zanim przejdziemy dalej, chciałbym Cię lepiej poznać. To pomoże nam stworzyć strategię, która będzie idealnie dopasowana do Ciebie.

Opowiedz mi proszę, kim jesteś i co skłoniło Cię do rozpoczęcia tworzenia treści?`,
      },
    ],
  };

  // Combine welcome message with actual messages
  const allMessages = Array.isArray(messages)
    ? [welcomeMessage, ...messages]
    : [welcomeMessage];

  return (
    <Chat
      sendMessage={sendIdentityMessage}
      transcribeVoice={transcribeVoice}
      messages={allMessages}
      chatId={currentAccount._id}
      placeholder="Napisz swoją wiadomość..."
      onRevalidate={onRevalidate}
      toolViews={{
        setCreatorIdentity: SetCreatorIdentityToolView,
      }}
      aboveChat={aboveChatComponent}
    />
  );
};

const CreatorIdentityPage = () => {
  const { Button } = useDesignSystem();
  const { completeCreatorIdentityStep, updateCreatorIdentity } = useCommands();
  const { currentAccount } = useAccountWorkspaces();
  const navigate = useNavigate();
  const revalidate = useRevalidate();
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch data at page level
  const [messages] = useQuery(
    (q) =>
      q.identityMessages.find({
        where: {
          chatId: currentAccount._id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    [currentAccount._id],
    "identity-messages"
  );

  const [creatorIdentity] = useQuery(
    (q) =>
      q.creatorIdentity.findOne({
        _id: currentAccount._id,
      }),
    [messages]
  );

  // Handle entity form update
  const handleUpdate = async (data: any) => {
    await updateCreatorIdentity({
      identityUpdate: data,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("identity-messages");
  };

  // Single Button Component - used in both places
  const completionPercentage = calculateCompletionPercentage(creatorIdentity);

  const stepButton = (() => {
    if (completionPercentage < 40) return null;

    const handleNextStep = async () => {
      setIsCompleting(true);
      try {
        await completeCreatorIdentityStep({
          accountWorkspaceId: currentAccount._id,
        });
        navigate("/strategy/creator-goals");
      } catch (error) {
        console.error("Error completing creator identity step:", error);
      } finally {
        setIsCompleting(false);
      }
    };

    return (
      <NextStepButton
        onNext={handleNextStep}
        isLoading={isCompleting}
        completionText={`${completionPercentage}%`}
      />
    );
  })();

  return (
    <StrategyStepLayout
      currentStep={1}
      totalSteps={7}
      title="Kim jesteś jako twórca lub marka?"
      description="Opisz swoją tożsamość jako twórcy. Kim jesteś i co sprawia, że jesteś wyjątkowy?"
      videoId="88QBKsZzcEU"
      horizontalThumbnailUrl="https://i.ytimg.com/vi/BZs8lviumDs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDgl5-ura1okRZqru-m73QGTD8Kdw"
      verticalThumbnailUrl="https://i.ytimg.com/vi/88QBKsZzcEU/oar2.jpg"
      showModeSwitch={true}
      chatView={
        <ChatView
          messages={messages || []}
          creatorIdentity={creatorIdentity}
          onRevalidate={() => revalidate("identity-messages")}
          aboveChatComponent={stepButton}
        />
      }
      summaryView={
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/70 p-6">
          <div className="space-y-6">
            <StepTitle icon={<User className="w-5 h-5" />}>
              Tożsamość twórcy
            </StepTitle>

            <EntityFormView
              schema={identitySchema}
              data={creatorIdentity}
              onUpdate={handleUpdate}
              mode="summary"
              render={(Fields) => (
                <CreatorIdentityFormFields
                  Fields={Fields}
                  data={creatorIdentity}
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

export default CreatorIdentityPage;
