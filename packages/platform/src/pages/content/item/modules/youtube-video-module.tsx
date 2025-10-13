import { useCustomToast } from "@/hooks/use-toast-custom";
import type { Content, ContentItem } from "@/providers/content-provider";
import {
  BarChart3,
  Calendar,
  Clock,
  Edit3,
  Eye,
  FileVideo,
  Globe,
  Heart,
  Image,
  MessageCircle,
  Play,
  Plus,
  Share2,
  Tag,
  ThumbsUp,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";

interface YouTubeVideoModuleProps {
  item: ContentItem;
  content: Content;
}

export function YouTubeVideoModule({ item, content }: YouTubeVideoModuleProps) {
  const { showDevelopmentToast } = useCustomToast();
  const [activeTab, setActiveTab] = useState<'content' | 'optimization' | 'analytics'>('content');

  // Mock data for YouTube video
  const mockVideoData = {
    titles: [
      {
        id: "1",
        text: "Jak zwiększyć zasięgi na YouTube w 2024? Sprawdzone metody!",
        performance: { ctr: 12.4, views: 8540 },
        isActive: true,
      },
      {
        id: "2", 
        text: "YouTube w 2024: Sekrety, które musisz znać",
        performance: { ctr: 8.9, views: 1250 },
        isActive: false,
      },
      {
        id: "3",
        text: "Zasięgi YouTube - co naprawdę działa?",
        performance: { ctr: 6.2, views: 890 },
        isActive: false,
      },
    ],
    thumbnails: [
      { id: "1", url: "/api/placeholder/320/180", name: "Thumbnail A", performance: { ctr: 15.2 }, isActive: true },
      { id: "2", url: "/api/placeholder/320/180", name: "Thumbnail B", performance: { ctr: 11.8 }, isActive: false },
      { id: "3", url: "/api/placeholder/320/180", name: "Thumbnail C", performance: { ctr: 9.4 }, isActive: false },
    ],
    video: {
      status: item.state === "published" ? "published" : item.state === "in_progress" ? "processing" : "planned",
      fileName: "youtube-video-final.mp4",
      duration: "8:24",
      size: "245 MB",
      resolution: "1920x1080",
      uploadProgress: item.state === "in_progress" ? 78 : 100,
    },
    scheduling: {
      publishDate: item.scheduledDate || "2024-02-20",
      publishTime: "14:00",
      timezone: "Europe/Warsaw",
      isScheduled: item.state === "scheduled",
    },
    seo: {
      description: "W tym filmie pokażę Ci najskuteczniejsze metody zwiększania zasięgów na YouTube w 2024 roku. Sprawdzone strategie, które pomogą Ci rozwinąć kanał!",
      tags: ["YouTube", "marketing", "zasięgi", "2024", "tips", "strategie"],
      category: "Edukacja",
      language: "Polski",
    },
    analytics: {
      views: item.views || 8540,
      likes: 456,
      comments: 89,
      shares: 34,
      watchTime: "6:12",
      retention: 72.5,
      subscribersGained: 23,
      impressions: 45200,
      clickThroughRate: 12.4,
      avgViewDuration: "6:12",
    }
  };

  const tabs = [
    { id: 'content', label: 'Treść', icon: Play },
    { id: 'optimization', label: 'Optymalizacja', icon: TrendingUp },
    { id: 'analytics', label: 'Analityka', icon: BarChart3 }
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
            {/* Video Preview Section */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Podgląd wideo</span>
              </h3>
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mb-4">
                {mockVideoData.video.status === "published" ? (
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Film opublikowany na YouTube</p>
                  </div>
                ) : mockVideoData.video.status === "processing" ? (
                  <div className="text-center">
                    <FileVideo className="w-16 h-16 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Przetwarzanie: {mockVideoData.video.uploadProgress}%</p>
                    <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${mockVideoData.video.uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">Wideo nie zostało jeszcze przesłane</p>
                    <button 
                      onClick={showDevelopmentToast} 
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2 inline" />
                      Prześlij wideo
                    </button>
                  </div>
                )}
              </div>

              {mockVideoData.video.status !== "planned" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg p-3">
                    <p className="text-gray-600 text-xs">Plik</p>
                    <p className="font-medium text-sm">{mockVideoData.video.fileName}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg p-3">
                    <p className="text-gray-600 text-xs">Czas trwania</p>
                    <p className="font-medium text-sm">{mockVideoData.video.duration}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg p-3">
                    <p className="text-gray-600 text-xs">Rozmiar</p>
                    <p className="font-medium text-sm">{mockVideoData.video.size}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg p-3">
                    <p className="text-gray-600 text-xs">Rozdzielczość</p>
                    <p className="font-medium text-sm">{mockVideoData.video.resolution}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Titles A/B Testing */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tytuły (A/B Testing)</span>
                </h3>
                <button 
                  onClick={showDevelopmentToast}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  + Dodaj tytuł
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Testuj różne warianty tytułów, aby znaleźć najskuteczniejszy</p>
              <div className="space-y-3">
                {mockVideoData.titles.map((title) => (
                  <div 
                    key={title.id}
                    className={`p-4 rounded-xl border ${
                      title.isActive 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className={`font-medium ${title.isActive ? 'text-red-900' : 'text-gray-900'}`}>
                        {title.text}
                      </p>
                      {title.isActive && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Aktywny
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>CTR: {title.performance.ctr}%</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>{title.performance.views.toLocaleString()} wyświetleń</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Image className="w-5 h-5" />
                  <span>Miniaturki</span>
                </h3>
                <button 
                  onClick={showDevelopmentToast}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  + Dodaj miniaturkę
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Zarządzaj miniaturkami i testuj ich skuteczność</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockVideoData.thumbnails.map((thumbnail) => (
                  <div 
                    key={thumbnail.id}
                    className={`relative rounded-xl overflow-hidden border ${
                      thumbnail.isActive ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-500" />
                    </div>
                    {thumbnail.isActive && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Aktywna
                      </div>
                    )}
                    <div className="p-3 bg-white/60 backdrop-blur-sm">
                      <p className="font-medium text-sm mb-1">{thumbnail.name}</p>
                      <p className="text-xs text-gray-600">CTR: {thumbnail.performance.ctr}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publishing */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Harmonogram publikacji</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data publikacji</label>
                    <input 
                      type="date" 
                      defaultValue={mockVideoData.scheduling.publishDate}
                      className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Godzina publikacji</label>
                    <input 
                      type="time" 
                      defaultValue={mockVideoData.scheduling.publishTime}
                      className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Strefa czasowa</label>
                    <select className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="Europe/Warsaw">Europa/Warszawa</option>
                      <option value="Europe/London">Europa/Londyn</option>
                      <option value="America/New_York">Ameryka/Nowy Jork</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg"
                >
                  {mockVideoData.scheduling.isScheduled ? 'Aktualizuj harmonogram' : 'Zaplanuj publikację'}
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

        {activeTab === 'optimization' && (
          <div className="space-y-6">
            {/* SEO Settings */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span>Ustawienia SEO</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
                  <textarea 
                    defaultValue={mockVideoData.seo.description}
                    rows={4}
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Dodaj opis który zachęci widzów do obejrzenia filmu..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagi</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mockVideoData.seo.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={showDevelopmentToast}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    + Dodaj tag
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                    <select className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="education">{mockVideoData.seo.category}</option>
                      <option value="entertainment">Rozrywka</option>
                      <option value="gaming">Gaming</option>
                      <option value="music">Muzyka</option>
                      <option value="news">Wiadomości</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Język</label>
                    <select className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="pl">{mockVideoData.seo.language}</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Ustawienia widoczności</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Publiczny</p>
                      <p className="text-sm text-gray-600">Każdy może wyszukać i wyświetlić</p>
                    </div>
                  </div>
                  <input type="radio" name="visibility" defaultChecked className="text-red-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900">Niewidoczny</p>
                      <p className="text-sm text-gray-600">Każdy z linkiem może wyświetlić</p>
                    </div>
                  </div>
                  <input type="radio" name="visibility" className="text-red-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Prywatny</p>
                      <p className="text-sm text-gray-600">Tylko Ty możesz wyświetlić</p>
                    </div>
                  </div>
                  <input type="radio" name="visibility" className="text-red-600" />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Edit3 className="w-5 h-5" />
                <span>Zaawansowane ustawienia</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Komentarze</p>
                    <p className="text-sm text-gray-600">Pozwól widzom na dodawanie komentarzy</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Automatyczne napisy</p>
                    <p className="text-sm text-gray-600">Pozwól YouTube na generowanie napisów</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Powiadomienia subskrybentów</p>
                    <p className="text-sm text-gray-600">Powiadom subskrybentów o nowym filmie</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
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
                  <p className="text-2xl font-bold text-gray-900">{mockVideoData.analytics.views.toLocaleString()}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Polubienia</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockVideoData.analytics.likes}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Komentarze</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockVideoData.analytics.comments}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600">Nowi subskr.</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">+{mockVideoData.analytics.subscribersGained}</p>
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Retencja widzów</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Średni czas oglądania</span>
                      <span className="text-lg font-bold text-blue-600">{mockVideoData.analytics.avgViewDuration}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${mockVideoData.analytics.retention}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{mockVideoData.analytics.retention}% średniej retencji</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Współczynnik klikalności</span>
                      <span className="text-lg font-bold text-green-600">{mockVideoData.analytics.clickThroughRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${mockVideoData.analytics.clickThroughRate * 8}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Źródła ruchu</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Wyszukiwanie YouTube</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">45%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Sugerowane filmy</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">28%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Bezpośrednie</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">15%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Zewnętrzne</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">12%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Breakdown */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Zaangażowanie w czasie</h3>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6">
                <div className="text-center mb-4">
                  <TrendingUp className="w-16 h-16 text-red-500 mx-auto mb-2" />
                  <h4 className="text-xl font-bold text-gray-900">Wysoka wydajność</h4>
                  <p className="text-sm text-gray-600">Film osiąga powyżej średnią retencję dla Twojego kanału</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mockVideoData.analytics.impressions.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Impressions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mockVideoData.analytics.clickThroughRate}%</p>
                    <p className="text-sm text-gray-600">CTR</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mockVideoData.analytics.shares}</p>
                    <p className="text-sm text-gray-600">Udostępnienia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}