import { boolean, command } from "@arcote.tech/arc";
import { contentTypesGeneratable } from "../../strategy/content-formats/objects/content-structure";
import contentUpdated from "../events/content-updated";
import { contentId } from "../objects/content";

export const updateContentByAi = command("updateContentByAi")
  .use([contentUpdated])
  .withParams({
    contentId,
    ...contentTypesGeneratable,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { contentId, ...contentUpdate }) => {
    await ctx.contentUpdated.emit({
      contentId,
      contentUpdate,
    });

    return { success: true };
  });
