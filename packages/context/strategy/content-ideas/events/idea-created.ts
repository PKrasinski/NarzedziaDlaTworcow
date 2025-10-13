import { event, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { ideaId, ideaSchema } from "../objects/idea";

export default event("ideaCreated", {
  ideaId,
  accountWorkspaceId,
  idea: object(ideaSchema),
});
