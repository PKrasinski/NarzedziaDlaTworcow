import { useCommands, useRevalidate } from "@/arc-provider";
import { object } from "@arcote.tech/arc";
import { contentSchema } from "@narzedziadlatworcow.pl/context";
import type { ToolViewProps } from "@narzedziadlatworcow.pl/ui/components/chat/types";
import { EntityUpdatedSuccess } from "@narzedziadlatworcow.pl/ui/components/tool-wrapper";
import { EntityFormView } from "../strategy/components/entity-form-view";
import { ContentFormFields } from "./content-form-fields";

const contentObject = object(contentSchema);

export const UpdateContentToolView = ({ params }: ToolViewProps) => {
  const { updateContent } = useCommands();
  const revalidate = useRevalidate();

  const contentUpdate = params as any;
  const contentId = contentUpdate?.contentId;

  if (!contentUpdate) {
    return <EntityUpdatedSuccess entityType="treść" />;
  }

  return (
    <EntityUpdatedSuccess entityType="treść">
      <EntityFormView
        schema={contentObject}
        data={contentUpdate}
        onUpdate={async (data) => {
          await updateContent({
            contentId: contentUpdate.contentId,
            accountWorkspaceId: contentUpdate.accountWorkspaceId,
            contentUpdate: data,
          });
          // Revalidate messages
          revalidate("content-messages");
        }}
        mode="tool"
        render={(Fields) => (
          <ContentFormFields
            Fields={Fields}
            data={contentUpdate}
            contentId={contentUpdate.contentId}
          />
        )}
      />
    </EntityUpdatedSuccess>
  );
};
