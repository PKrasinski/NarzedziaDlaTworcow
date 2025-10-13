"use client";

import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountWorkspaces } from "./account-workspace-provider";

interface OnboardingProtectedProps {
  children: ReactNode;
}

export function OnboardingProtected({ children }: OnboardingProtectedProps) {
  const { currentAccount, isLoading: accountLoading } = useAccountWorkspaces();
  const navigate = useNavigate();

  // Wait for account to load
  const isLoading = accountLoading;

  // Check if user needs to choose a plan
  // Allow access if: has completed onboarding OR has premium access
  // Redirect to plan selection if: has NEITHER completed onboarding NOR premium access
  console.log(currentAccount);
  const needsPlanSelection =
    currentAccount &&
    !currentAccount.hasCompletedOnboarding &&
    !currentAccount.hasAccessToStrategyAgentService;

  // Debug logging
  console.log("OnboardingProtected Debug:", {
    hasAccount: !!currentAccount,
    hasCompletedOnboarding: currentAccount?.hasCompletedOnboarding,
    hasAccessToStrategyAgentService:
      currentAccount?.hasAccessToStrategyAgentService,
    needsPlanSelection,
    isLoading,
  });

  useEffect(() => {
    if (!isLoading && needsPlanSelection) {
      navigate("/choose-plan");
    }
  }, [needsPlanSelection, navigate, isLoading]);

  // Show loading while data is being fetched or redirecting
  if (isLoading || needsPlanSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
