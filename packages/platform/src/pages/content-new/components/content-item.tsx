import { ArcViewRecord } from "@arcote.tech/arc";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useContent } from "../content-provider";

interface ContentItemProps {
  content: ArcViewRecord<any>;
  hideFormatBadge?: boolean;
}

export function ContentItem({ content, hideFormatBadge = false }: ContentItemProps) {
  const { contentFormats } = useContent();

  // Find the format for this content
  const format = contentFormats.find((f) => f._id === content.formatId);

  // Format date if available (extract timestamp from MongoDB ObjectId)
  const formatDate = (id: string) => {
    try {
      // Extract timestamp from ObjectId (first 8 characters)
      const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Data nieznana";
    }
  };

  return (
    <Link
      to={`/content/item/${content._id}`}
      className="block group bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-200 transition-all duration-200"
    >
      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-gray-900 text-sm leading-tight flex-1">
            {content.title || "Bez tytułu"}
          </h3>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {!hideFormatBadge && format && (
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {format.name || "Format"}
              </span>
            )}
            {content._id && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(content._id).split(".")[0]}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {content.description && (
            <p className="text-gray-600 text-xs truncate flex-1">
              {content.description}
            </p>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-start justify-between gap-3">
        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium text-gray-900 truncate">
              {content.title || "Bez tytułu"}
            </h3>
          </div>
          {content.description && (
            <p
              className="text-gray-600 text-sm overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
              }}
            >
              {content.description}
            </p>
          )}
        </div>

        {/* Date & Format Badge */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {!hideFormatBadge && format && (
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              {format.name || "Format bez nazwy"}
            </span>
          )}
          {content._id && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(content._id)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
