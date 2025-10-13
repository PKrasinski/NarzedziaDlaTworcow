import { useDesignSystem } from "design-system";
import { Plus, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ContentKanbanBoard } from "./components/content-kanban-board";
import { ListOfContentSidebar } from "./components/list-of-content-sidebar";
import { useContent } from "./content-provider";

// Filtry typu publikacji
const PUBLICATION_TYPE_FILTERS = [
  { key: "instagramPost", label: "Instagram Post" },
  { key: "instagramStory", label: "Instagram Story" },
  { key: "instagramReel", label: "Instagram Reel" },
  { key: "tiktokVideo", label: "TikTok" },
  { key: "linkedinPost", label: "LinkedIn Post" },
  { key: "linkedinArticle", label: "LinkedIn Artykuł" },
  { key: "twitterTweet", label: "Tweet" },
  { key: "twitterThread", label: "Twitter Thread" },
  { key: "youtubeVideo", label: "YouTube" },
  { key: "youtubeShorts", label: "YouTube Shorts" },
  { key: "longFormArticle", label: "Artykuł" },
];

export function AllContentPage() {
  const { Button, SidebarLayout } = useDesignSystem();
  const { content, contentFormats, isLoading } = useContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Calculate content counts for each publication type
  const publicationTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    PUBLICATION_TYPE_FILTERS.forEach(filter => {
      counts[filter.key] = content.filter(item => item[filter.key]).length;
    });
    
    return counts;
  }, [content]);

  // Filter publication type filters to only show those with content
  const availableFilters = useMemo(() => {
    return PUBLICATION_TYPE_FILTERS.filter(filter => publicationTypeCounts[filter.key] > 0);
  }, [publicationTypeCounts]);

  return (
    <SidebarLayout 
      sidebar={<ListOfContentSidebar />}
      sidebarSize="compact"
      defaultSidebarSize={30}
      storageKey="content-list-sidebar"
      sticky={true}
      stickyOffset={80}
      className="min-h-screen"
    >
      {/* Main Content Area */}
      <div className="h-full p-4 md:p-8">
        <div className="w-full">
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Tablica treści
              </h1>
              <p className="text-gray-600 text-sm md:text-lg">
                Zarządzaj swoimi treściami w stylu Kanban
              </p>
            </div>
            <Button asChild variant="cta">
              <Link to="/content/new">
                <Plus className="w-4 h-4 mr-2" />
                Dodaj treść
              </Link>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            {/* Filter Badges and Search Input */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Filter Badges */}
              <div className="flex flex-wrap gap-2 flex-1">
                <span className="text-sm font-medium text-gray-700 mr-2">Filtruj według typu:</span>
              {availableFilters.map((filter) => {
                const isActive = activeFilters.includes(filter.key);
                const count = publicationTypeCounts[filter.key];
                return (
                  <button
                    key={filter.key}
                    onClick={() => {
                      if (isActive) {
                        setActiveFilters(prev => prev.filter(f => f !== filter.key));
                      } else {
                        setActiveFilters(prev => [...prev, filter.key]);
                      }
                    }}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-full border transition-colors
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }
                    `}
                  >
                    {filter.label} ({count})
                  </button>
                );
              })}
                {activeFilters.length > 0 && (
                  <button
                    onClick={() => setActiveFilters([])}
                    className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-full hover:border-gray-400"
                  >
                    Wyczyść filtry
                  </button>
                )}
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Wyszukaj treści..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <ContentKanbanBoard
            content={content}
            contentFormats={contentFormats}
            isLoading={isLoading}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
