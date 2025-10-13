import { object, view } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../account-workspace";
import contentCreated from "../events/content-created";
import contentRemoved from "../events/content-removed";
import contentUpdated from "../events/content-updated";
import { contentId, contentSchema } from "../objects/content";

export default view(
  "content",
  contentId,
  object({ ...contentSchema, accountWorkspaceId })
)
  .use([contentCreated, contentUpdated, contentRemoved])
  .handle({
    contentCreated: async (ctx, event) => {
      await ctx.set(event.payload.contentId, {
        ...event.payload.content,
        accountWorkspaceId: event.payload.accountWorkspaceId,
      });
    },

    contentUpdated: async (ctx, event) => {
      await ctx.modify(event.payload.contentId, {
        ...event.payload.contentUpdate,
      });
    },

    contentRemoved: async (ctx, event) => {
      await ctx.remove(event.payload.contentId);
    },
  });
