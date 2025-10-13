import { useQuery } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { object } from "@arcote.tech/arc";
import { type FormFields } from "@arcote.tech/arc-react";
import { contentSchema } from "@narzedziadlatworcow.pl/context";
import { Layout } from "lucide-react";
import { LabeledSelect, LabeledText } from "../strategy/components";
import { useEditMode } from "../strategy/components/entity-form-view";
import { contentTypeFieldsMap } from "./components/content-types-fields";

const content = object(contentSchema);

interface ContentFormFieldsProps {
  Fields: FormFields<typeof content>;
  data?: any;
  onRemove?: () => void;
  contentId?: string;
}

export const ContentFormFields = ({
  Fields,
  data,
  onRemove,
  contentId,
}: ContentFormFieldsProps) => {
  const { currentAccount } = useAccountWorkspaces();

  const [formats] = useQuery((q) =>
    q.contentFormats.find({
      where: {
        accountWorkspaceId: currentAccount._id,
      },
    })
  );

  const userFormats = formats || [];

  const formatOptions = userFormats.map((format) => ({
    value: format._id,
    label: format.name || "Bez nazwy",
    icon: <Layout className="w-4 h-4" />,
  }));

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const ContentFields = Object.entries(contentTypeFieldsMap).map(
    ([key, Component]) => {
      const FieldComponent = Fields[
        capitalize(key) as keyof typeof Fields
      ] as any;
      return (
        <FieldComponent
          translations=""
          render={(data: any) => {
            const { hasValue } = useEditMode();
            if (!hasValue(data.name)) return null;
            return <Component Fields={data.subFields} />;
          }}
        />
      );
    }
  );

  return (
    <div className="space-y-4">
      {/* Title */}
      <Fields.Title
        translations="Tytuł treści jest wymagany"
        render={(field: any) => (
          <LabeledText
            {...field}
            label="TYTUŁ TREŚCI"
            placeholder="Wprowadź tytuł treści..."
          />
        )}
      />

      {/* Description */}
      <Fields.Description
        translations="Opis treści jest wymagany"
        render={(field: any) => (
          <LabeledText
            {...field}
            label="OPIS TREŚCI"
            placeholder="Opisz treść..."
            multiline
            rows={3}
          />
        )}
      />

      {/* Format Selection */}
      <Fields.FormatId
        translations="Format treści jest wymagany"
        render={(field: any) => (
          <LabeledSelect
            {...field}
            label="FORMAT TREŚCI"
            options={formatOptions}
            placeholder="Wybierz format treści..."
            emptyMessage={
              userFormats.length === 0
                ? "Najpierw dodaj formaty treści."
                : undefined
            }
          />
        )}
      />

      {ContentFields}
    </div>
  );
};
