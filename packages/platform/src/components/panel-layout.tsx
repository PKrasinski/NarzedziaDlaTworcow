"use client";

import { useQuery } from "@/arc-provider";
import { useAuth } from "@/auth-provider";
import { Logo } from "@narzedziadlatworcow.pl/ui/components/logo";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@narzedziadlatworcow.pl/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@narzedziadlatworcow.pl/ui/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@narzedziadlatworcow.pl/ui/components/ui/hover-card";
import { useWindowScroll } from "@uidotdev/usehooks";
import { useDesignSystem } from "design-system";
import {
  ChevronDown,
  Coins,
  Crown,
  FileText,
  LogOut,
  Menu,
  Plus,
  Settings,
} from "lucide-react";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChatProvider } from "../providers/chat-provider";
import { useAccountWorkspaces } from "./account-workspace-provider";

interface PanelLayoutProps {
  children: ReactNode;
  className?: string;
}

const WORKSPACE_GRADIENTS = [
  "from-purple-500 to-pink-500",
  "from-yellow-500 to-orange-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-indigo-500",
  "from-rose-500 to-red-500",
  "from-teal-500 to-cyan-500",
];

function getWorkspaceGradient(index: number): string {
  return WORKSPACE_GRADIENTS[index % WORKSPACE_GRADIENTS.length];
}

export function PanelLayout({ children, className }: PanelLayoutProps) {
  const { Button } = useDesignSystem();
  const { logout } = useAuth();
  const [user] = useQuery((q) => q.myUserAccount.findOne({}), [], "my-user");
  const [credits] = useQuery((q) => q.credits.findOne({}), [], "credits");
  const location = useLocation();
  const [{ y }] = useWindowScroll();
  const { accountWorkspaces, currentAccount, setCurrentAccount } =
    useAccountWorkspaces();

  const navigationItems = [
    {
      label: "Strategia",
      path: "/strategy",
      icon: <Crown className="w-4 h-4" />,
      description: "Planuj i optymalizuj swoją strategię",
    },
    {
      label: "Treści",
      path: "/",
      icon: <FileText className="w-4 h-4" />,
      description: "Zarządzaj treściami i pomysłami",
    },
  ];

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-landing relative overflow-hidden">
        <div
          className={`min-h-screen flex flex-col relative z-10 ${
            className || ""
          }`}
        >
          {/* Modern Dashboard Navbar */}
          <header
            className={`pr-[var(--removed-body-scroll-bar-size)] fixed top-0 z-30 w-full transition-colors duration-300 backdrop-blur-xl border-b border-white/20 ${
              y && y > 0 ? "bg-white/60" : "bg-transparent"
            }`}
          >
            <div className="px-4 sm:px-6">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-6">
                  <Link to="/" className="transition-all-smooth flex">
                    <Logo showText={false} className="block md:hidden" />
                    <Logo showText={true} className="hidden md:flex" />
                  </Link>

                  {/* Account Workspace Selector - Desktop */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200/50 hover:bg-white/5 transition-all duration-300"
                      >
                        <Avatar className="h-7 w-7 rounded-lg">
                          <AvatarFallback
                            className={`rounded-lg bg-gradient-to-br ${getWorkspaceGradient(
                              accountWorkspaces.findIndex(
                                (a) => a._id === currentAccount?._id
                              )
                            )} text-white font-semibold`}
                          >
                            {currentAccount?.creatorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-700">
                          {currentAccount?.creatorName}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-72 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-xl border-0 border border-white/20 p-2"
                    >
                      <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-500">
                        Twoje konta twórcy
                      </DropdownMenuLabel>
                      {accountWorkspaces.map((account, index) => (
                        <DropdownMenuItem
                          key={account._id}
                          onClick={() => setCurrentAccount(account._id)}
                          className={`rounded-xl transition-colors py-2.5 px-3 my-1 ${
                            currentAccount?._id === account._id
                              ? "bg-blue-50/80 text-blue-600"
                              : "hover:bg-gray-50/80"
                          }`}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarFallback
                                className={`rounded-lg bg-gradient-to-br ${getWorkspaceGradient(
                                  index
                                )} text-white font-semibold`}
                              >
                                {account.creatorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1">
                              <span className="font-medium">
                                {account.creatorName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {account.platforms.join(", ")}
                              </span>
                            </div>
                            {currentAccount?._id === account._id && (
                              <Link
                                to={`/workspace-settings`}
                                className="p-1.5 hover:bg-gray-100/80 rounded-lg transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Settings className="w-4 h-4 text-gray-500" />
                              </Link>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator className="my-2 bg-gray-100/50" />
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl hover:bg-gray-50/80 transition-colors py-2.5 px-3 my-1"
                      >
                        <Link
                          to="/create-account"
                          className="flex items-center gap-3"
                        >
                          <div className="h-8 w-8 rounded-lg bg-gray-100/80 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-medium text-gray-600">
                            Dodaj nowe konto
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Account Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="md:hidden flex items-center gap-2 px-2 py-2 rounded-xl border border-gray-200/50 hover:bg-white/5 transition-all duration-300"
                      >
                        <Avatar className="h-6 w-6 rounded-lg">
                          <AvatarFallback
                            className={`rounded-lg bg-gradient-to-br ${getWorkspaceGradient(
                              accountWorkspaces.findIndex(
                                (a) => a._id === currentAccount?._id
                              )
                            )} text-white font-semibold`}
                          >
                            {currentAccount?.creatorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-72 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-xl border-0 border border-white/20 p-2"
                    >
                      <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-500">
                        Twoje konta twórcy
                      </DropdownMenuLabel>
                      {accountWorkspaces.map((account, index) => (
                        <DropdownMenuItem
                          key={account._id}
                          onClick={() => setCurrentAccount(account._id)}
                          className={`rounded-xl transition-colors py-2.5 px-3 my-1 ${
                            currentAccount?._id === account._id
                              ? "bg-blue-50/80 text-blue-600"
                              : "hover:bg-gray-50/80"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarFallback
                                className={`rounded-lg bg-gradient-to-br ${getWorkspaceGradient(
                                  index
                                )} text-white font-semibold`}
                              >
                                {account.creatorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {account.creatorName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {account.platforms.join(", ")}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator className="my-2 bg-gray-100/50" />
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl hover:bg-gray-50/80 transition-colors py-2.5 px-3 my-1"
                      >
                        <Link
                          to="/create-account"
                          className="flex items-center gap-3"
                        >
                          <div className="h-8 w-8 rounded-lg bg-gray-100/80 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-medium text-gray-600">
                            Dodaj nowe konto
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex space-x-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5 flex items-center space-x-2 ${
                          location.pathname === item.path ||
                          (item.path !== "/" &&
                            location.pathname.startsWith(item.path))
                            ? "text-blue-600 bg-blue-50/80 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {user && (
                  <div className="flex items-center gap-2 md:gap-4">
                    {/* Credits Display */}
                    <HoverCard openDelay={0} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <Link
                          to="/buy-credits"
                          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full cursor-pointer hover:from-yellow-100 hover:to-orange-100 transition-all duration-300 shadow-sm border border-yellow-200/50"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Coins className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-700">
                            {(credits as any)?.amount || 0}
                          </span>
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 border-0 shadow-2xl rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">
                            Twoje kredyty
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>• 1 kredyt = 1 wygenerowany scenariusz</p>
                            <p>• 1 kredyt = 1 edycja scenariusza przez AI</p>
                          </div>
                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                          >
                            <Link to="/buy-credits">Kup więcej kredytów</Link>
                          </Button>
                        </div>
                      </HoverCardContent>
                    </HoverCard>

                    {/* Mobile Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="md:hidden">
                        <div className="p-1 hover:bg-white/5 transition-all duration-300 rounded-xl">
                          <Menu className="h-6 w-6" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={16}
                        className="w-screen shadow-2xl bg-white/90 backdrop-blur-xl border-0 border border-white/20 p-2 mt-2 animate-in slide-in-from-top-2"
                      >
                        <div className="px-4 py-3 mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-white/50">
                              <AvatarImage
                                src={(user as any)?.avatar}
                                alt={(user as any)?.nameAndSurname}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                                {(user as any)?.nameAndSurname?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {(user as any)?.nameAndSurname}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(user as any)?.email}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Navigation Section */}
                        <div className="p-2">
                          <div className="text-sm font-medium text-gray-500 px-3 py-2">
                            Nawigacja
                          </div>
                          {navigationItems.map((item) => (
                            <DropdownMenuItem
                              key={item.path}
                              asChild
                              className={`rounded-xl transition-colors py-3 px-4 my-1 ${
                                location.pathname === item.path ||
                                (item.path !== "/" &&
                                  location.pathname.startsWith(item.path))
                                  ? "bg-blue-50/80 text-blue-600"
                                  : "hover:bg-gray-50/80"
                              }`}
                            >
                              <Link
                                to={item.path}
                                className="flex items-center w-full"
                              >
                                {item.icon}
                                <div className="ml-3 flex flex-col">
                                  <span className="font-medium">
                                    {item.label}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {item.description}
                                  </span>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>

                        {/* Account Section */}
                        <div className="p-2 border-t border-gray-100/50">
                          <div className="text-sm font-medium text-gray-500 px-3 py-2">
                            Konto
                          </div>

                          <DropdownMenuItem
                            asChild
                            className="rounded-xl hover:bg-gray-50/80 transition-colors py-3 px-4 my-1"
                          >
                            <Link
                              to="/settings"
                              className="flex items-center w-full"
                            >
                              <Settings className="h-4 w-4 text-gray-500" />
                              <div className="ml-3 flex flex-col">
                                <span className="font-medium">Ustawienia</span>
                                <span className="text-xs text-gray-500">
                                  Zarządzaj kontem
                                </span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            className="rounded-xl hover:bg-gray-50/80 transition-colors py-3 px-4 my-1"
                          >
                            <Link
                              to="/my-orders"
                              className="flex items-center w-full"
                            >
                              <Coins className="h-4 w-4 text-gray-500" />
                              <div className="ml-3 flex flex-col">
                                <span className="font-medium">
                                  Historia zamówień
                                </span>
                                <span className="text-xs text-gray-500">
                                  Twoje zakupy i płatności
                                </span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={logout}
                            className="rounded-xl hover:bg-red-50/80 text-red-600 transition-colors py-3 px-4 my-1"
                          >
                            <LogOut className="h-4 w-4" />
                            <div className="ml-3 flex flex-col">
                              <span className="font-medium">Wyloguj się</span>
                              <span className="text-xs text-red-400">
                                Zakończ sesję
                              </span>
                            </div>
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Desktop User Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-300"
                        >
                          <Avatar className="h-8 w-8 ring-2 ring-white/50">
                            <AvatarImage
                              src={(user as any)?.avatar}
                              alt={(user as any)?.nameAndSurname}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                              {(user as any)?.nameAndSurname?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-700">
                            {(user as any)?.nameAndSurname}
                          </span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-72 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-xl border-0 border border-white/20 p-2"
                      >
                        <div className="px-4 py-3 border-b border-gray-100/50">
                          <DropdownMenuLabel className="px-0 font-semibold text-gray-900 text-base">
                            Moje konto
                          </DropdownMenuLabel>
                          <p className="text-sm text-gray-500 mt-1">
                            {(user as any)?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <DropdownMenuItem
                            asChild
                            className="rounded-xl hover:bg-gray-50/80 transition-colors py-3 px-4 my-1"
                          >
                            <Link
                              to="/settings"
                              className="flex items-center w-full"
                            >
                              <Settings className="mr-3 h-5 w-5 text-gray-500" />
                              <div className="flex flex-col">
                                <span className="font-medium">Ustawienia</span>
                                <span className="text-xs text-gray-500">
                                  Zarządzaj kontem
                                </span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            className="rounded-xl hover:bg-gray-50/80 transition-colors py-3 px-4 my-1"
                          >
                            <Link
                              to="/my-orders"
                              className="flex items-center w-full"
                            >
                              <Coins className="mr-3 h-5 w-5 text-gray-500" />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  Historia zamówień
                                </span>
                                <span className="text-xs text-gray-500">
                                  Twoje zakupy i płatności
                                </span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        </div>
                        <div className="border-t border-gray-100/50 pt-2">
                          <DropdownMenuItem
                            onClick={logout}
                            className="rounded-xl hover:bg-red-50/80 text-red-600 transition-colors py-3 px-4 my-1"
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            <div className="flex flex-col">
                              <span className="font-medium">Wyloguj się</span>
                              <span className="text-xs text-red-400">
                                Zakończ sesję
                              </span>
                            </div>
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 relative z-10 pt-16">{children}</main>
        </div>
      </div>
    </ChatProvider>
  );
}
