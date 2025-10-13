import { event } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { goalId } from "../objects/goals";

export default event("goalRemoved", {
  goalId,
  accountWorkspaceId,
});