import { ContentList } from "@/components/content/content-list";
import { StatsCards, StatsData } from "@/components/content/stats-cards";
import { useCustomToast } from "@/hooks/use-toast-custom";
import { useContent } from "@/providers/content-provider";
import { Plus } from "lucide-react";
import { useMemo } from "react";

export function AllContentPage() {
  const { showDevelopmentToast } = useCustomToast();
  const { content, getContentFormat } = useContent();

  // Calculate simple stats from content
  const stats: StatsData = useMemo(
    () => ({
      total: content.length,
      published: 0, // Simplified - no state tracking for now
      inProgress: 0, // Simplified - no state tracking for now
      ideas: 0, // Simplified - no state tracking for now
    }),
    [content]
  );

  return (
    <div className="h-full p-8">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Wszystkie treści
            </h1>
            <p className="text-gray-600 text-lg">
              Przeglądaj i zarządzaj wszystkimi swoimi treściami w jednym
              miejscu
            </p>
          </div>
          <button
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={showDevelopmentToast}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nowa treść
          </button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Content List */}
        <ContentList content={content} getContentFormat={getContentFormat} />
      </div>
    </div>
  );
}
