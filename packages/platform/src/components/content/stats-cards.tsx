import { CheckCircle, Edit3, Lightbulb, Sparkles } from "lucide-react";

export interface StatsData {
  total: number;
  published: number;
  inProgress: number;
  ideas: number;
}

interface StatsCardsProps {
  stats: StatsData;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      label: "Wszystkie treści",
      value: stats.total,
      icon: Sparkles,
      gradient: "from-blue-500 to-purple-600",
    },
    {
      label: "Opublikowane",
      value: stats.published,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      label: "W trakcie tworzenia",
      value: stats.inProgress,
      icon: Edit3,
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      label: "Pomysły",
      value: stats.ideas,
      icon: Lightbulb,
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.label}
            className="backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 border border-white/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.value}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}