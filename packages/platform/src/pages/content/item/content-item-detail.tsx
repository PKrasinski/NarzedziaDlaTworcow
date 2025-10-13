import { useCustomToast } from "@/hooks/use-toast-custom";
import { useContent } from "@/providers/content-provider";
import { Copy, Edit3, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogPostModule } from "./modules/blog-post-module";
import { InstagramReelModule } from "./modules/instagram-reel-module";
import { ScenarioModule } from "./modules/scenario-module";
import { SocialPostModule } from "./modules/social-post-module";
import { YouTubeVideoModule } from "./modules/youtube-video-module";

export function ContentItemDetail() {
  const { contentId, itemId } = useParams<{
    contentId: string;
    itemId: string;
  }>();
  const navigate = useNavigate();
  const { showDevelopmentToast } = useCustomToast();
  const { getContentWithFormat, getContentType } = useContent();

  if (!contentId || !itemId) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">Nieprawidłowe parametry</p>
      </div>
    );
  }

  const contentData = getContentWithFormat(contentId);
  if (!contentData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">Treść nie została znaleziona</p>
      </div>
    );
  }

  const { content, format } = contentData;
  const item = content.items.find((item) => item._id === itemId);
  if (!item) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">Element treści nie został znaleziony</p>
      </div>
    );
  }

  const contentType = getContentType(item.typeId);
  if (!contentType) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">Nieznany typ treści</p>
      </div>
    );
  }

  const TypeIcon = contentType.icon;

  const renderModule = () => {
    // Route to appropriate module based on content type
    switch (contentType._id) {
      case "type_youtube_video":
        return <YouTubeVideoModule item={item} content={contentData.content} />;
      case "type_instagram_reel":
        return <InstagramReelModule item={item} content={contentData.content} />;
      case "type_scenario":
        return <ScenarioModule item={item} content={contentData.content} />;
      case "type_blog_post":
        return <BlogPostModule item={item} content={contentData.content} />;
      case "type_social_post":
        return <SocialPostModule item={item} content={contentData.content} />;
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Moduł w przygotowaniu
              </h2>
              <p className="text-gray-600">
                Moduł dla typu "{contentType.name}" jest obecnie w przygotowaniu
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Item Header */}
      <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl shadow-lg p-6 mb-4">
        {/* Item Header Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Content Type Icon */}
            <div
              className={`w-12 h-12 bg-gradient-to-r ${contentType.color} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <TypeIcon className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {item.name}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={showDevelopmentToast}
              className="inline-flex items-center px-3 py-2 border border-white/30 bg-white/50 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-white/70 transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplikuj
            </button>
            <button 
              onClick={showDevelopmentToast}
              className="inline-flex items-center px-3 py-2 border border-white/30 bg-white/50 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-white/70 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Udostępnij
            </button>
            <button 
              onClick={showDevelopmentToast}
              className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edytuj
            </button>
          </div>
        </div>
      </div>

      {/* Module Content */}
      <div className="flex-1 overflow-hidden">
        {renderModule()}
      </div>
    </div>
  );
}