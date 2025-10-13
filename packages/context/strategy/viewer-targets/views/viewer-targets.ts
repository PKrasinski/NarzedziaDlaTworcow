import { object, view } from "@arcote.tech/arc";
import personaCreated from "../events/persona-created";
import personaRemoved from "../events/persona-removed";
import personaUpdated from "../events/persona-updated";
import { fullPersonaSchema, personaId } from "../objects/personas";

export default view("viewerTargets", personaId, object(fullPersonaSchema))
  .use([personaCreated, personaUpdated, personaRemoved])
  .handle({
    personaCreated: async (ctx, event) => {
      // Store individual persona with personaId as key and include accountWorkspaceId
      await ctx.set(event.payload.personaId, {
        ...event.payload!.persona,
        accountWorkspaceId: event.payload.accountWorkspaceId,
      });
    },

    personaUpdated: async (ctx, event) => {
      // Update existing persona
      const existing = await ctx.findOne({
        _id: event.payload!.personaId,
      });

      if (existing) {
        await ctx.modify(event.payload!.personaId, {
          ...existing,
          ...event.payload!.personaUpdate,
        });
      }
    },

    personaRemoved: async (ctx, event) => {
      // Remove persona by personaId
      await ctx.remove(event.payload!.personaId);
    },
  });
