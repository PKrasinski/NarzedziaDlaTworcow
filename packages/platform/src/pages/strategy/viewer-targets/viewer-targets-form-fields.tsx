import { object } from "@arcote.tech/arc";
import { FormFields } from "@arcote.tech/arc-react";
import { personaSchema } from "@narzedziadlatworcow.pl/context";
import {
  Heart,
  MessageCircle,
  Target,
  User,
  Users,
  Zap,
  Globe,
  BookOpen,
  Trophy,
  Lightbulb
} from "lucide-react";
import {
  LabeledList,
  LabeledText,
} from "../components";

const persona = object(personaSchema);
interface ViewerTargetsFormFieldsProps {
  Fields: FormFields<typeof persona>;
  data?: any;
  onRemove?: () => void;
}

export const ViewerTargetsFormFields = ({
  Fields,
  data,
  onRemove,
}: ViewerTargetsFormFieldsProps) => (
  <div className="space-y-4">
    {/* Name - Title for tool/summary views */}
    <Fields.Name
      translations="Nazwa persony jest wymagana"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="NAZWA PERSONY"
          placeholder="Wprowadź nazwę persony..."
        />
      )}
    />

    {/* Age */}
    <Fields.Age
      translations="Wiek jest wymagany"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="WIEK"
          placeholder="np. 28-35 lat"
        />
      )}
    />

    {/* Lifestyle */}
    <Fields.Lifestyle
      translations="Styl życia jest wymagany"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="STYL ŻYCIA, ZAWÓD LUB KONTEKST ŻYCIOWY"
          multiline
          placeholder="np. Pracuje w korporacji, samotna mama, mieszka w dużym mieście..."
        />
      )}
    />

    {/* Motivations */}
    <Fields.Motivations
      translations="Motywacje są wymagane"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="MOTYWACJE I POTRZEBY"
          multiline
          placeholder="np. Szuka sposobów na lepszą organizację czasu, chce rozwijać się zawodowo..."
        />
      )}
    />

    {/* Challenges */}
    <Fields.Challenges
      translations="Wyzwania są wymagane"
      render={(field: any) => (
        <LabeledList
          {...field}
          label="WYZWANIA I PROBLEMY"
          icon={<Target className="w-4 h-4" />}
          placeholder="Wprowadź wyzwanie..."
          addButtonText="Dodaj wyzwanie"
        />
      )}
    />

    {/* Values */}
    <Fields.Values
      translations="Wartości są wymagane"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="WARTOŚCI I PRZEKONANIA"
          multiline
          placeholder="np. Ceni autentyczność, ekologię, work-life balance..."
        />
      )}
    />

    {/* Online Behavior */}
    <Fields.OnlineBehavior
      translations="Zachowania online są wymagane"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="ZACHOWANIA ONLINE"
          multiline
          placeholder="np. Aktywna na LinkedIn, rzadko komentuje, przegląda treści wieczorem..."
        />
      )}
    />

    {/* Communication Style */}
    <Fields.CommunicationStyle
      translations="Sposób komunikacji jest wymagany"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="JĘZYK I SPOSÓB KOMUNIKACJI"
          multiline
          placeholder="np. Bezpośredni, merytoryczny, unika slangu..."
        />
      )}
    />

    {/* Preferred Channels */}
    <Fields.PreferredChannels
      translations="Preferowane kanały są wymagane"
      render={(field: any) => (
        <LabeledList
          {...field}
          label="PREFEROWANE KANAŁY"
          icon={<Globe className="w-4 h-4" />}
          placeholder="Wprowadź kanał..."
          addButtonText="Dodaj kanał"
        />
      )}
    />

    {/* Content Preferences */}
    <Fields.ContentPreferences
      translations="Preferencje treści są wymagane"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="PREFERENCJE TREŚCI"
          multiline
          placeholder="np. Krótkie artykuły, infografiki, case studies..."
        />
      )}
    />

    {/* Knowledge Level */}
    <Fields.KnowledgeLevel
      translations="Stopień wiedzy jest wymagany"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="STOPIEŃ WIEDZY W TEMACIE"
          placeholder="np. Początkujący, średnio zaawansowany, ekspert"
        />
      )}
    />

    {/* Goals */}
    <Fields.Goals
      translations="Cele persony są wymagane"
      render={(field: any) => (
        <LabeledList
          {...field}
          label="CELE PERSONY"
          icon={<Trophy className="w-4 h-4" />}
          placeholder="Wprowadź cel..."
          addButtonText="Dodaj cel"
        />
      )}
    />

    {/* Creator Alignment */}
    <Fields.CreatorAlignment
      translations="Dopasowanie do twórcy jest wymagane"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="DOPASOWANIE DO CELÓW TWÓRCY"
          multiline
          placeholder="np. Idealny odbiorca dla moich treści o produktywności, może skorzystać z moich kursów..."
        />
      )}
    />
  </div>
);