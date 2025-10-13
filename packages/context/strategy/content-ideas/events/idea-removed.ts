import { event } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { ideaId } from "../objects/idea";

export default event("ideaRemoved", {
  ideaId,
  accountWorkspaceId,
});