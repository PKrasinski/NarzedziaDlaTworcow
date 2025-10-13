import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import goalRemoved from "../events/goal-removed";
import { goalId } from "../objects/goals";

export const removeGoal = command("removeGoal")
  .use([goalRemoved])
  .withParams({
    goalId: goalId,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    goalId: goalId,
  })
  .handle(async (ctx, { goalId, accountWorkspaceId }) => {
    await ctx.goalRemoved.emit({
      goalId,
      accountWorkspaceId,
    });

    return { success: true, goalId };
  });