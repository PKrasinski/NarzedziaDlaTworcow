import { command, string } from "@arcote.tech/arc";
import { onboardingCompleted } from "../events/onboarding-completed";
import { accountWorkspaceId } from "../ids/account-workspace-id";

export default command("completeOnboarding")
  .use([onboardingCompleted])
  .withParams({
    accountWorkspaceId: accountWorkspaceId,
  })
  .withResult({
    success: string(),
  })
  .handle(async (ctx, { accountWorkspaceId }) => {
    await ctx.onboardingCompleted.emit({
      accountWorkspaceId,
    });

    return {
      success: "Onboarding completed successfully",
    };
  });