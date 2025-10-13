import { object, view } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import ideaCreated from "../events/idea-created";
import ideaRemoved from "../events/idea-removed";
import ideaUpdated from "../events/idea-updated";
import { ideaId, ideaSchema } from "../objects/idea";

export default view("contentIdeas", ideaId, object({ ...ideaSchema, accountWorkspaceId }))
  .use([ideaCreated, ideaUpdated, ideaRemoved])
  .handle({
    ideaCreated: async (ctx, event) => {
      // Store individual idea with ideaId as key and include accountWorkspaceId
      await ctx.set(event.payload.ideaId, {
        ...event.payload.idea,
        accountWorkspaceId: event.payload.accountWorkspaceId,
      });
    },

    ideaUpdated: async (ctx, event) => {
      await ctx.modify(event.payload.ideaId, {
        ...event.payload.ideaUpdate,
      });
    },

    ideaRemoved: async (ctx, event) => {
      // Remove idea by ideaId
      await ctx.remove(event.payload.ideaId);
    },
  });