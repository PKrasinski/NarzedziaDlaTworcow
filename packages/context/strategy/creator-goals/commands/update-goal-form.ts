import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { calculateDiff } from "../../../utils/diff";
import { goalsChat } from "../chat";
import goalUpdated from "../events/goal-updated";
import { goalId, goalSchema } from "../objects/goals";
import creatorGoals from "../views/creator-goals";

const goalsMessageSended = goalsChat.context.get("goalsMessageSended");

export const updateGoalForm = command("updateGoalForm")
  .use([goalUpdated, goalsMessageSended, creatorGoals])
  .withParams({
    goalId: goalId,
    goalUpdate: object(goalSchema).partial(),
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    goalId: goalId,
  })
  .handle(async (ctx, { goalId, goalUpdate, accountWorkspaceId }) => {
    const currentGoal = await ctx.creatorGoals.findOne({
      _id: goalId,
    });

    // Calculate diff - only include fields that are different (deep comparison)
    const diff = calculateDiff(currentGoal, goalUpdate);

    // Only proceed if there are actual changes
    if (Object.keys(diff).length === 0) {
      return { success: true, goalId };
    }

    // Update the goal data with diff only
    await ctx.goalUpdated.emit({
      goalId,
      accountWorkspaceId,
      goalUpdate: diff as any,
    });

    // Send message to chat with tool part containing only the diff
    const toolPart = {
      type: "tool",
      name: "updateGoal",
      params: { goalId, goalUpdate: diff, accountWorkspaceId },
      result: { success: true, goalId },
    };

    await ctx.goalsMessageSended.emit({
      userId: ctx.$auth.userId,
      messageId: goalsChat.messageId.generate(),
      previousResponseId: null,
      enabledTools: null,
      chatId: accountWorkspaceId,
      parts: [toolPart],
      skipAiResponse: true,
    });

    return { success: true, goalId };
  });
