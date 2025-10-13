import { useCommands, useQuery } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { object } from "@arcote.tech/arc";
import { useForm, type FormFields } from "@arcote.tech/arc-react";
import { ideaSchema } from "@narzedziadlatworcow.pl/context";
import { useDesignSystem } from "design-system";
import { Layout, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LabeledSelect, LabeledText } from "../components";

const idea = object(ideaSchema);

interface ContentIdeasFormFieldsProps {
  Fields: FormFields<typeof idea>;
  data?: any;
  onRemove?: () => void;
  ideaId?: string;
}

export const ContentIdeasFormFields = ({
  Fields,
  data,
  onRemove,
  ideaId,
}: ContentIdeasFormFieldsProps) => {
  const { Button } = useDesignSystem();
  const { currentAccount } = useAccountWorkspaces();
  const { generateContentBasedOnIdea } = useCommands();
  const navigate = useNavigate();
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const { values } = useForm<typeof idea>();

  const [formats] = useQuery((q) =>
    q.contentFormats.find({
      where: {
        accountWorkspaceId: currentAccount._id,
      },
    })
  );

  const userFormats = formats || [];

  const formatOptions = userFormats.map((format) => ({
    value: format._id,
    label: format.name || "Bez nazwy",
    icon: <Layout className="w-4 h-4" />,
  }));

  const handleGenerateContent = async () => {
    if (!values.title || !values.formatId || !ideaId) {
      return; // Don't generate if idea is incomplete or no ideaId
    }

    setIsGeneratingContent(true);
    try {
      const result = await generateContentBasedOnIdea({
        ideaId: ideaId,
        accountWorkspaceId: currentAccount._id,
      });

      if (result.success && result.contentId) {
        // Navigate to the generated content
        navigate(`/content/item/${result.contentId}`);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Check if idea is complete enough to generate content
  const canGenerateContent = values.title && values.formatId && ideaId;

  return (
    <div className="space-y-4">
      {/* Title */}
      <Fields.Title
        translations="Tytuł pomysłu jest wymagany"
        render={(field: any) => (
          <LabeledText
            {...field}
            label="TYTUŁ POMYSŁU"
            placeholder="Wprowadź tytuł pomysłu na treść..."
          />
        )}
      />

      {/* Format Selection and Generate Button Row */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:gap-4">
        <div className="flex-1">
          <Fields.FormatId
            translations="Format treści jest wymagany"
            render={(field: any) => (
              <LabeledSelect
                {...field}
                label="FORMAT TREŚCI"
                options={formatOptions}
                placeholder="Wybierz format treści..."
                emptyMessage={
                  userFormats.length === 0
                    ? "Najpierw dodaj formaty treści w poprzednim kroku."
                    : undefined
                }
              />
            )}
          />
        </div>

        {/* Generate Content Button */}
        {canGenerateContent && (
          <div className="mt-4 lg:mt-0">
            <Button
              type="button"
              onClick={handleGenerateContent}
              disabled={isGeneratingContent}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>
                  {isGeneratingContent ? "Generowanie..." : "Generuj treść"}
                </span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
