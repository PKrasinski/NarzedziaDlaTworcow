import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import ideaUpdated from "../events/idea-updated";
import { ideaId, ideaSchema } from "../objects/idea";

export const updateIdea = command("updateIdea")
  .use([ideaUpdated])
  .withParams({
    ideaId: ideaId,
    ...ideaSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, params) => {
    const { ideaId, accountWorkspaceId, ...ideaUpdate } = params;

    await ctx.ideaUpdated.emit({
      ideaId,
      accountWorkspaceId,
      ideaUpdate,
    });

    return { success: true };
  });
