// Chat
import { context, contextMerge } from "@arcote.tech/arc";
import { creatorStyleChat } from "./chat";

// Commands
import { completeCreatorStyleStep } from "./commands/complete-creator-style-step";
import { updateCreatorStyle } from "./commands/update-creator-style";
import { updateCreatorStyleForm } from "./commands/update-creator-style-form";

// Events
import creatorStyleStepCompleted from "./events/creator-style-step-completed";
import creatorStyleUpdated from "./events/creator-style-updated";

// Listeners
import { sendContentFormatsWelcomeMessage } from "./listeners/send-content-formats-welcome-message";

// Views
import creatorStyleView from "./views/creator-style";

export const creatorStyleContext = contextMerge(
  creatorStyleChat.context,
  context([
    // Commands
    completeCreatorStyleStep,
    updateCreatorStyle,
    updateCreatorStyleForm,

    // Events
    creatorStyleStepCompleted,
    creatorStyleUpdated,

    // Listeners
    sendContentFormatsWelcomeMessage,

    // Views
    creatorStyleView,
  ] as const)
);

export const creatorStyleMessageId = creatorStyleChat.messageId;
