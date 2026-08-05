import React, { useState } from "react";
import { 
  Sparkles,
  Sun, 
  Moon, 
  Zap, 
  Bot, 
  Database, 
  LayoutDashboard, 
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Menu,
  X,
  ChevronRight,
  Shield,
  Briefcase,
  UserCheck,
  Search,
  Target,
  Bell
} from "lucide-react";
import { formatINR } from "../utils/formatters";
import { NotificationDropdown } from "./NotificationDropdown";
import { NotificationsDrawer } from "./NotificationsDrawer";

export type PageId = "investments" | "dashboard" | "ledger" | "tax-hub" | "aa-hub" | "ai-advisor" | "profile" | "search";

interface HeaderProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  totalNetWorth: number;
  techPercentage: number;
  onOpenAAModal: () => void;
  lastSyncedAt: string;
  isSyncing: boolean;
  onRefreshSync: () => void;
  isOptimized: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onRunOptimization?: () => void;
  onOpenGoalDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  totalNetWorth,
  techPercentage,
  onOpenAAModal,
  lastSyncedAt,
  isSyncing,
  onRefreshSync,
  isOptimized,
  theme,
  onToggleTheme,
  onRunOptimization,
  onOpenGoalDrawer,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const isHighRisk = techPercentage > 35;
  const isDark = theme === "dark";

  const navItems: Array<{ 
    id: PageId; 
    label: string; 
    description: string;
    icon: React.FC<{ className?: string }>; 
    badge?: string 
  }> = [
    { 
      id: "investments", 
      label: "Dashboard", 
      description: "Portfolio Graphical & Standard Ledger views",
      icon: Briefcase 
    },
    { 
      id: "tax-hub", 
      label: "Tax & Optimization", 
      description: "Harvest short-term losses",
      icon: Zap
    },
    { 
      id: "aa-hub", 
      label: "Account Aggregator", 
      description: "RBI-backed encrypted live financial feeds (FIPs)",
      icon: Database, 
      badge: "Connected" 
    },
    { 
      id: "search", 
      label: "Global Search", 
      description: "Search holdings, sectors, actions",
      icon: Search 
    },
    { 
      id: "profile", 
      label: "Profile & Settings", 
      description: "Google Pay / PhonePe styled profile, linked feeds, risk & preferences",
      icon: UserCheck, 
      badge: "SEBI KYC" 
    },
  ];

  const topNavItems = navItems;

  const handleSelectPage = (id: PageId) => {
    setActivePage(id);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark 
          ? "bg-slate-900/95 border-slate-800 text-white shadow-xl shadow-slate-950/20" 
          : "bg-white/95  text-slate-900 shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Hamburger Three Lines Button + Logo & Brand */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Three Lines Menu Button */}
              <button
                id="three-lines-menu-button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center group ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-teal-400 border-slate-700 hover:border-teal-500/50"
                    : "bg-slate-100 hover:bg-slate-200 text-teal-700 border-slate-300 hover:border-teal-400"
                }`}
                title="Toggle Side Navigation Panel"
              >
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <div className="flex items-center gap-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className={`text-lg md:text-xl font-extrabold tracking-tight font-sans ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      OmniWealth
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Metrics & Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {isHighRisk && (
                <button
                  onClick={() => setActivePage("tax-hub")}
                  className={`hidden md:flex items-center px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer hover:bg-rose-100 hover:text-rose-950 hover:scale-105 ${
                    isDark ? "bg-rose-50 text-rose-700 border-rose-500/30" : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                  title="Click to open Risk Diagnosis & Rebalancing"
                >
                  Tech Risk {techPercentage.toFixed(1)}%
                </button>
              )}

              {/* Create Goal Button */}
              <button
                onClick={onOpenGoalDrawer}
                id="create-goal-header-button"
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isDark
                    ? "bg-teal-500/10 hover:bg-teal-50 text-teal-700 rounded-full border border-teal-500/20"
                    : "bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200"
                }`}
                title="Create Financial Goal"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Goal</span>
              </button>

              {/* Global Search Button */}
              <button
                onClick={() => setActivePage("search")}
                id="search-header-button"
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                }`}
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* AI Smart Alerts / Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  id="notifications-header-button"
                  className={`p-2 rounded-xl border transition cursor-pointer relative group ${
                    isNotificationsOpen
                      ? isDark ? "bg-slate-800 border-teal-500/50 text-teal-400" : "bg-white border-teal-500/50 text-teal-600 shadow-sm"
                      : isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                  }`}
                  title="Smart Alerts"
                >
                  <Bell className={`w-4 h-4 transition-transform group-hover:rotate-12 ${isNotificationsOpen ? "fill-current" : ""}`} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </button>

                <NotificationDropdown 
                  isOpen={isNotificationsOpen} 
                  onClose={() => setIsNotificationsOpen(false)}
                  theme={theme}
                  onSimulateRebalance={() => {
                    setActivePage("investments");
                    onRunOptimization?.();
                  }}
                  onGoToTaxHub={() => setActivePage("tax-hub")}
                  onViewAll={() => setIsNotificationsDrawerOpen(true)}
                />
              </div>


              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleTheme}
                id="theme-toggle-header-button"
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700"
                    : "bg-slate-100 hover:bg-slate-200 text-indigo-700 border-slate-300"
                }`}
                title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </div>

          </div>

          {/* Main Top Navigation Bar (Shows only current page indicator) */}
          <nav className={`mt-3 pt-2.5 border-t flex items-center gap-2 overflow-x-auto scrollbar-none ${
            isDark ? "border-slate-800/80" : ""
          }`}>
            {topNavItems
              .filter((item) => {
                const isActive = activePage === item.id || (item.id === "investments" && (activePage === "dashboard" || activePage === "ledger"));
                return isActive;
              })
              .map((item) => {
                const Icon = item.icon;
                const isActive = true;

                return (
                  <button
                    key={item.id}
                    id={`top-navbar-item-${item.id}`}
                    onClick={() => setActivePage(item.id)}
                    title={item.label}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border bg-gradient-to-r from-teal-600 via-teal-600 to-cyan-600 text-white border-teal-500 shadow-md shadow-teal-950/20"
                  >
                    <Icon className="w-4 h-4 text-white" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-white/20 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>

        </div>
      </header>

      {/* Side Navigation Bar Drawer (opened with three lines button) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Side Drawer Panel */}
          <aside 
            id="side-nav-drawer"
            className={`relative z-10 w-full max-w-xs sm:max-w-sm h-full shadow-2xl flex flex-col justify-between p-6 border-r animate-in slide-in-from-left duration-300 transition-colors ${
              isDark 
                ? "bg-slate-900 border-slate-800 text-white" 
                : "bg-white  text-slate-900"
            }`}
          >
            <div>
              {/* Drawer Header */}
              <div className={`flex items-center justify-between pb-4 border-b ${
                isDark ? "border-slate-800" : ""
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/20">
                    <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                      isDark ? "bg-slate-950" : "bg-white"
                    }`}>
                      <Sparkles className="w-4.5 h-4.5 text-teal-500" />
                    </div>
                  </div>
                  <div>
                    <h2 className={`font-extrabold text-base tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                      OmniWealth AI Navigation
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className={`p-1.5 rounded-xl border transition cursor-pointer ${
                    isDark 
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Vertical Navigation Items */}
              <div className="mt-5 space-y-2">

                {navItems
                  .filter((item) => item.id !== "search")
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id || (item.id === "investments" && (activePage === "dashboard" || activePage === "ledger"));

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectPage(item.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-teal-600 to-teal-600 text-white border-teal-500 shadow-md shadow-teal-950/20"
                            : isDark
                            ? "bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:text-white"
                            : "bg-slate-50 hover:bg-slate-100  text-slate-700 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl border shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white border-white/30"
                              : isDark ? "bg-slate-800 text-teal-400 border-slate-700" : "bg-white text-teal-700 "
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs">{item.label}</span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                          isActive ? "text-white" : isDark ? "text-slate-600" : "text-slate-400"
                        }`} />
                      </button>
                    );
                  })}
              </div>
            </div>
          </aside>
        </div>
      )}

      <NotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        theme={theme}
        onGoToTaxHub={() => setActivePage("tax-hub")}
        onSimulateRebalance={() => {
          setActivePage("investments");
          onRunOptimization?.();
        }}
      />
    </>
  );
};

