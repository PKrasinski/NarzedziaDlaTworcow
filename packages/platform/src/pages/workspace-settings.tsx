import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { Form } from "@arcote.tech/arc-react";
import { LabeledInput } from "@narzedziadlatworcow.pl/ui/components/labeled-input";
import { useDesignSystem } from "design-system";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import {
  ArrowRight,
  Building2,
  Save,
  Settings as SettingsIcon,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const WorkspaceSettingsPage = () => {
  const { Button } = useDesignSystem();
  const commands = useCommands();
  const revalidate = useRevalidate();
  const [isLoading, setIsLoading] = useState(false);
  const { currentAccount } = useAccountWorkspaces();

  // Fetch workspace data
  const [workspace, loading] = useQuery(
    (q) => q.accountWorkspaces.findOne({ _id: currentAccount?._id }),
    [currentAccount?._id],
    "account-workspaces"
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-white shadow-lg rounded-full text-sm font-medium mb-6 border border-gray-100">
          <SettingsIcon className="w-4 h-4 mr-2 text-blue-500" />
          Ustawienia konta twórcy
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ustawienia konta
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Zarządzaj swoim kontem twórcy i ustawieniami zespołu
        </p>
      </div>

      {/* Basic Settings */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Podstawowe informacje</CardTitle>
              <CardDescription>
                Zarządzaj podstawowymi ustawieniami konta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form
            schema={commands.updateWorkspace.params}
            defaults={{
              accountWorkspaceId: currentAccount?._id,
              creatorName: (workspace as any)?.creatorName || "",
            }}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);
                const result = await commands.updateWorkspace(values);

                if ("error" in result) {
                  toast.error("Błąd", {
                    description: "Wystąpił błąd podczas aktualizacji konta",
                  });
                  return;
                }

                revalidate("account-workspaces");
                toast.success("Sukces", {
                  description: result.success,
                });
              } catch (error) {
                console.error("Workspace update failed:", error);
                toast.error("Błąd", {
                  description: "Wystąpił błąd podczas aktualizacji konta",
                });
              } finally {
                setIsLoading(false);
              }
            }}
            render={(Fields) => (
              <div className="space-y-4">
                <Fields.CreatorName
                  translations="Nazwa konta jest wymagana"
                  render={(field: any) => (
                    <LabeledInput
                      {...field}
                      label="Nazwa konta"
                      placeholder="Nazwa Twojego konta"
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
                  {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Team Features */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Zespół</CardTitle>
              <CardDescription>
                Zarządzaj członkami zespołu i uprawnieniami
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Funkcje zespołowe w wersji beta
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Zaproś członków zespołu, przydzielaj role i współpracuj nad
                  treściami. Ta funkcja jest obecnie dostępna tylko dla beta
                  testerów.
                </p>
              </div>
            </div>

            <Button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const result = await commands.requestBetaAccess({
                    accountWorkspaceId: currentAccount._id,
                  });

                  if ("error" in result) {
                    toast.error("Błąd", {
                      description:
                        "Wystąpił błąd podczas zapisywania do beta testów",
                    });
                    return;
                  }

                  toast.success("Sukces", {
                    description:
                      "Twoje zgłoszenie zostało przyjęte. Skontaktujemy się z Tobą wkrótce.",
                  });
                } catch (error) {
                  console.error("Beta access request failed:", error);
                  toast.error("Błąd", {
                    description:
                      "Wystąpił błąd podczas zapisywania do beta testów",
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={isLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isLoading ? "Zapisywanie..." : "Dołącz do beta testów"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceSettingsPage;
