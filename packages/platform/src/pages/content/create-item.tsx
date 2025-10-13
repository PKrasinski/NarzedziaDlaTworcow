import { useCustomToast } from "@/hooks/use-toast-custom";
import { useContent } from "@/providers/content-provider";
import { Plus, Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function CreateItemPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const { contentTypes, getContentWithFormat } = useContent();
  const { showDevelopmentToast } = useCustomToast();
  const navigate = useNavigate();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      showDevelopmentToast();
      setIsSubmitting(false);
      // Navigate back to content detail after successful creation
      navigate(`/content/${contentId}`);
    }, 1500);
  };

  const getUserInput = () => {
    return contentEditableRef.current?.textContent || "";
  };

  if (!contentId) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">Nieprawidłowy identyfikator treści</p>
      </div>
    );
  }

  const contentData = getContentWithFormat(contentId);
  if (!contentData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">Treść nie została znaleziona</p>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .content-editable-placeholder:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF;
            pointer-events: none;
          }
        `}
      </style>
      <div className="h-full p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Plus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Stwórz Nowe Elementy Treści
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Wybierz typy treści które chcesz wygenerować dla:{" "}
              <strong>{contentData.content.title}</strong>
            </p>
          </div>

          {/* Main Form */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 border border-white/20 rounded-3xl p-8 shadow-xl">
            {/* Content Types Checklist */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Sparkles className="w-5 h-5 inline mr-2" />
                Wybierz typy treści do wygenerowania:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedTypes.includes(type._id);

                  return (
                    <div
                      key={type._id}
                      onClick={() => handleTypeToggle(type._id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 shadow-lg scale-102"
                          : "border-gray-200 bg-white/50 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center shadow-sm`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {type.name}
                          </h3>
                        </div>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Dodatkowy komentarz do generowania:
              </label>
              <div
                ref={contentEditableRef}
                contentEditable
                className="min-h-[120px] p-4 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 content-editable-placeholder"
                suppressContentEditableWarning={true}
                style={{ whiteSpace: "pre-wrap" }}
                data-placeholder="Opisz dodatkowe wymagania lub preferencje dla generowanych elementów treści..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Przykład: "Stwórz treści w przyjaznym tonie, skierowane do osób
                początkujących. Dodaj praktyczne przykłady i wskazówki."
              </p>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  selectedTypes.length === 0 ||
                  !getUserInput().trim()
                }
                className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                  isSubmitting ||
                  selectedTypes.length === 0 ||
                  !getUserInput().trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full"></div>
                    Generuję elementy treści...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Wygeneruj elementy treści
                  </>
                )}
              </button>

              {(selectedTypes.length === 0 || !getUserInput().trim()) && (
                <p className="text-sm text-gray-500 mt-3">
                  {selectedTypes.length === 0
                    ? "Wybierz przynajmniej jeden typ treści"
                    : "Dodaj komentarz opisujący wymagania"}
                </p>
              )}
            </div>

            {/* Back Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate(`/content/${contentId}`)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                ← Anuluj i wróć do treści
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
