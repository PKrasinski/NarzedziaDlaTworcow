import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { Form } from "@arcote.tech/arc-react";
import { LabeledInput } from "@narzedziadlatworcow.pl/ui/components/labeled-input";
import { LabeledPasswordInput } from "@narzedziadlatworcow.pl/ui/components/labeled-password-input";
import { LabeledSelect } from "@narzedziadlatworcow.pl/ui/components/labeled-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@narzedziadlatworcow.pl/ui/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { Input } from "@narzedziadlatworcow.pl/ui/components/ui/input";
import { Label } from "@narzedziadlatworcow.pl/ui/components/ui/label";
import { useDesignSystem } from "design-system";
import {
  Lock,
  Palette,
  Receipt,
  Save,
  Settings as SettingsIcon,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../auth-provider";
import { styles, tones } from "../utils/content-options";

const SettingsPage = () => {
  const { Button } = useDesignSystem();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const commands = useCommands();
  const revalidate = useRevalidate();

  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data from Arc views
  const [userData] = useQuery(
    (q) => q.myUserAccount.findOne({}),
    [],
    "my-user"
  );
  const [invoiceData] = useQuery(
    (q) => q.userInvoiceData.findOne({}),
    [],
    "user-invoice-data"
  );
  const [preferences] = useQuery(
    (q) => q.defaultGenerationSetting.findOne({}),
    [],
    "user-preferences"
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-white shadow-lg rounded-full text-sm font-medium mb-6 border border-gray-100">
          <SettingsIcon className="w-4 h-4 mr-2 text-blue-500" />
          Ustawienia konta
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ustawienia
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Zarządzaj swoim kontem, preferencjami i ustawieniami bezpieczeństwa
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Profil</CardTitle>
              <CardDescription>
                Zarządzaj swoimi danymi osobowymi
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form
            schema={commands.updateProfile.params}
            defaults={{
              nameAndSurname: (userData as any)?.nameAndSurname || "",
            }}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);
                const result = await commands.updateProfile(values);

                if ("error" in result) {
                  toast.error("Błąd", {
                    description: "Wystąpił błąd podczas aktualizacji profilu",
                  });
                  return;
                }

                revalidate("my-user");
                toast.success("Sukces", {
                  description: result.success,
                });
              } catch (error) {
                console.error("Profile update failed:", error);
                toast.error("Błąd", {
                  description: "Wystąpił błąd podczas aktualizacji profilu",
                });
              } finally {
                setIsLoading(false);
              }
            }}
            render={(Fields) => (
              <div className="space-y-4">
                <Fields.NameAndSurname
                  translations="Imię i nazwisko jest wymagane"
                  render={(field: any) => (
                    <LabeledInput
                      {...field}
                      label="Imię i nazwisko"
                      placeholder="Jan Kowalski"
                      disabled={isLoading}
                      className="border-2 border-gray-200 focus:border-blue-300"
                    />
                  )}
                />

                <div className="space-y-2">
                  <Label className="text-base font-medium ml-4">Email:</Label>
                  <Input
                    value={(userData as any)?.email || ""}
                    disabled
                    className="mt-2 h-12 text-base rounded-full border-2 border-gray-200 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 ml-4">
                    Email nie może być zmieniony
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Invoice Data */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Dane do faktury</CardTitle>
              <CardDescription>
                Uzupełnij dane do wystawiania faktur
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form
            schema={commands.updateInvoiceData.params}
            defaults={invoiceData}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);
                const result = await commands.updateInvoiceData(values);

                if ("error" in result) {
                  toast.error("Błąd", {
                    description:
                      "Wystąpił błąd podczas aktualizacji danych do faktury",
                  });
                  return;
                }

                revalidate("user-invoice-data");
                toast.success("Sukces", {
                  description: result.success,
                });
              } catch (error) {
                console.error("Invoice data update failed:", error);
                toast.error("Błąd", {
                  description:
                    "Wystąpił błąd podczas aktualizacji danych do faktury",
                });
              } finally {
                setIsLoading(false);
              }
            }}
            render={(Fields) => (
              <div className="space-y-4">
                <Fields.CompanyName
                  translations=""
                  render={(field: any) => (
                    <LabeledInput
                      {...field}
                      label="Nazwa firmy (opcjonalne)"
                      placeholder="Nazwa firmy"
                      disabled={isLoading}
                      className="border-2 border-gray-200 focus:border-blue-300"
                    />
                  )}
                />

                <Fields.Nip
                  translations=""
                  render={(field: any) => (
                    <LabeledInput
                      {...field}
                      label="NIP (opcjonalne)"
                      placeholder="123-456-78-90"
                      disabled={isLoading}
                      className="border-2 border-gray-200 focus:border-blue-300"
                    />
                  )}
                />

                <Fields.Address
                  translations="Adres jest wymagany"
                  render={(field: any) => (
                    <LabeledInput
                      {...field}
                      label="Adres"
                      placeholder="ul. Przykładowa 1"
                      disabled={isLoading}
                      className="border-2 border-gray-200 focus:border-blue-300"
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Fields.PostalCode
                    translations="Kod pocztowy jest wymagany"
                    render={(field: any) => (
                      <LabeledInput
                        {...field}
                        label="Kod pocztowy"
                        placeholder="00-000"
                        disabled={isLoading}
                        className="border-2 border-gray-200 focus:border-blue-300"
                      />
                    )}
                  />

                  <Fields.City
                    translations="Miasto jest wymagane"
                    render={(field: any) => (
                      <LabeledInput
                        {...field}
                        label="Miasto"
                        placeholder="Warszawa"
                        disabled={isLoading}
                        className="border-2 border-gray-200 focus:border-blue-300"
                      />
                    )}
                  />
                </div>

                <Fields.Country
                  translations="Kraj jest wymagany"
                  render={(field: any) => (
                    <LabeledInput
                      {...field}
                      label="Kraj"
                      placeholder="Polska"
                      disabled={isLoading}
                      className="border-2 border-gray-200 focus:border-blue-300"
                    />
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Zapisywanie..." : "Zapisz dane do faktury"}
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Default Preferences */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Preferencje</CardTitle>
              <CardDescription>
                Ustaw domyślny styl i ton komunikacji
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form
            schema={commands.updateDefaultPreferences.params}
            defaults={{
              defaultStyle: (preferences as any)?.style,
              defaultTone: (preferences as any)?.tone,
            }}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);
                const result = await commands.updateDefaultPreferences(values);

                if ("error" in result) {
                  toast.error("Błąd", {
                    description:
                      "Wystąpił błąd podczas aktualizacji preferencji",
                  });
                  return;
                }

                revalidate("user-preferences");
                toast.success("Sukces", {
                  description: result.success,
                });
              } catch (error) {
                console.error("Preferences update failed:", error);
                toast.error("Błąd", {
                  description: "Wystąpił błąd podczas aktualizacji preferencji",
                });
              } finally {
                setIsLoading(false);
              }
            }}
            render={(Fields) => (
              <div className="space-y-4">
                <Fields.DefaultStyle
                  translations="Wybierz domyślny styl"
                  render={(field: any) => (
                    <LabeledSelect
                      {...field}
                      label="Domyślny styl"
                      options={styles}
                      disabled={isLoading}
                      className="border-2 border-gray-200 focus:border-blue-300"
                    />
                  )}
                />

                <Fields.DefaultTone
                  translations="Wybierz domyślny ton"
                  render={(field: any) => (
                    <LabeledSelect
                      {...field}
                      label="Domyślny ton"
                      options={tones}
                      disabled={isLoading}
                      className="border-2 border-gray-200 focus:border-blue-300"
                    />
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Zapisywanie..." : "Zapisz preferencje"}
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Bezpieczeństwo</CardTitle>
              <CardDescription>Zmień hasło do swojego konta</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form
            schema={commands.changeUserPassword.params}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);
                const result = await commands.changeUserPassword(values);

                if ("error" in result) {
                  if (result.error === "INVALID_CURRENT_PASSWORD") {
                    toast.error("Błąd", {
                      description: "Nieprawidłowe aktualne hasło",
                    });
                  } else {
                    toast.error("Błąd", {
                      description: "Wystąpił błąd podczas zmiany hasła",
                    });
                  }
                  return;
                }

                toast.success("Sukces", {
                  description: result.success,
                });
              } catch (error) {
                console.error("Password change failed:", error);
                toast.error("Błąd", {
                  description: "Wystąpił błąd podczas zmiany hasła",
                });
              } finally {
                setIsLoading(false);
              }
            }}
            render={(Fields) => (
              <div className="space-y-4">
                <Fields.CurrentPassword
                  translations="Aktualne hasło jest wymagane"
                  render={(field: any) => (
                    <LabeledPasswordInput
                      {...field}
                      label="Aktualne hasło"
                      placeholder="Wprowadź aktualne hasło"
                      disabled={isLoading}
                      className="border-2 border-gray-200 focus:border-blue-300"
                    />
                  )}
                />

                <Fields.NewPassword
                  translations="Nowe hasło jest wymagane"
                  render={(field: any) => (
                    <LabeledPasswordInput
                      {...field}
                      label="Nowe hasło"
                      placeholder="Wprowadź nowe hasło"
                      disabled={isLoading}
                      className="border-2 border-gray-200 focus:border-blue-300"
                    />
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isLoading ? "Zmienianie hasła..." : "Zmień hasło"}
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Danger Zone - Account Deletion */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-red-700">
                Strefa zagrożenia
              </CardTitle>
              <CardDescription>
                Nieodwracalne akcje dotyczące Twojego konta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">Usuń konto</h3>
            <p className="text-sm text-red-600 mb-4">
              Po usunięciu konta wszystkie Twoje dane zostaną nieodwracalnie
              utracone. Ta akcja nie może być cofnięta.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Usuń konto
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <Form
                  schema={commands.deleteUserAccount.params}
                  onSubmit={async (values) => {
                    try {
                      setIsLoading(true);
                      const result = await commands.deleteUserAccount(values);

                      if ("error" in result) {
                        if (result.error === "INVALID_PASSWORD") {
                          toast.error("Błąd", {
                            description: "Nieprawidłowe hasło",
                          });
                        } else {
                          toast.error("Błąd", {
                            description: "Wystąpił błąd podczas usuwania konta",
                          });
                        }
                        return;
                      }

                      logout();
                      navigate("/signin");
                    } catch (error) {
                      console.error("Account deletion failed:", error);
                      toast.error("Błąd", {
                        description: "Wystąpił błąd podczas usuwania konta",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  render={(Fields) => (
                    <>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Czy na pewno chcesz usunąć konto?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Ta akcja jest nieodwracalna. Wszystkie Twoje dane,
                          scenariusze, kredyty i historia zostaną trwale
                          usunięte.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="my-4">
                        <Fields.Password
                          translations="Hasło jest wymagane do potwierdzenia"
                          render={(field: any) => (
                            <LabeledPasswordInput
                              {...field}
                              label="Potwierdź hasłem"
                              placeholder="Wprowadź hasło"
                              disabled={isLoading}
                              className="border-2 border-gray-200 focus:border-blue-300"
                            />
                          )}
                        />
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Anuluj</AlertDialogCancel>
                        <AlertDialogAction
                          type="submit"
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isLoading}
                        >
                          {isLoading ? "Usuwanie..." : "Tak, usuń konto"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </>
                  )}
                />
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
