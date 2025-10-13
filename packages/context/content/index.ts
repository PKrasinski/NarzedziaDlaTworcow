import { context, contextMerge } from "@arcote.tech/arc";
// Content Commands
import { createContent } from "./commands/create-content";
import { generateContentBasedOnIdea } from "./commands/generate-content-based-on-idea";
import { removeContent } from "./commands/remove-content";
import { updateContent } from "./commands/update-content";
import { updateContentByAi } from "./commands/update-content-by-ai";

// Content Chat
import { contentChat } from "./chat";
export { contentChat };

// Content Idea Events

// Content Events
import contentCreated from "./events/content-created";
import contentRemoved from "./events/content-removed";
import contentUpdated from "./events/content-updated";

// Views
import contentView from "./views/content";

export const contentContext = contextMerge(
  contentChat.context,
  context([
    // Content Commands
    createContent,
    updateContent,
    removeContent,
    generateContentBasedOnIdea,
    updateContentByAi,

    // Content Events
    contentCreated,
    contentUpdated,
    contentRemoved,

    // Views
    contentView,
  ] as const)
);
