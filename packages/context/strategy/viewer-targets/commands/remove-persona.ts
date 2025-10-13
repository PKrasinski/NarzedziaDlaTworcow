import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import personaRemoved from "../events/persona-removed";
import { personaId } from "../objects/personas";

export const removePersona = command("removePersona")
  .use([personaRemoved])
  .withParams({
    personaId: personaId,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { personaId, accountWorkspaceId }) => {
    await ctx.personaRemoved.emit({
      personaId,
      accountWorkspaceId,
    });

    return { success: true };
  });