import { CheckCircle, Target } from "lucide-react";
import { LabeledList } from "../components/labeled-list";
import { LabeledText } from "../components/labeled-text";

export const GoalFormFields = ({ Fields, onRemove }: { Fields: any; onRemove?: () => void }) => (
  <div className="space-y-4">
    {/* Goal Title and Objective */}
    <Fields.Objective
      translations="Opis celu jest wymagany"
      render={(field: any) => (
        <LabeledText
          {...field}
          label="CEL"
          placeholder="Wprowadź opis celu..."
        />
      )}
    />

    {/* Key Results */}
    <Fields.KeyResults
      translations="Kluczowe rezultaty są wymagane"
      render={(field: any) => (
        <LabeledList
          {...field}
          label="KLUCZOWE REZULTATY"
          icon={<CheckCircle className="w-4 h-4" />}
          placeholder="Wprowadź kluczowy rezultat..."
          addButtonText="Dodaj rezultat"
        />
      )}
    />
  </div>
);
