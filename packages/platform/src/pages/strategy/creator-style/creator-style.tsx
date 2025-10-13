import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { styleSchema } from "@narzedziadlatworcow.pl/context/browser";
import { Chat } from "@narzedziadlatworcow.pl/ui/components/chat/chat";
import { useDesignSystem } from "design-system";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntityFormView } from "../components/entity-form-view";
import { NextStepButton } from "../components/next-step-button";
import { StepTitle } from "../components/step-title";
import { StrategyStepLayout } from "../components/strategy-step-layout";
import { CreatorStyleFormFields } from "./creator-style-form-fields";
import { UpdateCreatorStyleToolView } from "./update-creator-style-tool-view";

// Calculate completion percentage
const calculateCompletionPercentage = (style: any) => {
  if (!style) return 0;
  const fields = ["toneAndSpeaking", "communicationPersonality", "vocabularyAndLanguage", "narrative", "emotionsAndValues", "visualCharacter"];
  const completedFields = fields.filter(field => style[field] && style[field].trim().length > 0).length;
  return Math.round((completedFields / fields.length) * 100);
};

const ChatView = ({
  messages,
  style,
  onRevalidate,
  aboveChatComponent,
}: {
  messages: any[];
  style: any;
  onRevalidate: () => void;
  aboveChatComponent: React.ReactNode;
}) => {
  const { sendCreatorStyleMessage, transcribeVoice } = useCommands();
  const { currentAccount } = useAccountWorkspaces();

  // Use messages directly without welcome message
  const allMessages = Array.isArray(messages) ? messages : [];

  return (
    <Chat
      sendMessage={sendCreatorStyleMessage}
      transcribeVoice={transcribeVoice}
      messages={allMessages}
      chatId={currentAccount._id}
      placeholder="Opisz swój styl komunikacji..."
      onRevalidate={onRevalidate}
      toolViews={{
        updateCreatorStyle: UpdateCreatorStyleToolView,
      }}
      aboveChat={aboveChatComponent}
    />
  );
};


export const CreatorStylePage = () => {
  const { Button } = useDesignSystem();
  const { completeCreatorStyleStep, updateCreatorStyle } = useCommands();
  const { currentAccount } = useAccountWorkspaces();
  const navigate = useNavigate();
  const revalidate = useRevalidate();
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch data at page level
  const [messages] = useQuery(
    (q) =>
      q.creatorStyleMessages.find({
        where: {
          chatId: currentAccount._id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    [currentAccount._id],
    "creator-style-messages"
  );

  const [style] = useQuery(
    (q) =>
      q.creatorStyle.findOne({
        _id: currentAccount._id,
      }),
    [messages]
  );

  // Handle entity form update
  const handleUpdate = async (styleData: any) => {
    await updateCreatorStyle({
      accountWorkspaceId: currentAccount._id,
      styleUpdate: styleData,
    });
    revalidate("creator-style-messages");
  };

  // Single Button Component - used in both places
  const completionPercentage = calculateCompletionPercentage(style);

  const stepButton = (() => {
    if (completionPercentage < 40) return null;

    const handleNextStep = async () => {
      setIsCompleting(true);
      try {
        await completeCreatorStyleStep({ accountWorkspaceId: currentAccount._id });
        navigate("/strategy/content-formats");
      } catch (error) {
        console.error("Error completing creator style step:", error);
      } finally {
        setIsCompleting(false);
      }
    };

    return (
      <NextStepButton
        onNext={handleNextStep}
        isLoading={isCompleting}
        completionText={`${completionPercentage}%`}
        loadingText="Finalizowanie kroku..."
        buttonText="Przejdź dalej"
      />
    );
  })();

  return (
    <StrategyStepLayout
      showModeSwitch={true}
      currentStep={4}
      totalSteps={7}
      title="Ustal swój styl komunikacji"
      description="Wybierz ton i sposób komunikacji, który najlepiej do Ciebie pasuje"
      videoId="88QBKsZzcEU"
      horizontalThumbnailUrl="https://i.ytimg.com/vi/BZs8lviumDs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDgl5-ura1okRZqru-m73QGTD8Kdw"
      verticalThumbnailUrl="https://i.ytimg.com/vi/88QBKsZzcEU/oar2.jpg"
      chatView={
        <ChatView
          messages={messages || []}
          style={style}
          onRevalidate={() => revalidate("creator-style-messages")}
          aboveChatComponent={stepButton}
        />
      }
      summaryView={
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/70 p-6">
          <div className="space-y-6">
            <StepTitle icon={<MessageCircle className="w-5 h-5" />}>
              Styl komunikacji
            </StepTitle>

            <EntityFormView
              schema={styleSchema}
              data={style}
              onUpdate={handleUpdate}
              mode="summary"
              render={(Fields) => (
                <CreatorStyleFormFields Fields={Fields} data={style} />
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

export default CreatorStylePage;
