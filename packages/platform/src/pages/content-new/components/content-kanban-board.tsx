import { useMemo } from "react";
import { ArcViewRecord } from "@arcote.tech/arc";
import { ContentKanbanProvider, useContentKanban } from "./content-kanban-provider";
import { ContentKanbanColumn } from "./content-kanban-column";
import { ContentKanbanMobileList } from "./content-kanban-mobile-list";

interface ContentKanbanBoardProps {
  content: ArcViewRecord<any>[];
  contentFormats: ArcViewRecord<any>[];
  isLoading?: boolean;
  searchQuery?: string;
  activeFilters?: string[];
}

function ContentKanbanBoardInner({
  content,
  contentFormats,
  isLoading,
  searchQuery = "",
  activeFilters = [],
}: ContentKanbanBoardProps) {
  const { columns } = useContentKanban();

  // Filter and group content by status
  const groupedContent = useMemo(() => {
    const groups: Record<string, ArcViewRecord<any>[]> = {
      ideas: [],
      in_progress: [],
      published: [],
    };

    // Filter content based on search query and active filters
    const filteredContent = content.filter((item) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesFilter = activeFilters.length === 0 ||
        activeFilters.some(filter => item[filter]);

      return matchesSearch && matchesFilter;
    });

    filteredContent.forEach((item) => {
      const status = item.status || "ideas";
      if (groups[status]) {
        groups[status].push(item);
      }
    });

    return groups;
  }, [content, searchQuery, activeFilters]);

  // Get format name helper
  const getFormatName = (formatId: string) => {
    const format = contentFormats.find((f) => f._id === formatId);
    return format?.name || "Nieznany format";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-20 bg-gray-100 rounded"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Kanban View (hidden on mobile) */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {columns.map((column) => {
          const items = groupedContent[column.id] || [];
          
          return (
            <ContentKanbanColumn
              key={column.id}
              column={column}
              items={items}
              getFormatName={getFormatName}
            />
          );
        })}
      </div>

      {/* Mobile List View (shown only on mobile) */}
      <div className="lg:hidden">
        <ContentKanbanMobileList
          content={content}
          contentFormats={contentFormats}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

export function ContentKanbanBoard(props: ContentKanbanBoardProps) {
  return (
    <ContentKanbanProvider content={props.content}>
      <ContentKanbanBoardInner {...props} />
    </ContentKanbanProvider>
  );
}