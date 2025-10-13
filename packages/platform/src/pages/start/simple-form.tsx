"use client";

import { useCommands } from "@/arc-provider";
import { Form, FormPart } from "@arcote.tech/arc-react";
import { FormMessage } from "@narzedziadlatworcow.pl/ui/components/form-message";
import { LabeledInput } from "@narzedziadlatworcow.pl/ui/components/labeled-input";
import { LabeledPasswordInput } from "@narzedziadlatworcow.pl/ui/components/labeled-password-input";
import { Checkbox } from "@narzedziadlatworcow.pl/ui/components/ui/checkbox";
import { Label } from "@narzedziadlatworcow.pl/ui/components/ui/label";
import { useDesignSystem } from "design-system";
import {
  ArrowLeft,
  Building2,
  Loader2,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "./navigation";
import { useSteps } from "./steps-provider";
import { UserTypeCard } from "./user-type-card";

const personaTypes = [
  {
    id: "creator",
    title: "Jestem twórcą / influencerem",
    description: "Tworzę content dla swoich obserwujących",
    icon: Users,
    color: "blue",
  },
  {
    id: "business",
    title: "Prowadzę firmę i chcę rozwijać marketing online",
    description: "Potrzebuję treści, które pomogą mi sprzedawać",
    icon: Building2,
    color: "pink",
  },
  {
    id: "editor",
    title: "Jestem montażystą / specjalistą od produkcji",
    description: "Specjalizuję się w edycji video",
    icon: Video,
    color: "yellow",
  },
  {
    id: "beginner",
    title: "Dopiero zaczynam swoją przygodę z contentem",
    description: "Uczę się podstaw tworzenia treści",
    icon: Sparkles,
    color: "blue",
  },
];

export default function SimpleRegisterForm() {
  const { Button } = useDesignSystem();
  const { registerUserAccount } = useCommands();
  const navigate = useNavigate();
  const { currentStep, prev, isPrev } = useSteps();
  const [error, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const result = await registerUserAccount(values);

      if ("error" in result) {
        if (result.error === "ACCOUNT_EXISTS") {
          setSubmitError("ACCOUNT_EXISTS");
          return;
        } else if (result.error === "IP_LIMIT_EXCEEDED") {
          setSubmitError("IP_LIMIT_EXCEEDED");
          return;
        } else if (result.error === "RODO_CONSENT_REQUIRED") {
          setSubmitError("RODO_CONSENT_REQUIRED");
          return;
        } else {
          throw new Error(result.error);
        }
      }

      // Registration successful, redirect to OTP verification
      if (result.success && result.email) {
        navigate(`/verify-email?email=${encodeURIComponent(result.email)}`);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setSubmitError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      schema={registerUserAccount.params}
      onSubmit={handleSubmit}
      defaults={{
        marketingConsent: false,
      }}
      render={(Fields) => {
        switch (currentStep) {
          case 1:
            return (
              <div className="space-y-8">
                <div className="text-center">
                  <h2
                    className="text-3xl md:text-4xl font-light text-gray-900 mb-4"
                    style={{ fontFamily: "Mitr, sans-serif" }}
                  >
                    Kim jesteś?
                  </h2>
                  <p className="text-lg text-gray-600">
                    Z jakiej perspektywy będziesz korzystać z tego narzędzia?
                  </p>
                </div>

                <FormPart>
                  <Fields.Persona
                    translations="Musisz wybrać kim jesteś"
                    render={(field) => (
                      <div>
                        <div className="grid md:grid-cols-2 gap-6">
                          {personaTypes.map((type) => (
                            <UserTypeCard
                              key={type.id}
                              id={type.id}
                              title={type.title}
                              description={type.description}
                              icon={type.icon}
                              color={type.color}
                              isSelected={field.value === type.id}
                              onClick={() => field.onChange(type.id)}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </div>
                    )}
                  />
                  <Navigation />
                </FormPart>
              </div>
            );

          case 2:
            return (
              <div className="space-y-8">
                <div className="text-center">
                  <h2
                    className="text-3xl md:text-4xl font-light text-gray-900 mb-4"
                    style={{ fontFamily: "Mitr, sans-serif" }}
                  >
                    Podstawowe informacje
                  </h2>
                  <p className="text-lg text-gray-600">
                    Podaj swoje dane, aby utworzyć konto
                  </p>
                </div>

                <FormPart>
                  <div className="max-w-md mx-auto space-y-6">
                    <Fields.NameAndSurname
                      translations="Musisz podać imię i nazwisko"
                      render={(field) => (
                        <LabeledInput
                          {...field}
                          name="name_and_surname"
                          label="Imię i nazwisko"
                          placeholder="Jan Kowalski"
                        />
                      )}
                    />
                    <Fields.Email
                      translations="Email jest nieprawidłowy"
                      render={(field) => (
                        <LabeledInput
                          {...field}
                          label="Email"
                          placeholder="jan@example.com"
                          type="email"
                        />
                      )}
                    />

                    {error === "ACCOUNT_EXISTS" && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-600">
                          Użytkownik z tym adresem email już istnieje. Zaloguj
                          się lub użyj innego adresu email.
                        </p>
                      </div>
                    )}

                    {error === "IP_LIMIT_EXCEEDED" && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-600">
                          Osiągnięto limit rejestracji z tego adresu IP
                          (maksymalnie 2 rejestracje w ciągu miesiąca). Spróbuj
                          ponownie za kilka dni lub skontaktuj się z naszym
                          zespołem wsparcia.
                        </p>
                      </div>
                    )}

                    <Fields.Password
                      translations={{
                        type: () => "Hasło jest wymagane",
                        minLength: (data) => `Minimum ${data.minLength} znaków`,
                        maxLength: (data) =>
                          `Maksymalnie ${data.maxLength} znaków`,
                      }}
                      render={(field) => (
                        <LabeledPasswordInput {...field} label="Hasło" />
                      )}
                    />

                    <div className="space-y-4 pt-4">
                      <Fields.RodoConsent
                        translations="Musisz zaakceptować regulamin"
                        render={(field) => (
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="rodo"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                            <div>
                              <Label
                                htmlFor="rodo"
                                className="text-base font-medium cursor-pointer"
                              >
                                Akceptuję regulamin i politykę prywatności
                                (RODO) *
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Wyrażam zgodę na przetwarzanie moich danych
                                osobowych zgodnie z
                                <Link
                                  to="https://www.narzedziadlatworcow.pl/regulamin"
                                  target="_blank"
                                  className="text-blue-500 hover:underline"
                                >
                                  {" "}
                                  regulaminem
                                </Link>{" "}
                                oraz
                                <Link
                                  to="https://narzedziadlatworcow.pl/polityka-prywatnosci"
                                  target="_blank"
                                  className="text-blue-500 hover:underline"
                                >
                                  {" "}
                                  polityką prywatności
                                </Link>
                                .
                              </p>
                              <FormMessage />
                            </div>
                          </div>
                        )}
                      />

                      {error === "RODO_CONSENT_REQUIRED" && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                          <p className="text-sm text-red-600">
                            Musisz zaakceptować regulamin i politykę
                            prywatności, aby kontynuować.
                          </p>
                        </div>
                      )}

                      <Fields.MarketingConsent
                        translations={{}}
                        render={(field) => (
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="marketing"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                            <div>
                              <Label
                                htmlFor="marketing"
                                className="text-base font-medium cursor-pointer"
                              >
                                Chcę otrzymywać newsletter i informacje
                                marketingowe
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Będziesz otrzymywać porady, nowości i
                                ekskluzywne oferty. Możesz się wypisać w każdej
                                chwili.
                              </p>
                            </div>
                          </div>
                        )}
                      />
                    </div>

                    {error &&
                      ![
                        "ACCOUNT_EXISTS",
                        "IP_LIMIT_EXCEEDED",
                        "RODO_CONSENT_REQUIRED",
                      ].includes(error) && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                          <p className="text-sm text-red-600">{error}</p>
                        </div>
                      )}
                  </div>

                  {/* Custom navigation for final step */}
                  <div className="flex flex-col justify-between pt-8 sm:flex-row-reverse gap-4">
                    <Button
                      type="submit"
                      variant="success"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Tworzenie konta...
                        </>
                      ) : (
                        "Utwórz konto"
                      )}
                    </Button>

                    {isPrev() && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prev}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-full px-6 py-3 h-auto text-sm"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Wstecz
                      </Button>
                    )}
                  </div>
                </FormPart>
              </div>
            );

          default:
            return null;
        }
      }}
    />
  );
}
