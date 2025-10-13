import { useDesignSystem } from "design-system";
import { Input } from "@narzedziadlatworcow.pl/ui/components/ui/input";
import { Label } from "@narzedziadlatworcow.pl/ui/components/ui/label";
import { Textarea } from "@narzedziadlatworcow.pl/ui/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { Plus, X, Users, User, MapPin, Heart, AlertCircle, Target, Smartphone, FileText } from "lucide-react";
import { LabeledArrayInput } from "./labeled-array-input";

interface Persona {
  name?: string;
  role?: string;
  age?: string;
  demographics?: string;
  psychographics?: string;
  painPoints?: string[];
  goals?: string[];
  preferredChannels?: string[];
  contentPreferences?: string;
}

interface LabeledPersonaInputProps {
  label: string;
  value: Persona[];
  onChange: (value: Persona[]) => void;
  name?: string;
}

export function LabeledPersonaInput({
  label,
  value = [],
  onChange,
  name,
}: LabeledPersonaInputProps) {
  const { Button } = useDesignSystem();
  const handleAddPersona = () => {
    onChange([
      ...value,
      {
        name: "",
        role: "",
        age: "",
        demographics: "",
        psychographics: "",
        painPoints: [],
        goals: [],
        preferredChannels: [],
        contentPreferences: "",
      },
    ]);
  };

  const handleRemovePersona = (index: number) => {
    const newPersonas = value.filter((_, i) => i !== index);
    onChange(newPersonas);
  };

  const handlePersonaChange = (index: number, field: keyof Persona, fieldValue: any) => {
    const newPersonas = [...value];
    newPersonas[index] = {
      ...newPersonas[index],
      [field]: fieldValue,
    };
    onChange(newPersonas);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium text-gray-900">{label}</Label>
        <Button
          type="button"
          onClick={handleAddPersona}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Dodaj persona
        </Button>
      </div>

      {value.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">
            Nie dodano jeszcze żadnych person. Kliknij przycisk powyżej, aby rozpocząć.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {value.map((persona, index) => (
          <Card key={index} className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Persona {index + 1}
                </CardTitle>
                <Button
                  type="button"
                  onClick={() => handleRemovePersona(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Imię
                  </Label>
                  <Input
                    value={persona.name || ""}
                    onChange={(e) => handlePersonaChange(index, "name", e.target.value)}
                    placeholder="np. Anna"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Rola/Pozycja
                  </Label>
                  <Input
                    value={persona.role || ""}
                    onChange={(e) => handlePersonaChange(index, "role", e.target.value)}
                    placeholder="np. Młoda mama, Freelancer"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Wiek
                  </Label>
                  <Input
                    value={persona.age || ""}
                    onChange={(e) => handlePersonaChange(index, "age", e.target.value)}
                    placeholder="np. 25-35 lat"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Demographics */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Demografia
                </Label>
                <Textarea
                  value={persona.demographics || ""}
                  onChange={(e) => handlePersonaChange(index, "demographics", e.target.value)}
                  placeholder="Lokalizacja, dochody, wykształcenie, status rodzinny..."
                  className="w-full resize-none"
                  rows={2}
                />
              </div>

              {/* Psychographics */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  Psychografia
                </Label>
                <Textarea
                  value={persona.psychographics || ""}
                  onChange={(e) => handlePersonaChange(index, "psychographics", e.target.value)}
                  placeholder="Osobowość, wartości, zainteresowania, styl życia..."
                  className="w-full resize-none"
                  rows={2}
                />
              </div>

              {/* Pain Points */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  Problemy i wyzwania
                </Label>
                <LabeledArrayInput
                  label=""
                  value={persona.painPoints || []}
                  onChange={(newPainPoints) => handlePersonaChange(index, "painPoints", newPainPoints)}
                  placeholder="Opisz główny problem..."
                  addButtonText="Dodaj problem"
                />
              </div>

              {/* Goals */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  Cele i aspiracje
                </Label>
                <LabeledArrayInput
                  label=""
                  value={persona.goals || []}
                  onChange={(newGoals) => handlePersonaChange(index, "goals", newGoals)}
                  placeholder="Opisz cel tej osoby..."
                  addButtonText="Dodaj cel"
                />
              </div>

              {/* Preferred Channels */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  Preferowane kanały
                </Label>
                <LabeledArrayInput
                  label=""
                  value={persona.preferredChannels || []}
                  onChange={(newChannels) => handlePersonaChange(index, "preferredChannels", newChannels)}
                  placeholder="np. Instagram, YouTube, LinkedIn..."
                  addButtonText="Dodaj kanał"
                />
              </div>

              {/* Content Preferences */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Preferencje treści
                </Label>
                <Textarea
                  value={persona.contentPreferences || ""}
                  onChange={(e) => handlePersonaChange(index, "contentPreferences", e.target.value)}
                  placeholder="Jakiego typu treści preferuje? Jaki format, styl, tematy?"
                  className="w-full resize-none"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <input type="hidden" name={name} value={JSON.stringify(value)} />
    </div>
  );
}