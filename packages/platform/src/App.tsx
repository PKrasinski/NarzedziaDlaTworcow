import { Toaster } from "@narzedziadlatworcow.pl/ui/components/ui/sonner";
import "@narzedziadlatworcow.pl/ui/styles/globals.css";
import "design-system/globals.css";
import { useRoutes } from "react-router-dom";
import { ModelProvider } from "./arc-provider";
import { AuthProvider, useAuth } from "./auth-provider";
import { routes } from "./routes";

function AppContent() {
  const element = useRoutes(routes);
  const { token } = useAuth();

  return (
    <ModelProvider
      client="http://localhost:3000"
      token={token || ""}
      catchErrorCallback={() => {}}
    >
      {element}
      <Toaster />
    </ModelProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
