import { boolean, command, stringEnum } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { strategyProgress } from "../../views/strategy-progress";
import creatorStyleStepCompleted from "../events/creator-style-step-completed";

export const completeCreatorStyleStep = command("completeCreatorStyleStep")
  .use([creatorStyleStepCompleted, strategyProgress])
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
    const progress = await ctx
      .get(strategyProgress)
      .findOne({ _id: accountWorkspaceId });

    if (progress?.creatorStyleCompleted) {
      return { error: "ALREADY_COMPLETED" };
    }

    await ctx.creatorStyleStepCompleted.emit({
      accountWorkspaceId,
    });

    return { success: true };
  });
