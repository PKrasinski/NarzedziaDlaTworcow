// Chat
import { context, contextMerge } from "@arcote.tech/arc";
import { viewerTargetsChat } from "./chat";

// Commands
import { completeViewerTargetsStep } from "./commands/complete-viewer-targets-step";
import { createPersona } from "./commands/create-persona";
import { createPersonaForm } from "./commands/create-persona-form";
import { removePersona } from "./commands/remove-persona";
import { updatePersona } from "./commands/update-persona";
import { updatePersonaForm } from "./commands/update-persona-form";

// Events
import personaCreated from "./events/persona-created";
import personaRemoved from "./events/persona-removed";
import personaUpdated from "./events/persona-updated";
import viewerTargetsStepCompleted from "./events/viewer-targets-step-completed";

// Listeners
import { sendCreatorStyleWelcomeMessage } from "./listeners/send-creator-style-welcome-message";

// Views
import viewerTargetsView from "./views/viewer-targets";

export const viewerTargetsContext = contextMerge(
  viewerTargetsChat.context,
  context([
    // Commands
    completeViewerTargetsStep,
    createPersona,
    createPersonaForm,
    updatePersona,
    updatePersonaForm,
    removePersona,

    // Events
    personaCreated,
    personaUpdated,
    personaRemoved,
    viewerTargetsStepCompleted,

    // Listeners
    sendCreatorStyleWelcomeMessage,

    // Views
    viewerTargetsView,
  ] as const)
);

export const viewerTargetsMessageId = viewerTargetsChat.messageId;
