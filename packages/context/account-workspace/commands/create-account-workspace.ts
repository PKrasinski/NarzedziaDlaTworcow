import { array, command, string } from "@arcote.tech/arc";
import { accountWorkspaceId } from "..";
import { accountWorkspaceCreated } from "../events/account-workspace-created";

export const createAccountWorkspace = command("createAccountWorkspace")
  .use([accountWorkspaceCreated])
  .withParams({
    creatorName: string().minLength(1).maxLength(100),
    platforms: array(string()),
    otherPlatform: string().minLength(1).maxLength(200).optional(),
  })
  .withResult({
    id: accountWorkspaceId,
    success: string(),
  })
  .handle(async (ctx, { creatorName, platforms, otherPlatform }) => {
    const id = accountWorkspaceId.generate();

    await ctx.accountWorkspaceCreated.emit({
      userId: ctx.$auth.userId as any,
      accountWorkspaceId: id,
      creatorName,
      platforms,
      otherPlatform,
      createdAt: new Date(),
    });

    return {
      id,
      success: "Account workspace created successfully",
    };
  });
