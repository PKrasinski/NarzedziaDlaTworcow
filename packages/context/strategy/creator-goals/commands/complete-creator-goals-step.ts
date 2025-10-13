import { boolean, command, stringEnum } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import creatorGoalsStepCompleted from "../events/creator-goals-step-completed";
import { strategyProgress } from "../../views/strategy-progress";

export const completeCreatorGoalsStep = command("completeCreatorGoalsStep")
  .use([creatorGoalsStepCompleted, strategyProgress])
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
    
    if (progress?.creatorGoalsCompleted) {
      return { error: "ALREADY_COMPLETED" };
    }

    await ctx.creatorGoalsStepCompleted.emit({
      accountWorkspaceId,
    });

    return { success: true };
  });