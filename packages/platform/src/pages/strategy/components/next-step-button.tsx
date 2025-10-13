import { useDesignSystem } from "design-system";
import { ChevronRight, Sparkles } from "lucide-react";

interface NextStepButtonProps {
  onNext: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  completionText?: string;
  loadingText?: string;
  buttonText?: string;
  className?: string;
}

export const NextStepButton = ({
  onNext,
  isLoading = false,
  disabled = false,
  completionText,
  loadingText = "Przechodzę...",
  buttonText = "Następny krok",
  className = "",
}: NextStepButtonProps) => {
  const { Button } = useDesignSystem();

  return (
    <Button
      onClick={onNext}
      disabled={isLoading || disabled}
      variant="continue"
      size="sm"
      radius="lg"
      shadow="lg"
      animation="scale"
      className={className}
    >
      <div className="flex items-center space-x-2">
        {isLoading ? (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Sparkles className="w-4 h-4 animate-pulse" />
        )}
        <span className="hidden sm:inline">
          {isLoading ? loadingText : buttonText}
        </span>
        <span className="sm:hidden">{isLoading ? "..." : "Dalej"}</span>
        {completionText && (
          <div className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-medium">
            {completionText}
          </div>
        )}
        {!isLoading && (
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        )}
      </div>
    </Button>
  );
};
