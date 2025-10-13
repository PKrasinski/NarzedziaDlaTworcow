import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { goalsChat } from "../chat";
import goalCreated from "../events/goal-created";
import { goalId, goalSchema } from "../objects/goals";

const goalsMessageSended = goalsChat.context.get("goalsMessageSended");

export const createGoalForm = command("createGoalForm")
  .use([goalCreated, goalsMessageSended])
  .withParams({
    goal: object(goalSchema),
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    goalId: goalId,
  })
  .handle(async (ctx, { goal, accountWorkspaceId }) => {
    const id = goalId.generate();

    await ctx.goalCreated.emit({
      goalId: id,
      accountWorkspaceId,
      goal,
    });

    // Send message to chat with tool part
    const toolPart = {
      type: "tool",
      name: "createGoal",
      params: { goal, accountWorkspaceId },
      result: { success: true, goalId: id },
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

    return { success: true, goalId: id };
  });