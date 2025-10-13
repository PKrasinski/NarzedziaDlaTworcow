import { useDesignSystem } from "design-system";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useContent } from "../content-provider";

export function ContentStatisticsPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const { content } = useContent();
  const { Button } = useDesignSystem();

  // Find the current content
  const currentContent = content.find((item) => item._id === contentId);

  // Mock statistics data
  const mockStats = {
    totalViews: 15420,
    likes: 892,
    comments: 156,
    shares: 89,
    avgEngagementRate: 5.8,
    weeklyGrowth: 12.5,
  };

  const mockPlatformStats = [
    {
      platform: "YouTube",
      views: 8540,
      likes: 456,
      comments: 89,
      shares: 34,
    },
    {
      platform: "Instagram",
      views: 4230,
      likes: 312,
      comments: 45,
      shares: 28,
    },
    {
      platform: "TikTok",
      views: 2650,
      likes: 124,
      comments: 22,
      shares: 27,
    },
  ];

  return (
    <div className="relative h-full">
      {/* Beta Overlay with Glass Effect */}
      <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/60">
        <div className="flex items-center justify-center h-full p-8">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">
                    Zaawansowane statystyki
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Analityka wydajności treści
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-blue-800 text-center leading-relaxed">
                Szczegółowe dane o wydajności treści, analizy zaangażowania,
                trendy wzrostu i porównania między platformami. Dostępne dla
                beta testerów.
              </p>
              <Button
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    // Mock beta access request
                    setTimeout(() => {
                      toast.success("Sukces", {
                        description:
                          "Twoje zgłoszenie zostało przyjęte. Skontaktujemy się z Tobą wkrótce.",
                      });
                      setIsLoading(false);
                    }, 1000);
                  } catch (error) {
                    toast.error("Błąd", {
                      description:
                        "Wystąpił błąd podczas zapisywania do beta testów",
                    });
                    setIsLoading(false);
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading ? "Zapisywanie..." : "Dołącz do beta testów"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Content (Blurred) */}
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Statystyki treści
            </h1>
            <p className="text-gray-600">
              {currentContent?.title || "Analiza wydajności i zaangażowania"}
            </p>
          </div>
          <Button variant="primary">
            <BarChart3 className="w-4 h-4 mr-2" />
            Eksportuj raport
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Wyświetlenia</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockStats.totalViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />+
                    {mockStats.weeklyGrowth}% w tym tygodniu
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Polubienia</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockStats.likes.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((mockStats.likes / mockStats.totalViews) * 100).toFixed(
                      1
                    )}
                    % ratio
                  </p>
                </div>
                <Heart className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Komentarze</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockStats.comments.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(
                      (mockStats.comments / mockStats.totalViews) *
                      100
                    ).toFixed(2)}
                    % ratio
                  </p>
                </div>
                <MessageCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Udostępnienia</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockStats.shares.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((mockStats.shares / mockStats.totalViews) * 100).toFixed(
                      2
                    )}
                    % ratio
                  </p>
                </div>
                <Share2 className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Wydajność na platformach
            </CardTitle>
            <CardDescription>
              Porównanie statystyk między różnymi platformami
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPlatformStats.map((platform, index) => (
                <div
                  key={platform.platform}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0
                          ? "bg-red-500"
                          : index === 1
                          ? "bg-pink-500"
                          : "bg-black"
                      }`}
                    />
                    <span className="font-medium">{platform.platform}</span>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="text-gray-600">
                      {platform.views.toLocaleString()} wyświetleń
                    </span>
                    <span className="text-gray-600">
                      {platform.likes} polubień
                    </span>
                    <span className="text-gray-600">
                      {platform.comments} komentarzy
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timeline Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trend wyświetleń w czasie
            </CardTitle>
            <CardDescription>Ostatnie 7 dni wydajności treści</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Tutaj będzie wykres trendu wyświetleń
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
