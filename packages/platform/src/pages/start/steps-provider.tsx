import { createContext, useContext, useEffect, useState } from "react";

export type StepsContext = {
  currentStep: number;
  numberOfSteps: number;
  next: () => void;
  prev: () => void;
  isNext: () => boolean;
  isPrev: () => boolean;
  setCurrentStep: (step: number) => void;
};

export const StepsContext = createContext<null | StepsContext>(null);

export function StepsProvider(props: {
  children: React.ReactNode;
  numberOfSteps: number;
}) {
  const [currentStep, setCurrentStep] = useState(1);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const handleStepChange = (newStep: number) => {
    if (newStep >= 1 && newStep <= props.numberOfSteps) {
      setCurrentStep(newStep);
    }
  };

  return (
    <StepsContext.Provider
      value={{
        currentStep,
        numberOfSteps: props.numberOfSteps,
        next: () => {
          if (props.numberOfSteps > currentStep) {
            handleStepChange(currentStep + 1);
          }
        },
        prev: () => {
          if (currentStep > 1) {
            handleStepChange(currentStep - 1);
          }
        },
        isNext: () => props.numberOfSteps > currentStep,
        isPrev: () => currentStep > 1,
        setCurrentStep: handleStepChange,
      }}
    >
      {props.children}
    </StepsContext.Provider>
  );
}

export function useSteps() {
  const context = useContext(StepsContext);
  if (!context) throw new Error("useSteps must be used within a StepsProvider");
  return context;
}
