import { ArcViewRecord } from "@arcote.tech/arc";
import { FileX, Loader2 } from "lucide-react";
import { ContentItem } from "./content-item";

interface ContentListProps {
  content: ArcViewRecord<any>[];
  isLoading?: boolean;
  emptyMessage?: string;
  hideFormatBadges?: boolean;
}

export function ContentList({
  content,
  isLoading,
  emptyMessage = "Brak treści do wyświetlenia",
  hideFormatBadges = false,
}: ContentListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Ładowanie treści...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!content || content.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileX className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Brak treści
            </h3>
            <p className="text-gray-600 text-sm max-w-sm">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Content list
  return (
    <div className="space-y-4">
      {/* List Layout */}
      <div className="space-y-3">
        {content.map((item) => (
          <ContentItem key={item._id} content={item} hideFormatBadge={hideFormatBadges} />
        ))}
      </div>
    </div>
  );
}
