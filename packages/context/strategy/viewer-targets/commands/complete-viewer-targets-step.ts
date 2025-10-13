import { boolean, command, stringEnum } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import viewerTargetsStepCompleted from "../events/viewer-targets-step-completed";
import { strategyProgress } from "../../views/strategy-progress";

export const completeViewerTargetsStep = command("completeViewerTargetsStep")
  .use([viewerTargetsStepCompleted, strategyProgress])
  .withParams({
    accountWorkspaceId,
  })
  .withResult(
    {
      error: stringEnum("ALREADY_COMPLETED"),
    },
    {
      success: boolean(),
    }
  )
  .handle(async (ctx, { accountWorkspaceId }) => {
    // Check if step is already completed
    const progress = await ctx.get(strategyProgress).findOne({ _id: accountWorkspaceId });
    
    if (progress?.viewerTargetsCompleted) {
      return { error: "ALREADY_COMPLETED" };
    }

    await ctx.viewerTargetsStepCompleted.emit({
      accountWorkspaceId,
    });

    return { success: true };
  });