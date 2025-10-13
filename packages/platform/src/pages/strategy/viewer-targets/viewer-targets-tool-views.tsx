import { object } from "@arcote.tech/arc";
import { personaSchema } from "@narzedziadlatworcow.pl/context";
import type { ToolViewProps } from "@narzedziadlatworcow.pl/ui/components/chat/types";
import { ToolWrapper } from "@narzedziadlatworcow.pl/ui/components/tool-wrapper";
import { EntityFormView } from "../components/entity-form-view";
import { ViewerTargetsFormFields } from "./viewer-targets-form-fields";

// Create Persona Tool View
export const CreatePersonaToolView = ({ params }: ToolViewProps) => {
  const personaData = params as any;

  if (!personaData) {
    return <ToolWrapper message="Persona została utworzona" />;
  }

  return (
    <ToolWrapper message="Nowa persona">
      <EntityFormView
        schema={object(personaSchema)}
        data={personaData}
        onUpdate={async () => {}} // No-op for tool view
        mode="tool"
        render={(Fields) => (
          <ViewerTargetsFormFields Fields={Fields} data={personaData} />
        )}
      />
    </ToolWrapper>
  );
};

// Update Persona Tool View
export const UpdatePersonaToolView = ({ params }: ToolViewProps) => {
  const personaUpdate = params as any;

  if (!personaUpdate) {
    return <ToolWrapper message="Persona została zaktualizowana" />;
  }

  return (
    <ToolWrapper message="Zaktualizowano personę">
      <EntityFormView
        schema={object(personaSchema)}
        data={personaUpdate}
        onUpdate={async () => {}} // No-op for tool view
        mode="tool"
        render={(Fields) => (
          <ViewerTargetsFormFields Fields={Fields} data={personaUpdate} />
        )}
      />
    </ToolWrapper>
  );
};

// Remove Persona Tool View
export const RemovePersonaToolView = ({ params }: ToolViewProps) => {
  const personaId = (params as any)?.personaId;

  return (
    <ToolWrapper
      message={`Persona została usunięta${
        personaId ? ` (ID: ${personaId})` : ""
      }`}
    />
  );
};

// Set Viewer Targets Tool View (for bulk operations)
export const SetViewerTargetsToolView = ({ params }: ToolViewProps) => {
  const personas = (params as any)?.personas;

  if (!personas || !Array.isArray(personas)) {
    return <ToolWrapper message="Grupy docelowe zostały zaktualizowane" />;
  }

  return (
    <ToolWrapper
      message={`Zaktualizowano ${personas.length} person${
        personas.length === 1 ? "ę" : personas.length <= 4 ? "y" : ""
      }`}
    >
      <div className="space-y-4">
        {personas.map((persona: any, index: number) => (
          <EntityFormView
            key={index}
            schema={object(personaSchema)}
            data={persona}
            onUpdate={async () => {}} // No-op for tool view
            mode="tool"
            render={(Fields) => (
              <ViewerTargetsFormFields Fields={Fields} data={persona} />
            )}
          />
        ))}
      </div>
    </ToolWrapper>
  );
};
