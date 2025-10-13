import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { viewerTargetsChat } from "../chat";
import personaCreated from "../events/persona-created";
import { personaId, personaSchema } from "../objects/personas";

const viewerTargetsMessageSended = viewerTargetsChat.context.get("viewerTargetsMessageSended");

export const createPersonaForm = command("createPersonaForm")
  .use([personaCreated, viewerTargetsMessageSended])
  .withParams({
    persona: object(personaSchema),
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    personaId: personaId,
  })
  .handle(async (ctx, { persona, accountWorkspaceId }) => {
    const id = personaId.generate();

    await ctx.personaCreated.emit({
      personaId: id,
      accountWorkspaceId,
      persona,
    });

    // Send message to chat with tool part
    const toolPart = {
      type: "tool",
      name: "createPersona",
      params: { persona, accountWorkspaceId },
      result: { success: true, personaId: id },
    };

    await ctx.viewerTargetsMessageSended.emit({
      userId: ctx.$auth.userId,
      messageId: viewerTargetsChat.messageId.generate(),
      previousResponseId: null,
      enabledTools: null,
      chatId: accountWorkspaceId,
      parts: [toolPart],
      skipAiResponse: true,
    });

    return { success: true, personaId: id };
  });