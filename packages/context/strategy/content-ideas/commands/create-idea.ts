import { boolean, command, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import ideaCreated from "../events/idea-created";
import { ideaSchema, ideaId } from "../objects/idea";

export const createIdea = command("createIdea")
  .use([ideaCreated])
  .withParams({
    ...ideaSchema,
    accountWorkspaceId,
  })
  .withResult({
    success: boolean(),
    ideaId: ideaId,
  })
  .handle(async (ctx, params) => {
    const { accountWorkspaceId, ...idea } = params;
    const id = ideaId.generate();

    await ctx.ideaCreated.emit({
      ideaId: id,
      accountWorkspaceId,
      idea,
    });

    return { success: true, ideaId: id };
  });