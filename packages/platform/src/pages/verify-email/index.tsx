"use client";

import { useCommands } from "@/arc-provider";
import { useAuth } from "@/auth-provider";
import { Form } from "@arcote.tech/arc-react";
import { LabeledInput } from "@narzedziadlatworcow.pl/ui/components/labeled-input";
import { Logo } from "@narzedziadlatworcow.pl/ui/components/logo";
import { useDesignSystem } from "design-system";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { Mail, RefreshCw } from "lucide-react";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyEmailPage() {
  const { Button } = useDesignSystem();
  const { verifyUserOtp, resendUserOtp } = useCommands();
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [error, setError] = React.useState<string | null>(null);
  const [isResending, setIsResending] = React.useState(false);
  const [resendMessage, setResendMessage] = React.useState<string | null>(null);

  const handleResendOtp = async () => {
    if (!email) return;

    setIsResending(true);
    setResendMessage(null);
    setError(null);

    try {
      const result = await resendUserOtp({ email });

      if ("error" in result) {
        if (result.error === "ALREADY_VERIFIED") {
          setError("Email został już zweryfikowany. Możesz się zalogować.");
        } else if (result.error === "ACCOUNT_NOT_FOUND") {
          setError("Nie znaleziono użytkownika z tym adresem email.");
        } else if (result.error === "OTP_CODE_RESENT_TOO_SOON") {
          setError(
            "Kod weryfikacyjny można wysyłać co 3 minuty. Spróbuj ponownie za chwilę."
          );
        } else {
          setError("Wystąpił błąd podczas wysyłania kodu. Spróbuj ponownie.");
        }
      } else {
        setResendMessage(
          "Kod weryfikacyjny został wysłany ponownie na Twój email!"
        );
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Wystąpił błąd podczas wysyłania kodu. Spróbuj ponownie.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-landing">
        <div className="py-8 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">
                  Brak adresu email. Wróć do rejestracji.
                </p>
                <Button asChild>
                  <Link to="/start">Wróć do rejestracji</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-landing">
      <div className="py-8 flex justify-center">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle
              className="text-2xl font-light"
              style={{ fontFamily: "Mitr, sans-serif" }}
            >
              Potwierdź swój email
            </CardTitle>
            <CardDescription>
              Wysłaliśmy 6-cyfrowy kod weryfikacyjny na adres{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              schema={verifyUserOtp.params}
              defaults={{
                email,
              }}
              onSubmit={async (values) => {
                try {
                  setError(null);

                  const result = await verifyUserOtp({
                    email,
                    otpCode: values.otpCode,
                  });

                  if ("error" in result) {
                    if (result.error === "INVALID_OTP") {
                      setError(
                        "Nieprawidłowy kod weryfikacyjny. Sprawdź i spróbuj ponownie."
                      );
                    } else if (result.error === "OTP_EXPIRED") {
                      setError("Kod weryfikacyjny wygasł. Poproś o nowy kod.");
                    } else if (result.error === "ACCOUNT_NOT_FOUND") {
                      setError(
                        "Nie znaleziono użytkownika. Spróbuj się zarejestrować ponownie."
                      );
                    } else {
                      setError(
                        "Wystąpił błąd podczas weryfikacji. Spróbuj ponownie."
                      );
                    }
                    return;
                  }

                  // Verification successful
                  if (result.token) {
                    setAccessToken(result.token);
                    navigate("/");
                  }
                } catch (error) {
                  console.error("Verification failed:", error);
                  setError(
                    "Wystąpił błąd podczas weryfikacji. Spróbuj ponownie."
                  );
                }
              }}
              render={(Fields) => (
                <div className="space-y-6">
                  <Fields.OtpCode
                    translations="Kod weryfikacyjny jest wymagany"
                    render={(field) => (
                      <LabeledInput
                        {...field}
                        label="Kod weryfikacyjny"
                        placeholder="123456"
                        type="text"
                        className="text-center text-2xl tracking-widest"
                        maxLength={6}
                        autoComplete="one-time-code"
                      />
                    )}
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {resendMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <p className="text-sm text-green-600">{resendMessage}</p>
                    </div>
                  )}

                  <Button type="submit" variant="primary" className="w-full">
                    Zweryfikuj email
                  </Button>

                  <div className="text-center space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Nie otrzymałeś kodu?
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="text-sm"
                      >
                        {isResending ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Wysyłanie...
                          </>
                        ) : (
                          "Wyślij kod ponownie"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
