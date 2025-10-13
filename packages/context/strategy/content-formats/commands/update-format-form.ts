import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { calculateDiff } from "../../../utils/diff";
import { contentFormatsChat } from "../chat";
import formatUpdated from "../events/format-updated";
import { formatId, formatSchema } from "../objects/format";
import contentFormats from "../views/content-formats";

const contentFormatsMessageSended = contentFormatsChat.context.get("contentFormatsMessageSended");

export const updateFormatForm = command("updateFormatForm")
  .use([formatUpdated, contentFormatsMessageSended, contentFormats])
  .withParams({
    formatId: formatId,
    formatUpdate: object(formatSchema).partial(),
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    formatId: formatId,
  })
  .handle(async (ctx, { formatId, formatUpdate, accountWorkspaceId }) => {
    const currentFormat = await ctx.contentFormats.findOne({
      _id: formatId,
    });

    // Calculate diff - only include fields that are different (deep comparison)
    const diff = calculateDiff(currentFormat, formatUpdate);

    // Only proceed if there are actual changes
    if (Object.keys(diff).length === 0) {
      return { success: true, formatId };
    }

    // Update the format data with diff only
    await ctx.formatUpdated.emit({
      formatId,
      accountWorkspaceId,
      formatUpdate: diff as any,
    });

    // Send message to chat with tool part containing only the diff
    const toolPart = {
      type: "tool",
      name: "updateFormat",
      params: { formatId, formatUpdate: diff, accountWorkspaceId },
      result: { success: true, formatId },
    };

    await ctx.contentFormatsMessageSended.emit({
      userId: ctx.$auth.userId,
      messageId: contentFormatsChat.messageId.generate(),
      previousResponseId: null,
      enabledTools: null,
      chatId: accountWorkspaceId,
      parts: [toolPart],
      skipAiResponse: true,
    });

    return { success: true, formatId };
  });