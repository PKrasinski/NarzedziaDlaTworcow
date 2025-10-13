import { useDesignSystem } from "design-system";
import { ArcViewRecord } from "@arcote.tech/arc";
import { useMemo } from "react";
import { ContentKanbanCard } from "./content-kanban-card";
import { useContentKanban } from "./content-kanban-provider";

interface ContentKanbanMobileListProps {
  content: ArcViewRecord<any>[];
  contentFormats: ArcViewRecord<any>[];
  isLoading?: boolean;
}

export function ContentKanbanMobileList({
  content,
  contentFormats,
  isLoading,
}: ContentKanbanMobileListProps) {
  // const { Badge } = useDesignSystem(); // Badge not available, using span instead
  const { columns } = useContentKanban();

  // Group content by status and flatten for mobile list view
  const allContentWithStatus = useMemo(() => {
    const items: Array<{
      content: ArcViewRecord<any>;
      statusInfo: typeof columns[0];
    }> = [];

    columns.forEach((column) => {
      const statusItems = content.filter(
        (item) => (item.status || "ideas") === column.id
      );
      
      statusItems.forEach((content) => {
        items.push({
          content,
          statusInfo: column,
        });
      });
    });

    // Sort by creation date (newest first)
    return items.sort((a, b) => 
      new Date(b.content.createdAt).getTime() - new Date(a.content.createdAt).getTime()
    );
  }, [content, columns]);

  // Get format name helper
  const getFormatName = (formatId: string) => {
    const format = contentFormats.find((f) => f._id === formatId);
    return format?.name || "Nieznany format";
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-100 rounded"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-100 rounded mb-3"></div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-100 rounded"></div>
                <div className="h-4 w-16 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (allContentWithStatus.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Brak treści
        </h3>
        <p className="text-gray-500 text-sm">
          Rozpocznij od stworzenia swojej pierwszej treści!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allContentWithStatus.map(({ content, statusInfo }) => (
        <div key={content._id} className="relative">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-2">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.textColor} border-0`}
            >
              {statusInfo.title}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(content.createdAt).toLocaleDateString('pl-PL')}
            </span>
          </div>
          
          {/* Content card (reuse existing drag-enabled card) */}
          <ContentKanbanCard
            content={content}
            getFormatName={getFormatName}
            columnBorderColor={statusInfo.borderColor}
          />
        </div>
      ))}
    </div>
  );
}