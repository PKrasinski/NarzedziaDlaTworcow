import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import personaCreated from "../events/persona-created";
import { personaId, personaSchema } from "../objects/personas";

export const createPersona = command("createPersona")
  .use([personaCreated])
  .withParams({
    ...personaSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    personaId: personaId,
  })
  .handle(async (ctx, params) => {
    const { accountWorkspaceId, ...persona } = params;
    const id = personaId.generate();

    await ctx.personaCreated.emit({
      personaId: id,
      accountWorkspaceId,
      persona,
    });

    return { success: true, personaId: id };
  });