import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { Check } from "lucide-react";
import * as React from "react";

interface ToolWrapperProps {
  message: string;
  children?: React.ReactNode;
  className?: string;
}

export const ToolWrapper: React.FC<ToolWrapperProps> = ({
  message,
  children,
  className,
}) => {
  return (
    <div className={cn("relative", className)}>
      {/* Light gradient message bar with glass effect */}
      <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 text-green-800 px-4 py-2 rounded-t-lg pb-5 -mb-4 relative z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Check className="w-3 h-3 flex-shrink-0 text-green-600" />
          <span className="text-xs font-medium">{message}</span>
        </div>
      </div>

      {/* Content with glass effect background */}
      {children && (
        <div className="relative z-20 bg-white/60 backdrop-blur-sm border border-white/70 rounded-lg shadow-lg border-t-gray-300/60">
          {children}
        </div>
      )}
    </div>
  );
};

export const EntityUpdatedSuccess: React.FC<{
  entityType: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ entityType, children, className }) => {
  return (
    <ToolWrapper message={`Zaktualizowano ${entityType}`} className={className}>
      {children}
    </ToolWrapper>
  );
};
