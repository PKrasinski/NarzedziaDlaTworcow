import { event } from "@arcote.tech/arc";
import { accountWorkspaceId } from "../ids/account-workspace-id";

export const onboardingCompleted = event("onboardingCompleted", {
  accountWorkspaceId,
});