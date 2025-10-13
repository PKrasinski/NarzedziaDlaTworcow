import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useDesignSystem } from "design-system";
import { ArcViewRecord } from "@arcote.tech/arc";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContentDragData } from "./content-kanban-provider";
import {
  MessageCircle,
  Camera,
  Video,
  Play,
  Image,
  Share,
  Hash,
  Monitor,
  Users,
  BookOpen,
  Film,
  Zap,
  Layout,
  Clapperboard,
  Newspaper,
  FileText
} from "lucide-react";

// Mapa typów publikacji (tylko elementy publikacyjne, bez chat i scenariuszy)
const PUBLICATION_ELEMENTS = {
  // Instagram
  instagramPost: { label: "Post Instagram", icon: Camera },
  instagramStory: { label: "Instagram Story", icon: Play },
  instagramReel: { label: "Instagram Reel", icon: Video },
  instagramCarousel: { label: "Instagram Karuzela", icon: Image },
  // TikTok
  tiktokVideo: { label: "TikTok Video", icon: Film },
  // LinkedIn
  linkedinPost: { label: "Post LinkedIn", icon: Users },
  linkedinArticle: { label: "Artykuł LinkedIn", icon: Newspaper },
  linkedinVideo: { label: "LinkedIn Video", icon: Clapperboard },
  // Twitter/X
  twitterTweet: { label: "Tweet", icon: Hash },
  twitterThread: { label: "Twitter Thread", icon: Share },
  twitterVideo: { label: "Twitter Video", icon: Play },
  // YouTube
  youtubeVideo: { label: "YouTube Video", icon: Monitor },
  youtubeShorts: { label: "YouTube Shorts", icon: Zap },
  // Własne typy publikacji
  longFormArticle: { label: "Artykuł Blogowy", icon: BookOpen },
} as const;

// Funkcja do pobrania typów publikacji
function getPublicationTypes(content: any) {
  const types = [];
  
  // Sprawdź tylko typy publikacji
  Object.keys(PUBLICATION_ELEMENTS).forEach((key) => {
    if (content[key]) {
      types.push(PUBLICATION_ELEMENTS[key as keyof typeof PUBLICATION_ELEMENTS]);
    }
  });
  
  return types;
}

interface ContentKanbanCardProps {
  content: ArcViewRecord<any>;
  getFormatName: (formatId: string) => string;
}

export function ContentKanbanCard({ 
  content, 
  getFormatName
}: ContentKanbanCardProps) {
  // const { Card } = useDesignSystem(); // Card not available, using div instead
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragged, setIsDragged] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const dragData: ContentDragData = {
      type: "content",
      contentId: content._id,
    };

    return draggable({
      element,
      getInitialData: () => dragData,
      onDragStart: () => {
        setIsDragging(true);
        setIsDragged(true);
      },
      onDrop: () => {
        setIsDragging(false);
        // Reset dragged state after a small delay to prevent click from firing
        setTimeout(() => setIsDragged(false), 100);
      },
    });
  }, [content._id]);

  const handleClick = () => {
    // Only navigate if the card wasn't dragged
    if (!isDragged) {
      navigate(`/content/${content._id}`);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`
        p-4 cursor-grab active:cursor-grabbing transition-all duration-200 bg-white rounded-lg shadow-sm
        border-2 border-gray-200 hover:border-gray-300 hover:shadow-md
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : 'opacity-100 hover:cursor-pointer'}
      `}
    >
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 line-clamp-2">
          {content.title}
        </h4>
        {content.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {content.description}
          </p>
        )}
        {/* Publication Type Badges */}
        <div className="flex flex-wrap gap-1">
          {getPublicationTypes(content).map((type, index) => {
            const IconComponent = type.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700"
              >
                <IconComponent className="w-3 h-3" />
                <span className="font-medium">{type.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}