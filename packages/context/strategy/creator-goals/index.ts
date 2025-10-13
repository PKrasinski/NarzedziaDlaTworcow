// Chat
import { context, contextMerge } from "@arcote.tech/arc";
import { goalsChat } from "./chat";

// Commands
import { completeCreatorGoalsStep } from "./commands/complete-creator-goals-step";
import { createGoal } from "./commands/create-goal";
import { createGoalForm } from "./commands/create-goal-form";
import { removeGoal } from "./commands/remove-goal";
import { updateGoal } from "./commands/update-goal";
import { updateGoalForm } from "./commands/update-goal-form";

// Events
import creatorGoalsStepCompleted from "./events/creator-goals-step-completed";
import goalCreated from "./events/goal-created";
import goalRemoved from "./events/goal-removed";
import goalUpdated from "./events/goal-updated";

// Listeners
import { sendViewerTargetsWelcomeMessage } from "./listeners/send-viewer-targets-welcome-message";

// Views
import creatorGoalsView from "./views/creator-goals";

export const creatorGoalsContext = contextMerge(
  goalsChat.context,
  context([
    // Commands
    completeCreatorGoalsStep,
    createGoal,
    createGoalForm,
    updateGoal,
    updateGoalForm,
    removeGoal,

    // Events
    goalCreated,
    goalUpdated,
    goalRemoved,
    creatorGoalsStepCompleted,

    // Listeners
    sendViewerTargetsWelcomeMessage,

    // Views
    creatorGoalsView,
  ] as const)
);

export const creatorGoalMessageId = goalsChat.messageId;
