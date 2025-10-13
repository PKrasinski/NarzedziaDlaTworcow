import { useCustomToast } from "@/hooks/use-toast-custom";
import { useContent } from "@/providers/content-provider";
import { Lightbulb, Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

export function IdeasPage() {
  const { contentFormats } = useContent();
  const { showDevelopmentToast } = useCustomToast();

  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [ideaCount, setIdeaCount] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleFormatToggle = (formatId: string) => {
    setSelectedFormats((prev) =>
      prev.includes(formatId)
        ? prev.filter((id) => id !== formatId)
        : [...prev, formatId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      showDevelopmentToast();
      setIsSubmitting(false);
    }, 1000);
  };

  const getUserInput = () => {
    return contentEditableRef.current?.textContent || "";
  };

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
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Generuj Pomysły na Treści
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Pozwól AI wygenerować kreatywne pomysły na treści dostosowane do
              Twoich formatów i tematyki
            </p>
          </div>

          {/* Main Form */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 border border-white/20 rounded-3xl p-8 shadow-xl">
            {/* Number of Ideas Selector */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Sparkles className="w-5 h-5 inline mr-2" />
                Ile pomysłów chcesz wygenerować?
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => setIdeaCount(count)}
                    className={`p-4 rounded-xl font-semibold transition-all duration-200 ${
                      ideaCount === count
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                        : "bg-white/50 hover:bg-white/70 text-gray-700 hover:shadow-md"
                    }`}
                  >
                    {count} pomysłów
                  </button>
                ))}
              </div>
            </div>

            {/* Content Formats Checklist */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Wybierz formaty treści:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentFormats.map((format) => {
                  const IconComponent = (format as any)?.icon || Sparkles;
                  const isSelected = selectedFormats.includes(
                    (format as any)._id
                  );

                  return (
                    <div
                      key={(format as any)._id}
                      onClick={() => handleFormatToggle((format as any)._id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 shadow-lg scale-102"
                          : "border-gray-200 bg-white/50 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${
                            (format as any)?.color ||
                            "from-gray-500 to-gray-600"
                          } rounded-lg flex items-center justify-center shadow-sm`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {format.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {format.subtitle}
                          </p>
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
                Dodatkowy komentarz:
              </label>
              <div
                ref={contentEditableRef}
                contentEditable
                className="min-h-[120px] p-4 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 content-editable-placeholder"
                suppressContentEditableWarning={true}
                style={{ whiteSpace: "pre-wrap" }}
                data-placeholder="Dodaj dodatkowe informacje do generowania pomysłów"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  selectedFormats.length === 0 ||
                  !getUserInput().trim()
                }
                className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                  isSubmitting ||
                  selectedFormats.length === 0 ||
                  !getUserInput().trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full"></div>
                    Generuję pomysły...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Wygeneruj {ideaCount} pomysłów
                  </>
                )}
              </button>

              {(selectedFormats.length === 0 || !getUserInput().trim()) && (
                <p className="text-sm text-gray-500 mt-3">
                  {selectedFormats.length === 0
                    ? "Wybierz przynajmniej jeden format treści"
                    : "Opisz tematykę swoich treści"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
