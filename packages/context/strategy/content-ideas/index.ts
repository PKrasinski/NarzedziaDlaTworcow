// Chat
import { context, contextMerge } from "@arcote.tech/arc";
import { contentIdeasChat } from "./chat";

// Commands
import { completeContentIdeasStep } from "./commands/complete-content-ideas-step";
import { createIdea } from "./commands/create-idea";
import { createIdeaForm } from "./commands/create-idea-form";
import { removeIdea } from "./commands/remove-idea";
import { updateIdea } from "./commands/update-idea";
import { updateIdeaForm } from "./commands/update-idea-form";

// Events
import contentIdeasStepCompleted from "./events/content-ideas-step-completed";
import ideaCreated from "./events/idea-created";
import ideaRemoved from "./events/idea-removed";
import ideaUpdated from "./events/idea-updated";

// Views
import contentIdeasView from "./views/content-ideas";

export const contentIdeasContext = contextMerge(
  contentIdeasChat.context,
  context([
    // Commands
    completeContentIdeasStep,
    createIdea,
    createIdeaForm,
    updateIdea,
    updateIdeaForm,
    removeIdea,

    // Events
    ideaCreated,
    ideaUpdated,
    ideaRemoved,
    contentIdeasStepCompleted,

    // Views
    contentIdeasView,
  ] as const)
);