import { command, string } from "@arcote.tech/arc";
import { accountWorkspaceId } from "..";
import { workspaceUpdated } from "../events/workspace-updated";

export default command("updateWorkspace")
  .use([workspaceUpdated])
  .withParams({
    accountWorkspaceId,
    creatorName: string().minLength(1).maxLength(100),
  })
  .withResult({
    success: string(),
  })
  .handle(async (ctx, { accountWorkspaceId, creatorName }) => {
    await ctx.workspaceUpdated.emit({
      accountWorkspaceId,
      creatorName,
    });

    return {
      success: "Konto zostało zaktualizowane",
    };
  });
