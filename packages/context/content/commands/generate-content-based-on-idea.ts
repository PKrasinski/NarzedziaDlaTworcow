import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../account-workspace";
import { ideaId } from "../../strategy/content-ideas/objects/idea";
import contentIdeasView from "../../strategy/content-ideas/views/content-ideas";
import { contentChat } from "../chat";
import contentCreated from "../events/content-created";
import { contentId } from "../objects/content";

export const generateContentBasedOnIdea = command("generateContentBasedOnIdea")
  .use([
    contentCreated,
    contentIdeasView,
    contentChat.context.get("contentSystemMessageRequested"),
  ])
  .withParams({
    ideaId,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    contentId: contentId,
  })
  .handle(async (ctx, { ideaId, accountWorkspaceId }) => {
    // Fetch the idea data
    const idea = await ctx.contentIdeas.findOne({ _id: ideaId });

    if (!idea) {
      throw new Error("Idea not found");
    }

    // Generate new content ID
    const newContentId = contentId.generate();

    await ctx.contentCreated.emit({
      contentId: newContentId,
      accountWorkspaceId,
      content: {
        title: idea.title || "Nowa treść",
        description: "",
        formatId: idea.formatId || "",
      },
    });

    // Create research and planning message with web search enabled
    const message = `Cześć, pomóż mi stworzyć treść na temat: "${idea.title}".

    Najpierw przeprowadź research na dany temat następnie przygotuj koncepcję treści którą chcesz przygotować oraz zadaj mi pytania niezbędne do stworzenia rzetelnej treści.`;

    // Emit system message with web search enabled
    await ctx
      .get(contentChat.context.get("contentSystemMessageRequested"))
      .emit({
        chatId: newContentId,
        parts: [{ type: "text", value: message }],
        enabledTools: ["web_search"], // Enable web search for research
        messageId: contentChat.messageId.generate(),
        previousResponseId: null,
      });

    return { success: true, contentId: newContentId };
  });
