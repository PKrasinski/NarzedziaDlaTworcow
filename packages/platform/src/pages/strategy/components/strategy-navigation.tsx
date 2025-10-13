import { useDesignSystem } from "design-system";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const STRATEGY_STEPS = [
  { path: "/strategy/creator-identity", title: "Tożsamość twórcy" },
  { path: "/strategy/content-purpose", title: "Cel tworzenia" },
  { path: "/strategy/define-audience", title: "Grupa docelowa" },
  { path: "/strategy/audience-needs", title: "Potrzeby grupy docelowej" },
  { path: "/strategy/communication-style", title: "Styl komunikacji" },
  { path: "/strategy/content-formats", title: "Formaty treści" },
  { path: "/strategy/content-ideas", title: "Pomysły na treści" },
];

export function StrategyNavigation() {
  const { Button } = useDesignSystem();
  const navigate = useNavigate();
  const location = useLocation();

  const currentStepIndex = STRATEGY_STEPS.findIndex(
    (step) => step.path === location.pathname
  );
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STRATEGY_STEPS.length - 1;

  const previousStep = isFirstStep
    ? null
    : STRATEGY_STEPS[currentStepIndex - 1];
  const nextStep = isLastStep ? null : STRATEGY_STEPS[currentStepIndex + 1];

  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={() =>
          isFirstStep ? navigate("/strategy") : navigate(previousStep!.path)
        }
        className="bg-white hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Wstecz
      </Button>
      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isLastStep ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Zakończ strategię
          </>
        ) : (
          <>
            Dalej: {nextStep?.title}
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </>
        )}
      </Button>
    </div>
  );
}
