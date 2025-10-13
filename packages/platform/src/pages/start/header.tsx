import { Logo } from "@narzedziadlatworcow.pl/ui/components/logo";
import { Link } from "react-router-dom";
import { useSteps } from "./steps-provider";

export function Header() {
  const { currentStep, numberOfSteps } = useSteps();
  return (
    <header className="p-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="text-sm text-gray-600">
          Krok {currentStep} z {numberOfSteps}
        </div>
      </div>
    </header>
  );
}
