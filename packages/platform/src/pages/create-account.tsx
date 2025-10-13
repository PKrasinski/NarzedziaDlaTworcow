"use client";

import { useCommands, useRevalidate } from "@/arc-provider";
import { useMyUser } from "@/components";
import { useAccountWorkspaces } from "@/components/account-workspace-provider";
import { Form } from "@arcote.tech/arc-react";
import { LabeledInput } from "@narzedziadlatworcow.pl/ui/components/labeled-input";
import { Logo } from "@narzedziadlatworcow.pl/ui/components/logo";
import { useDesignSystem } from "design-system";
import { Checkbox } from "@narzedziadlatworcow.pl/ui/components/ui/checkbox";
import { Label } from "@narzedziadlatworcow.pl/ui/components/ui/label";
import {
  AlertCircle,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Music,
  Rss,
  Star,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
  { id: "tiktok", name: "TikTok", icon: Music, color: "bg-black" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-500" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-600" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-700" },
  { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-blue-400" },
  {
    id: "website",
    name: "Strona internetowa",
    icon: Globe,
    color: "bg-green-400",
  },
  { id: "blog", name: "Blog osobisty", icon: Rss, color: "bg-green-600" },
];

export default function CreateAccountPage() {
  const { Button } = useDesignSystem();
  const { createAccountWorkspace } = useCommands();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useMyUser();
  const { setCurrentAccount } = useAccountWorkspaces();
  const revalidate = useRevalidate();
  return (
    <div className="min-h-screen bg-gradient-landing relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="lg:pt-4">
          <header className="navbar-glass">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center h-16 py-4">
                <Logo />
              </div>
            </div>
          </header>
        </div>

        {/* Main Content */}
        <main className="flex-1  flex items-center justify-center">
          <div className="max-w-4xl mx-auto w-full">
            <div className="card-modern p-8 sm:p-12">
              {/* Hero Section */}
              <div className="text-center space-y-6 mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <h1
                  className="text-3xl md:text-4xl font-light text-gray-900"
                  style={{ fontFamily: "Mitr, sans-serif" }}
                >
                  Utwórz konto twórcy
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Podaj nazwę twórcy i platformy, na których tworzysz treści.
                </p>
              </div>

              {/* Team Collaboration Feature Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">
                      Zarządzaj wieloma kontami
                    </h3>
                    <p className="text-blue-700 text-sm">
                      W ramach platformy możesz zarządzać wieloma kontami
                      twórców treści. Każde z nich może mieć różną strategię
                      treści które tworzy. Zaproś do współpracy montażystów,
                      asystentów, agencje czy innych członków zespołu. Każdy
                      będzie miał dostęp do wspólnych projektów i narzędzi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Workspace Creation Form */}
              <Form
                schema={createAccountWorkspace.params}
                defaults={{
                  creatorName: user?.nameAndSurname,
                  platforms: [],
                }}
                onSubmit={async (values) => {
                  try {
                    setIsLoading(true);
                    setError("");

                    const result = await createAccountWorkspace(values);
                    await revalidate("account-workspaces");

                    if ("error" in result) {
                      setError(
                        "Wystąpił błąd podczas tworzenia konta twórcy. Spróbuj ponownie."
                      );
                      return;
                    }

                    // Switch to the newly created workspace
                    setCurrentAccount(result.id);

                    // Success - redirect to main app
                    navigate("/");
                  } catch (error: any) {
                    console.error("Account workspace creation failed:", error);
                    setError(
                      error.message ||
                        "Wystąpił błąd podczas tworzenia konta twórcy. Spróbuj ponownie."
                    );
                  } finally {
                    setIsLoading(false);
                  }
                }}
                render={(Fields, values) => (
                  <div className="space-y-8">
                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Creator Name */}
                    <Fields.CreatorName
                      translations="Nazwa twórcy jest wymagana"
                      render={(field: any) => (
                        <div>
                          <LabeledInput
                            {...field}
                            label="Nazwa konta"
                            placeholder="np. Jan Kowalski, JanKowalski_official"
                            disabled={isLoading}
                          />
                          <p className="text-sm text-gray-500 mt-2">
                            Wpisz nazwę, pod którą tworzysz treści
                          </p>
                        </div>
                      )}
                    />

                    {/* Platform Selection */}
                    <Fields.Platforms
                      translations="Musisz wybrać co najmniej jedną platformę"
                      render={(field: any) => (
                        <div>
                          <Label className="text-base font-medium text-gray-900 mb-4 block">
                            Platformy, na których aktualnie tworzysz
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {platforms.map((platform) => {
                              const IconComponent = platform.icon;
                              const isSelected = field.value?.includes(
                                platform.id
                              );

                              return (
                                <div
                                  key={platform.id}
                                  className={`
                                    relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md
                                    ${
                                      isSelected
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                    }
                                  `}
                                  onClick={() => {
                                    const currentPlatforms = field.value || [];
                                    if (
                                      currentPlatforms.includes(platform.id)
                                    ) {
                                      field.onChange(
                                        currentPlatforms.filter(
                                          (p: string) => p !== platform.id
                                        )
                                      );
                                    } else {
                                      field.onChange([
                                        ...currentPlatforms,
                                        platform.id,
                                      ]);
                                    }
                                  }}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center ${platform.color}`}
                                    >
                                      <IconComponent className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      {platform.name}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Other Platform */}
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="other-platform"
                              checked={field.value?.includes("other")}
                              onCheckedChange={(checked) => {
                                const currentPlatforms = field.value || [];
                                if (checked) {
                                  field.onChange([
                                    ...currentPlatforms,
                                    "other",
                                  ]);
                                } else {
                                  field.onChange(
                                    currentPlatforms.filter(
                                      (p: string) => p !== "other"
                                    )
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor="other-platform"
                              className="text-sm text-gray-600"
                            >
                              Inna platforma:
                            </Label>
                          </div>
                        </div>
                      )}
                    />

                    {/* Other Platform Name */}
                    {values.platforms?.includes("other") && (
                      <Fields.OtherPlatform
                        translations=""
                        render={(field: any) => (
                          <LabeledInput
                            {...field}
                            label="Nazwa platformy"
                            placeholder="np. Twitch, Discord, Podcast"
                            disabled={isLoading}
                          />
                        )}
                      />
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Tworzenie konta twórcy...</span>
                        </div>
                      ) : (
                        "Utwórz konto twórcy"
                      )}
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
