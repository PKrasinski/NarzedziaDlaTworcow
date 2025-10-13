import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { object } from "@arcote.tech/arc";
import { personaSchema } from "@narzedziadlatworcow.pl/context/browser";
import { StrategyEntityForm } from "@narzedziadlatworcow.pl/ui/components/strategy-entity-form";
import { Input } from "@narzedziadlatworcow.pl/ui/components/ui/input";
import { Label } from "@narzedziadlatworcow.pl/ui/components/ui/label";
import { Textarea } from "@narzedziadlatworcow.pl/ui/components/ui/textarea";
import { Users } from "lucide-react";
import { StrategyNavigation } from "../components/strategy-navigation";

// Calculate completion percentage
const calculateCompletionPercentage = (personas: any[]) => {
  if (!personas || personas.length === 0) return 0;

  const importantFields = [
    "name",
    "lifestyle",
    "motivations",
    "challenges",
    "knowledgeLevel",
  ];
  let completedFields = 0;
  let totalFields = personas.length * importantFields.length;

  personas.forEach((persona: any) => {
    importantFields.forEach((field) => {
      if (field === "challenges" && persona[field]?.length > 0)
        completedFields++;
      else if (field !== "challenges" && persona[field]) completedFields++;
    });
  });

  return Math.round((completedFields / totalFields) * 100);
};

export const ViewerTargetsForm = () => {
  const { currentAccount } = useAccountWorkspaces();
  const { createPersona, updatePersona, removePersona } = useCommands();
  const revalidate = useRevalidate();

  const [allPersonas] = useQuery((q) =>
    q.viewerTargets.find({
      where: {
        accountWorkspaceId: currentAccount._id,
      },
    })
  );

  // Personas are now filtered by accountWorkspaceId in the query
  const userPersonas = allPersonas || [];

  const handleCreate = async (persona: any) => {
    await createPersona({
      persona,
      accountWorkspaceId: currentAccount._id,
    });
  };

  const handleEdit = async (personaId: any, persona: any) => {
    await updatePersona({
      personaId,
      personaUpdate: persona,
      accountWorkspaceId: currentAccount._id,
    });
  };

  const handleRemove = async (personaId: any) => {
    await removePersona({ personaId, accountWorkspaceId: currentAccount._id });
  };

  const getPersonaPreview = (persona: any) => {
    const parts = [];
    if (persona.age) parts.push(persona.age);
    if (persona.lifestyle) parts.push(persona.lifestyle);
    if (persona.knowledgeLevel) parts.push(`Wiedza: ${persona.knowledgeLevel}`);
    if (persona.motivations)
      parts.push(persona.motivations.substring(0, 40) + "...");

    if (parts.length === 0) {
      // Show challenges or goals if no main info
      if (persona.challenges && persona.challenges.length > 0) {
        return `Wyzwania: ${persona.challenges.slice(0, 2).join(", ")}${
          persona.challenges.length > 2 ? "..." : ""
        }`;
      }
      if (persona.goals && persona.goals.length > 0) {
        return `Cele: ${persona.goals.slice(0, 2).join(", ")}${
          persona.goals.length > 2 ? "..." : ""
        }`;
      }
    }

    return parts.join(" • ");
  };

  return (
    <div className="space-y-6">
      <StrategyNavigation />

      <StrategyEntityForm
        values={userPersonas}
        revalidate={() => revalidate("viewerTargets")}
        create={handleCreate}
        edit={handleEdit}
        remove={handleRemove}
        schema={object(personaSchema)}
        title="Grupy docelowe"
        description="Zdefiniuj szczegółowe persony Twoich odbiorców"
        emptyStateText="Dodaj swoją pierwszą personę odbiorcy"
        icon={<Users className="w-5 h-5" />}
        getEntityId={(persona) => persona._id || persona.personaId}
        getEntityDisplayName={(persona) => persona.name || "Nowa persona"}
        getEntityPreview={getPersonaPreview}
        render={(Fields) => (
          <div className="space-y-8">
            {/* Section 1: Podstawowe informacje */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Podstawowe informacje
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nazwa persony</Label>
                  <Fields.Name
                    translations={{
                      type: () => "To pole jest wymagane",
                      min: () => "Minimalna wartość to {{min}}",
                      max: () => "Maksymalna wartość to {{max}}",
                    }}
                    render={(field) => (
                      <Input
                        id="name"
                        placeholder="np. Marta Minimalistka"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="age">Wiek</Label>
                  <Fields.Age
                    translations={{
                      type: () => "To pole jest wymagane",
                      min: () => "Minimalna wartość to {{min}}",
                      max: () => "Maksymalna wartość to {{max}}",
                    }}
                    render={(field) => (
                      <Input
                        id="age"
                        placeholder="np. 28-35 lat"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lifestyle">
                  Styl życia, zawód lub kontekst życiowy
                </Label>
                <Fields.Lifestyle
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <Textarea
                      id="lifestyle"
                      placeholder="np. Pracuje w korporacji, samotna mama, mieszka w dużym mieście..."
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={3}
                    />
                  )}
                />
              </div>
            </div>

            {/* Section 2: Psychologia i motywacje */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Psychologia i motywacje
              </h3>

              <div>
                <Label htmlFor="motivations">Motywacje i potrzeby</Label>
                <Fields.Motivations
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <Textarea
                      id="motivations"
                      placeholder="np. Szuka sposobów na lepszą organizację czasu, chce rozwijać się zawodowo..."
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={3}
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="challenges">Wyzwania i problemy</Label>
                <Fields.Challenges
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <div className="space-y-2">
                      {(field.value || []).map(
                        (challenge: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={challenge}
                              onChange={(e) => {
                                const newChallenges = [...(field.value || [])];
                                newChallenges[index] = e.target.value;
                                field.onChange(newChallenges);
                              }}
                              placeholder={`Wyzwanie ${index + 1}...`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newChallenges = [...(field.value || [])];
                                newChallenges.splice(index, 1);
                                field.onChange(newChallenges);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange([...(field.value || []), ""]);
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        + Dodaj wyzwanie
                      </button>
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="values">Wartości i przekonania</Label>
                <Fields.Values
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <Textarea
                      id="values"
                      placeholder="np. Ceni autentyczność, ekologię, work-life balance..."
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={3}
                    />
                  )}
                />
              </div>
            </div>

            {/* Section 3: Zachowania online */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Zachowania online
              </h3>

              <div>
                <Label htmlFor="onlineBehavior">Zachowania online</Label>
                <Fields.OnlineBehavior
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <Textarea
                      id="onlineBehavior"
                      placeholder="np. Aktywna na LinkedIn, rzadko komentuje, przegląda treści wieczorem..."
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={3}
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="communicationStyle">
                  Język i sposób komunikacji
                </Label>
                <Fields.CommunicationStyle
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <Textarea
                      id="communicationStyle"
                      placeholder="np. Bezpośredni, merytoryczny, unika slangu..."
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={2}
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="preferredChannels">Preferowane kanały</Label>
                <Fields.PreferredChannels
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <div className="space-y-2">
                      {(field.value || []).map(
                        (channel: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={channel}
                              onChange={(e) => {
                                const newChannels = [...(field.value || [])];
                                newChannels[index] = e.target.value;
                                field.onChange(newChannels);
                              }}
                              placeholder={`Kanał ${index + 1}...`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newChannels = [...(field.value || [])];
                                newChannels.splice(index, 1);
                                field.onChange(newChannels);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange([...(field.value || []), ""]);
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        + Dodaj kanał
                      </button>
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="contentPreferences">Preferencje treści</Label>
                <Fields.ContentPreferences
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <Textarea
                      id="contentPreferences"
                      placeholder="np. Krótkie artykuły, infografiki, case studies..."
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={3}
                    />
                  )}
                />
              </div>
            </div>

            {/* Section 4: Dopasowanie do twórcy */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Dopasowanie do twórcy
              </h3>

              <div>
                <Label htmlFor="knowledgeLevel">Stopień wiedzy w temacie</Label>
                <Fields.KnowledgeLevel
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <Input
                      id="knowledgeLevel"
                      placeholder="np. Początkujący, średnio zaawansowany, ekspert"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="goals">Cele persony</Label>
                <Fields.Goals
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <div className="space-y-2">
                      {(field.value || []).map(
                        (goal: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={goal}
                              onChange={(e) => {
                                const newGoals = [...(field.value || [])];
                                newGoals[index] = e.target.value;
                                field.onChange(newGoals);
                              }}
                              placeholder={`Cel ${index + 1}...`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newGoals = [...(field.value || [])];
                                newGoals.splice(index, 1);
                                field.onChange(newGoals);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange([...(field.value || []), ""]);
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        + Dodaj cel
                      </button>
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="creatorAlignment">
                  Dopasowanie do celów twórcy
                </Label>
                <Fields.CreatorAlignment
                  translations={{
                    type: () => "To pole jest wymagane",
                    min: () => "Minimalna wartość to {{min}}",
                    max: () => "Maksymalna wartość to {{max}}",
                  }}
                  render={(field) => (
                    <Textarea
                      id="creatorAlignment"
                      placeholder="np. Idealny odbiorca dla moich treści o produktywności, może skorzystać z moich kursów..."
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={3}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};
