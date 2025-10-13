import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import contentIdeasStepCompleted from "../events/content-ideas-step-completed";

export const completeContentIdeasStep = command("completeContentIdeasStep")
  .use([contentIdeasStepCompleted])
  .withParams({
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { accountWorkspaceId }) => {
    await ctx.contentIdeasStepCompleted.emit({
      accountWorkspaceId,
    });

    return { success: true };
  });