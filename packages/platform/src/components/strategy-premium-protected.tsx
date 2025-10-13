"use client";

import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountWorkspaces } from "./account-workspace-provider";

interface StrategyPremiumProtectedProps {
  children: ReactNode;
}

export function StrategyPremiumProtected({
  children,
}: StrategyPremiumProtectedProps) {
  const { currentAccount, isLoading } = useAccountWorkspaces();
  const navigate = useNavigate();

  // Check if user has premium access (has purchased strategy agent service)
  const hasPremiumAccess = currentAccount?.hasAccessToStrategyAgentService;

  useEffect(() => {
    if (!isLoading && !hasPremiumAccess) {
      navigate("/course");
    }
  }, [hasPremiumAccess, navigate, isLoading]);

  // Show loading while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show loading while redirecting if no premium access
  if (!hasPremiumAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
