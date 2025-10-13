import { Check } from "lucide-react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  isCompleted?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormSection({
  icon,
  title,
  isCompleted = false,
  className,
  children,
}: FormSectionProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isCompleted
          ? "bg-green-50/50 border-green-200/50 shadow-md"
          : "bg-orange-50/50 border-orange-200/50",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isCompleted
                ? "bg-green-100 text-green-600"
                : "bg-orange-100 text-orange-600"
            )}
          >
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {isCompleted && (
            <div className="ml-auto">
              <Check className="w-5 h-5 text-green-600" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}