import { Logo } from "@narzedziadlatworcow.pl/ui/components/logo";
import { Link } from "react-router-dom";
import SimpleRegisterForm from "./simple-form";
import { StepsProvider } from "./steps-provider";

export default function StartPage() {
  return (
    <div className="min-h-screen bg-gradient-landing relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="blob blob-blue" />
      <div className="blob blob-pink" />
      <div className="blob blob-yellow" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Modern Header */}
        <div className="lg:pt-2">
          <header className="navbar-glass">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between h-auto lg:h-16 py-4 lg:py-0 gap-4 lg:gap-0">
                <div className="flex justify-center lg:justify-start">
                  <Link to="/" className="transition-all-smooth">
                    <Logo />
                  </Link>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="text-sm text-gray-600">
                    Masz już konto?{" "}
                    <Link to="/sign-in" className="text-blue-600">
                      Zaloguj się
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-3 sm:px-6 py-4 lg:py-12">
          <StepsProvider numberOfSteps={2}>
            <div className="max-w-4xl mx-auto">
              <div className="card-modern px-4 sm:px-8 md:px-12 py-12">
                <SimpleRegisterForm />
              </div>
            </div>
          </StepsProvider>
        </main>
      </div>
    </div>
  );
}
