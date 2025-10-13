import { event } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { identityUpdateSchema } from "../objects/identity";

export default event("creatorIdentitySet", {
  accountWorkspaceId,
  identityUpdate: identityUpdateSchema,
});