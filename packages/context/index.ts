/// <reference path="./arc.types.ts" />

import { context as arcContext } from "@arcote.tech/arc";

// Import auth context from factory

// Import remaining non-auth events
import { creditsPurchased, strategyAgentServicePurchased } from "./events";

// New ordering system factory
import { createAccountWorkspaceElements } from "./account-workspace";
import { transcribeVoice } from "./ai";
export * from "./strategy";

// Create ordering elements using factory function
const accountWorkspaceElements = createAccountWorkspaceElements();

// Create context with all components
export const context1 = arcContext([
  // Remaining non-auth events
  strategyAgentServicePurchased,
  creditsPurchased,
  transcribeVoice,
]);

export const context2 = arcContext([...accountWorkspaceElements]);

export {
  narzedziaDlaTworcowOrderingContext,
  type CreditPackage,
  type StrategyProduct,
} from "./ordering/";

// Export auth context and userId
export { authContext, userId } from "./auth";

// Export remaining non-auth events
export { creditsPurchased, strategyAgentServicePurchased } from "./events";

export { accountWorkspaces } from "./account-workspace/views/account-workspaces";
export { invoiceDataSchema } from "./ordering/objects/invoice-data";

export { personaSchema } from "./strategy/viewer-targets/objects/personas";

export { styleSchema } from "./strategy/creator-style/objects/style";

export { formatSchema } from "./strategy/content-formats/objects/format";

export { identitySchema } from "./strategy/creator-identity/objects/identity";

export { ideaSchema } from "./strategy/content-ideas/objects/idea";

// Export Arc framework types for chat components
export type { ArcAnyViewRecord } from "@arcote.tech/arc";

// Export new strategy contexts
export { contentFormatsContext } from "./strategy/content-formats";
export { contentIdeasContext } from "./strategy/content-ideas";
export { creatorStyleContext } from "./strategy/creator-style";

// Export content management context
export { contentChat, contentContext } from "./content";

export { goalSchema } from "./strategy/creator-goals/objects/goals";

export { contentSchema, contentTypes } from "./content/objects/content";
