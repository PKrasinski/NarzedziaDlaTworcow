import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import formatRemoved from "../events/format-removed";
import { formatId } from "../objects/format";

export const removeFormat = command("removeFormat")
  .use([formatRemoved])
  .withParams({
    formatId: formatId,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, { formatId, accountWorkspaceId }) => {
    await ctx.formatRemoved.emit({
      formatId,
      accountWorkspaceId,
    });

    return { success: true };
  });
