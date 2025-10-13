import { event, number } from "@arcote.tech/arc";
import { accountWorkspaceId } from "./account-workspace";
import { userId } from "./auth";

export const strategyAgentServicePurchased = event(
  "strategyAgentServicePurchased",
  {
    accountWorkspaceId,
  }
);

// Credit purchase event
export const creditsPurchased = event("creditsPurchased", {
  userId,
  creditsAmount: number(),
});
