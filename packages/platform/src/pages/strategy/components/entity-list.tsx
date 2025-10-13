import { type ArcObjectAny } from "@arcote.tech/arc";
import { useDesignSystem } from "design-system";
import { Plus, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EntityFormView } from "./entity-form-view";

interface EntityListProps<T extends ArcObjectAny> {
  title: string;
  icon: React.ReactNode;
  entities: any[];
  schema: T;
  addButtonText: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  onCreate: (data: any) => Promise<void>;
  onUpdate: (entityId: string, data: any) => Promise<void>;
  onRemove: (entityId: string) => Promise<void>;
  getEntityId: (entity: any) => string;
  getEntityDisplayName: (entity: any) => string;
  renderFormFields: (
    Fields: any,
    props?: { onRemove?: () => void; entity?: any }
  ) => React.ReactNode;
  className?: string;
}

export function EntityList<T extends ArcObjectAny>({
  title,
  icon,
  entities,
  schema,
  addButtonText,
  emptyStateTitle,
  emptyStateDescription,
  onCreate,
  onUpdate,
  onRemove,
  getEntityId,
  getEntityDisplayName,
  renderFormFields,
  className = "",
}: EntityListProps<T>) {
  const { Button } = useDesignSystem();
  const [isAdding, setIsAdding] = useState(false);
  const [formEditingState, setFormEditingState] = useState(false);
  const addFormRef = useRef<HTMLDivElement>(null);

  const handleCreate = async (data: any) => {
    await onCreate(data);
    setIsAdding(false);
    setFormEditingState(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setFormEditingState(true);
    // Scroll to form after state update
    setTimeout(() => {
      if (addFormRef.current) {
        addFormRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  // Hide form when editing state changes to false
  useEffect(() => {
    if (isAdding && !formEditingState) {
      setIsAdding(false);
    }
  }, [formEditingState, isAdding]);

  const handleUpdate = async (entityId: string, data: any) => {
    await onUpdate(entityId, data);
  };

  const handleRemove = async (entityId: string) => {
    await onRemove(entityId);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/70 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-blue-600">{icon}</div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>

          {!isAdding && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddClick}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {addButtonText}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {entities.map((entity: any) => {
            const entityId = getEntityId(entity);

            return (
              <EntityFormView
                key={entityId}
                schema={schema}
                data={entity}
                onUpdate={(data) => handleUpdate(entityId, data)}
                mode="summary"
                render={(Fields) =>
                  renderFormFields(Fields, {
                    onRemove: () => handleRemove(entityId),
                    entity: entity,
                  })
                }
              />
            );
          })}

          {isAdding && (
            <div 
              ref={addFormRef}
              className="border-2 border-dashed border-blue-200 rounded-lg p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dodaj nowy element
                  </h3>
                  <p className="text-sm text-gray-600">
                    Wypełnij poniższe pola, aby utworzyć nowy element
                  </p>
                </div>
              </div>
              
              <EntityFormView
                schema={schema}
                data={{} as any}
                onUpdate={handleCreate}
                mode="summary"
                startInEditMode={true}
                onEditStateChange={setFormEditingState}
                render={(Fields) => renderFormFields(Fields)}
              />
            </div>
          )}

          {entities.length === 0 && !isAdding && (
            <div className="text-center py-12">
              <div className="w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center">
                {icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {emptyStateTitle}
              </h3>
              <p className="text-gray-600 mb-4">{emptyStateDescription}</p>
              <Button
                type="button"
                onClick={handleAddClick}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {addButtonText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
