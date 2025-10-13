import { useCommands, useRevalidate } from "@/arc-provider";
import { styleSchema } from "@narzedziadlatworcow.pl/context/browser";
import type { ToolViewProps } from "@narzedziadlatworcow.pl/ui/components/chat/types";
import { ToolWrapper } from "@narzedziadlatworcow.pl/ui/components/tool-wrapper";
import { EntityFormView } from "../components/entity-form-view";
import { CreatorStyleFormFields } from "./creator-style-form-fields";

export const UpdateCreatorStyleToolView = ({ params }: ToolViewProps) => {
  const { updateCreatorStyleForm } = useCommands();
  const revalidate = useRevalidate();

  // Extract style update data from params
  const styleUpdate = (params as any)?.styleUpdate;
  const accountWorkspaceId = (params as any)?.accountWorkspaceId;

  if (!styleUpdate) {
    return <ToolWrapper message="Zaktualizowano styl komunikacji" />;
  }

  return (
    <ToolWrapper message="Zaktualizowano styl komunikacji">
      <EntityFormView
        schema={styleSchema}
        data={styleUpdate}
        onUpdate={async (data) => {
          await updateCreatorStyleForm({
            styleUpdate: data,
            accountWorkspaceId,
          });
          revalidate("creator-style-messages");
        }}
        mode="tool"
        render={(Fields) => (
          <CreatorStyleFormFields Fields={Fields} data={styleUpdate} />
        )}
      />
    </ToolWrapper>
  );
};
