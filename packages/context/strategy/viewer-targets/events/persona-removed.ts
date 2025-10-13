import { event } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { personaId } from "../objects/personas";

export default event("personaRemoved", {
  personaId,
  accountWorkspaceId,
});