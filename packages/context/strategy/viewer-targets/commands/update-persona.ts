import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import personaUpdated from "../events/persona-updated";
import { personaId, personaSchema } from "../objects/personas";

export const updatePersona = command("updatePersona")
  .use([personaUpdated])
  .withParams({
    personaId: personaId,
    ...personaSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, params) => {
    const { personaId, accountWorkspaceId, ...personaUpdate } = params;

    await ctx.personaUpdated.emit({
      personaId,
      accountWorkspaceId,
      personaUpdate,
    });

    return { success: true };
  });
