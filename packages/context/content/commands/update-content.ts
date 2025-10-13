import { boolean, command, object, stringEnum } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../account-workspace";
import contentUpdated from "../events/content-updated";
import { contentId, contentSchema } from "../objects/content";

export const updateContent = command("updateContent")
  .use([contentUpdated])
  .withParams({
    contentId,
    contentUpdate: object(contentSchema).omit("accountWorkspaceId").partial(),
    accountWorkspaceId,
  })
  .withResult(
    {
      error: stringEnum("CONTENT_NOT_FOUND"),
    },
    {
      success: boolean(),
    }
  )
  .handle(async (ctx, { contentId, contentUpdate, accountWorkspaceId }) => {
    await ctx.contentUpdated.emit({
      contentId,
      accountWorkspaceId,
      contentUpdate,
    });

    return { success: true };
  });
