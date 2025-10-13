import { useCommands, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { contentTypes } from "@narzedziadlatworcow.pl/context";
import { useParams } from "react-router-dom";
import { getContentTypeConfig } from "../../lib/content-types";
import { useContentItem } from "../../providers/content-item-provider";
import { EntityFormView } from "../strategy/components/entity-form-view";
import { ContentItemSidebar } from "./components/content-item-sidebar";
import { contentTypeFieldsMap } from "./components/content-types-fields";

export const ContentTypePage = () => {
  const { itemId, contentType } = useParams<{
    itemId: string;
    contentType: keyof typeof contentTypes;
  }>();
  const { currentAccount } = useAccountWorkspaces();
  const { contentItem, isLoading: isContentLoading } = useContentItem();
  const revalidate = useRevalidate();
  console.log(contentItem);

  // Get content type configuration
  const contentTypeConfig = contentType
    ? getContentTypeConfig(contentType)
    : null;
  const FieldComponent = contentType
    ? contentTypeFieldsMap[contentType as keyof typeof contentTypeFieldsMap]
    : null;

  // Commands
  const { updateContent } = useCommands();

  // Handle form submission
  const handleUpdate = async (data: any) => {
    if (!itemId || !contentItem) return;

    await updateContent({
      contentId: itemId as any,
      contentUpdate: data,
      accountWorkspaceId: currentAccount._id,
    });

    // Revalidate any relevant queries if needed
    // revalidate("content-messages");
  };

  // Show loading state
  if (isContentLoading) {
    return (
      <div className="flex h-screen">
        <ContentItemSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error states
  if (!contentItem || !contentType || !contentTypeConfig || !FieldComponent) {
    return (
      <div className="flex h-screen">
        <ContentItemSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {!contentItem
                ? "Treść nie została znaleziona"
                : "Nieznany typ treści"}
            </h2>
            <p className="text-gray-600 mb-4">
              {!contentItem
                ? "Nie można załadować treści o podanym ID."
                : `Typ treści "${contentType}" nie jest obsługiwany.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <ContentItemSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Content Type Header */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/70 p-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-lg text-white shadow-sm ${contentTypeConfig.color}`}
                >
                  <contentTypeConfig.icon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {contentTypeConfig.name}
                  </h1>
                  <p className="text-gray-600">{contentItem.title}</p>
                </div>
              </div>
            </div>

            {/* Entity Form View */}
            <EntityFormView
              schema={contentTypes[contentType] as any}
              data={contentItem?.[contentType] || {}}
              onUpdate={handleUpdate}
              mode="summary"
              render={(Fields) => <FieldComponent Fields={Fields} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
