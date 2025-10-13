import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { object } from "@arcote.tech/arc";
import { goalSchema } from "@narzedziadlatworcow.pl/context";
import { Chat } from "@narzedziadlatworcow.pl/ui/components/chat/chat";
import { useDesignSystem } from "design-system";
import { ArrowLeft, Target } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntityList } from "../components/entity-list";
import { NextStepButton } from "../components/next-step-button";
import { StrategyStepLayout } from "../components/strategy-step-layout";
import { formatCount } from "../utils/pluralization";
import { GoalFormFields } from "./goal-form-fields";
import { CreateGoalToolView, UpdateGoalToolView } from "./goal-tool-views";
import { RemoveGoalToolView } from "./remove-goal-tool-view";

const goalsObject = object(goalSchema);

// Calculate completion percentage of creator goals (array of individual goals)
const calculateCompletionPercentage = (goals: any[]) => {
  if (!goals || goals.length === 0) return 0;

  let completedFields = 0;
  let totalFields = goals.length * 2; // Each goal has 2 fields: objective, keyResults

  goals.forEach((goal: any) => {
    if (goal.objective) completedFields++;
    if (goal.keyResults && goal.keyResults.length > 0) completedFields++;
  });

  return Math.round((completedFields / totalFields) * 100);
};


const ChatView = ({
  messages,
  goals,
  onRevalidate,
  aboveChatComponent,
}: {
  messages: any[];
  goals: any[];
  onRevalidate: () => void;
  aboveChatComponent: React.ReactNode;
}) => {
  const { sendGoalsMessage, transcribeVoice } = useCommands();
  const { currentAccount } = useAccountWorkspaces();

  // Use messages directly without welcome message
  const allMessages = Array.isArray(messages) ? messages : [];

  return (
    <Chat
      sendMessage={sendGoalsMessage}
      transcribeVoice={transcribeVoice}
      messages={allMessages}
      chatId={currentAccount._id}
      placeholder="Opisz swoje cele jako twórca treści..."
      onRevalidate={onRevalidate}
      toolViews={{
        createGoal: CreateGoalToolView,
        updateGoal: UpdateGoalToolView,
        removeGoal: RemoveGoalToolView,
      }}
      aboveChat={aboveChatComponent}
    />
  );
};

export const CreatorGoalsPage = () => {
  const { Button } = useDesignSystem();
  const { completeCreatorGoalsStep, createGoalForm, updateGoalForm, removeGoal } = useCommands();
  const { currentAccount } = useAccountWorkspaces();
  const navigate = useNavigate();
  const revalidate = useRevalidate();
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch data at page level
  const [messages] = useQuery(
    (q) =>
      q.goalsMessages.find({
        where: {
          chatId: currentAccount._id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    [currentAccount._id],
    "goals-messages"
  );

  const [allGoals] = useQuery(
    (q) =>
      q.creatorGoals.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
        orderBy: {
          _id: "asc",
        },
      }),
    [messages]
  );

  const userGoals = allGoals || [];

  // Handle entity list operations
  const handleCreate = async (goalData: any) => {
    await createGoalForm({
      goal: goalData,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("goals-messages");
  };

  const handleUpdate = async (goalId: string, goalData: any) => {
    await updateGoalForm({
      goalId,
      goalUpdate: goalData,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("goals-messages");
  };

  const handleRemove = async (goalId: string) => {
    await removeGoal({
      goalId,
      accountWorkspaceId: currentAccount._id,
    });
    revalidate("goals-messages");
  };

  // Single Button Component - used in both places
  const completionPercentage = calculateCompletionPercentage(userGoals);

  const stepButton = (() => {
    if (completionPercentage < 40) return null;

    const handleNextStep = async () => {
      setIsCompleting(true);
      try {
        await completeCreatorGoalsStep({
          accountWorkspaceId: currentAccount._id,
        });
        navigate("/strategy/viewer-targets");
      } catch (error) {
        console.error("Error completing creator goals step:", error);
      } finally {
        setIsCompleting(false);
      }
    };

    return (
      <NextStepButton
        onNext={handleNextStep}
        isLoading={isCompleting}
        completionText={userGoals.length > 0 ? formatCount(userGoals.length, "goal") : undefined}
      />
    );
  })();

  return (
    <StrategyStepLayout
      currentStep={2}
      totalSteps={7}
      title="Jakie są Twoje cele jako twórcy?"
      description="Zdefiniuj swoje cele i kluczowe rezultaty. To pomoże w tworzeniu strategii treści, która rzeczywiście przyniesie rezultaty."
      videoId="88QBKsZzcEU"
      horizontalThumbnailUrl="https://i.ytimg.com/vi/BZs8lviumDs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDgl5-ura1okRZqru-m73QGTD8Kdw"
      verticalThumbnailUrl="https://i.ytimg.com/vi/88QBKsZzcEU/oar2.jpg"
      showModeSwitch={true}
      chatView={
        <ChatView
          messages={messages || []}
          goals={userGoals}
          onRevalidate={() => revalidate("goals-messages")}
          aboveChatComponent={stepButton}
        />
      }
      summaryView={
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/70 p-6">
          <div className="space-y-6">
            <EntityList
              title="Cele twórcy"
              icon={<Target className="w-5 h-5" />}
              entities={userGoals}
              schema={goalsObject}
              addButtonText="Dodaj cel"
              emptyStateTitle="Brak celów"
              emptyStateDescription="Dodaj swój pierwszy cel jako twórca treści"
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              getEntityId={(goal) => goal._id || goal.goalId}
              getEntityDisplayName={(goal) => goal.title || "Nowy cel"}
              renderFormFields={(Fields, { onRemove } = {}) => <GoalFormFields Fields={Fields} onRemove={onRemove} />}
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
