import { event } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";

export default event("creatorStyleStepCompleted", {
  accountWorkspaceId,
});
