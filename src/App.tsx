import React, { useState, useEffect } from "react";
import { LayoutDashboard, FileSpreadsheet, Bot, Flame, Bell, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Header, PageId } from "./components/Header";
import { GraphicalView } from "./components/GraphicalView";
import { ManualTableView } from "./components/ManualTableView";
import { AccountAggregatorPage } from "./components/AccountAggregatorPage";
import { TaxHarvestingHub } from "./components/TaxHarvestingHub";
import { OptimizationBanner } from "./components/OptimizationBanner";
import { AccountAggregatorModal } from "./components/AccountAggregatorModal";
import { AccountAggregatorSetupModal } from "./components/AccountAggregatorSetupModal";
import { AIAdvisorDrawer } from "./components/AIAdvisorDrawer";
import { UserProfilePage } from "./components/UserProfilePage";
import { GlobalSearchPage } from "./components/GlobalSearchPage";
import { CreateGoalDrawer } from "./components/CreateGoalDrawer";
import { HeroBanner } from "./components/HeroBanner";
import { LoginPage } from "./components/LoginPage";
import { INITIAL_ASSETS, INITIAL_ACCOUNT_AGGREGATORS } from "./data/initialData";
import { Asset, AccountAggregatorSource } from "./types";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [activePage, setActivePage] = useState<PageId>("investments");
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [isOptimized, setIsOptimized] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [techBeforePercent, setTechBeforePercent] = useState(65.3);

  const [riskProfile, setRiskProfile] = useState<"Conservative" | "Moderate" | "Aggressive">("Aggressive");
  const [taxSlab, setTaxSlab] = useState<"10%" | "20%" | "30%">("30%");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(true);
  const [isLedgerExpanded, setIsLedgerExpanded] = useState(true);

  const isDark = theme === "dark";
  
  // Goal Drawer State
  const [isGoalDrawerOpen, setIsGoalDrawerOpen] = useState(false);

  // Account Aggregator state
  const [isAAModalOpen, setIsAAModalOpen] = useState(false);
  const [isAASetupOpen, setIsAASetupOpen] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState("Just now");
  const [isSyncing, setIsSyncing] = useState(false);
  const [aaSources, setAASources] = useState<AccountAggregatorSource[]>(INITIAL_ACCOUNT_AGGREGATORS);

  // AI Drawer state
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  // Calculate current tech percentage dynamically
  const totalNetWorth = assets.reduce((s, a) => s + (a.value || 0), 0);
  const techValue = assets
    .filter((a) => a.sector === "Technology")
    .reduce((s, a) => s + (a.value || 0), 0);
  const currentTechPercentage = totalNetWorth > 0 ? (techValue / totalNetWorth) * 100 : 0;

  // Handle One-Click Portfolio Optimization Action
  const handleRunOptimization = () => {
    setTechBeforePercent(currentTechPercentage);

    const rebalancedAssets: Asset[] = [
      {
        id: "asset-1",
        name: "Infosys Ltd (INFY)",
        category: "Stocks",
        value: 210000,
        sector: "Technology",
        taxStatus: "STCG (20%)",
        accountSource: "Zerodha Demat (AA Synced)",
        units: 140,
        navOrPrice: 1500,
        notes: "Trimmed via Tax-Loss Harvesting to cap sector risk at 30%",
      },
      {
        id: "asset-2",
        name: "HDFC Bank Ltd (HDFCBANK)",
        category: "Stocks",
        value: 340000,
        sector: "Banking & Financials",
        taxStatus: "LTCG (12.5%)",
        accountSource: "HDFC Securities (AA Synced)",
        units: 211,
        navOrPrice: 1607,
        notes: "Reallocated into Banking & Financials",
      },
      {
        id: "asset-3",
        name: "Tech Growth Opportunities Fund",
        category: "Mutual Funds",
        value: 144000,
        sector: "Technology",
        taxStatus: "LTCG (12.5%)",
        accountSource: "CAMS Mutual Fund Folio (AA Synced)",
        units: 1107,
        navOrPrice: 130,
        notes: "Rebalanced to optimal 30% sector target",
      },
      {
        id: "asset-4",
        name: "Sovereign Gold Bond (SGB 2028-IV)",
        category: "Sovereign Gold Bonds",
        value: 486000,
        sector: "Gold & Commodities",
        taxStatus: "Tax Exempt (Maturity)",
        accountSource: "RBI Vault / NSDL (AA Synced)",
        units: 74,
        navOrPrice: 6571,
        notes: "Increased allocation to tax-free sovereign gold",
      },
    ];

    setAssets(rebalancedAssets);
    setIsOptimized(true);
    setShowSuccessBanner(true);
  };

  // Reset to default 65% concentration state
  const handleResetToDefault = () => {
    setAssets(INITIAL_ASSETS);
    setIsOptimized(false);
    setShowSuccessBanner(false);
  };

  // Asset Ledger CRUD Operations
  const handleUpdateAsset = (id: string, updated: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const handleAddAsset = (newAssetData: Omit<Asset, "id">) => {
    const newAsset: Asset = {
      ...newAssetData,
      id: `asset-${Date.now()}`,
    };
    setAssets((prev) => [...prev, newAsset]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDuplicateAsset = (asset: Asset) => {
    const dupAsset: Asset = {
      ...asset,
      id: `asset-${Date.now()}`,
      name: `${asset.name} (Copy)`,
    };
    setAssets((prev) => [...prev, dupAsset]);
  };

  // Refresh Account Aggregator Sync Simulation
  const handleRefreshSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedAt("Just now");
    }, 800);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} isDark={isDark} />;
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-teal-500 selection:text-slate-950 flex flex-col justify-between transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-gray-100 text-slate-900"
    }`}>
      
      {/* App Header with Fixed Top Navigation Bar */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        totalNetWorth={totalNetWorth}
        techPercentage={currentTechPercentage}
        onOpenAAModal={() => setIsAAModalOpen(true)}
        lastSyncedAt={lastSyncedAt}
        isSyncing={isSyncing}
        onRefreshSync={handleRefreshSync}
        isOptimized={isOptimized}
        theme={theme}
        onToggleTheme={toggleTheme}
        onRunOptimization={handleRunOptimization}
        onOpenGoalDrawer={() => setIsGoalDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Success Banner when 1-Click Optimization is executed */}
        {showSuccessBanner && (
          <OptimizationBanner
            onDismiss={() => setShowSuccessBanner(false)}
            onReset={handleResetToDefault}
            savedAmountINR={12400}
            techBefore={techBeforePercent}
            techAfter={currentTechPercentage}
            theme={theme}
          />
        )}

        {/* Page Routing */}
        {(activePage === "investments" || activePage === "dashboard" || activePage === "ledger") && (
          <div className="space-y-10">
            <HeroBanner totalValue={totalNetWorth} />
            {/* Unified Investments View */}
            <div className="space-y-8">
              
              {/* 1. Analytics & Visualizations */}
              <div className="space-y-4">
                <button 
                  onClick={() => setIsAnalyticsExpanded(!isAnalyticsExpanded)}
                  className="flex items-center justify-between w-full px-2 group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className={`w-4 h-4 transition-colors ${isAnalyticsExpanded ? "text-teal-500" : "text-slate-400"}`} />
                    <h2 className={`text-sm font-black uppercase tracking-wider transition-colors ${
                      isAnalyticsExpanded 
                        ? (isDark ? "text-slate-200" : "text-slate-900") 
                        : (isDark ? "text-slate-500" : "text-slate-400")
                    }`}>Portfolio Analytics</h2>
                  </div>
                  <motion.div
                    animate={{ rotate: isAnalyticsExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className={`w-4 h-4 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isAnalyticsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <GraphicalView
                        assets={assets}
                        techPercentage={currentTechPercentage}
                        isOptimized={isOptimized}
                        onRunOptimization={handleRunOptimization}
                        theme={theme}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Asset Ledger (Manual Table) */}
              <div className="space-y-4">
                <button 
                  onClick={() => setIsLedgerExpanded(!isLedgerExpanded)}
                  className="flex items-center justify-between w-full px-2 group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className={`w-4 h-4 transition-colors ${isLedgerExpanded ? "text-teal-500" : "text-slate-400"}`} />
                    <h2 className={`text-sm font-black uppercase tracking-wider transition-colors ${
                      isLedgerExpanded 
                        ? (isDark ? "text-slate-200" : "text-slate-900") 
                        : (isDark ? "text-slate-500" : "text-slate-400")
                    }`}>INVESTMENTS</h2>
                  </div>
                  <motion.div
                    animate={{ rotate: isLedgerExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className={`w-4 h-4 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isLedgerExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ManualTableView
                        assets={assets}
                        onUpdateAsset={handleUpdateAsset}
                        onAddAsset={handleAddAsset}
                        onDeleteAsset={handleDeleteAsset}
                        onDuplicateAsset={handleDuplicateAsset}
                        onResetToDefault={handleResetToDefault}
                        onOpenAASetup={() => setIsAASetupOpen(true)}
                        theme={theme}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {activePage === "aa-hub" && (
          <AccountAggregatorPage
            sources={aaSources}
            lastSyncedAt={lastSyncedAt}
            isSyncing={isSyncing}
            onRefreshSync={handleRefreshSync}
            onOpenAASetup={() => setIsAASetupOpen(true)}
            theme={theme}
          />
        )}

        {activePage === "tax-hub" && (
          <div className="space-y-6">
            <TaxHarvestingHub
              assets={assets}
              isOptimized={isOptimized}
              onRunOptimization={handleRunOptimization}
              techPercentage={currentTechPercentage}
              theme={theme}
              riskProfile={riskProfile}
              taxSlab={taxSlab}
              setRiskProfile={setRiskProfile}
              setTaxSlab={setTaxSlab}
            />
          </div>
        )}

        {activePage === "profile" && (
          <UserProfilePage
            theme={theme}
            onToggleTheme={toggleTheme}
            sources={aaSources}
            onOpenAAModal={() => setIsAAModalOpen(true)}
            totalNetWorth={totalNetWorth}
            assets={assets}
            riskProfile={riskProfile}
            taxSlab={taxSlab}
            onNavigateToTax={() => setActivePage("tax-hub")}
            onNavigateToAA={() => setActivePage("aa-hub")}
            onLogout={() => setIsAuthenticated(false)}
          />
        )}

        {activePage === "search" && (
          <GlobalSearchPage
            theme={theme}
            assets={assets}
            setActivePage={setActivePage}
            onRunOptimization={handleRunOptimization}
          />
        )}

      </main>

      {/* Floating AI Advisor Chat Button on Right Side */}
      <button
        id="open-ai-advisor-button"
        onClick={() => setIsAIDrawerOpen(true)}
        title="Open AI Wealth Advisor"
        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-cyan-300/30 font-black text-xs uppercase tracking-widest"
      >
        Ask Omni
      </button>

      {/* Footer info */}
      <footer className={`mt-8 border-t py-6 px-6 text-xs transition-colors duration-300 ${
        isDark ? "border-slate-800/80 bg-slate-950/80 text-slate-500" : " bg-gray-50 text-slate-600"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-dashed border-slate-800/10 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="text-teal-600 font-extrabold uppercase tracking-wider text-xs">OmniWealth AI</span>
              <span className="text-[11px] font-medium">• Portfolio Analytics & Tax Loss Harvesting</span>
            </div>
            <div className={`flex items-center gap-4 text-[11px] font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <span>RBI AA Compliant</span>
            </div>
          </div>
          <div className="space-y-2 text-[10px] md:text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
            <p className="font-bold">
              Regulatory Disclaimer: Investments in securities markets are subject to market risks. Read all related documents carefully before investing.
            </p>
            <p>
              OmniWealth AI provides algorithmic portfolio analytics and tax optimization insights under SEBI (Investment Advisers) Regulations, 2013. Account sync powered by RBI-regulated Account Aggregator (NBFC-AA) framework.
            </p>
          </div>
        </div>
      </footer>

      {/* Account Aggregator Consent Modal */}
      <AccountAggregatorModal
        isOpen={isAAModalOpen}
        onClose={() => setIsAAModalOpen(false)}
        sources={aaSources}
        lastSyncedAt={lastSyncedAt}
        isSyncing={isSyncing}
        onRefresh={handleRefreshSync}
        theme={theme}
      />

      {/* Account Aggregator Setup Modal */}
      <AccountAggregatorSetupModal
        isOpen={isAASetupOpen}
        onClose={() => setIsAASetupOpen(false)}
        onSuccess={() => handleRefreshSync()}
        theme={theme}
      />

      {/* AI Advisor Chat Drawer */}
      <AIAdvisorDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        assets={assets}
        techPercentage={currentTechPercentage}
        theme={theme}
      />

      {/* Create Financial Goal Drawer */}
      <CreateGoalDrawer
        isOpen={isGoalDrawerOpen}
        onClose={() => setIsGoalDrawerOpen(false)}
        theme={theme}
      />
    </div>
  );
}
