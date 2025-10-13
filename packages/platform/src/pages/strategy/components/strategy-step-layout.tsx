import { useDesignSystem } from "design-system";
import { Label } from "@narzedziadlatworcow.pl/ui/components/ui/label";
import { Sticky } from "@narzedziadlatworcow.pl/ui/components/ui/sticky";
import { Switch } from "@narzedziadlatworcow.pl/ui/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { createContext, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Stepper } from "./stepper";
import { VideoPreview } from "./video-preview";

// Context for sharing current state with child components
const StrategyStepContext = createContext<any>(null);

export const useStrategyStepContext = () => {
  return useContext(StrategyStepContext);
};

interface StrategyStepLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  videoId: string;
  verticalThumbnailUrl: string;
  horizontalThumbnailUrl: string;
  children?: React.ReactNode;
  // New props for dual-mode support
  chatView?: React.ReactNode;
  summaryView?: React.ReactNode;
  currentState?: any;
  showModeSwitch?: boolean;
}

export function StrategyStepLayout({
  currentStep,
  totalSteps,
  title,
  description,
  videoId,
  verticalThumbnailUrl,
  horizontalThumbnailUrl,
  children,
  chatView,
  summaryView,
  currentState,
  showModeSwitch = false,
}: StrategyStepLayoutProps) {
  const { Button } = useDesignSystem();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Handle mode switching via search params
  const isFormMode = searchParams.get("view") === "summary";
  const handleToggleChange = (checked: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (checked) {
      newParams.set("view", "summary");
    } else {
      newParams.delete("view");
    }
    setSearchParams(newParams);
  };
  
  // Determine content to render
  const contentToRender = showModeSwitch 
    ? (isFormMode ? summaryView : chatView)
    : children;

  return (
    <StrategyStepContext.Provider value={currentState}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/strategy")}
            className="md:hover:bg-white/50 bg-white/70 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none transition-all duration-200 px-4 py-2.5 h-auto text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do strategii
          </Button>
          <Stepper
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="Krok"
          />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex flex-col items-center justify-center text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Video Section */}
          <div className="col-span-12 lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-8 space-y-6">
              <VideoPreview
                videoId={videoId}
                title={`Instrukcja krok ${currentStep}`}
                thumbnailUrl={verticalThumbnailUrl}
                mobileThumbnailUrl={horizontalThumbnailUrl}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="col-span-12 lg:col-span-9 space-y-6 order-3 lg:order-2">
            {/* Desktop Header */}
            <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">{description}</p>
            </div>

            <div className="space-y-6">
              {/* Mode Switch - only show if showModeSwitch is true */}
              {showModeSwitch && (
                <Sticky offset={72} className="flex justify-end">
                  <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-3 border border-white/30">
                    <Label htmlFor="mode-switch" className="text-sm font-medium">
                      Czat z AI
                    </Label>
                    <Switch
                      id="mode-switch"
                      checked={isFormMode}
                      onCheckedChange={handleToggleChange}
                    />
                    <Label htmlFor="mode-switch" className="text-sm font-medium">
                      Podsumowanie
                    </Label>
                  </div>
                </Sticky>
              )}

              {/* Content */}
              {contentToRender}
            </div>
          </div>
        </div>
      </div>
    </StrategyStepContext.Provider>
  );
}
