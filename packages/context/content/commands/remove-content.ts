import { boolean, command, stringEnum } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../account-workspace";
import contentRemoved from "../events/content-removed";
import { contentId } from "../objects/content";

export const removeContent = command("removeContent")
  .use([contentRemoved])
  .withParams({
    contentId,
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
  .handle(async (ctx, { contentId, accountWorkspaceId }) => {
    await ctx.contentRemoved.emit({
      contentId,
      accountWorkspaceId,
    });

    return { success: true };
  });