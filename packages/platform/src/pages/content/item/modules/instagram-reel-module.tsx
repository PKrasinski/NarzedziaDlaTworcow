import { useCustomToast } from "@/hooks/use-toast-custom";
import type { Content, ContentItem } from "@/providers/content-provider";
import { 
  Camera, 
  Clock, 
  Eye, 
  Hash, 
  Heart, 
  MessageCircle, 
  Play, 
  Share, 
  TrendingUp,
  Upload,
  Music,
  Palette,
  Calendar,
  BarChart3
} from "lucide-react";
import { useState } from "react";

interface InstagramReelModuleProps {
  item: ContentItem;
  content: Content;
}

export function InstagramReelModule({ item, content }: InstagramReelModuleProps) {
  const { showDevelopmentToast } = useCustomToast();
  const [activeTab, setActiveTab] = useState<'content' | 'performance' | 'schedule'>('content');

  // Mock data for Instagram Reel
  const mockData = {
    videoFile: "reel_example.mp4",
    duration: "00:28",
    captions: [
      { text: "5 sposobów na zwiększenie zasięgu 🚀", isDefault: true },
      { text: "Sprawdzone metody na viral content ✨", isDefault: false },
      { text: "Instagram hacks które działają 💯", isDefault: false }
    ],
    hashtags: ["#instagramtips", "#contentcreator", "#socialmedia", "#viral", "#reels", "#marketing"],
    music: {
      title: "Upbeat Corporate",
      artist: "AudioJungle",
      duration: "2:30"
    },
    performance: {
      views: 12540,
      likes: 847,
      comments: 23,
      shares: 156,
      saves: 234,
      reachRate: 15.2,
      engagementRate: 8.4
    },
    schedule: {
      publishDate: "2024-01-25",
      publishTime: "18:00",
      timezone: "Europe/Warsaw"
    }
  };

  const tabs = [
    { id: 'content', label: 'Treść', icon: Camera },
    { id: 'performance', label: 'Wydajność', icon: BarChart3 },
    { id: 'schedule', label: 'Harmonogram', icon: Calendar }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Video Preview */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Podgląd wideo</h3>
              <div className="flex space-x-6">
                <div className="w-48 h-80 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <Play className="w-16 h-16 text-white/80 z-10" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="flex items-center justify-between text-white text-sm">
                      <span className="bg-black/30 px-2 py-1 rounded-full">{mockData.duration}</span>
                      <div className="flex space-x-2">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>12.5K</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>847</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <button 
                    onClick={showDevelopmentToast}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Zmień wideo</span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={showDevelopmentToast}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/80 transition-colors"
                    >
                      <Music className="w-4 h-4" />
                      <span>Muzyka</span>
                    </button>
                    <button 
                      onClick={showDevelopmentToast}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/80 transition-colors"
                    >
                      <Palette className="w-4 h-4" />
                      <span>Filtry</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Music className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{mockData.music.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">{mockData.music.artist} • {mockData.music.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption Variants */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Warianty opisów</h3>
                <button 
                  onClick={showDevelopmentToast}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  + Dodaj wariant
                </button>
              </div>
              <div className="space-y-3">
                {mockData.captions.map((caption, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${caption.isDefault ? 'border-pink-200 bg-pink-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${caption.isDefault ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>
                        {caption.isDefault ? 'Domyślny' : `Wariant ${index}`}
                      </span>
                      <div className="flex space-x-2">
                        <button onClick={showDevelopmentToast} className="text-gray-500 hover:text-gray-700">
                          <Share className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-900">{caption.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Hashtagi</h3>
                <button 
                  onClick={showDevelopmentToast}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  Edytuj
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockData.hashtags.map((hashtag, index) => (
                  <span key={index} className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-sm rounded-full">
                    <Hash className="w-3 h-3" />
                    <span>{hashtag.replace('#', '')}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Przegląd wydajności</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Wyświetlenia</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.views.toLocaleString()}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-600">Polubienia</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.likes.toLocaleString()}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Komentarze</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.comments}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Share className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Udostępnienia</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.shares}</p>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metryki zaangażowania</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Współczynnik zasięgu</span>
                      <span className="text-lg font-bold text-blue-600">{mockData.performance.reachRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${mockData.performance.reachRate}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Współczynnik zaangażowania</span>
                      <span className="text-lg font-bold text-green-600">{mockData.performance.engagementRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${mockData.performance.engagementRate * 10}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Wydajność powyżej średniej</p>
                    <p className="text-lg font-semibold text-green-600">+24% vs poprzedni miesiąc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Scheduling */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Harmonogram publikacji</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data publikacji</label>
                    <input 
                      type="date" 
                      defaultValue={mockData.schedule.publishDate}
                      className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Godzina publikacji</label>
                    <input 
                      type="time" 
                      defaultValue={mockData.schedule.publishTime}
                      className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Strefa czasowa</label>
                    <select className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                      <option value="Europe/Warsaw">Europa/Warszawa</option>
                      <option value="Europe/London">Europa/Londyn</option>
                      <option value="America/New_York">Ameryka/Nowy Jork</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Optymalna godzina</h4>
                      <p className="text-sm text-gray-600">Najlepsze wyniki</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">18:00 - 20:00</p>
                  <p className="text-sm text-gray-600">Na podstawie analizy Twojej publiczności</p>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={showDevelopmentToast}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg"
                >
                  Zaplanuj publikację
                </button>
                <button 
                  onClick={showDevelopmentToast}
                  className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 hover:bg-white/80 transition-colors"
                >
                  Publikuj teraz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}