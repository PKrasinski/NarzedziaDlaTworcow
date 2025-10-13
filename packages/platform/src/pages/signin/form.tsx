"use client";

import { useCommands } from "@/arc-provider";
import { Form } from "@arcote.tech/arc-react";
import { LabeledInput } from "@narzedziadlatworcow.pl/ui/components/labeled-input";
import { LabeledPasswordInput } from "@narzedziadlatworcow.pl/ui/components/labeled-password-input";
import { useDesignSystem } from "design-system";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth-provider";

export default function SignInForm() {
  const { Button } = useDesignSystem();
  const { signInUser } = useCommands();
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  console.log(signInUser.params);

  return (
    <Form
      schema={signInUser.params}
      onSubmit={async (values) => {
        try {
          setIsLoading(true);
          setError("");

          const result = await signInUser(values);

          // Check if the result contains an error
          if ("error" in result) {
            // Handle the error case
            if (result.error === "INVALID_EMAIL_OR_PASSWORD") {
              setError(
                "Nieprawidłowy email lub hasło. Sprawdź dane i spróbuj ponownie."
              );
            } else if (result.error === "EMAIL_NOT_VERIFIED") {
              // Redirect to email verification page
              navigate(
                `/verify-email?email=${encodeURIComponent(
                  result.email || values.email
                )}`
              );
              return;
            } else {
              setError("Wystąpił błąd podczas logowania. Spróbuj ponownie.");
            }
            return;
          }

          // Success case - result has token
          setAccessToken(result.token);
          navigate("/");
        } catch (error: any) {
          console.error("Sign in failed:", error);
          setError(
            error.message ||
              "Nie udało się zalogować. Sprawdź dane i spróbuj ponownie."
          );
        } finally {
          setIsLoading(false);
        }
      }}
      render={(Fields) => (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1
              className="text-2xl md:text-3xl font-light text-gray-900"
              style={{ fontFamily: "Mitr, sans-serif" }}
            >
              Zaloguj się
            </h1>
            <p className="text-gray-600">
              Wprowadź swoje dane, aby uzyskać dostęp do konta
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            <Fields.Email
              translations="Email jest wymagany"
              render={(field: any) => (
                <LabeledInput
                  {...field}
                  label="Adres email"
                  type="email"
                  placeholder="twoj@email.com"
                  disabled={isLoading}
                />
              )}
            />

            <Fields.Password
              translations="Hasło jest wymagane"
              render={(field: any) => (
                <LabeledPasswordInput
                  {...field}
                  label="Hasło"
                  placeholder="Wprowadź hasło"
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </Button>

          {/* Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Nie masz jeszcze konta? <Link to="/start">Zarejestruj się</Link>
            </p>
          </div>
        </div>
      )}
    />
  );
}
