import { Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ContentList } from "./components/content-list";
import { ListOfContentSidebar } from "./components/list-of-content-sidebar";
import { useContent } from "./content-provider";

export function FormatContentPage() {
  const { formatId } = useParams<{ formatId: string }>();
  const { content, contentFormats, isLoading } = useContent();

  // Find the current format
  const currentFormat = contentFormats.find((f) => f._id === formatId);

  // Filter content by format
  const formatContent = content.filter((item) => item.formatId === formatId);

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <ListOfContentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 pr-4 md:pr-4 p-4 md:p-0">
        <div className="h-full pt-4">
          <div className="h-full p-4 md:p-8">
            <div className="w-full">
              {/* Header with format info and Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {currentFormat?.name || "Format bez nazwy"}
                    </h1>
                  </div>
                  {currentFormat?.subtitle && (
                    <p className="text-lg md:text-xl text-gray-600 mb-2">
                      {currentFormat.subtitle}
                    </p>
                  )}
                  {currentFormat?.description && (
                    <p className="text-gray-600">{currentFormat.description}</p>
                  )}
                </div>
                <Link
                  to={`/content/new?formatId=${formatId}`}
                  className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm md:text-base rounded-lg hover:shadow-lg transition-all duration-200 self-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">
                    Dodaj treść w tym formacie
                  </span>
                  <span className="sm:hidden">Dodaj treść</span>
                </Link>
              </div>

              {/* Content List */}
              <ContentList
                content={formatContent}
                isLoading={isLoading}
                emptyMessage={`Nie masz jeszcze treści w formacie "${
                  currentFormat?.name || "tym"
                }". Stwórz swoją pierwszą treść w tym formacie!`}
                hideFormatBadges={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
