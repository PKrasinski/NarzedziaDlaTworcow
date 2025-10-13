import { useCustomToast } from "@/hooks/use-toast-custom";
import type { Content, ContentItem } from "@/providers/content-provider";
import { 
  Image, 
  Hash, 
  Calendar, 
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Clock,
  Globe,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit3,
  Copy,
  Settings
} from "lucide-react";
import { useState } from "react";

interface SocialPostModuleProps {
  item: ContentItem;
  content: Content;
}

export function SocialPostModule({ item, content }: SocialPostModuleProps) {
  const { showDevelopmentToast } = useCustomToast();
  const [activeTab, setActiveTab] = useState<'content' | 'platforms' | 'performance'>('content');

  // Mock data for Social Post
  const mockData = {
    variants: [
      {
        id: 1,
        platform: "all",
        title: "Podstawowa wersja",
        content: "🚀 Najlepsze narzędzia dla twórców treści w 2024 roku! \n\nOdkryj jak zwiększyć produktywność i jakość swojej pracy dzięki sprawdzonym aplikacjom. Link w bio! 👆\n\n#twórcatreści #produktywność #narzędzia #contentcreator",
        images: ["post-image-1.jpg"],
        hashtags: ["#twórcatreści", "#produktywność", "#narzędzia", "#contentcreator"],
        isDefault: true
      },
      {
        id: 2,
        platform: "instagram",
        title: "Wersja Instagram",
        content: "✨ TOP narzędzia dla twórców 2024! ✨\n\n📱 Canva Pro - grafiki w 5 minut\n🎬 DaVinci Resolve - montaż jak pro\n📊 Later - scheduling posts\n💡 Notion - organizacja projektów\n\nKtóre używasz? 👇 Komenty!\n\n#instagramcreator #tools2024 #contenttools #creatorlife #productivity",
        images: ["post-image-1.jpg", "carousel-2.jpg", "carousel-3.jpg"],
        hashtags: ["#instagramcreator", "#tools2024", "#contenttools", "#creatorlife", "#productivity"],
        isDefault: false
      },
      {
        id: 3,
        platform: "linkedin",
        title: "Wersja LinkedIn",
        content: "Jako content creator testowałem dziesiątki narzędzi w 2024 roku. Oto 4 które rzeczywiście zwiększyły moją produktywność:\n\n🎨 Canva Pro - szabiony oszczędzają 2-3h dziennie\n🎬 DaVinci Resolve - darmowy, ale funkcje jak w Adobe\n📅 Later - automatyzacja social media\n📋 Notion - jeden hub dla wszystkich projektów\n\nInwestycja w dobre narzędzia to inwestycja w rozwój biznesu.\n\nA jakie narzędzia polecacie Wy?",
        images: ["linkedin-post.jpg"],
        hashtags: ["#ContentCreation", "#Productivity", "#DigitalTools", "#Entrepreneurship"],
        isDefault: false
      }
    ],
    platforms: [
      {
        name: "Instagram",
        icon: "📷",
        status: "scheduled",
        scheduledFor: "2024-01-25T18:00:00Z",
        postType: "carousel",
        engagement: { likes: 234, comments: 12, shares: 8 }
      },
      {
        name: "LinkedIn",
        icon: "💼",
        status: "published",
        publishedAt: "2024-01-24T09:00:00Z",
        postType: "single",
        engagement: { likes: 89, comments: 15, shares: 23 }
      },
      {
        name: "Twitter/X",
        icon: "🐦",
        status: "draft",
        postType: "thread",
        engagement: { likes: 0, comments: 0, shares: 0 }
      },
      {
        name: "Facebook",
        icon: "📘",
        status: "failed",
        error: "Image resolution too low",
        postType: "single",
        engagement: { likes: 0, comments: 0, shares: 0 }
      }
    ],
    performance: {
      totalReach: 5680,
      totalEngagement: 381,
      engagementRate: 6.7,
      clickThroughRate: 2.3,
      topPerformingPlatform: "LinkedIn",
      bestPostTime: "09:00 - 11:00"
    },
    mediaLibrary: [
      { id: 1, name: "post-image-1.jpg", type: "image", size: "1080x1080" },
      { id: 2, name: "carousel-2.jpg", type: "image", size: "1080x1080" },
      { id: 3, name: "carousel-3.jpg", type: "image", size: "1080x1080" },
      { id: 4, name: "linkedin-post.jpg", type: "image", size: "1200x628" }
    ]
  };

  const tabs = [
    { id: 'content', label: 'Treść', icon: Edit3 },
    { id: 'platforms', label: 'Platformy', icon: Globe },
    { id: 'performance', label: 'Wydajność', icon: BarChart3 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'draft': return <Edit3 className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Edit3 className="w-4 h-4" />;
    }
  };

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
            {/* Content Variants */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Warianty treści</h3>
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nowy wariant</span>
                </button>
              </div>
              <div className="space-y-4">
                {mockData.variants.map((variant) => (
                  <div key={variant.id} className={`p-4 rounded-xl border ${
                    variant.isDefault ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{variant.title}</h4>
                          {variant.isDefault && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              Domyślny
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Platforma: {variant.platform === 'all' ? 'Wszystkie' : variant.platform}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={showDevelopmentToast}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={showDevelopmentToast}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
                        {variant.content}
                      </pre>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {variant.hashtags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            <Hash className="w-2 h-2" />
                            <span>{tag.replace('#', '')}</span>
                          </span>
                        ))}
                        {variant.hashtags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{variant.hashtags.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Image className="w-4 h-4" />
                        <span>{variant.images.length} obraz{variant.images.length > 1 ? 'y' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Library */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Biblioteka mediów</h3>
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Dodaj media</span>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockData.mediaLibrary.map((media) => (
                  <div key={media.id} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg p-3">
                    <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mb-2">
                      <Image className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{media.name}</p>
                    <p className="text-xs text-gray-500">{media.size}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'platforms' && (
          <div className="space-y-6">
            {/* Platform Status */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status na platformach</h3>
              <div className="space-y-3">
                {mockData.platforms.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{platform.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{platform.name}</h4>
                          <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(platform.status)}`}>
                            {getStatusIcon(platform.status)}
                            <span>
                              {platform.status === 'published' ? 'Opublikowany' :
                               platform.status === 'scheduled' ? 'Zaplanowany' :
                               platform.status === 'draft' ? 'Szkic' :
                               'Błąd'}
                            </span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {platform.status === 'published' && platform.publishedAt && (
                            <>Opublikowany: {new Date(platform.publishedAt).toLocaleString('pl-PL')}</>
                          )}
                          {platform.status === 'scheduled' && platform.scheduledFor && (
                            <>Zaplanowany na: {new Date(platform.scheduledFor).toLocaleString('pl-PL')}</>
                          )}
                          {platform.status === 'draft' && <>Gotowy do publikacji</>}
                          {platform.status === 'failed' && platform.error && (
                            <span className="text-red-600">Błąd: {platform.error}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {(platform.status === 'published' || platform.status === 'scheduled') && (
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{platform.engagement.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{platform.engagement.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="w-4 h-4" />
                            <span>{platform.engagement.shares}</span>
                          </div>
                        </div>
                      )}
                      <button 
                        onClick={showDevelopmentToast}
                        className="p-2 text-gray-500 hover:text-gray-700"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Akcje grupowe</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 shadow-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Publikuj wszystkie</span>
                </button>
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl transition-all duration-200 shadow-lg"
                >
                  <Clock className="w-4 h-4" />
                  <span>Zaplanuj wszystkie</span>
                </button>
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 hover:bg-white/80 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplikuj post</span>
                </button>
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
                    <span className="text-sm font-medium text-gray-600">Zasięg</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.totalReach.toLocaleString()}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-600">Zaangażowanie</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.totalEngagement}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Wskaźnik zaang.</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.engagementRate}%</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">CTR</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.clickThroughRate}%</p>
                </div>
              </div>
            </div>

            {/* Platform Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Najlepsza platforma</h3>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{mockData.performance.topPerformingPlatform}</h4>
                  <p className="text-sm text-gray-600">Najwyższe zaangażowanie</p>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Optymalna godzina</h3>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{mockData.performance.bestPostTime}</h4>
                  <p className="text-sm text-gray-600">Najlepszy czas publikacji</p>
                </div>
              </div>
            </div>

            {/* Engagement Breakdown */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Podział zaangażowania</h3>
              <div className="space-y-3">
                {mockData.platforms.filter(p => p.status === 'published' || p.status === 'scheduled').map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{platform.icon}</span>
                      <span className="font-medium text-gray-900">{platform.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-red-600">
                        <Heart className="w-4 h-4" />
                        <span>{platform.engagement.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-600">
                        <MessageCircle className="w-4 h-4" />
                        <span>{platform.engagement.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600">
                        <Share2 className="w-4 h-4" />
                        <span>{platform.engagement.shares}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}