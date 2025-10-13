interface StepperProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export function Stepper({ currentStep, totalSteps, title }: StepperProps) {
  return (
    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
      {title} {currentStep} z {totalSteps}
    </div>
  );
}
