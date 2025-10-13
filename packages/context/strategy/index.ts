import { context } from "@arcote.tech/arc";
import { strategyProgress } from "./views/strategy-progress";

// Import strategy modules
export { contentFormatsContext } from "./content-formats";
export { contentIdeasContext } from "./content-ideas";
export { creatorGoalsContext } from "./creator-goals";
export { creatorIdentityContext, identitySchema } from "./creator-identity";
export { creatorStyleContext } from "./creator-style";
export { viewerTargetsContext } from "./viewer-targets";

export const strategyContext = context([strategyProgress]);
