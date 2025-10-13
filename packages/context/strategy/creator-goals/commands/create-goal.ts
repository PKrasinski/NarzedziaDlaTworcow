import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import goalCreated from "../events/goal-created";
import { goalId, goalSchema } from "../objects/goals";

export const createGoal = command("createGoal")
  .use([goalCreated])
  .withParams({
    ...goalSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    goalId: goalId,
  })
  .handle(async (ctx, params) => {
    const { accountWorkspaceId, ...goal } = params;
    const id = goalId.generate();

    await ctx.goalCreated.emit({
      goalId: id,
      accountWorkspaceId,
      goal,
    });

    return { success: true, goalId: id };
  });
