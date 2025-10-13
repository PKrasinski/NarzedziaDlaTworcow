"use client";

import { useCommands, useQuery, useRevalidate } from "@/arc-provider";
import { Badge } from "@narzedziadlatworcow.pl/ui/components/ui/badge";
import {
  Card,
  CardContent,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { useDesignSystem } from "design-system";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  CreditCard,
  Flame,
  Loader2,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountWorkspaces } from "../../components/account-workspace-provider";

const formatPrice = (price: number): string => {
  return (price / 100).toFixed(0);
};

export default function ChoosePlanPage() {
  const { Button } = useDesignSystem();
  const navigate = useNavigate();
  const { currentAccount } = useAccountWorkspaces();
  const { completeOnboarding } = useCommands();
  const revalidate = useRevalidate();
  const [isSelectingFreePlan, setIsSelectingFreePlan] = useState(false);

  // Get strategy agent product data
  const [premiums] = useQuery((q) => q.premium.find({}));
  const strategyAgentProduct = premiums?.[0];
  const strategyPrice = formatPrice(strategyAgentProduct?.price || 0);

  // Handle redirections based on user status and account workspace
  useEffect(() => {
    if (currentAccount) {
      if (currentAccount.hasAccessToStrategyAgentService) {
        // If user has premium access, redirect to main page
        navigate("/");
      } else if (currentAccount.hasCompletedOnboarding) {
        // If user has completed onboarding, redirect to main page
        navigate("/");
      }
    }
  }, [currentAccount, navigate]);

  const handleFreePlan = async () => {
    try {
      setIsSelectingFreePlan(true);

      if (!currentAccount?._id) {
        console.error("No current account workspace found");
        return;
      }

      // Complete onboarding with just the workspace ID
      const result = await completeOnboarding({
        accountWorkspaceId: currentAccount._id,
      });

      if ("success" in result) {
        await revalidate("account-workspaces");
        // Navigate directly to main page after completing onboarding
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setIsSelectingFreePlan(false);
    }
  };

  const handleProPlan = () => {
    // Navigate to buying strategy course for full version
    navigate("/course-payment");
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Wybierz swój plan
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
            Masz dwie opcje – obie dobre, zależy co wolisz
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Zacznij za darmo i zobacz jak to działa, albo wskocz od razu na
            głęboką wodę z pełnym kursem.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan Card */}
          <Card className="order-2 md:order-1 relative overflow-visible border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  DARMOWY START
                </h3>
                <div className="text-4xl font-bold text-gray-900">0 zł</div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">30 kredytów na testy</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">
                    Dostęp do generatora scenariuszy
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">1 kredyt = 1 scenariusz</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">
                    Idealne do sprawdzenia jak to działa
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              <Button
                className="w-full"
                onClick={handleFreePlan}
                disabled={isSelectingFreePlan}
              >
                {isSelectingFreePlan ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Przygotowywanie konta...
                  </>
                ) : (
                  "Zacznij za darmo"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan Card */}
          <Card className="order-1 md:order-2 relative overflow-visible border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-blue-600 text-white px-6 py-2 flex items-center gap-2 whitespace-nowrap shadow-lg">
                <Flame className="w-4 h-4" />
                Tylko dla pierwszych 100 twórców!
              </Badge>
            </div>
            <CardContent className="p-8 pt-12">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  PEŁNY DOSTĘP
                </h3>
                <div className="text-4xl font-bold text-blue-600">
                  {strategyPrice} zł
                </div>
              </div>

              <div className="border-t border-blue-200 my-6"></div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">
                    Kurs: krok po kroku do strategii
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">
                    Pełny dostęp do AI-pomocnika
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Rocket className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">
                    Do konkretnej pracy nad marką
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">100 kredytów w pakiecie</span>
                </div>
              </div>

              <div className="border-t border-blue-200 my-6"></div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleProPlan}
              >
                Zbuduj swoją strategię treści
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="text-center mt-12 max-w-2xl mx-auto">
          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <span>🔒 Bezpieczne płatności przez Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
