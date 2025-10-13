"use client";

import { useCommands } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { ArcViewRecord } from "@arcote.tech/arc";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal, flushSync } from "react-dom";

// Content drag data types
export type ContentDragData = {
  type: "content";
  contentId: string;
};

export type ContentColumnDropData = {
  type: "column";
  status: "ideas" | "in_progress" | "published";
};

export function validContentDragData(data: any): data is ContentDragData {
  return data?.type === "content" && typeof data?.contentId === "string";
}

export function validContentColumnDropData(
  data: any
): data is ContentColumnDropData {
  return data?.type === "column" && typeof data?.status === "string";
}

// Context types
interface ContentKanbanContextType {
  draggedContent: string | null;
  columns: {
    id: "ideas" | "in_progress" | "published";
    title: string;
    description: string;
    color: string;
    borderColor: string;
    textColor: string;
  }[];
}

const ContentKanbanContext = createContext<
  ContentKanbanContextType | undefined
>(undefined);

// Column configuration
const KANBAN_COLUMNS = [
  {
    id: "ideas" as const,
    title: "Pomysły",
    description: "Pomysły na treści do opracowania",
    color: "bg-gray-100",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
  },
  {
    id: "in_progress" as const,
    title: "W trakcie",
    description: "Treści obecnie w opracowaniu",
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  {
    id: "published" as const,
    title: "Opublikowane",
    description: "Gotowe treści do wykorzystania",
    color: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
];

// Drag preview component
function ContentDragPreview({ content }: { content: ArcViewRecord<any> }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
        {content.title}
      </h4>
    </div>
  );
}

interface ContentKanbanProviderProps {
  children: ReactNode;
  content: ArcViewRecord<any>[];
}

export function ContentKanbanProvider({
  children,
  content,
}: ContentKanbanProviderProps) {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const [draggedContent, setDraggedContent] = useState<string | null>(null);
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(
    null
  );
  
  const { currentAccount } = useAccountWorkspaces();
  const { updateContent } = useCommands();

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          if (!wrapper.current) return false;
          return wrapper.current.contains(source.element);
        },
        onDragStart({ source }) {
          // Optional: Add visual feedback on drag start
        },
        onDrop: async ({ source, location }) => {
          if (location.current.dropTargets.length === 0) {
            setDraggedContent(null);
            return;
          }

          const dropTargetData = location.current.dropTargets[0].data;
          if (!validContentColumnDropData(dropTargetData)) {
            setDraggedContent(null);
            return;
          }

          if (!draggedContent) {
            return;
          }

          // Execute the status change
          await flushSync(async () => {
            await updateContent({
              contentId: draggedContent,
              contentUpdate: {
                status: dropTargetData.status,
                // Generate new order using current timestamp
                order: Date.now(),
              },
              accountWorkspaceId: currentAccount._id,
            });
          });

          setDraggedContent(null);
        },
        onGenerateDragPreview({ source, nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
            render({ container }) {
              if (!validContentDragData(source.data)) return;

              setDraggedContent(source.data.contentId);
              setPreviewContainer(container);
            },
          });
        },
      })
    );
  }, [draggedContent, updateContent, currentAccount._id]);

  const contextValue: ContentKanbanContextType = {
    draggedContent,
    columns: KANBAN_COLUMNS,
  };

  // Find dragged content for preview
  const draggedContentData = draggedContent
    ? content.find((c) => c._id === draggedContent)
    : null;

  return (
    <ContentKanbanContext.Provider value={contextValue}>
      <div ref={wrapper} className="w-full">
        {children}
      </div>
      {previewContainer &&
        draggedContentData &&
        createPortal(
          <ContentDragPreview content={draggedContentData} />,
          previewContainer
        )}
    </ContentKanbanContext.Provider>
  );
}

export function useContentKanban() {
  const context = useContext(ContentKanbanContext);
  if (!context) {
    throw new Error(
      "useContentKanban must be used within a ContentKanbanProvider"
    );
  }
  return context;
}
