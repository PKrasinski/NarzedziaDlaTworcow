import { event, string } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../ids/account-workspace-id";

export const workspaceUpdated = event("workspaceUpdated", {
  accountWorkspaceId,
  creatorName: string(),
});
