import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../account-workspace";
import contentCreated from "../events/content-created";
import { contentId, contentSchema } from "../objects/content";

export const createContent = command("createContent")
  .use([contentCreated])
  .withParams({
    content: object(contentSchema).partial(),
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    contentId: contentId,
  })
  .handle(async (ctx, { content, accountWorkspaceId }) => {
    const id = contentId.generate();

    await ctx.contentCreated.emit({
      contentId: id,
      accountWorkspaceId,
      content,
    });

    return { success: true, contentId: id };
  });
