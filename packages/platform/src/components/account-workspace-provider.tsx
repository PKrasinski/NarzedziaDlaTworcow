"use client";

import { useQuery } from "@/arc-provider";
import { ArcViewRecord } from "@arcote.tech/arc";
import { accountWorkspaces } from "@narzedziadlatworcow.pl/context/browser";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AccountWorkspaceContextType {
  accountWorkspaces: ArcViewRecord<typeof accountWorkspaces>[];
  currentAccount: ArcViewRecord<typeof accountWorkspaces>;
  isLoading: boolean;
  setCurrentAccount: (accountId: string) => void;
  hasAccounts: boolean;
}

const AccountWorkspaceContext = createContext<
  AccountWorkspaceContextType | undefined
>(undefined);

interface AccountWorkspaceProviderProps {
  children: ReactNode;
}

export function AccountWorkspaceProvider({
  children,
}: AccountWorkspaceProviderProps) {
  const [accountWorkspaces, loading] = useQuery(
    (q) => q.accountWorkspaces.find({ orderBy: { _id: "asc" } }),
    [],
    "account-workspaces"
  );
  const navigate = useNavigate();
  const location = useLocation();

  const [currentAccountId, setCurrentAccountId] = useLocalStorage<string>(
    "currentAccountWorkspaceId",
    undefined
  );

  const hasAccounts = accountWorkspaces && accountWorkspaces.length > 0;

  // Find current account or default to first account
  const currentAccount = useMemo(() => {
    if (!accountWorkspaces || accountWorkspaces.length === 0) {
      return null;
    }

    // Try to find the stored current account
    if (currentAccountId) {
      const found = accountWorkspaces.find(
        (account: (typeof accountWorkspaces)[number]) =>
          account._id === currentAccountId
      );
      if (found) {
        return found;
      }
    }

    // Default to first account if stored account not found
    return accountWorkspaces[0];
  }, [accountWorkspaces, currentAccountId]);

  // Update localStorage when current account changes
  useEffect(() => {
    if (currentAccount && currentAccount._id !== currentAccountId) {
      setCurrentAccountId(currentAccount._id);
    }
  }, [currentAccount, currentAccountId, setCurrentAccountId]);

  // Handle navigation when no accounts exist
  useEffect(() => {
    if (!loading && accountWorkspaces !== undefined && !hasAccounts) {
      // Only redirect to create-account if we're not already there
      if (location.pathname !== "/create-account") {
        navigate("/create-account");
      }
    }
  }, [accountWorkspaces, hasAccounts, navigate, loading, location.pathname]);

  const setCurrentAccount = useCallback(
    (accountId: string) => {
      setCurrentAccountId(accountId);
    },
    [setCurrentAccountId]
  );

  const contextValue: AccountWorkspaceContextType = {
    accountWorkspaces: accountWorkspaces || [],
    currentAccount: currentAccount as any,
    isLoading: loading,
    setCurrentAccount,
    hasAccounts: hasAccounts || false,
  };

  // Show loading while checking account workspaces
  if (accountWorkspaces === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user doesn't have account workspaces and we're not on create-account page, show loading while redirecting
  if (!hasAccounts && location.pathname !== "/create-account") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AccountWorkspaceContext.Provider value={contextValue}>
      {children}
    </AccountWorkspaceContext.Provider>
  );
}

export function useAccountWorkspaces() {
  const context = useContext(AccountWorkspaceContext);
  if (context === undefined) {
    throw new Error(
      "useAccountWorkspaces must be used within an AccountWorkspaceProvider"
    );
  }
  return context;
}
