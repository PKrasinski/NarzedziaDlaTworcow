import { command, string } from "@arcote.tech/arc";
import { accountWorkspaceId } from "..";
import { betaAccessRequested } from "../events/beta-access-requested";

export default command("requestBetaAccess")
  .use([betaAccessRequested])
  .withParams({
    accountWorkspaceId,
  })
  .withResult({
    success: string(),
  })
  .handle(async (ctx, { accountWorkspaceId }) => {
    await ctx.betaAccessRequested.emit({
      accountWorkspaceId,
    });

    return {
      success: "Zgłoszenie do beta testów zostało przyjęte",
    };
  });
