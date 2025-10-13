import { view } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { accountWorkspaceCreated } from "../../../account-workspace/events/account-workspace-created";
import creatorIdentitySet from "../events/creator-identity-set";
import { identitySchema } from "../objects/identity";

export default view("creatorIdentity", accountWorkspaceId, identitySchema)
  .use([creatorIdentitySet, accountWorkspaceCreated])
  .handle({
    creatorIdentitySet: async (ctx, event) => {
      const existing = await ctx.findOne({
        _id: event.payload.accountWorkspaceId,
      });

      if (existing) {
        // Simple merge with arrays
        await ctx.modify(event.payload.accountWorkspaceId, {
          ...existing,
          ...event.payload.identityUpdate,
        });
      } else {
        // Create new identity record
        await ctx.set(
          event.payload.accountWorkspaceId,
          event.payload.identityUpdate
        );
      }
    },
    accountWorkspaceCreated: async (ctx, event) => {
      await ctx.set(event.payload.accountWorkspaceId, {
        name: event.payload.creatorName,
      } as any);
    },
  });
