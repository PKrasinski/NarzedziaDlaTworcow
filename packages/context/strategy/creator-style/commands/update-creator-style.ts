import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import creatorStyleUpdated from "../events/creator-style-updated";
import { styleUpdateSchema } from "../objects/style";

export const updateCreatorStyle = command("updateCreatorStyle")
  .use([creatorStyleUpdated])
  .withParams({
    styleUpdate: styleUpdateSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { styleUpdate, accountWorkspaceId }) => {
    await ctx.creatorStyleUpdated.emit({
      accountWorkspaceId,
      styleUpdate,
    });

    return { success: true };
  });
