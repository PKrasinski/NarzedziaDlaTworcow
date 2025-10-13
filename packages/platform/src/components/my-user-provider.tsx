"use client";

import { useQuery } from "@/arc-provider";
import { ArcViewRecord } from "@arcote.tech/arc";
import { myUser } from "@narzedziadlatworcow.pl/context/browser";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type MyUserContextType =
  | {
      user: ArcViewRecord<typeof myUser>;
      isLoading: false;
    }
  | {
      user: undefined;
      isLoading: true;
    };

const MyUserContext = createContext<MyUserContextType | undefined>(undefined);

interface MyUserProviderProps {
  children: ReactNode;
}

export function MyUserProvider({ children }: MyUserProviderProps) {
  const navigate = useNavigate();
  const [user, isLoading] = useQuery(
    (q) => q.myUserAccount.findOne({}),
    [],
    "my-user"
  );
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/sign-in");
    }
  }, [user, isLoading]);
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <MyUserContext.Provider value={{ user, isLoading } as any}>
      {children}
    </MyUserContext.Provider>
  );
}

export function useMyUser() {
  const context = useContext(MyUserContext);
  if (context === undefined) {
    throw new Error("useMyUser must be used within a MyUserProvider");
  }
  return context;
}
