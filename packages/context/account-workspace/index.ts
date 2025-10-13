import completeOnboarding from "./commands/complete-onboarding";
import { createAccountWorkspace } from "./commands/create-account-workspace";
import requestBetaAccess from "./commands/request-beta-access";
import updateWorkspace from "./commands/update-workspace";
import { accountWorkspaceCreated } from "./events/account-workspace-created";
import { betaAccessRequested } from "./events/beta-access-requested";
import { onboardingCompleted } from "./events/onboarding-completed";
import { workspaceUpdated } from "./events/workspace-updated";
import { accountWorkspaces } from "./views/account-workspaces";

export * from "./ids/account-workspace-id";

export const createAccountWorkspaceElements = () =>
  [
    accountWorkspaces,
    accountWorkspaceCreated,
    workspaceUpdated,
    onboardingCompleted,
    betaAccessRequested,
    updateWorkspace,
    requestBetaAccess,
    createAccountWorkspace,
    completeOnboarding,
  ] as const;
