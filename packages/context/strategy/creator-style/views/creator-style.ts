import { view } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import creatorStyleStepCompleted from "../events/creator-style-step-completed";
import creatorStyleUpdated from "../events/creator-style-updated";
import { styleSchema } from "../objects/style";

export default view("creatorStyle", accountWorkspaceId, styleSchema)
  .use([creatorStyleUpdated, creatorStyleStepCompleted])
  .handle({
    creatorStyleUpdated: async (ctx, event) => {
      const existing = await ctx.findOne({
        _id: event.payload.accountWorkspaceId,
      });

      if (existing) {
        await ctx.modify(event.payload.accountWorkspaceId, {
          ...existing,
          ...event.payload.styleUpdate,
        });
      } else {
        await ctx.set(
          event.payload.accountWorkspaceId,
          event.payload.styleUpdate
        );
      }
    },

    creatorStyleStepCompleted: async (ctx, event) => {
      // This event is handled by the progress tracking system
      // Just ensure the style exists
      const existing = await ctx.findOne({
        _id: event.payload.accountWorkspaceId,
      });

      if (!existing) {
        await ctx.set(event.payload.accountWorkspaceId, {});
      }
    },
  });
