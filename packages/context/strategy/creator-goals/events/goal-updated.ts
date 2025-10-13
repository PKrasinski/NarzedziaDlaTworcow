import { event, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { goalId, goalSchema } from "../objects/goals";

export default event("goalUpdated", {
  goalId,
  accountWorkspaceId,
  goalUpdate: object(goalSchema),
});
