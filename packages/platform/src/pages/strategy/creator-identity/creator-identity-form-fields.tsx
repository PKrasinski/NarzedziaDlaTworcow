import { FormFields } from "@arcote.tech/arc-react";
import { identitySchema } from "@narzedziadlatworcow.pl/context/browser";
import {
  Building2,
  Package,
  Radio,
  Star,
  User,
  Users,
  Zap,
} from "lucide-react";
import {
  LabeledList,
  LabeledSelect,
  LabeledText,
} from "../components";

// Helper function to get entity type info
const getEntityTypeInfo = (entityType: string) => {
  switch (entityType) {
    case "individual":
      return { icon: <User className="w-4 h-4" />, label: "Osoba" };
    case "team":
      return { icon: <Users className="w-4 h-4" />, label: "Zespół" };
    case "brand":
      return { icon: <Zap className="w-4 h-4" />, label: "Marka" };
    case "project":
      return { icon: <Package className="w-4 h-4" />, label: "Projekt" };
    default:
      return {
        icon: <User className="w-4 h-4" />,
        label: "Wybierz rodzaj twórcy",
      };
  }
};

// Helper function to get stage options
const getStageOptions = () => [
  {
    value: "aspiring",
    label: "Aspirujący",
    icon: <Star className="w-4 h-4" />,
  },
  {
    value: "growing",
    label: "Rozwijający się",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    value: "established",
    label: "Ugruntowany",
    icon: <Building2 className="w-4 h-4" />,
  },
];

// Helper function to get entity type options
const getEntityTypeOptions = () => [
  { value: "individual", label: "Osoba", icon: <User className="w-4 h-4" /> },
  { value: "team", label: "Zespół", icon: <Users className="w-4 h-4" /> },
  { value: "brand", label: "Marka", icon: <Zap className="w-4 h-4" /> },
  { value: "project", label: "Projekt", icon: <Package className="w-4 h-4" /> },
];

interface CreatorIdentityFormFieldsProps {
  Fields: FormFields<typeof identitySchema>;
  data?: any;
}

export const CreatorIdentityFormFields = ({
  Fields,
  data,
}: CreatorIdentityFormFieldsProps) => (
  <div className="space-y-4">
    {/* Name - Title for tool/summary views */}
    <Fields.Name
      translations="Nazwa jest wymagana"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="NAZWA"
          placeholder="Wprowadź nazwę twórcy/marki..."
        />
      )}
    />

    <Fields.EntityType
      translations="Rodzaj twórcy jest wymagany"
      render={(field) => (
        <LabeledSelect
          {...field}
          label="RODZAJ TWÓRCY"
          options={getEntityTypeOptions()}
          placeholder="Wybierz rodzaj twórcy..."
        />
      )}
    />

    <Fields.Stage
      translations="Etap rozwoju jest wymagany"
      render={(field: any) => (
        <LabeledSelect
          {...field}
          label="ETAP ROZWOJU"
          options={getStageOptions()}
          placeholder="Wybierz etap rozwoju..."
        />
      )}
    />

    {/* Description */}
    <Fields.Description
      translations="Opis jest wymagany"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="OPIS"
          multiline
          placeholder="Opisz swoją tożsamość jako twórca..."
        />
      )}
    />

    {/* Origin Story */}
    <Fields.OriginStory
      translations="Historia początków jest wymagana"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="HISTORIA POCZĄTKÓW"
          multiline
          placeholder="Opisz jak zaczynałeś swoją działalność..."
        />
      )}
    />

    {/* Current Structure */}
    <Fields.CurrentStructure
      translations="Obecna struktura jest wymagana"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="OBECNA STRUKTURA"
          multiline
          placeholder="Opisz obecną strukturę swojej działalności..."
        />
      )}
    />

    {/* Current Activities */}
    <Fields.CurrentActivities
      translations="Obecne działania są wymagane"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="OBECNE DZIAŁANIA"
          multiline
          placeholder="Opisz swoje obecne działania..."
        />
      )}
    />

    {/* Future Vision */}
    <Fields.FutureVision
      translations="Wizja przyszłości jest wymagana"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="WIZJA PRZYSZŁOŚCI"
          multiline
          placeholder="Opisz swoją wizję przyszłości..."
        />
      )}
    />

    {/* Image of Creator */}
    <Fields.ImageOfCreator
      translations="Wizerunek twórcy jest wymagany"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="WIZERUNEK TWÓRCY"
          multiline
          placeholder="Opisz swój wizerunek jako twórca..."
        />
      )}
    />

    {/* Unique Strengths */}
    <Fields.UniqueStrengths
      translations="Mocne strony są wymagane"
      render={(field: any) => (
        <LabeledList
          {...field}
          label="MOCNE STRONY"
          icon={<Star className="w-4 h-4" />}
          placeholder="Wprowadź mocną stronę..."
          addButtonText="Dodaj mocną stronę"
        />
      )}
    />

    {/* Products or Services */}
    <Fields.ProductsOrServices
      translations="Produkty/usługi są wymagane"
      render={(field: any) => (
        <LabeledList
          {...field}
          label="PRODUKTY/USŁUGI"
          icon={<Package className="w-4 h-4" />}
          placeholder="Wprowadź produkt/usługę..."
          addButtonText="Dodaj produkt/usługę"
        />
      )}
    />

    {/* Channels Already Used */}
    <Fields.ChannelsAlreadyUsed
      translations="Kanały są wymagane"
      render={(field: any) => (
        <LabeledList
          {...field}
          label="KANAŁY"
          icon={<Radio className="w-4 h-4" />}
          placeholder="Wprowadź kanał..."
          addButtonText="Dodaj kanał"
        />
      )}
    />
  </div>
);
