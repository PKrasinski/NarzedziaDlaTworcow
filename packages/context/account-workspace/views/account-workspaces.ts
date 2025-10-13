import { array, boolean, date, object, string, view } from "@arcote.tech/arc";
import { userId } from "../../auth";
import { strategyAgentServicePurchased } from "../../events";
import { accountWorkspaceCreated } from "../events/account-workspace-created";
import { onboardingCompleted } from "../events/onboarding-completed";
import { workspaceUpdated } from "../events/workspace-updated";
import { accountWorkspaceId } from "../ids/account-workspace-id";

const accountWorkspaceItemSchema = object({
  userId: userId,
  creatorName: string(),
  platforms: array(string()),
  otherPlatform: string().optional(),
  createdAt: date(),
  hasAccessToStrategyAgentService: boolean(),
  hasCompletedOnboarding: boolean(),
});

export const accountWorkspaces = view(
  "accountWorkspaces",
  accountWorkspaceId,
  accountWorkspaceItemSchema
)
  .use([
    accountWorkspaceCreated,
    workspaceUpdated,
    onboardingCompleted,
    strategyAgentServicePurchased,
  ])
  .auth((authContext) => ({
    userId: authContext.userId, // Only show user's own account workspaces
  }))
  .handle({
    accountWorkspaceCreated: async (ctx, event) => {
      await ctx.set(event.payload.accountWorkspaceId, {
        userId: event.payload.userId,
        creatorName: event.payload.creatorName,
        platforms: event.payload.platforms,
        otherPlatform: event.payload.otherPlatform,
        createdAt: event.payload.createdAt,
        hasAccessToStrategyAgentService: false,
        hasCompletedOnboarding: false,
      });
    },
    workspaceUpdated: async (ctx, event) => {
      await ctx.modify(event.payload.accountWorkspaceId, {
        creatorName: event.payload.creatorName,
      });
    },
    onboardingCompleted: async (ctx, event) => {
      await ctx.modify(event.payload.accountWorkspaceId, {
        hasCompletedOnboarding: true,
      });
    },
    strategyAgentServicePurchased: async (ctx, event) => {
      await ctx.modify(event.payload.accountWorkspaceId, {
        hasAccessToStrategyAgentService: true,
      });
    },
  });
