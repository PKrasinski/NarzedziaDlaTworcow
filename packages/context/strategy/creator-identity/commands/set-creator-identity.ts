import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import creatorIdentitySet from "../events/creator-identity-set";
import { identityUpdateSchema } from "../objects/identity";

export const setCreatorIdentity = command("setCreatorIdentity")
  .use([creatorIdentitySet])
  .withParams({
    identityUpdate: identityUpdateSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { identityUpdate, accountWorkspaceId }) => {
    await ctx.creatorIdentitySet.emit({
      accountWorkspaceId,
      identityUpdate,
    });

    return { success: true };
  });
