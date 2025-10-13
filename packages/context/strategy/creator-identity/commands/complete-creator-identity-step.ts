import { boolean, command, stringEnum } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import creatorIdentityStepCompleted from "../events/creator-identity-step-completed";
import { strategyProgress } from "../../views/strategy-progress";

export const completeCreatorIdentityStep = command("completeCreatorIdentityStep")
  .use([creatorIdentityStepCompleted, strategyProgress])
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
    
    if (progress?.creatorIdentityCompleted) {
      return { error: "ALREADY_COMPLETED" };
    }

    await ctx.creatorIdentityStepCompleted.emit({
      accountWorkspaceId,
    });

    return { success: true };
  });