import { useCommands, useRevalidate } from "@/arc-provider";
import { identitySchema } from "@narzedziadlatworcow.pl/context/browser";
import type { ToolViewProps } from "@narzedziadlatworcow.pl/ui/components/chat/types";
import { ToolWrapper } from "@narzedziadlatworcow.pl/ui/components/tool-wrapper";
import { EntityFormView } from "../components/entity-form-view";
import { CreatorIdentityFormFields } from "./creator-identity-form-fields";

export const SetCreatorIdentityToolView = ({ params }: ToolViewProps) => {
  const { updateCreatorIdentity } = useCommands();
  const revalidate = useRevalidate();

  // Extract identity data from params
  const identityUpdate = (params as any)?.identityUpdate;
  const accountWorkspaceId = (params as any)?.accountWorkspaceId;

  if (!identityUpdate) {
    return <ToolWrapper message="Zaktualizowano tożsamość twórcy" />;
  }

  return (
    <ToolWrapper message="Zaktualizowano tożsamość twórcy">
      <EntityFormView
        schema={identitySchema}
        data={identityUpdate}
        onUpdate={async (data) => {
          await updateCreatorIdentity({
            identityUpdate: data,
            accountWorkspaceId,
          });
          revalidate("identity-messages");
        }}
        mode="tool"
        render={(Fields) => (
          <CreatorIdentityFormFields Fields={Fields} data={identityUpdate} />
        )}
      />
    </ToolWrapper>
  );
};
