"use client";

import * as React from "react";
import { useDesignSystem } from "../../provider";

interface SidebarLayoutProps {
  /**
   * Sidebar content as JSX element
   */
  sidebar: React.ReactNode;
  /**
   * Main content to display in the right panel
   */
  children: React.ReactNode;
  /**
   * Default width for the sidebar panel (as percentage)
   */
  defaultSidebarSize?: number;
  /**
   * Minimum width for the sidebar panel (as percentage)
   */
  minSidebarSize?: number;
  /**
   * Maximum width for the sidebar panel (as percentage)
   */
  maxSidebarSize?: number;
  /**
   * Whether to show the resize handle
   */
  showHandle?: boolean;
  /**
   * Size configuration for sidebar components
   */
  sidebarSize?: "compact" | "default" | "comfortable";
  /**
   * Additional className for the layout container
   */
  className?: string;
  /**
   * Unique key for localStorage to allow different sidebar sizes per page
   */
  storageKey?: string;
  /**
   * Whether to make the sidebar sticky (desktop only)
   */
  sticky?: boolean;
  /**
   * Offset from top when sidebar becomes sticky
   */
  stickyOffset?: number;
}

export function SidebarLayout({
  sidebar,
  children,
  defaultSidebarSize = 25,
  minSidebarSize = 20,
  maxSidebarSize = 40,
  showHandle = true,
  sidebarSize = "default",
  className,
  storageKey = "sidebar-size",
  sticky = false,
  stickyOffset = 64,
}: SidebarLayoutProps) {
  const {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarTrigger,
    Sticky,
    useLocalStorage,
  } = useDesignSystem();

  const [isMobile, setIsMobile] = React.useState(false);
  
  // Use localStorage to persist sidebar size
  const [sidebarStoredSize, setSidebarStoredSize] = useLocalStorage(
    storageKey, 
    defaultSidebarSize
  );

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <SidebarProvider size={sidebarSize} defaultOpen={false}>
        <div className={`flex h-screen w-full ${className || ""}`}>
          {/* Mobile Sidebar */}
          <Sidebar
            side="left"
            variant="sidebar"
            collapsible="offcanvas"
            className="bg-white/95 backdrop-blur-lg"
          >
            <SidebarContent>{sidebar}</SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Mobile Header with Trigger */}
            <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
              <div className="flex-1" />
              <SidebarTrigger className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 [&>svg]:w-4 [&>svg]:h-4" />
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Desktop Layout with Resizable Panels
  return (
    <SidebarProvider size={sidebarSize} defaultOpen={true}>
      <div className={`h-screen w-full ${className || ""}`}>
        <ResizablePanelGroup 
          direction="horizontal"
          onLayout={(sizes) => {
            // Save the sidebar size when user resizes
            if (sizes[0] !== undefined) {
              setSidebarStoredSize(sizes[0]);
            }
          }}
        >
          {/* Sidebar Panel */}
          <ResizablePanel
            defaultSize={sidebarStoredSize}
            minSize={minSidebarSize}
            maxSize={maxSidebarSize}
            className="min-w-0"
          >
            <div className="h-full p-4">
              {sticky ? (
                <Sticky 
                  offset={stickyOffset}
                  className="h-[calc(100vh-var(--header-height,4rem)-2rem)]"
                  stickyClassName="h-[calc(100vh-4rem)]"
                >
                  <Sidebar
                    side="left"
                    variant="floating"
                    collapsible="none"
                    className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg h-full"
                  >
                    <SidebarContent className="p-2">{sidebar}</SidebarContent>
                  </Sidebar>
                </Sticky>
              ) : (
                <Sidebar
                  side="left"
                  variant="floating"
                  collapsible="none"
                  className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg h-[calc(100vh-var(--header-height,4rem)-2rem)]"
                >
                  <SidebarContent className="p-2">{sidebar}</SidebarContent>
                </Sidebar>
              )}
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          {showHandle && <ResizableHandle withHandle />}

          {/* Main Content Panel */}
          <ResizablePanel defaultSize={100 - sidebarStoredSize} minSize={60}>
            <main className="h-full overflow-auto">{children}</main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  );
}