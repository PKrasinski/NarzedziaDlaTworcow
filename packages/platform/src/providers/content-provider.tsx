import { useQuery } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { createContext, ReactNode, useContext } from "react";
import { ContentData } from "../../../context/content/objects/content";
import { ContentFormatType } from "../../../context/strategy/content-formats/objects/format";

// Context type with proper typing
interface ContentContextType {
  contentFormats: ContentFormatType[];
  content: ContentData[];
  contentIdeas: any[]; // Keep as any for now, can be typed later if needed
  getContentFormat: (formatId: string) => ContentFormatType | undefined;
  getContentByFormat: (formatId: string) => ContentData[];
}

// Create context
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Provider component
interface ContentProviderProps {
  children: ReactNode;
}

export function ContentProvider({ children }: ContentProviderProps) {
  const { currentAccount } = useAccountWorkspaces();

  // Fetch content from Arc framework - no transformations
  const [content] = useQuery(
    (q) =>
      q.content.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
        orderBy: {
          _id: "desc",
        },
      }),
    [currentAccount._id]
  );

  // Fetch content formats from Arc framework - no transformations
  const [contentFormats] = useQuery(
    (q) =>
      q.contentFormats.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
      }),
    [currentAccount._id]
  );

  // Fetch content ideas from Arc framework - no transformations
  const [contentIdeas] = useQuery(
    (q) =>
      q.contentIdeas.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
        orderBy: {
          _id: "desc",
        },
      }),
    [currentAccount._id]
  );

  // Helper functions
  const getContentFormat = (
    formatId: string
  ): ContentFormatType | undefined => {
    return (contentFormats as any)?.find(
      (format: any) => format._id === formatId
    );
  };

  const getContentByFormat = (formatId: string): ContentData[] => {
    return (
      (content as any)?.filter((item: any) => item.formatId === formatId) || []
    );
  };

  const value: ContentContextType = {
    contentFormats: (contentFormats as any) || [],
    content: (content as any) || [],
    contentIdeas: contentIdeas || [],
    getContentFormat,
    getContentByFormat,
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
