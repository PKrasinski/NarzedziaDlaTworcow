import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { identityChat } from "../chat";
import creatorIdentitySet from "../events/creator-identity-set";
import { identityUpdateSchema } from "../objects/identity";
import { calculateDiff } from "../../../utils/diff";
import creatorIdentity from "../views/creator-identity";

const identityMessageSended = identityChat.context.get("identityMessageSended");

export const updateCreatorIdentity = command("updateCreatorIdentity")
  .use([creatorIdentitySet, identityMessageSended, creatorIdentity])
  .withParams({
    identityUpdate: identityUpdateSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { identityUpdate, accountWorkspaceId }) => {
    const currentIdentity = await ctx.creatorIdentity.findOne({
      _id: accountWorkspaceId,
    });

    // Calculate diff - only include fields that are different (deep comparison)
    const diff = calculateDiff(currentIdentity, identityUpdate);

    // Only proceed if there are actual changes
    if (Object.keys(diff).length === 0) {
      return { success: true };
    }

    // Update the identity data with diff only
    await ctx.creatorIdentitySet.emit({
      accountWorkspaceId,
      identityUpdate: diff as any,
    });

    // Send message to chat with tool part containing only the diff
    const toolPart = {
      type: "tool",
      name: "setCreatorIdentity",
      params: { identityUpdate: diff, accountWorkspaceId },
      result: { success: true },
    };

    await ctx.identityMessageSended.emit({
      userId: ctx.$auth.userId,
      messageId: identityChat.messageId.generate(),
      previousResponseId: null,
      enabledTools: null,
      chatId: accountWorkspaceId,
      parts: [toolPart],
      skipAiResponse: true,
    });

    return { success: true };
  });
