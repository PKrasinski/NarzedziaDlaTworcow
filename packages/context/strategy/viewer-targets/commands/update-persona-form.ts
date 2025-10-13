import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { calculateDiff } from "../../../utils/diff";
import { viewerTargetsChat } from "../chat";
import personaUpdated from "../events/persona-updated";
import { personaId, personaSchema } from "../objects/personas";
import viewerTargets from "../views/viewer-targets";

const viewerTargetsMessageSended = viewerTargetsChat.context.get("viewerTargetsMessageSended");

export const updatePersonaForm = command("updatePersonaForm")
  .use([personaUpdated, viewerTargetsMessageSended, viewerTargets])
  .withParams({
    personaId: personaId,
    personaUpdate: object(personaSchema).partial(),
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { personaId, personaUpdate, accountWorkspaceId }) => {
    const currentPersona = await ctx.viewerTargets.findOne({
      _id: personaId,
    });

    // Calculate diff - only include fields that are different (deep comparison)
    const diff = calculateDiff(currentPersona, personaUpdate);

    // Only proceed if there are actual changes
    if (Object.keys(diff).length === 0) {
      return { success: true };
    }

    // Update the persona data with diff only
    await ctx.personaUpdated.emit({
      personaId,
      accountWorkspaceId,
      personaUpdate: diff as any,
    });

    // Send message to chat with tool part containing only the diff
    const toolPart = {
      type: "tool",
      name: "updatePersona",
      params: { personaId, personaUpdate: diff, accountWorkspaceId },
      result: { success: true },
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

    return { success: true };
  });