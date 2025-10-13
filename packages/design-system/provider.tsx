import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { Sticky } from "./components/ui/sticky";
import { sidebarComponents } from "./components/ui/sidebar";
import { SidebarLayout } from "./components/layouts/sidebar-layout";
import { useLocalStorage } from "./hooks/use-local-storage";

const designSystemComponents = {
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Link,
  useLocation,
  useLocalStorage,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Sticky,
  SidebarLayout,
  ...sidebarComponents,
} as const;

type DesignSystemComponents = typeof designSystemComponents;
type DesignSystemOverrides = Partial<DesignSystemComponents>;

// Create the context
const DesignSystemContext = createContext<DesignSystemComponents | null>(null);

// Provider props
interface DesignSystemProviderProps {
  children: ReactNode;
  overrides?: DesignSystemOverrides;
}

/**
 * DesignSystemProvider - Provides design system components via context
 *
 * Usage:
 * ```tsx
 * // Basic usage
 * <DesignSystemProvider>
 *   <App />
 * </DesignSystemProvider>
 *
 * // With overrides for custom projects
 * <DesignSystemProvider overrides={{ Button: CustomButton }}>
 *   <App />
 * </DesignSystemProvider>
 * ```
 */
export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({
  children,
  overrides = {},
}) => {
  // Memoize components to prevent unnecessary re-renders
  const components = useMemo<DesignSystemComponents>(
    () => ({
      ...designSystemComponents,
      ...overrides,
    }),
    [overrides]
  );

  return (
    <DesignSystemContext.Provider value={components}>
      {children}
    </DesignSystemContext.Provider>
  );
};

/**
 * useDesignSystem - High-performance hook to access design system components
 *
 * Usage:
 * ```tsx
 * const { Button } = useDesignSystem();
 *
 * return (
 *   <Button variant="cta" size="lg">
 *     Click me
 *   </Button>
 * );
 * ```
 */
export const useDesignSystem = (): DesignSystemComponents => {
  const context = useContext(DesignSystemContext);

  if (!context) {
    throw new Error(
      "useDesignSystem must be used within a DesignSystemProvider. " +
        "Please wrap your app with <DesignSystemProvider>."
    );
  }

  return context;
};

// Export types for external usage
export type { DesignSystemComponents, DesignSystemOverrides };
