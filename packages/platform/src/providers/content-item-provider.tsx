import { useQuery } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { createContext, ReactNode, useContext } from "react";
import { useParams } from "react-router-dom";

// Context type - holds current content item data
interface ContentItemContextType {
  contentItem: any | null;
  isLoading: boolean;
}

// Create context
const ContentItemContext = createContext<ContentItemContextType | undefined>(
  undefined
);

// Provider component
interface ContentItemProviderProps {
  children: ReactNode;
}

export function ContentItemProvider({ children }: ContentItemProviderProps) {
  const { currentAccount } = useAccountWorkspaces();
  const { itemId } = useParams<{ itemId: string }>();

  // Fetch content item from Arc framework
  const [contentItem, isLoading] = useQuery(
    (q) =>
      q.content.findOne({
        _id: itemId as any,
      }),
    [itemId, currentAccount._id]
  );

  const value: ContentItemContextType = {
    contentItem: contentItem || null,
    isLoading: !!isLoading,
  };

  return (
    <ContentItemContext.Provider value={value}>
      {children}
    </ContentItemContext.Provider>
  );
}

// Hook to use content item context
export function useContentItem(): ContentItemContextType {
  const context = useContext(ContentItemContext);
  if (context === undefined) {
    throw new Error("useContentItem must be used within a ContentItemProvider");
  }
  return context;
}
