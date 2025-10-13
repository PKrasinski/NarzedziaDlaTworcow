import { useFormPart } from "@arcote.tech/arc-react";
import { useDesignSystem } from "design-system";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSteps } from "./steps-provider";

export function Navigation() {
  const { Button } = useDesignSystem();
  const { next, prev, isNext, isPrev } = useSteps();
  const { validatePart } = useFormPart();
  return (
    <div className="flex justify-between lg:pt-8">
      {isPrev() ? (
        <Button type="button" variant="outline" onClick={prev}>
          <ArrowLeft className="w-4 h-4" />
          Wstecz
        </Button>
      ) : (
        <div></div>
      )}

      {isNext() ? (
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            const hasErrors = validatePart();
            if (!hasErrors) next();
          }}
        >
          Dalej
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : null}
    </div>
  );
}

export function LastStepNavigation() {
  const { Button } = useDesignSystem();
  const { prev } = useSteps();
  return (
    <div className="flex flex-col justify-between pt-8 sm:flex-row-reverse gap-4">
      <Button type="submit" variant="success">
        Rozpocznij tworzenie
      </Button>
      <Button type="button" variant="outline" onClick={prev}>
        <ArrowLeft className="w-4 h-4" />
        Wstecz
      </Button>
    </div>
  );
}
