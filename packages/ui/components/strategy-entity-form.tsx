import { type $type, type ArcObjectAny } from "@arcote.tech/arc";
import { Form, type FormProps } from "@arcote.tech/arc-react";
import { useDesignSystem } from "design-system";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { Edit, Loader2, Plus, Trash2, X } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";

interface StrategyEntityFormProps<T extends ArcObjectAny> {
  values: any[];
  revalidate: () => void;
  create: (data: $type<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  edit: (id: string, data: $type<T>) => Promise<void>;
  schema: T;
  render: FormProps<T>["render"];
  title: string;
  description: string;
  emptyStateText: string;
  icon?: React.ReactNode;
  getEntityId: (entity: any) => string;
  getEntityDisplayName: (entity: any) => string;
  getEntityPreview?: (entity: any) => string;
  className?: string;
}

interface EntityCardProps {
  displayName: string;
  preview?: string;
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

const EntityCard: React.FC<EntityCardProps> = ({
  displayName,
  preview,
  onEdit,
  onDelete,
  children,
}) => {
  const { Button } = useDesignSystem();
  return (
    <Card className="group bg-white/60 backdrop-blur-sm border border-white/70 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">
              {displayName}
            </h4>
            {preview && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {preview}
              </p>
            )}
            {children}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onAdd: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  onAdd,
}) => {
  const { Button } = useDesignSystem();
  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50/60 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        {icon && (
          <div className="w-12 h-12 text-gray-400 mb-4 flex items-center justify-center">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-center mb-4 max-w-md">{description}</p>
        <Button
          onClick={onAdd}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj pierwszy element
        </Button>
      </CardContent>
    </Card>
  );
};

export function StrategyEntityForm<T extends ArcObjectAny>({
  values,
  revalidate,
  create,
  remove,
  edit,
  schema,
  render,
  title,
  description,
  emptyStateText,
  icon,
  getEntityId,
  getEntityDisplayName,
  getEntityPreview,
  className,
}: StrategyEntityFormProps<T>) {
  const { Button } = useDesignSystem();
  const [showForm, setShowForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openCreateForm = () => {
    setEditingEntity(null);
    setShowForm(true);
  };

  const openEditForm = (entity: any) => {
    setEditingEntity(entity);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEntity(null);
  };

  const handleSubmit = async (data: $type<T>) => {
    setIsLoading(true);
    try {
      if (editingEntity) {
        await edit(getEntityId(editingEntity), data);
      } else {
        await create(data);
      }
      revalidate();
      closeForm();
    } catch (error) {
      console.error("Error saving entity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (entity: any) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten element?")) {
      setIsLoading(true);
      try {
        await remove(getEntityId(entity));
        revalidate();
      } catch (error) {
        console.error("Error deleting entity:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/70 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && <div className="text-blue-600">{icon}</div>}
              <div>
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {values.length}{" "}
              {values.length === 1
                ? "element"
                : values.length < 5
                ? "elementy"
                : "elementów"}
            </div>
          </div>

          {values.length === 0 && !showForm ? (
            <EmptyState
              title={emptyStateText}
              description={description}
              icon={icon}
              onAdd={openCreateForm}
            />
          ) : (
            <div className="space-y-4">
              {values.map((entity, index) => {
                const entityId = getEntityId(entity);
                const isEditing =
                  editingEntity && getEntityId(editingEntity) === entityId;

                if (isEditing) {
                  // Show form in place of the item being edited
                  return (
                    <Card
                      key={entityId || index}
                      className="bg-blue-50/60 backdrop-blur-sm border-2 border-blue-200 border-dashed"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {icon && (
                              <div className="text-blue-600">{icon}</div>
                            )}
                            <h4 className="font-medium text-blue-800">
                              Edytuj element
                            </h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={closeForm}
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <Form
                          schema={schema}
                          defaults={editingEntity || {}}
                          onSubmit={handleSubmit}
                          onUnvalidatedSubmit={console.warn}
                          render={(Fields, values) => (
                            <div className="space-y-4">
                              <div className="space-y-4">
                                {
                                  render(
                                    Fields as any,
                                    values
                                  ) as React.ReactNode
                                }
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-4 border-t border-blue-200">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={closeForm}
                                  disabled={isLoading}
                                >
                                  Anuluj
                                </Button>
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={isLoading}
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                >
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Zapisywanie...
                                    </>
                                  ) : (
                                    <>Zapisz</>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        />
                      </CardContent>
                    </Card>
                  );
                }

                // Show normal entity card
                return (
                  <EntityCard
                    key={entityId || index}
                    displayName={getEntityDisplayName(entity)}
                    preview={getEntityPreview?.(entity)}
                    onEdit={() => openEditForm(entity)}
                    onDelete={() => handleDelete(entity)}
                  >
                    {/* Custom entity preview content can be added here */}
                  </EntityCard>
                );
              })}

              {/* Add form for creating new items (shows at the end) */}
              {showForm && !editingEntity && (
                <Card className="bg-blue-50/60 backdrop-blur-sm border-2 border-blue-200 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {icon && <div className="text-blue-600">{icon}</div>}
                        <h4 className="font-medium text-blue-800">
                          Dodaj nowy element
                        </h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={closeForm}
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <Form
                      schema={schema}
                      defaults={{}}
                      onSubmit={handleSubmit}
                      render={(Fields, values) => (
                        <div className="space-y-4">
                          <div className="space-y-4">
                            {render(Fields as any, values) as React.ReactNode}
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-4 border-t border-blue-200">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={closeForm}
                              disabled={isLoading}
                            >
                              Anuluj
                            </Button>
                            <Button
                              type="submit"
                              size="sm"
                              disabled={isLoading}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Zapisywanie...
                                </>
                              ) : (
                                <>Zapisz</>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Add New Button Card (show when not in create form mode) */}
              {!showForm && (
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/60 backdrop-blur-sm hover:border-blue-300 hover:bg-blue-50/60 transition-all duration-200 cursor-pointer group">
                  <CardContent
                    className="flex items-center justify-center gap-3 p-4"
                    onClick={openCreateForm}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-blue-200 flex items-center justify-center transition-colors duration-200">
                      <Plus className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-blue-700 font-medium">
                      Dodaj nowy element
                    </span>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              💡 <strong>Wskazówka:</strong> Kliknij "Dodaj nowy" aby dodać
              element lub wybierz istniejący element aby go edytować.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
