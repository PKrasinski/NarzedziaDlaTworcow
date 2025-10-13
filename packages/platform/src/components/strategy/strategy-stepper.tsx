import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface StepperProps {
  currentStep: number;
  steps: Array<{
    title: string;
    description: string;
  }>;
}

export function StrategyStepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
        <span>Kurs strategii treści</span>
        <span>
          Krok {currentStep} z {steps.length}
        </span>
      </div>
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted">
          <div
            className="absolute h-0.5 bg-primary transition-all duration-300 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index + 1 < currentStep;
            const isCurrent = index + 1 === currentStep;

            return (
              <div
                key={step.title}
                className={cn(
                  "flex flex-col items-center space-y-2",
                  isCompleted && "text-primary",
                  isCurrent && "text-primary",
                  !isCompleted && !isCurrent && "text-muted-foreground"
                )}
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background">
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </div>
                <div className="absolute top-14 w-32 text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
