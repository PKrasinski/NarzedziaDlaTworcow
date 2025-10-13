import { Logo } from "@narzedziadlatworcow.pl/ui/components/logo";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="navbar-glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
          <Link to="/" className="transition-all-smooth">
            <Logo />
          </Link>
          <div className="text-sm">
            <Link to="/start">
              Nie masz konta?{" "}
              <span className="text-blue-600">Zarejestruj się</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
