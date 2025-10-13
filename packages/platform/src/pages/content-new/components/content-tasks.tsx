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
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useContent } from "../content-provider";

export function ContentTasksPage() {
  const { Button } = useDesignSystem();
  const { contentId } = useParams<{ contentId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const { content } = useContent();

  // Find the current content
  const currentContent = content.find((item) => item._id === contentId);

  // Mock task data for beta testers
  const mockTasks = [
    {
      id: "1",
      title: "Napisz scenariusz wideo",
      description: "Stwórz szczegółowy scenariusz dla filmu YouTube",
      status: "in_progress",
      assignee: "Jan Kowalski",
      dueDate: "2024-02-15",
      priority: "high",
    },
    {
      id: "2",
      title: "Przygotuj miniaturę",
      description: "Zaprojektuj atrakcyjną miniaturę dla filmu",
      status: "todo",
      assignee: "Anna Nowak",
      dueDate: "2024-02-18",
      priority: "medium",
    },
    {
      id: "3",
      title: "Nagranie wideo",
      description: "Nagraj główną część filmu zgodnie ze scenariuszem",
      status: "todo",
      assignee: "Jan Kowalski",
      dueDate: "2024-02-20",
      priority: "high",
    },
    {
      id: "4",
      title: "Montaż i edycja",
      description: "Zmontuj nagrany materiał, dodaj efekty i muzykę",
      status: "completed",
      assignee: "Tomasz Wiśniewski",
      dueDate: "2024-02-10",
      priority: "medium",
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Zakończone",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle2,
        };
      case "in_progress":
        return {
          label: "W trakcie",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        };
      default:
        return {
          label: "Do zrobienia",
          color: "bg-gray-100 text-gray-800",
          icon: Calendar,
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-300";
    }
  };

  return (
    <div className="relative h-full">
      {/* Beta Overlay with Glass Effect */}
      <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/60">
        <div className="flex items-center justify-center h-full p-8">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">
                    Funkcja w wersji beta
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Zarządzanie zadaniami dla treści
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-blue-800 text-center leading-relaxed">
                Planowanie zadań, przydzielanie ról zespołowych i śledzenie
                postępów pracy nad treścią. Ta funkcja jest obecnie dostępna
                tylko dla beta testerów.
              </p>
              <Button
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    // Mock beta access request
                    setTimeout(() => {
                      toast.success("Sukces", {
                        description:
                          "Twoje zgłoszenie zostało przyjęte. Skontaktujemy się z Tobą wkrótce.",
                      });
                      setIsLoading(false);
                    }, 1000);
                  } catch (error) {
                    toast.error("Błąd", {
                      description:
                        "Wystąpił błąd podczas zapisywania do beta testów",
                    });
                    setIsLoading(false);
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading ? "Zapisywanie..." : "Dołącz do beta testów"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Content (Blurred) */}
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Zadania dla treści
            </h1>
            <p className="text-gray-600">
              {currentContent?.title || "Zarządzaj zadaniami i postępem pracy"}
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <User className="w-4 h-4 mr-2" />
            Dodaj zadanie
          </Button>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Wszystkie zadania</p>
                  <p className="text-2xl font-bold">{mockTasks.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">W trakcie</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      mockTasks.filter((task) => task.status === "in_progress")
                        .length
                    }
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Zakończone</p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      mockTasks.filter((task) => task.status === "completed")
                        .length
                    }
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Członkowie</p>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {mockTasks.map((task) => {
            const statusConfig = getStatusConfig(task.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={task.id}
                className={`border-l-4 ${getPriorityColor(
                  task.priority
                )} hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {task.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(task.dueDate).toLocaleDateString("pl-PL")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
