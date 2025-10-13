import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { calculateDiff } from "../../../utils/diff";
import { creatorStyleChat } from "../chat";
import creatorStyleUpdated from "../events/creator-style-updated";
import { styleUpdateSchema } from "../objects/style";
import creatorStyle from "../views/creator-style";

const creatorStyleMessageSended = creatorStyleChat.context.get("creatorStyleMessageSended");

export const updateCreatorStyleForm = command("updateCreatorStyleForm")
  .use([creatorStyleUpdated, creatorStyleMessageSended, creatorStyle])
  .withParams({
    styleUpdate: styleUpdateSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { styleUpdate, accountWorkspaceId }) => {
    const currentStyle = await ctx.creatorStyle.findOne({
      _id: accountWorkspaceId,
    });

    // Calculate diff - only include fields that are different (deep comparison)
    const diff = calculateDiff(currentStyle, styleUpdate);

    // Only proceed if there are actual changes
    if (Object.keys(diff).length === 0) {
      return { success: true };
    }

    // Update the style data with diff only
    await ctx.creatorStyleUpdated.emit({
      accountWorkspaceId,
      styleUpdate: diff as any,
    });

    // Send message to chat with tool part containing only the diff
    const toolPart = {
      type: "tool",
      name: "updateCreatorStyle",
      params: { styleUpdate: diff, accountWorkspaceId },
      result: { success: true },
    };

    await ctx.creatorStyleMessageSended.emit({
      userId: ctx.$auth.userId,
      messageId: creatorStyleChat.messageId.generate(),
      previousResponseId: null,
      enabledTools: null,
      chatId: accountWorkspaceId,
      parts: [toolPart],
      skipAiResponse: true,
    });

    return { success: true };
  });