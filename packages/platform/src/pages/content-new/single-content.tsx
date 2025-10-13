import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { useDesignSystem } from "design-system";
import { Chat } from "@narzedziadlatworcow.pl/ui/components/chat/chat";
import {
  Plus,
  MessageCircle,
  FileText,
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
  Edit,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ListOfContentSidebar } from "./components/list-of-content-sidebar";
import { useContent } from "./content-provider";
import { UpdateContentToolView } from "./content-tool-views";

// Mapa wszystkich dostępnych elementów treści z polskimi nazwami i ikonami
const AVAILABLE_CONTENT_ELEMENTS = [
  // Instagram
  {
    key: "instagramPost",
    label: "Post na Instagram",
    description: "Pojedynczy post z opisem",
    icon: Camera,
    category: "Instagram",
  },
  {
    key: "instagramStory",
    label: "Instagram Story",
    description: "Krótkotrawała historia",
    icon: Play,
    category: "Instagram",
  },
  {
    key: "instagramReel",
    label: "Instagram Reel",
    description: "Krótkie wideo pionowe",
    icon: Video,
    category: "Instagram",
  },
  {
    key: "instagramCarousel",
    label: "Instagram Karuzela",
    description: "Post z wieloma zdjęciami",
    icon: Image,
    category: "Instagram",
  },
  // TikTok
  {
    key: "tiktokVideo",
    label: "TikTok Video",
    description: "Krótkie wideo z muzyką",
    icon: Film,
    category: "TikTok",
  },
  // LinkedIn
  {
    key: "linkedinPost",
    label: "Post na LinkedIn",
    description: "Post biznesowy",
    icon: Users,
    category: "LinkedIn",
  },
  {
    key: "linkedinArticle",
    label: "Artykuł LinkedIn",
    description: "Długi artykuł branżowy",
    icon: Newspaper,
    category: "LinkedIn",
  },
  {
    key: "linkedinVideo",
    label: "LinkedIn Video",
    description: "Wideo biznesowe",
    icon: Clapperboard,
    category: "LinkedIn",
  },
  // Twitter/X
  {
    key: "twitterTweet",
    label: "Tweet",
    description: "Krótka wiadomość",
    icon: Hash,
    category: "Twitter/X",
  },
  {
    key: "twitterThread",
    label: "Twitter Thread",
    description: "Serie powiązanych tweetów",
    icon: Share,
    category: "Twitter/X",
  },
  {
    key: "twitterVideo",
    label: "Twitter Video",
    description: "Wideo na platformie X",
    icon: Play,
    category: "Twitter/X",
  },
  // YouTube
  {
    key: "youtubeVideo",
    label: "YouTube Video",
    description: "Pełne wideo z opisem",
    icon: Monitor,
    category: "YouTube",
  },
  {
    key: "youtubeShorts",
    label: "YouTube Shorts",
    description: "Krótkie wideo pionowe",
    icon: Zap,
    category: "YouTube",
  },
  // Własne typy treści
  {
    key: "longFormArticle",
    label: "Długi Artykuł",
    description: "Szczegółowy artykuł blogowy",
    icon: BookOpen,
    category: "Blog",
  },
  {
    key: "shortVideoScenario",
    label: "Scenariusz Krótkiego Video",
    description: "Plan dla video do 60s",
    icon: FileText,
    category: "Planowanie",
  },
  {
    key: "longVideoScenario",
    label: "Scenariusz Długiego Video",
    description: "Plan dla długich materiałów",
    icon: Layout,
    category: "Planowanie",
  },
  {
    key: "carouselIdeas",
    label: "Pomysły na Karuzelę",
    description: "Koncepcja slajdów karuzeli",
    icon: Image,
    category: "Planowanie",
  },
];

// Komponent edytowalnego tytułu
function EditableTitle({
  title,
  onSave,
}: {
  title: string;
  onSave: (newTitle: string) => void;
}) {
  const { Tooltip, TooltipContent, TooltipTrigger } = useDesignSystem();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    if (editedTitle.trim() && editedTitle !== title) {
      onSave(editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleDoubleClick = () => {
    setEditedTitle(title);
    setIsEditing(true);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="flex items-start gap-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-2xl md:text-3xl font-bold text-gray-900 bg-transparent border-2 border-blue-500 rounded-lg px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
          <div className="flex items-center gap-1 mt-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSave}
                  className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Zapisz</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Anuluj</TooltipContent>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="relative inline-block">
          <h1
            className="text-lg md:text-2xl font-semibold text-gray-900 mb-3 cursor-pointer inline"
            onDoubleClick={handleDoubleClick}
          >
            {title}
            {isHovered && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setEditedTitle(title);
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center justify-center ml-2 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100 align-middle"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Edytuj tytuł</TooltipContent>
              </Tooltip>
            )}
          </h1>
        </div>
      )}
    </div>
  );
}

// Pobierz istniejące elementy treści z obiektu content
function getExistingElements(content: any) {
  const elements = [];

  // Zawsze dołącz Chat jako domyślny interfejs
  elements.push({
    key: "chat",
    label: "Czat AI",
    description: "Rozmowa z asystentem AI",
    icon: MessageCircle,
    category: "AI",
  });

  // Najpierw dodaj elementy planowania (scenariusze)
  const planningElements = AVAILABLE_CONTENT_ELEMENTS.filter(el => el.category === "Planowanie");
  planningElements.forEach((element) => {
    if (content[element.key]) {
      elements.push(element);
    }
  });

  // Potem dodaj pozostałe elementy (publikacje)
  const otherElements = AVAILABLE_CONTENT_ELEMENTS.filter(el => el.category !== "Planowanie");
  otherElements.forEach((element) => {
    if (content[element.key]) {
      elements.push(element);
    }
  });

  return elements;
}

// Komponent nagłówka strony treści z glassmorphism
function ContentPageHeader({
  content,
  activeElement,
  onElementSelect,
  onAddElement,
  onTitleSave,
}: {
  content: any;
  activeElement: string;
  onElementSelect: (element: string) => void;
  onAddElement: () => void;
  onTitleSave: (newTitle: string) => void;
}) {
  const existingElements = getExistingElements(content);

  return (
    <div className="mb-8">
      {/* Header Card with sidebar-matching styling */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-4 mb-6">
        {/* Title and Description */}
        <div className="mb-4">
          <EditableTitle
            title={content.title || "Bez tytułu"}
            onSave={onTitleSave}
          />
          {content.description && (
            <p className="text-gray-700 text-lg leading-relaxed">
              {content.description}
            </p>
          )}
        </div>

        {/* Element Navigation Badges */}
        <div className="flex flex-wrap gap-3 items-center">
          {existingElements.map((element) => {
            const IconComponent = element.icon;
            const isActive = activeElement === element.key;

            return (
              <button
                key={element.key}
                onClick={() => onElementSelect(element.key)}
                className={`
                  group flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm
                  transition-all duration-200 shadow-sm
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-blue-500/25 border border-blue-500"
                      : "bg-white/60 border border-white/40 text-gray-700 hover:bg-white/80 hover:border-white/60 hover:shadow-md hover:text-gray-800"
                  }
                `}
              >
                <IconComponent className="w-4 h-4 transition-transform duration-200" />
                {element.label}
              </button>
            );
          })}

          {/* Add Element Button */}
          <button
            onClick={onAddElement}
            className="
              group flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm
              transition-all duration-200 shadow-sm
              bg-white/40 border-2 border-dashed border-gray-300 text-gray-600
              hover:bg-white/60 hover:border-gray-400 hover:text-gray-800 hover:shadow-md
            "
          >
            <Plus className="w-4 h-4 transition-transform duration-200" />
            Dodaj Element
          </button>
        </div>
      </div>
    </div>
  );
}

// Komponent zawartości selektora elementów
function ElementSelectorContent({
  content,
  onSelect,
}: {
  content: any;
  onSelect: (elementKey: string) => void;
}) {
  const existingElements = getExistingElements(content);
  const existingKeys = existingElements.map((e) => e.key);

  // Filtruj elementy które już istnieją
  const availableElements = AVAILABLE_CONTENT_ELEMENTS.filter(
    (element) => !existingKeys.includes(element.key)
  );

  // Grupuj elementy po kategoriach
  const elementsByCategory = availableElements.reduce((acc, element) => {
    const category = element.category || "Inne";
    if (!acc[category]) acc[category] = [];
    acc[category].push(element);
    return acc;
  }, {} as Record<string, typeof availableElements>);

  if (availableElements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Wszystkie dostępne elementy zostały już dodane do tej treści.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
      {Object.entries(elementsByCategory).map(([category, elements]) => (
        <div key={category}>
          <h4 className="text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
            {category}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {elements.map((element) => {
              const IconComponent = element.icon;
              return (
                <button
                  key={element.key}
                  onClick={() => onSelect(element.key)}
                  className="
                    group p-4 bg-white/60 border border-gray-200 rounded-xl
                    hover:bg-white/80 hover:border-gray-300 transition-all duration-300
                    hover:shadow-md text-left
                  "
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <IconComponent className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-gray-900 transition-colors">
                        {element.label}
                      </div>
                      <div className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors line-clamp-2">
                        {element.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Komponent głównego obszaru treści
function ContentArea({
  content,
  activeElement,
  itemId,
}: {
  content: any;
  activeElement: string;
  itemId: string;
}) {
  const { transcribeVoice, sendContentMessage } = useCommands();
  const revalidate = useRevalidate();

  // Pobierz wiadomości dla elementu chat
  const [messagesResult] = useQuery(
    (q) =>
      q.contentMessages.find({
        where: {
          chatId: itemId as any,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    [itemId],
    `content-messages-${itemId}`
  );

  const messages = Array.isArray(messagesResult) ? messagesResult : [];

  // Znajdź element w mapie elementów
  const elementInfo = AVAILABLE_CONTENT_ELEMENTS.find(
    (el) => el.key === activeElement
  ) || {
    key: "chat",
    label: "Czat AI",
    description: "Rozmowa z asystentem AI",
    icon: MessageCircle,
  };

  // Renderuj różne interfejsy w zależności od aktywnego elementu
  if (activeElement === "chat") {
    return (
      <Chat
        sendMessage={(sendContentMessage as any) || (() => Promise.resolve())}
        transcribeVoice={transcribeVoice}
        messages={messages || []}
        chatId={itemId}
        placeholder={`Zapytaj AI o "${content?.title || "tę treść"}"...`}
        onRevalidate={() => revalidate(`content-messages-${itemId}`)}
        toolViews={{
          updateContentByAi: UpdateContentToolView,
        }}
      />
    );
  }

  const IconComponent = elementInfo.icon;

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex p-6 rounded-2xl bg-white/10 border border-white/20 mb-6">
          <IconComponent className="w-12 h-12 text-gray-700" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {elementInfo.label}
        </h3>
        <p className="text-gray-700 text-lg mb-6">{elementInfo.description}</p>
        <p className="text-gray-500">
          Edytor dla tego typu treści będzie wkrótce dostępny...
        </p>
      </div>
    </div>
  );
}

export function SingleContentPage() {
  const { id: itemId } = useParams<{ id: string }>();
  const { content, isLoading } = useContent();
  console.log(content);
  const { currentAccount } = useAccountWorkspaces();
  const { updateContent } = useCommands();
  const {
    SidebarLayout,
    TooltipProvider,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } = useDesignSystem();

  const [activeElement, setActiveElement] = useState("chat");
  const [showElementSelector, setShowElementSelector] = useState(false);

  // Find the current content item
  const currentContent = content.find((item) => item._id === itemId);
  console.log(currentContent, itemId);

  const handleAddElement = async (elementKey: string) => {
    if (!currentContent) return;

    try {
      // Add the new element to the content
      await updateContent({
        contentId: currentContent._id,
        contentUpdate: {
          [elementKey]: {}, // Initialize with empty object
        },
        accountWorkspaceId: currentAccount._id,
      });

      // Switch to the new element and close selector
      setActiveElement(elementKey);
      setShowElementSelector(false);
    } catch (error) {
      console.error("Error adding content element:", error);
    }
  };

  if (isLoading) {
    return (
      <TooltipProvider>
        <SidebarLayout
          sidebar={<ListOfContentSidebar />}
          sidebarSize="compact"
          defaultSidebarSize={30}
          storageKey="content-list-sidebar"
          sticky={true}
          stickyOffset={80}
          className="min-h-screen"
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Ładowanie treści...</p>
            </div>
          </div>
        </SidebarLayout>
      </TooltipProvider>
    );
  }

  if (!currentContent) {
    return (
      <TooltipProvider>
        <SidebarLayout
          sidebar={<ListOfContentSidebar />}
          sidebarSize="compact"
          defaultSidebarSize={30}
          storageKey="content-list-sidebar"
          sticky={true}
          stickyOffset={80}
          className="min-h-screen"
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Nie znaleziono treści
              </h2>
              <p className="text-gray-700">
                Nie można znaleźć treści o podanym ID.
              </p>
            </div>
          </div>
        </SidebarLayout>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <SidebarLayout
        sidebar={<ListOfContentSidebar />}
        sidebarSize="compact"
        defaultSidebarSize={30}
        storageKey="content-list-sidebar"
        sticky={true}
        stickyOffset={80}
        className="min-h-screen"
      >
        {/* Main Content Area */}
        <div className="h-full p-4">
          <div className="w-full">
            {/* Content Page Header */}
            <ContentPageHeader
              content={currentContent}
              activeElement={activeElement}
              onElementSelect={setActiveElement}
              onAddElement={() => setShowElementSelector(true)}
              onTitleSave={(newTitle) => {
                updateContent({
                  contentId: currentContent._id,
                  contentUpdate: { title: newTitle },
                  accountWorkspaceId: currentAccount._id,
                });
              }}
            />

            {/* Content Area */}
            <ContentArea
              content={currentContent}
              activeElement={activeElement}
              itemId={itemId!}
            />
          </div>
        </div>

        {/* Element Selector Dialog */}
        <Dialog
          open={showElementSelector}
          onOpenChange={setShowElementSelector}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj Element Treści</DialogTitle>
              <DialogDescription>
                Wybierz typ treści którą chcesz dodać
              </DialogDescription>
            </DialogHeader>

            <ElementSelectorContent
              content={currentContent}
              onSelect={handleAddElement}
            />

            <DialogFooter>
              <button
                onClick={() => setShowElementSelector(false)}
                className="
                px-6 py-2 rounded-xl font-semibold text-sm
                bg-gray-100 border border-gray-300 text-gray-700
                hover:bg-gray-200 hover:border-gray-400 transition-all duration-300
              "
              >
                Anuluj
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarLayout>
    </TooltipProvider>
  );
}
