import { object, view } from "@arcote.tech/arc";
import formatCreated from "../events/format-created";
import formatRemoved from "../events/format-removed";
import formatUpdated from "../events/format-updated";
import { formatId, fullFormatSchema } from "../objects/format";

export default view("contentFormats", formatId, object(fullFormatSchema))
  .use([formatCreated, formatUpdated, formatRemoved])
  .handle({
    formatCreated: async (ctx, event) => {
      // Store individual format with formatId as key and include accountWorkspaceId
      await ctx.set(event.payload.formatId, {
        ...event.payload.format,
        accountWorkspaceId: event.payload.accountWorkspaceId,
      });
    },

    formatUpdated: async (ctx, event) => {
      await ctx.modify(event.payload.formatId, {
        ...event.payload.formatUpdate,
      });
    },

    formatRemoved: async (ctx, event) => {
      // Remove format by formatId
      await ctx.remove(event.payload.formatId);
    },
  });
