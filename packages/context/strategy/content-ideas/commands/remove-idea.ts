import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import ideaRemoved from "../events/idea-removed";
import { ideaId } from "../objects/idea";

export const removeIdea = command("removeIdea")
  .use([ideaRemoved])
  .withParams({
    ideaId: ideaId,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { ideaId, accountWorkspaceId }) => {
    await ctx.ideaRemoved.emit({
      ideaId,
      accountWorkspaceId,
    });

    return { success: true };
  });