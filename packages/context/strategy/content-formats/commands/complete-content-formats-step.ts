import { boolean, command, stringEnum } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { strategyProgress } from "../../views/strategy-progress";
import contentFormatsStepCompleted from "../events/content-formats-step-completed";

export const completeContentFormatsStep = command("completeContentFormatsStep")
  .use([contentFormatsStepCompleted, strategyProgress])
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

    if (progress?.contentFormatsCompleted) {
      return { error: "ALREADY_COMPLETED" };
    }

    await ctx.contentFormatsStepCompleted.emit({
      accountWorkspaceId,
    });

    return { success: true };
  });
