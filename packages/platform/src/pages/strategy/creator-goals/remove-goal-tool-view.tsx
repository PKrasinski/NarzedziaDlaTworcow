import type { ToolViewProps } from "@narzedziadlatworcow.pl/ui/components/chat/types";
import { ToolWrapper } from "@narzedziadlatworcow.pl/ui/components/tool-wrapper";
import {
  Card,
  CardContent,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const RemoveGoalToolView = ({ params }: ToolViewProps) => {
  return (
    <ToolWrapper message="Cel został usunięty">
      <Card className="bg-orange-50 border border-orange-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-orange-800 font-medium mb-1">
                Cel został trwale usunięty
              </p>
              <p className="text-xs text-orange-700">
                Ta operacja nie może być cofnięta. Cel nie będzie już widoczny w
                liście celów.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolWrapper>
  );
};
