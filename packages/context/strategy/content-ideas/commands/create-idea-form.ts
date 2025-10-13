import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { contentIdeasChat } from "../chat";
import ideaCreated from "../events/idea-created";
import { ideaId, ideaSchema } from "../objects/idea";

const contentIdeasMessageSended = contentIdeasChat.context.get("contentIdeasMessageSended");

export const createIdeaForm = command("createIdeaForm")
  .use([ideaCreated, contentIdeasMessageSended])
  .withParams({
    idea: object(ideaSchema),
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    ideaId: ideaId,
  })
  .handle(async (ctx, { idea, accountWorkspaceId }) => {
    const id = ideaId.generate();

    await ctx.ideaCreated.emit({
      ideaId: id,
      accountWorkspaceId,
      idea,
    });

    // Send message to chat with tool part
    const toolPart = {
      type: "tool",
      name: "createIdea",
      params: { idea, accountWorkspaceId },
      result: { success: true, ideaId: id },
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

    return { success: true, ideaId: id };
  });