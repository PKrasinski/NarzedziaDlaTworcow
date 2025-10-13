import { useCommands, useRevalidate } from "@/arc-provider";
import { object } from "@arcote.tech/arc";
import { ideaSchema } from "@narzedziadlatworcow.pl/context";
import type { ToolViewProps } from "@narzedziadlatworcow.pl/ui/components/chat/types";
import {
  EntityUpdatedSuccess,
  ToolWrapper,
} from "@narzedziadlatworcow.pl/ui/components/tool-wrapper";
import { EntityFormView } from "../components/entity-form-view";
import { ContentIdeasFormFields } from "./content-ideas-form-fields";

const ideaObject = object(ideaSchema);

export const CreateIdeaToolView = ({ params, result }: ToolViewProps) => {
  const { updateIdeaForm } = useCommands();
  const revalidate = useRevalidate();

  const ideaData = params as any;
  const accountWorkspaceId = (params as any)?.accountWorkspaceId;
  const ideaId = (result as any)?.success?.ideaId;

  if (!ideaData || !ideaId) {
    return <ToolWrapper message="Dodano nowy pomysł na treść" />;
  }

  return (
    <ToolWrapper message="Dodano nowy pomysł na treść">
      <EntityFormView
        schema={ideaObject}
        data={ideaData}
        onUpdate={async (data) => {
          await updateIdeaForm({
            ideaId,
            accountWorkspaceId,
            ideaUpdate: data,
          });
          revalidate("content-ideas-messages");
        }}
        mode="tool"
        render={(Fields) => (
          <ContentIdeasFormFields Fields={Fields} data={ideaData} ideaId={ideaId} />
        )}
      />
    </ToolWrapper>
  );
};

export const UpdateIdeaToolView = ({ params }: ToolViewProps) => {
  const { updateIdeaForm } = useCommands();
  const revalidate = useRevalidate();

  const ideaUpdate = params as any;

  if (!ideaUpdate) {
    return <EntityUpdatedSuccess entityType="pomysł na treść" />;
  }

  return (
    <EntityUpdatedSuccess entityType="pomysł na treść">
      <EntityFormView
        schema={ideaObject}
        data={ideaUpdate}
        onUpdate={async (data) => {
          await updateIdeaForm({
            ideaId: ideaUpdate.ideaId,
            accountWorkspaceId: ideaUpdate.accountWorkspaceId,
            ideaUpdate: data,
          });
          revalidate("content-ideas-messages");
        }}
        mode="tool"
        render={(Fields) => (
          <ContentIdeasFormFields Fields={Fields} data={ideaUpdate} ideaId={ideaUpdate.ideaId} />
        )}
      />
    </EntityUpdatedSuccess>
  );
};

export const RemoveIdeaToolView = ({ params }: ToolViewProps) => {
  const ideaId = (params as any)?.ideaId;

  return (
    <ToolWrapper
      message={`Pomysł na treść został usunięty${
        ideaId ? ` (ID: ${ideaId})` : ""
      }`}
    />
  );
};
