// Chat
import { context, contextMerge } from "@arcote.tech/arc";
import { contentFormatsChat } from "./chat";

// Commands
import { completeContentFormatsStep } from "./commands/complete-content-formats-step";
import { createFormat } from "./commands/create-format";
import { createFormatForm } from "./commands/create-format-form";
import { removeFormat } from "./commands/remove-format";
import { updateFormat } from "./commands/update-format";
import { updateFormatForm } from "./commands/update-format-form";

// Events
import contentFormatsStepCompleted from "./events/content-formats-step-completed";
import formatCreated from "./events/format-created";
import formatRemoved from "./events/format-removed";
import formatUpdated from "./events/format-updated";

// Listeners
import { sendContentIdeasWelcomeMessage } from "./listeners/send-content-ideas-welcome-message";

// Views
import contentFormatsView from "./views/content-formats";

export const contentFormatsContext = contextMerge(
  contentFormatsChat.context,
  context([
    // Commands
    completeContentFormatsStep,
    createFormat,
    createFormatForm,
    updateFormat,
    updateFormatForm,
    removeFormat,

    // Events
    formatCreated,
    formatUpdated,
    formatRemoved,
    contentFormatsStepCompleted,

    // Listeners
    sendContentIdeasWelcomeMessage,

    // Views
    contentFormatsView,
  ] as const)
);
