// Export the provider and hook
export { DesignSystemProvider, useDesignSystem } from "./provider";
export type { DesignSystemComponents, DesignSystemOverrides } from "./provider";

// Export components for direct usage if needed (but prefer useDesignSystem hook)
export * from "./components";

// Export utilities
export { cn } from "./lib/utils";