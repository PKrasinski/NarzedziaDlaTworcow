import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import goalUpdated from "../events/goal-updated";
import { goalId, goalSchema } from "../objects/goals";

export const updateGoal = command("updateGoal")
  .use([goalUpdated])
  .withParams({
    goalId: goalId,
    ...goalSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    goalId: goalId,
  })
  .handle(async (ctx, params) => {
    const { goalId, accountWorkspaceId, ...goalUpdate } = params;
    
    await ctx.goalUpdated.emit({
      goalId,
      accountWorkspaceId,
      goalUpdate,
    });

    return { success: true, goalId };
  });
