import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { contentFormatsChat } from "../chat";
import formatCreated from "../events/format-created";
import { formatId, formatSchema } from "../objects/format";

const contentFormatsMessageSended = contentFormatsChat.context.get("contentFormatsMessageSended");

export const createFormatForm = command("createFormatForm")
  .use([formatCreated, contentFormatsMessageSended])
  .withParams({
    format: object(formatSchema),
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    formatId: formatId,
  })
  .handle(async (ctx, { format, accountWorkspaceId }) => {
    const id = formatId.generate();

    await ctx.formatCreated.emit({
      formatId: id,
      accountWorkspaceId,
      format,
    });

    // Send message to chat with tool part
    const toolPart = {
      type: "tool",
      name: "createFormat",
      params: { format, accountWorkspaceId },
      result: { success: true, formatId: id },
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

    return { success: true, formatId: id };
  });