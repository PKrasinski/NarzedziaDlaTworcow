import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@narzedziadlatworcow.pl/ui/components/ui/tooltip";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContentData } from "../../../../context/content/objects/content";
import { ContentFormatType } from "../../../../context/strategy/content-formats/objects/format";

interface ContentListProps {
  content: ContentData[];
  getContentFormat: (formatId: string) => ContentFormatType | undefined;
  className?: string;
}

export function ContentList({
  content,
  getContentFormat,
  className = "",
}: ContentListProps) {
  const navigate = useNavigate();

  if (content.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="w-32 h-32 backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Sparkles className="w-16 h-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Brak treści
        </h3>
        <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
          Zacznij tworzyć treści, dodając pomysły lub używając formatów treści z
          Twojej strategii.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${className}`}>
        {content.map((contentItem) => {
          const format = getContentFormat(contentItem.formatId);
          // Use default icon and color for now since format might not have these UI properties
          const FormatIcon = (format as any)?.icon || Sparkles;
          const formatColor =
            (format as any)?.color || "from-gray-500 to-gray-600";

          return (
            <div
              key={contentItem._id}
              className="group backdrop-blur-xl bg-gradient-to-r from-white/60 to-white/30 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/content/${contentItem._id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    {/* Format Icon */}
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${formatColor} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <FormatIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                        {contentItem.title}
                      </h3>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {contentItem.description}
                      </p>

                      {/* Content Type Indicators */}
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(contentItem).map(([key, value]) => {
                          // Only show content type fields (skip basic fields)
                          if (
                            [
                              "_id",
                              "title",
                              "description",
                              "formatId",
                            ].includes(key) ||
                            !value
                          ) {
                            return null;
                          }

                          return (
                            <Tooltip key={key}>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-help bg-blue-100 text-blue-800">
                                  <FormatIcon className="w-3 h-3 mr-1" />
                                  {key}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900/90 text-white text-xs px-2 py-1 rounded-md border-none shadow-lg">
                                <p>Typ treści: {key}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
