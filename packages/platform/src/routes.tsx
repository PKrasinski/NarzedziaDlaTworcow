import { useEffect } from "react";
import type { RouteObject } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./auth-provider";
import {
  AccountWorkspaceProvider,
  MyUserProvider,
  OnboardingProtected,
  PanelLayout,
  StrategyPremiumProtected,
} from "./components";
import BuyCreditsPage from "./pages/buy-credits";
import ChoosePlanPage from "./pages/choose-plan";
import { ContentStatisticsPage } from "./pages/content-new/components/content-statistics";
import { ContentTasksPage } from "./pages/content-new/components/content-tasks";
// Content pages
import { AllContentPage } from "./pages/content-new/all-content";
import { ContentItemPage } from "./pages/content-new/content-item";
import { SingleContentPage } from "./pages/content-new/single-content";
import { ContentItemStatisticsPage } from "./pages/content-new/content-item-statistics";
import { ContentItemTasksPage } from "./pages/content-new/content-item-tasks";
import { ContentProvider } from "./pages/content-new/content-provider";
import { ContentTypePage } from "./pages/content-new/content-type-page";
import { FormatContentPage } from "./pages/content-new/format-content";
import { ContentItemProvider } from "./providers/content-item-provider";
import CoursePage from "./pages/course";
import CoursePaymentPage from "./pages/course-payment";
import CreateAccountPage from "./pages/create-account";
import MyOrdersPage from "./pages/my-orders";
import PaymentSuccessPage from "./pages/payment-success";
import SettingsPage from "./pages/settings";
import SignInPage from "./pages/signin/signin";
import StartPage from "./pages/start";
import StrategyIndexPage from "./pages/strategy";
import { ContentFormatsPage as StrategyContentFormatsPage } from "./pages/strategy/content-formats/content-formats";
import { ContentIdeasPage as StrategyContentIdeasPage } from "./pages/strategy/content-ideas/content-ideas";
import { CreatorGoalsPage as StrategyCreatorGoalsPage } from "./pages/strategy/creator-goals/creator-goals";
import StrategyCreatorIdentityPage from "./pages/strategy/creator-identity/creator-identity";
import { CreatorStylePage as StrategyCreatorStylePage } from "./pages/strategy/creator-style/creator-style";
import { ViewerTargetsPage as StrategyViewerTargetsPage } from "./pages/strategy/viewer-targets/viewer-targets";
import VerifyEmailPage from "./pages/verify-email";
import WorkspaceSettingsPage from "./pages/workspace-settings";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    ),
    children: [
      // Public routes
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "start",
        element: <StartPage />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccessPage />,
      },

      // All protected routes (requires authentication)
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <MyUserProvider>
              <Outlet />
            </MyUserProvider>
          </ProtectedRoute>
        ),
        children: [
          // Main app routes (requires account workspace)
          {
            path: "/",
            element: (
              <AccountWorkspaceProvider>
                <Outlet />
              </AccountWorkspaceProvider>
            ),
            children: [
              // Create first account route
              {
                path: "create-account",
                element: <CreateAccountPage />,
              },

              // Main app routes with PanelLayout
              {
                path: "/",
                element: (
                  <PanelLayout>
                    <Outlet />
                  </PanelLayout>
                ),
                children: [
                  // Onboarding routes (auth + account workspace protected)
                  {
                    path: "choose-plan",
                    element: <ChoosePlanPage />,
                  },
                  {
                    path: "course",
                    element: <CoursePage />,
                  },
                  {
                    path: "course-payment",
                    element: <CoursePaymentPage />,
                  },
                  {
                    path: "/settings",
                    element: <SettingsPage />,
                  },
                  {
                    path: "/workspace-settings",
                    element: <WorkspaceSettingsPage />,
                  },
                  {
                    path: "/my-orders",
                    element: <MyOrdersPage />,
                  },

                  // Main app routes (auth + account workspace + onboarding protected)
                  {
                    path: "/",
                    element: (
                      <OnboardingProtected>
                        <Outlet />
                      </OnboardingProtected>
                    ),
                    children: [
                      // Content routes with shared provider
                      {
                        path: "/",
                        element: (
                          <ContentProvider>
                            <Outlet />
                          </ContentProvider>
                        ),
                        children: [
                          // Home page - all content
                          {
                            index: true,
                            element: <AllContentPage />,
                          },

                          // Single content page  
                          {
                            path: "content/:id",
                            element: <SingleContentPage />,
                          },

                          // Format content page
                          {
                            path: "content/format/:formatId",
                            element: <FormatContentPage />,
                          },

                          // Content item routes with shared provider
                          {
                            path: "content/item/:itemId",
                            element: (
                              <ContentItemProvider>
                                <Outlet />
                              </ContentItemProvider>
                            ),
                            children: [
                              {
                                index: true,
                                element: <ContentItemPage />,
                              },
                              {
                                path: "statistics",
                                element: <ContentItemStatisticsPage />,
                              },
                              {
                                path: "tasks",
                                element: <ContentItemTasksPage />,
                              },
                              {
                                path: ":contentType",
                                element: <ContentTypePage />,
                              },
                            ],
                          },
                        ],
                      },

                      // Strategy routes (premium protected)
                      {
                        path: "/",
                        element: (
                          <StrategyPremiumProtected>
                            <Outlet />
                          </StrategyPremiumProtected>
                        ),
                        children: [
                          {
                            path: "/strategy",
                            element: <StrategyIndexPage />,
                          },
                          {
                            path: "/strategy/creator-identity",
                            element: <StrategyCreatorIdentityPage />,
                          },
                          {
                            path: "/strategy/creator-goals",
                            element: <StrategyCreatorGoalsPage />,
                          },
                          {
                            path: "/strategy/viewer-targets",
                            element: <StrategyViewerTargetsPage />,
                          },
                          {
                            path: "/strategy/creator-style",
                            element: <StrategyCreatorStylePage />,
                          },
                          {
                            path: "/strategy/content-formats",
                            element: <StrategyContentFormatsPage />,
                          },
                          {
                            path: "/strategy/content-ideas",
                            element: <StrategyContentIdeasPage />,
                          },
                        ],
                      },

                      {
                        path: "/buy-credits",
                        element: <BuyCreditsPage />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
