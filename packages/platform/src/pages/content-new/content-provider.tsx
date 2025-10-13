import { context, useQuery } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { ArcViewRecord } from "@arcote.tech/arc";
import { createContext, ReactNode, useContext } from "react";

const contentFormats = context.get("contentFormats");
const content = context.get("content");

// Simple context type using Arc's native types
interface ContentContextType {
  contentFormats: ArcViewRecord<typeof contentFormats>[];
  content: ArcViewRecord<typeof content>[];
  isLoading: boolean;
}

// Create context
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Provider component
interface ContentProviderProps {
  children: ReactNode;
}

export function ContentProvider({ children }: ContentProviderProps) {
  const { currentAccount } = useAccountWorkspaces();

  // Fetch content formats
  const [contentFormats, isLoadingFormats] = useQuery(
    (q) =>
      q.contentFormats.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
      }),
    [currentAccount._id]
  );

  // Fetch content
  const [content, isLoadingContent] = useQuery(
    (q) =>
      q.content.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
        orderBy: {
          order: "asc",
        },
      }),
    [currentAccount._id]
  );

  const value: ContentContextType = {
    contentFormats: contentFormats || [],
    content: content || [],
    isLoading: isLoadingFormats || isLoadingContent,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

// Hook to use content context
export function useContent(): ContentContextType {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
