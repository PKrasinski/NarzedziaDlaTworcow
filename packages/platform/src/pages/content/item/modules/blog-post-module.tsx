import { useCustomToast } from "@/hooks/use-toast-custom";
import type { Content, ContentItem } from "@/providers/content-provider";
import { 
  Edit, 
  FileText, 
  Image, 
  Globe, 
  Search, 
  Tag, 
  Calendar, 
  BarChart3,
  Eye,
  Share2,
  MessageSquare,
  BookmarkCheck,
  TrendingUp,
  Clock,
  Link
} from "lucide-react";
import { useState } from "react";

interface BlogPostModuleProps {
  item: ContentItem;
  content: Content;
}

export function BlogPostModule({ item, content }: BlogPostModuleProps) {
  const { showDevelopmentToast } = useCustomToast();
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'performance'>('content');

  // Mock data for Blog Post
  const mockData = {
    title: "5 Sposobów na Efektywne Zarządzanie Czasem w Pracy Zdalnej",
    slug: "5-sposobow-na-efektywne-zarzadzanie-czasem-w-pracy-zdalnej",
    excerpt: "Odkryj sprawdzone metody na zwiększenie produktywności podczas pracy z domu. Praktyczne wskazówki od ekspertów.",
    content: `
      <h2>Wprowadzenie</h2>
      <p>Praca zdalna stała się nową normalnością dla milionów ludzi na całym świecie...</p>
      
      <h3>1. Ustalenie stałego harmonogramu</h3>
      <p>Regularny harmonogram pracy pomaga w utrzymaniu równowagi między życiem zawodowym a prywatnym...</p>
    `,
    featuredImage: {
      url: "https://example.com/remote-work-tips.jpg",
      alt: "Osoba pracująca zdalnie przy laptopie",
      caption: "Efektywna praca zdalna wymaga odpowiedniej organizacji"
    },
    seo: {
      metaTitle: "5 Sposobów na Efektywne Zarządzanie Czasem w Pracy Zdalnej | Blog",
      metaDescription: "Odkryj sprawdzone metody na zwiększenie produktywności podczas pracy z domu. Praktyczne wskazówki od ekspertów w dziedzinie zarządzania czasem.",
      focusKeyword: "zarządzanie czasem praca zdalna",
      keywords: ["praca zdalna", "produktywność", "zarządzanie czasem", "home office", "efektywność"],
      readabilityScore: 85,
      seoScore: 92
    },
    tags: ["Produktywność", "Praca Zdalna", "Zarządzanie Czasem", "Home Office", "Samorozwój"],
    category: "Porady Biznesowe",
    status: "published",
    publishDate: "2024-01-20T09:00:00Z",
    lastModified: "2024-01-21T14:30:00Z",
    performance: {
      views: 3240,
      uniqueVisitors: 2890,
      averageTimeOnPage: "3:45",
      bounceRate: 32,
      shares: 89,
      comments: 12,
      bookmarks: 156
    },
    platforms: [
      { name: "WordPress", status: "published", url: "https://blog.example.com/post-123" },
      { name: "Medium", status: "scheduled", scheduledFor: "2024-01-22T10:00:00Z" },
      { name: "LinkedIn", status: "draft" }
    ]
  };

  const tabs = [
    { id: 'content', label: 'Treść', icon: Edit },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'performance', label: 'Wydajność', icon: BarChart3 }
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
            {/* Article Header */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nagłówek artykułu</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    mockData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {mockData.status === 'published' ? 'Opublikowany' : 'Szkic'}
                  </span>
                </div>
              </div>
              <input 
                type="text" 
                defaultValue={mockData.title}
                className="w-full px-4 py-3 text-xl font-bold bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                placeholder="Tytuł artykułu..."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug URL</label>
                  <input 
                    type="text" 
                    defaultValue={mockData.slug}
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                  <select className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="porady-biznesowe">{mockData.category}</option>
                    <option value="technologia">Technologia</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Zdjęcie wyróżniające</h3>
                <button 
                  onClick={showDevelopmentToast}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Zmień zdjęcie
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-500" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tekst alternatywny</label>
                    <input 
                      type="text" 
                      defaultValue={mockData.featuredImage.alt}
                      className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Podpis</label>
                    <input 
                      type="text" 
                      defaultValue={mockData.featuredImage.caption}
                      className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Treść artykułu</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={showDevelopmentToast}
                    className="px-3 py-1 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/80 transition-colors"
                  >
                    Podgląd
                  </button>
                  <button 
                    onClick={showDevelopmentToast}
                    className="px-3 py-1 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/80 transition-colors"
                  >
                    HTML
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 min-h-64 border border-gray-200">
                <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Image className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Link className="w-4 h-4" />
                  </button>
                </div>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: mockData.content }}
                />
              </div>
            </div>

            {/* Tags and Excerpt */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tagi</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockData.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
                <button 
                  onClick={showDevelopmentToast}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  + Dodaj tag
                </button>
              </div>

              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Excerpt</h3>
                <textarea 
                  defaultValue={mockData.excerpt}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Krótki opis artykułu..."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            {/* SEO Overview */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Przegląd SEO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Ocena SEO</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-full h-2 bg-green-500 rounded-full" style={{ width: `${mockData.seo.seoScore}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-green-600">{mockData.seo.seoScore}/100</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Czytelność</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-full h-2 bg-blue-500 rounded-full" style={{ width: `${mockData.seo.readabilityScore}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-blue-600">{mockData.seo.readabilityScore}/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <Search className="w-16 h-16 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Dobrze zoptymalizowane</p>
                    <p className="text-lg font-semibold text-green-600">Gotowe do publikacji</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Tags */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta tagi</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta title</label>
                  <input 
                    type="text" 
                    defaultValue={mockData.seo.metaTitle}
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{mockData.seo.metaTitle.length}/60 znaków</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta description</label>
                  <textarea 
                    rows={3}
                    defaultValue={mockData.seo.metaDescription}
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{mockData.seo.metaDescription.length}/160 znaków</p>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Słowa kluczowe</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Główne słowo kluczowe</label>
                  <input 
                    type="text" 
                    defaultValue={mockData.seo.focusKeyword}
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dodatkowe słowa kluczowe</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {mockData.seo.keywords.map((keyword, index) => (
                      <span key={index} className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        <span>{keyword}</span>
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={showDevelopmentToast}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    + Dodaj słowo kluczowe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wydajność artykułu</h3>
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
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Czas czytania</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.averageTimeOnPage}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Share2 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Udostępnienia</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.shares}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600">Komentarze</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockData.performance.comments}</p>
                </div>
              </div>
            </div>

            {/* Publishing Platforms */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platformy publikacji</h3>
              <div className="space-y-3">
                {mockData.platforms.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{platform.name}</p>
                        <p className="text-sm text-gray-600">
                          {platform.status === 'published' && platform.url && (
                            <a href={platform.url} className="text-blue-600 hover:text-blue-700">
                              {platform.url}
                            </a>
                          )}
                          {platform.status === 'scheduled' && (
                            <span>Zaplanowane na {new Date(platform.scheduledFor!).toLocaleString('pl-PL')}</span>
                          )}
                          {platform.status === 'draft' && <span>Szkic</span>}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      platform.status === 'published' ? 'bg-green-100 text-green-700' :
                      platform.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {platform.status === 'published' ? 'Opublikowany' : 
                       platform.status === 'scheduled' ? 'Zaplanowany' : 'Szkic'}
                    </span>
                  </div>
                ))}
              </div>
              <button 
                onClick={showDevelopmentToast}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 shadow-lg"
              >
                Publikuj na wszystkich platformach
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}