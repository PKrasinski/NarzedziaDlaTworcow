import { boolean, command } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import formatCreated from "../events/format-created";
import { formatId, formatSchema } from "../objects/format";

export const createFormat = command("createFormat")
  .use([formatCreated])
  .withParams({
    ...formatSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    formatId: formatId,
  })
  .handle(async (ctx, params) => {
    const { accountWorkspaceId, ...format } = params;
    const id = formatId.generate();

    await ctx.formatCreated.emit({
      formatId: id,
      accountWorkspaceId,
      format,
    });

    return { success: true, formatId: id };
  });
