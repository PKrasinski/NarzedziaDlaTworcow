import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import formatUpdated from "../events/format-updated";
import { formatId, formatSchema } from "../objects/format";

export const updateFormat = command("updateFormat")
  .use([formatUpdated])
  .withParams({
    formatId: formatId,
    ...formatSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
  })
  .handle(async (ctx, params) => {
    const { formatId, accountWorkspaceId, ...formatUpdate } = params;

    await ctx.formatUpdated.emit({
      formatId,
      accountWorkspaceId,
      formatUpdate,
    });

    return { success: true };
  });
