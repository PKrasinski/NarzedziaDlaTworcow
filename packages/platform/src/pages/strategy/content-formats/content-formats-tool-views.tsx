import { useCommands, useRevalidate } from "@/arc-provider";
import { object } from "@arcote.tech/arc";
import { formatSchema } from "@narzedziadlatworcow.pl/context";
import type { ToolViewProps } from "@narzedziadlatworcow.pl/ui/components/chat/types";
import {
  EntityUpdatedSuccess,
  ToolWrapper,
} from "@narzedziadlatworcow.pl/ui/components/tool-wrapper";
import { EntityFormView } from "../components/entity-form-view";
import { ContentFormatsFormFields } from "./content-formats-form-fields";

const formatObject = object(formatSchema);

// Create Format Tool View
export const CreateFormatToolView = ({ params, result }: ToolViewProps) => {
  const { updateFormatForm } = useCommands();
  const revalidate = useRevalidate();

  const formatData = params as any;
  const accountWorkspaceId = (params as any)?.accountWorkspaceId;
  const formatId = (result as any)?.success?.formatId;

  if (!formatData || !formatId) {
    return <ToolWrapper message="Dodano nowy format treści" />;
  }

  return (
    <ToolWrapper message="Dodano nowy format treści">
      <EntityFormView
        schema={formatObject}
        data={formatData}
        onUpdate={async (data) => {
          await updateFormatForm({
            formatId,
            accountWorkspaceId,
            formatUpdate: data,
          });
          revalidate("content-formats-messages");
        }}
        mode="tool"
        render={(Fields) => <ContentFormatsFormFields Fields={Fields} />}
      />
    </ToolWrapper>
  );
};

// Update Format Tool View
export const UpdateFormatToolView = ({ params }: ToolViewProps) => {
  const { updateFormatForm } = useCommands();
  const revalidate = useRevalidate();

  const formatUpdate = params as any;

  if (!formatUpdate) {
    return <EntityUpdatedSuccess entityType="format treści" />;
  }

  return (
    <EntityUpdatedSuccess entityType="format treści">
      <EntityFormView
        schema={formatObject}
        data={formatUpdate}
        onUpdate={async (data) => {
          await updateFormatForm({
            formatId: formatUpdate.formatId,
            accountWorkspaceId: formatUpdate.accountWorkspaceId,
            formatUpdate: data,
          });
          revalidate("content-formats-messages");
        }}
        mode="tool"
        render={(Fields) => <ContentFormatsFormFields Fields={Fields} />}
      />
    </EntityUpdatedSuccess>
  );
};

// Remove Format Tool View
export const RemoveFormatToolView = ({ params }: ToolViewProps) => {
  const formatId = (params as any)?.formatId;

  return (
    <ToolWrapper
      message={`Format treści został usunięty${
        formatId ? ` (ID: ${formatId})` : ""
      }`}
    />
  );
};
