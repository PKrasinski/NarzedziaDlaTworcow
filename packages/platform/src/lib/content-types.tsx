import {
  BookOpen,
  Camera,
  FileIcon,
  FileText,
  Film,
  ImageIcon,
  Instagram,
  Layers,
  Linkedin,
  MessageSquare,
  PlayCircle,
  Twitter,
  Video,
  Youtube,
} from "lucide-react";
import { ReactNode } from "react";

export interface ContentTypeConfig {
  name: string;
  icon: any;
  color: string;
  alias: string;
}

// Content type configurations
export const contentTypeConfigs: Record<string, ContentTypeConfig> = {
  instagramPost: {
    name: "Instagram Post",
    icon: Instagram,
    color: "bg-gradient-to-br from-pink-500 to-orange-500",
    alias: "instagramPost",
  },
  instagramStory: {
    name: "Instagram Story",
    icon: Camera,
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    alias: "instagramStory",
  },
  instagramReel: {
    name: "Instagram Reel",
    icon: PlayCircle,
    color: "bg-gradient-to-br from-red-500 to-pink-500",
    alias: "instagramReel",
  },
  instagramCarousel: {
    name: "Instagram Carousel",
    icon: ImageIcon,
    color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    alias: "instagramCarousel",
  },
  tiktokVideo: {
    name: "TikTok Video",
    icon: Film,
    color: "bg-gradient-to-br from-black to-red-500",
    alias: "tiktokVideo",
  },
  linkedinPost: {
    name: "LinkedIn Post",
    icon: Linkedin,
    color: "bg-gradient-to-br from-blue-600 to-blue-700",
    alias: "linkedinPost",
  },
  linkedinArticle: {
    name: "LinkedIn Article",
    icon: FileIcon,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    alias: "linkedinArticle",
  },
  linkedinVideo: {
    name: "LinkedIn Video",
    icon: Video,
    color: "bg-gradient-to-br from-blue-700 to-indigo-600",
    alias: "linkedinVideo",
  },
  twitterTweet: {
    name: "Twitter Tweet",
    icon: Twitter,
    color: "bg-gradient-to-br from-sky-400 to-blue-500",
    alias: "twitterTweet",
  },
  twitterThread: {
    name: "Twitter Thread",
    icon: MessageSquare,
    color: "bg-gradient-to-br from-blue-500 to-indigo-500",
    alias: "twitterThread",
  },
  twitterVideo: {
    name: "Twitter Video",
    icon: PlayCircle,
    color: "bg-gradient-to-br from-blue-400 to-purple-500",
    alias: "twitterVideo",
  },
  youtubeVideo: {
    name: "YouTube Video",
    icon: Youtube,
    color: "bg-gradient-to-br from-red-600 to-red-700",
    alias: "youtubeVideo",
  },
  youtubeShorts: {
    name: "YouTube Shorts",
    icon: Youtube,
    color: "bg-gradient-to-br from-red-500 to-orange-500",
    alias: "youtubeShorts",
  },
  longFormArticle: {
    name: "Artykuł blogowy",
    icon: BookOpen,
    color: "bg-gradient-to-br from-green-500 to-teal-500",
    alias: "longFormArticle",
  },
  shortVideoScenario: {
    name: "Scenariusz krótkiego wideo",
    icon: FileText,
    color: "bg-gradient-to-br from-purple-600 to-indigo-600",
    alias: "shortVideoScenario",
  },
  longVideoScenario: {
    name: "Scenariusz długiego wideo",
    icon: Video,
    color: "bg-gradient-to-br from-indigo-600 to-purple-700",
    alias: "longVideoScenario",
  },
  carouselIdeas: {
    name: "Pomysły na karuzelę",
    icon: Layers,
    color: "bg-gradient-to-br from-teal-500 to-cyan-600",
    alias: "carouselIdeas",
  },
};

// Helper function to get content type config
export const getContentTypeConfig = (
  alias: string
): ContentTypeConfig | null => {
  return contentTypeConfigs[alias] || null;
};

// Helper function to get content types present in a content object
export const getContentTypes = (content: any): ContentTypeConfig[] => {
  const types: ContentTypeConfig[] = [];

  Object.keys(contentTypeConfigs).forEach((alias) => {
    if (content[alias] && typeof content[alias] === "object") {
      const config = contentTypeConfigs[alias];
      if (config) {
        types.push(config);
      }
    }
  });

  return types;
};

// Helper function to create icons with custom size
export const createContentTypeIcon = (
  alias: string,
  className: string = "w-5 h-5"
): ReactNode => {
  const config = contentTypeConfigs[alias];
  if (!config) return null;

  // Create icon element with custom className
  const IconComponent = config.icon;
  return <IconComponent className={className} />;
};
