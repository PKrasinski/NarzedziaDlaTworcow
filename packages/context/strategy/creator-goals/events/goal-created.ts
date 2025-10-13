import { event, object } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../../../account-workspace";
import { goalId, goalSchema } from "../objects/goals";

export default event("goalCreated", {
  goalId,
  accountWorkspaceId,
  goal: object(goalSchema),
});