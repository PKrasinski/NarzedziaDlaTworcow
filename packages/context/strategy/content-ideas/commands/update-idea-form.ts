import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { calculateDiff } from "../../../utils/diff";
import { contentIdeasChat } from "../chat";
import ideaUpdated from "../events/idea-updated";
import { ideaId, ideaSchema } from "../objects/idea";
import contentIdeas from "../views/content-ideas";

const contentIdeasMessageSended = contentIdeasChat.context.get("contentIdeasMessageSended");

export const updateIdeaForm = command("updateIdeaForm")
  .use([ideaUpdated, contentIdeasMessageSended, contentIdeas])
  .withParams({
    ideaId: ideaId,
    ideaUpdate: object(ideaSchema).partial(),
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    ideaId: ideaId,
  })
  .handle(async (ctx, { ideaId, ideaUpdate, accountWorkspaceId }) => {
    const currentIdea = await ctx.contentIdeas.findOne({
      _id: ideaId,
    });

    // Calculate diff - only include fields that are different (deep comparison)
    const diff = calculateDiff(currentIdea, ideaUpdate);

    // Only proceed if there are actual changes
    if (Object.keys(diff).length === 0) {
      return { success: true, ideaId };
    }

    // Update the idea data with diff only
    await ctx.ideaUpdated.emit({
      ideaId,
      accountWorkspaceId,
      ideaUpdate: diff as any,
    });

    // Send message to chat with tool part containing only the diff
    const toolPart = {
      type: "tool",
      name: "updateIdea",
      params: { ideaId, ideaUpdate: diff, accountWorkspaceId },
      result: { success: true, ideaId },
    };

    await ctx.contentIdeasMessageSended.emit({
      userId: ctx.$auth.userId,
      messageId: contentIdeasChat.messageId.generate(),
      previousResponseId: null,
      enabledTools: null,
      chatId: accountWorkspaceId,
      parts: [toolPart],
      skipAiResponse: true,
    });

    return { success: true, ideaId };
  });