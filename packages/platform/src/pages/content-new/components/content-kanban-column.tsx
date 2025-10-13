import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useDesignSystem } from "design-system";
import { ArcViewRecord } from "@arcote.tech/arc";
import { useEffect, useRef, useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { useCommands } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { ContentKanbanCard } from "./content-kanban-card";
import {
  ContentColumnDropData,
  validContentDragData,
  useContentKanban,
} from "./content-kanban-provider";

interface ContentKanbanColumnProps {
  column: {
    id: "ideas" | "in_progress" | "published";
    title: string;
    description: string;
    color: string;
    borderColor: string;
    textColor: string;
  };
  items: ArcViewRecord<any>[];
  getFormatName: (formatId: string) => string;
}

export function ContentKanbanColumn({
  column,
  items,
  getFormatName,
}: ContentKanbanColumnProps) {
  // const { Card } = useDesignSystem(); // Card not available, using div instead
  const { draggedContent } = useContentKanban();
  const { currentAccount } = useAccountWorkspaces();
  const { createContent } = useCommands();

  const columnRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [newIdeaText, setNewIdeaText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const element = columnRef.current;
    if (!element) return;

    const dropData: ContentColumnDropData = {
      type: "column",
      status: column.id,
    };

    return dropTargetForElements({
      element,
      getData: () => dropData,
      canDrop: ({ source }) => {
        return validContentDragData(source.data);
      },
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [column.id]);

  // Focus textarea when widget is shown
  useEffect(() => {
    if (showAddWidget && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showAddWidget]);

  const handleAddIdea = () => {
    setShowAddWidget(true);
    setSaveError(null);
  };

  const handleCancelAdd = () => {
    setShowAddWidget(false);
    setNewIdeaText("");
    setSaveError(null);
  };

  const handleSaveIdea = async () => {
    if (!newIdeaText.trim()) {
      setSaveError("Please enter an idea");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await createContent({
        content: {
          title: newIdeaText.trim(),
          description: "",
          status: "ideas",
          order: Date.now(),
        },
        accountWorkspaceId: currentAccount._id,
      });

      if (result.success) {
        // Reset form and hide widget
        setNewIdeaText("");
        setShowAddWidget(false);
        // The new content will appear automatically due to the contentKanban view updates
      } else {
        setSaveError("Failed to create idea");
      }
    } catch (error) {
      setSaveError("Error creating idea");
      console.error("Error creating content idea:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSaveIdea();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelAdd();
    }
  };

  return (
    <div
      ref={columnRef}
      className={`
        p-4 transition-all duration-200 bg-white border rounded-lg shadow-sm
        ${
          isDraggedOver
            ? "bg-blue-50 border-blue-300 border-2"
            : "border-gray-200"
        }
        ${draggedContent ? "min-h-[200px]" : ""}
      `}
    >
      {/* Column Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold text-lg ${column.textColor}`}>
            {column.title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${column.color} ${column.textColor}`}
          >
            {items.length}
          </span>
        </div>
      </div>

      {/* Column Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div
            className={`
            text-center py-8 transition-all duration-200 rounded-lg
            ${
              isDraggedOver
                ? "text-blue-600 bg-blue-100 border-2 border-dashed border-blue-300"
                : "text-gray-400"
            }
          `}
          >
            <p className="text-sm">
              {isDraggedOver
                ? "Upuść tutaj treść"
                : "Brak treści w tej kolumnie"}
            </p>
          </div>
        ) : (
          items.map((item) => (
            <ContentKanbanCard
              key={item._id}
              content={item}
              getFormatName={getFormatName}
            />
          ))
        )}
      </div>

      {/* Add Idea Button (only for Ideas column) */}
      {column.id === "ideas" && (
        <div className="mt-4">
          {!showAddWidget ? (
            <button
              onClick={handleAddIdea}
              className="w-full flex text-sm items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Dodaj pomysł
            </button>
          ) : (
            <div className="p-3 border-2 border-gray-300 rounded-lg bg-white">
              <textarea
                ref={textareaRef}
                value={newIdeaText}
                onChange={(e) => setNewIdeaText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Wpisz swój pomysł na treść"
                className="w-full p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                disabled={isSaving}
              />
              {saveError && (
                <p className="text-sm text-red-600 mt-1">{saveError}</p>
              )}
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={handleCancelAdd}
                  disabled={isSaving}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  <X className="w-3 h-3" />
                  Anuluj
                </button>
                <button
                  onClick={handleSaveIdea}
                  disabled={isSaving || !newIdeaText.trim()}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-3 h-3" />
                  {isSaving ? "Zapisywanie..." : "Zapisz "}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
