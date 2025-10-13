import { useQuery } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import {
  Card,
  CardContent,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { useDesignSystem } from "design-system";
import {
  ArrowRight,
  CheckCircle,
  Layout,
  Lightbulb,
  Lock,
  MessageCircle,
  Target,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StrategyIndexPage = () => {
  const { Button } = useDesignSystem();
  const navigate = useNavigate();
  const { currentAccount } = useAccountWorkspaces();
  const [strategyProgress] = useQuery(
    (q) =>
      q.strategyProgress.findOne({
        _id: currentAccount._id,
      }),
    [currentAccount._id]
  );

  const steps = [
    {
      number: 1,
      title: "Zdefiniuj swoją tożsamość twórcy",
      path: "/strategy/creator-identity",
      description: "Określ swoją unikalną tożsamość jako twórca treści",
      completed: !!strategyProgress?.creatorIdentityCompleted,
      icon: <User className="w-6 h-6" />,
    },
    {
      number: 2,
      title: "Określ swoje cele jako twórca",
      path: "/strategy/creator-goals",
      description:
        "Zdefiniuj jasne cele, które chcesz osiągnąć poprzez tworzenie treści",
      completed: !!strategyProgress?.creatorGoalsCompleted,
      icon: <Target className="w-6 h-6" />,
    },
    {
      number: 3,
      title: "Poznaj swoich odbiorców",
      path: "/strategy/viewer-targets",
      description: "Określ, do kogo chcesz dotrzeć ze swoimi treściami",
      completed: !!strategyProgress?.viewerTargetsCompleted,
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: 4,
      title: "Ustal swój styl komunikacji",
      path: "/strategy/creator-style",
      description:
        "Wybierz ton i sposób komunikacji, który najlepiej do Ciebie pasuje",
      completed: !!strategyProgress?.creatorStyleCompleted,
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      number: 5,
      title: "Dobierz formaty treści",
      path: "/strategy/content-formats",
      description:
        "Wybierz formaty treści, które najlepiej sprawdzą się w Twojej strategii",
      completed: !!strategyProgress?.contentFormatsCompleted,
      icon: <Layout className="w-6 h-6" />,
    },
    {
      number: 6,
      title: "Zaplanuj pomysły na treści",
      path: "/strategy/content-ideas",
      description: "Stwórz listę pomysłów na treści, które będziesz tworzyć",
      completed: false, // Not implemented yet
      icon: <Lightbulb className="w-6 h-6" />,
    },
  ];

  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;
  const nextStepIndex = steps.findIndex((step) => !step.completed);

  const getStepStatus = (index: number) => {
    if (index < nextStepIndex) return "completed";
    if (index === nextStepIndex) return "next";
    return "disabled";
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case "completed":
        return {
          card: "bg-green-50 border-green-200 hover:shadow-md cursor-pointer",
          icon: "bg-green-100 border-green-200",
          button: "bg-green-600 hover:bg-green-700 text-white",
          connector: "bg-green-300",
        };
      case "next":
        return {
          card: "bg-white border-gray-200 hover:shadow-xl cursor-pointer hover:scale-[1.02]",
          icon: "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg",
          button:
            "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg text-white",
          connector: "bg-gradient-to-b from-blue-300 to-purple-300",
        };
      case "disabled":
        return {
          card: "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed",
          icon: "bg-gray-200 border-gray-300",
          button: "bg-gray-300 text-gray-500 cursor-not-allowed",
          connector: "bg-gray-200",
        };
      default:
        return {
          card: "bg-white border-gray-200",
          icon: "bg-gray-200",
          button: "bg-gray-500 text-white",
          connector: "bg-gray-300",
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-6 py-3 bg-white shadow-lg rounded-full text-sm font-medium mb-6 border border-gray-100">
          <Target className="w-4 h-4 mr-2 text-blue-500" />
          Strategia treści
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Stwórz swoją strategię treści
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Odkryj swój unikalny głos i zbuduj strategię, która przyciągnie
          właściwą widownię. Każdy krok pomoże Ci lepiej zrozumieć siebie i
          swoich odbiorców.
        </p>

        {/* Progress Section */}
        <div className="mt-10 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Postęp</span>
            <span className="text-sm font-medium text-gray-900">
              {completedSteps}/{steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const styles = getStepStyles(status);
          const isClickable = status !== "disabled";

          return (
            <Card
              key={step.number}
              className={`border-0 shadow-xl transition-all duration-300 group ${styles.card}`}
              onClick={() => isClickable && navigate(step.path)}
            >
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 ${styles.icon}`}
                    >
                      {status === "completed" ? (
                        <CheckCircle className="w-8 h-8 text-green-700" />
                      ) : status === "disabled" ? (
                        <Lock className="w-8 h-8 text-gray-500" />
                      ) : (
                        <div className="text-white">{step.icon}</div>
                      )}
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`hidden md:block w-0.5 h-12 mx-auto mt-6 ${styles.connector}`}
                      ></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-0 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Krok {step.number}
                          </span>
                          {status === "completed" && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Ukończone
                            </span>
                          )}
                          {status === "next" && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              Następny krok
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                      <Button
                        className={`w-full md:w-auto ${styles.button}`}
                        disabled={status === "disabled"}
                      >
                        {status === "completed" ? (
                          "Edytuj"
                        ) : status === "next" ? (
                          <>
                            Rozpocznij
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          "Zablokowane"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StrategyIndexPage;
