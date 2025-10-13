import { useAccountWorkspaces } from "@/components/account-workspace-provider";
import { useContent } from "@/providers/content-provider";
import { BookOpen, Plus, Sparkles } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

export function ContentListLayout() {
  const location = useLocation();
  const { currentAccount } = useAccountWorkspaces();
  const { contentFormats } = useContent();

  const hasStrategyAccess = currentAccount?.hasAccessToStrategyAgentService;

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const UpgradePrompt = () => (
    <div className="relative backdrop-blur-xl bg-gradient-to-r from-white/20 to-blue-50/30 border border-white/20 rounded-2xl p-6 mb-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
      <div className="relative flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Stwórz swoją strategię treści
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Aby dodać własne formaty treści, przejdź przez proces tworzenia
            strategii treści i odkryj pełny potencjał platformy.
          </p>
          <Link
            to="/course"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Rozpocznij strategię
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-screen">
      {/* Left Sidebar with margins and rounded corners */}
      <div className="w-96 p-4">
        <div className="h-full backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl shadow-lg">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Treści
              </h1>
              <p className="text-gray-600 text-sm">
                Zarządzaj swoimi treściami i formatami
              </p>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-3">
              {/* All Content */}
              <Link
                to="/"
                className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActiveRoute("/")
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 shadow-lg backdrop-blur-sm border border-blue-200/30"
                    : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                }`}
              >
                <BookOpen className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                <span>Wszystkie treści</span>
                {isActiveRoute("/") && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                )}
              </Link>

              {/* Ideas Link */}
              <Link
                to="/content/ideas"
                className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActiveRoute("/content/ideas")
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 shadow-lg backdrop-blur-sm border border-blue-200/30"
                    : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                }`}
              >
                <Sparkles className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                <span>Pomysły na treści</span>
                {isActiveRoute("/content/ideas") && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                )}
              </Link>

              {/* Content Formats Section */}
              <div className="pt-6">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">
                  Formaty treści
                </h2>

                {!hasStrategyAccess && <UpgradePrompt />}

                {hasStrategyAccess && (
                  <div className="space-y-2">
                    {contentFormats.map((format) => {
                      const IconComponent = format.icon;
                      return (
                        <Link
                          key={format._id}
                          to={`/content/format/${format._id}`}
                          className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActiveRoute(`/content/format/${format._id}`)
                              ? "bg-gradient-to-r from-white/60 to-white/40 shadow-lg backdrop-blur-sm border border-white/30"
                              : "hover:bg-white/30 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 bg-gradient-to-r ${format.color} rounded-lg flex items-center justify-center shadow-sm mr-3 group-hover:scale-110 transition-transform duration-200`}
                            >
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">
                                {format.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                {format.subtitle}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-white/50 text-gray-700 px-2 py-1 rounded-md font-medium">
                              {format.count}
                            </span>
                          </div>
                        </Link>
                      );
                    })}

                    {/* Add New Format Button */}
                    <Link
                      to="/strategy/content-formats?view=summary"
                      className="w-full flex items-center justify-center px-4 py-3 mt-3 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl text-sm font-medium text-gray-600 hover:text-blue-700 transition-all duration-200 hover:bg-blue-50/50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Dodaj nowy format
                    </Link>
                  </div>
                )}

                {hasStrategyAccess && contentFormats.length === 0 && (
                  <div className="text-sm text-gray-500 italic py-4 px-4 text-center bg-white/20 rounded-xl">
                    Brak formatów treści. Stwórz je w strategii.
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area - Full width */}
      <div className="flex-1 pr-4">
        <div className="h-full pt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
