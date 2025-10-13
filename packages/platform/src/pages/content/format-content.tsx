import { useCommands, useQuery } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { ContentList } from "@/components/content/content-list";
import { StatsCards, StatsData } from "@/components/content/stats-cards";
import { useCustomToast } from "@/hooks/use-toast-custom";
import { useContent } from "@/providers/content-provider";
import { useDesignSystem } from "design-system";
import { ArrowLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// Removed unused calculateCompletionPercentage function

// Component for next step button that appears when minimum content formats are available
const NextStepButton = ({ contentFormats }: { contentFormats: any }) => {
  const navigate = useNavigate();
  const { completeContentFormatsStep } = useCommands();
  const { currentAccount } = useAccountWorkspaces();
  const [isCompleting, setIsCompleting] = useState(false);

  // Show button if there's at least one format
  if (!contentFormats || contentFormats.length === 0) return null;

  const handleNextStep = async () => {
    setIsCompleting(true);
    try {
      await completeContentFormatsStep({
        accountWorkspaceId: currentAccount._id,
      });
      navigate("/strategy/content-ideas");
    } catch (error) {
      console.error("Error completing content formats step:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Button
      onClick={handleNextStep}
      disabled={isCompleting}
      size="sm"
      className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-lg px-3 sm:px-4 py-2 text-sm font-semibold group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <div className="flex items-center space-x-2">
        {isCompleting ? (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Sparkles className="w-4 h-4 animate-pulse" />
        )}
        <span className="hidden sm:inline">
          {isCompleting ? "Przechodzę..." : "Następny krok"}
        </span>
        <span className="sm:hidden">{isCompleting ? "..." : "Dalej"}</span>
        <div className="bg-white/20 rounded-full px-1.5 py-0.5 text-xs">
          {contentFormats.length} format{contentFormats.length > 1 ? "y" : ""}
        </div>
        {!isCompleting && (
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        )}
      </div>
    </Button>
  );
};

export function FormatContentPage() {
  const { Button } = useDesignSystem();
  const { formatId } = useParams<{ formatId: string }>();
  const { showDevelopmentToast } = useCustomToast();
  const { currentAccount } = useAccountWorkspaces();
  const { getContentFormat, getContentByFormat } = useContent();

  // Fetch actual content formats from Arc framework
  const [contentFormats] = useQuery(
    (q) =>
      q.contentFormats.find({
        where: {
          accountWorkspaceId: currentAccount._id,
        },
      }),
    [currentAccount._id]
  );

  if (!formatId) {
    return <div>Format nie został znaleziony</div>;
  }

  const format = getContentFormat(formatId);
  const contentList = getContentByFormat(formatId);

  if (!format) {
    return <div>Format nie został znaleziony</div>;
  }

  const FormatIcon = (format as any)?.icon || Sparkles;

  // Calculate simple stats from content in this format
  const stats: StatsData = useMemo(
    () => ({
      total: contentList.length,
      published: 0, // Simplified - no state tracking for now
      inProgress: 0, // Simplified - no state tracking for now
      ideas: 0, // Simplified - no state tracking for now
    }),
    [contentList]
  );

  return (
    <div className="h-full p-8">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div
              className={`w-16 h-16 bg-gradient-to-r ${
                (format as any)?.color || "from-gray-500 to-gray-600"
              } rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <FormatIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {format.name}
              </h1>
              <p className="text-gray-600 text-lg">{format.subtitle}</p>
            </div>
          </div>
          <button
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={showDevelopmentToast}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nowa treść w tym formacie
          </button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Next Step Button - appears when minimum content formats are available */}
        <div className="flex justify-center mb-8">
          <NextStepButton contentFormats={contentFormats} />
        </div>

        {/* Content List */}
        <ContentList
          content={contentList}
          getContentFormat={getContentFormat}
        />

        {/* Empty state for format */}
        {contentList.length === 0 && (
          <div className="text-center py-16">
            <div
              className={`w-32 h-32 bg-gradient-to-r ${
                (format as any)?.color || "from-gray-500 to-gray-600"
              } rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
            >
              <FormatIcon className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Brak treści w formacie "{format.name}"
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
              Zacznij tworzyć treści w tym formacie, aby zobaczyć je tutaj.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
