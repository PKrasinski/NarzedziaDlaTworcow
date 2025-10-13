import { event, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { personaId, personaSchema } from "../objects/personas";

export default event("personaCreated", {
  personaId,
  accountWorkspaceId,
  persona: object(personaSchema),
});