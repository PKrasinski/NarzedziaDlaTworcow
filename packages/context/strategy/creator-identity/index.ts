// Chat
import { context, contextMerge } from "@arcote.tech/arc";
import { identityChat } from "./chat";

// Commands
import { completeCreatorIdentityStep } from "./commands/complete-creator-identity-step";
import { setCreatorIdentity } from "./commands/set-creator-identity";
import { updateCreatorIdentity } from "./commands/update-creator-identity";

// Events
import creatorIdentitySet from "./events/creator-identity-set";
import creatorIdentityStepCompleted from "./events/creator-identity-step-completed";

// Listeners
import { sendCreatorGoalsWelcomeMessage } from "./listeners/send-creator-goals-welcome-message";

// Views
import creatorIdentityView from "./views/creator-identity";

export const creatorIdentityContext = contextMerge(
  identityChat.context,
  context([
    // Commands
    completeCreatorIdentityStep,
    setCreatorIdentity,
    updateCreatorIdentity,

    // Events
    creatorIdentitySet,
    creatorIdentityStepCompleted,

    // Listeners
    sendCreatorGoalsWelcomeMessage,

    // Views
    creatorIdentityView,
  ] as const)
);

export { identitySchema } from "./objects/identity";

export const creatorIdentityMessageId = identityChat.messageId;
