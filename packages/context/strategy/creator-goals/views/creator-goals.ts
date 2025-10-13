import { object, view } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import goalCreated from "../events/goal-created";
import goalRemoved from "../events/goal-removed";
import goalUpdated from "../events/goal-updated";
import { goalId, goalSchema } from "../objects/goals";

export default view(
  "creatorGoals",
  goalId,
  object({ ...goalSchema, accountWorkspaceId })
)
  .use([goalCreated, goalUpdated, goalRemoved])
  .handle({
    goalCreated: async (ctx, event) => {
      // Store individual goal with goalId as key and include accountWorkspaceId
      await ctx.set(event.payload.goalId, {
        ...event.payload.goal,
        accountWorkspaceId: event.payload.accountWorkspaceId,
      });
    },

    goalUpdated: async (ctx, event) => {
      await ctx.modify(event.payload.goalId, {
        ...event.payload.goalUpdate,
      });
    },

    goalRemoved: async (ctx, event) => {
      // Remove goal by goalId
      await ctx.remove(event.payload.goalId);
    },
  });
