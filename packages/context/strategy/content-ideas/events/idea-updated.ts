import { event, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { ideaId, ideaSchema } from "../objects/idea";

export default event("ideaUpdated", {
  ideaId,
  accountWorkspaceId,
  ideaUpdate: object(ideaSchema),
});
