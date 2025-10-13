import { useDesignSystem } from "design-system";
import { Input } from "@narzedziadlatworcow.pl/ui/components/ui/input";
import { Label } from "@narzedziadlatworcow.pl/ui/components/ui/label";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface LabeledArrayInputProps {
  label: string;
  placeholder: string;
  addButtonText: string;
  value: string[];
  onChange: (value: string[]) => void;
  name?: string;
}

export function LabeledArrayInput({
  label,
  placeholder,
  addButtonText,
  value = [],
  onChange,
  name,
}: LabeledArrayInputProps) {
  const { Button } = useDesignSystem();
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...value, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number, newValue: string) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      
      {/* Existing items list */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => handleEdit(index, e.target.value)}
                className="flex-1"
                name={name ? `${name}-${index}` : undefined}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemove(index)}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add new item */}
      <div className="flex items-center gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          {addButtonText}
        </Button>
      </div>
    </div>
  );
}