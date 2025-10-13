import { FormFieldData, useFormField } from "@arcote.tech/arc-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";
import { useDesignSystem } from "design-system";
import { cn } from "../lib/utils";
import { FormMessage } from "./form-message";
import { ContentEditable } from "./ui/content-editable";
import { Label } from "./ui/label";

const labeledRecordInputVariants = cva("", {
  variants: {
    size: {
      default: "",
      sm: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const labelVariants = cva("text-base font-medium ml-4", {
  variants: {
    size: {
      default: "text-base ml-4",
      sm: "text-sm ml-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type LabeledRecordInputSize = VariantProps<
  typeof labeledRecordInputVariants
>["size"];

export interface RecordItem {
  order: number;
  value: string;
}

export type RecordData = Record<string, RecordItem>;

export function LabeledRecordInput({
  label,
  asideLabel,
  placeholder,
  size = "default",
  rows = 1,
  addButtonText = "Dodaj",
  ...props
}: FormFieldData<any> & {
  label: string;
  asideLabel?: React.ReactNode;
  placeholder?: string;
  size?: LabeledRecordInputSize;
  rows?: number;
  addButtonText?: string;
}) {
  const { Button } = useDesignSystem();
  const { errors } = useFormField();
  const recordData: RecordData = props.value || {};
  
  // Convert record to sorted array for display
  const items = Object.entries(recordData)
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => a.order - b.order);

  const addItem = () => {
    const newId = `item_${Date.now()}`;
    const maxOrder = Math.max(...Object.values(recordData).map(item => item.order), -1);
    const newRecord = {
      ...recordData,
      [newId]: {
        order: maxOrder + 1,
        value: "",
      },
    };
    props.onChange?.(newRecord);
  };

  const updateItem = (id: string, value: string) => {
    const updatedRecord = {
      ...recordData,
      [id]: {
        ...recordData[id],
        value,
      },
    };
    props.onChange?.(updatedRecord);
  };

  const deleteItem = (id: string) => {
    const { [id]: deleted, ...rest } = recordData;
    props.onChange?.(rest);
  };

  const hasItems = items.length > 0;

  return (
    <div className={labeledRecordInputVariants({ size })}>
      <div className="flex items-center">
        <Label
          className={cn(labelVariants({ size }), errors && "text-red-600")}
        >
          {label}:
        </Label>
        {asideLabel && <div className="ml-auto mr-2">{asideLabel}</div>}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="bg-white/80 hover:bg-white border-gray-300 text-gray-700 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          {addButtonText}
        </Button>
      </div>
      
      {hasItems && (
        <div className="space-y-3 mt-2">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <ContentEditable
                value={item.value}
                onChange={(value) => updateItem(item.id, value)}
                placeholder={placeholder}
                rows={rows}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <FormMessage className="ml-4" />
    </div>
  );
}