import React, { useState, useEffect } from "react";
import { 
  Search, 
  Zap, 
  Database, 
  LayoutDashboard, 
  FileSpreadsheet,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  Download,
  Briefcase,
  History,
  Clock,
  ArrowRight
} from "lucide-react";
import { Asset } from "../types";
import { formatINR } from "../utils/formatters";
import { PageId } from "./Header";

interface GlobalSearchPageProps {
  theme: "dark" | "light";
  assets: Asset[];
  setActivePage: (page: PageId) => void;
  onRunOptimization?: () => void;
}

type FilterType = "All" | "My Assets" | "Sectors" | "Actions";

export const GlobalSearchPage: React.FC<GlobalSearchPageProps> = ({
  theme,
  assets,
  setActivePage,
  onRunOptimization
}) => {
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // Data for default state
  const recentSearches = [
    "HDFC Bank",
    "Tax-loss harvesting",
    "Technology sector risk",
    "Mutual funds"
  ];

  const allActions = [
    { id: "tax-harvesting", label: "Run Tax Harvesting", description: "Optimize portfolio and save taxes", icon: Zap, onClick: onRunOptimization || (() => setActivePage("tax-hub")) },
    { id: "sync-aa", label: "Sync Account Aggregator", description: "Refresh all linked bank and broker feeds", icon: Database, onClick: () => setActivePage("aa-hub") },
    { id: "profile-edit", label: "Edit Profile & KYC", description: "Manage identity, biometric lock and preferences", icon: UserCheck, onClick: () => setActivePage("profile") },
    { id: "import-cas", label: "Import CAS PDF", description: "Upload CAMS/KFintech statement", icon: FileSpreadsheet, onClick: () => setActivePage("profile") },
    { id: "export-portfolio", label: "Export Portfolio", description: "Download valuation and tax summary", icon: Download, onClick: () => setActivePage("profile") },
  ];

  // Group assets by sector for sector insights
  const sectorMap = assets.reduce((acc, asset) => {
    if (!acc[asset.sector]) {
      acc[asset.sector] = { totalValue: 0, assets: [] };
    }
    acc[asset.sector].totalValue += (asset.value || 0);
    acc[asset.sector].assets.push(asset);
    return acc;
  }, {} as Record<string, { totalValue: number, assets: Asset[] }>);
  
  const totalNetWorth = assets.reduce((sum, a) => sum + (a.value || 0), 0);

  // Search logic
  const normalizedQuery = debouncedQuery.toLowerCase().trim();
  
  const matchedAssets = normalizedQuery 
    ? assets.filter(a => 
        a.name.toLowerCase().includes(normalizedQuery) || 
        a.category.toLowerCase().includes(normalizedQuery) ||
        a.sector.toLowerCase().includes(normalizedQuery) ||
        a.accountSource.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const matchedActions = normalizedQuery
    ? allActions.filter(act => 
        act.label.toLowerCase().includes(normalizedQuery) || 
        act.description.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const matchedSectors = normalizedQuery
    ? Object.keys(sectorMap).filter(sec => sec.toLowerCase().includes(normalizedQuery))
    : [];

  const hasResults = matchedAssets.length > 0 || matchedActions.length > 0 || matchedSectors.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header title block */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Global Search
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Instantly find holdings, analyze sector risks, or trigger app actions
          </p>
        </div>
      </div>

      {/* Main Search Input & Filters Container */}
      <div className={`p-4 sm:p-5 rounded-3xl border shadow-lg transition-all ${
        isDark
          ? "bg-slate-900/90 border-slate-800"
          : "bg-white "
      }`}>
        
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
          </div>
          <input
            type="text"
            className={`w-full pl-11 pr-4 py-4 rounded-2xl border text-base sm:text-lg font-semibold outline-none transition-all shadow-inner focus:ring-2 focus:ring-teal-500/50 ${
              isDark 
                ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500" 
                : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
            }`}
            placeholder="Search holdings, sectors, tax insights, or app actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className={`absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer ${
                isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "bg-slate-800" : "bg-slate-200"
              }`}>Clear</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {(["All", "My Assets", "Sectors", "Actions"] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                activeFilter === filter
                  ? isDark 
                    ? "bg-slate-200 text-slate-900 border-transparent shadow-sm"
                    : "bg-slate-800 text-white border-transparent shadow-sm"
                  : isDark
                    ? "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                    : "bg-white text-slate-600  hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* DEFAULT STATE (Before Typing) */}
      {!normalizedQuery && (
        <div className="grid grid-cols-1 gap-6">
          
          {/* Recent Searches */}
          <div className={`p-5 rounded-3xl border transition-all ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white "
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              <History className="w-3.5 h-3.5" />
              Recent Searches
            </h3>
            <div className="space-y-1">
              {recentSearches.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(item)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                    isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <Clock className={`w-4 h-4 shrink-0 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
                  <span className="text-sm font-semibold truncate">{item}</span>
                  <ArrowRight className={`w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NO RESULTS STATE */}
      {normalizedQuery && !hasResults && (
        <div className={`p-10 rounded-3xl border text-center transition-all ${
          isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 "
        }`}>
          <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isDark ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-400"
          }`}>
            <Search className="w-6 h-6" />
          </div>
          <h3 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
            No results found
          </h3>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            We couldn't find anything matching "{query}". Try checking for typos or use broader terms.
          </p>
        </div>
      )}

      {/* SEARCH RESULTS */}
      {normalizedQuery && hasResults && (
        <div className="space-y-6">
          
          {/* SECTION 1: Portfolio Holdings */}
          {(activeFilter === "All" || activeFilter === "My Assets") && matchedAssets.length > 0 && (
            <div className={`p-6 rounded-3xl border shadow-lg transition-all ${
              isDark ? "bg-slate-900/90 border-slate-800" : "bg-white "
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                <Briefcase className="w-4 h-4" />
                Portfolio Holdings ({matchedAssets.length})
              </h3>
              <div className="space-y-3">
                {matchedAssets.map((asset) => (
                  <div key={asset.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 "
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {asset.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"
                        }`}>
                          {asset.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>{asset.sector}</span>
                        <span className={`text-[10px] opacity-60 ${isDark ? "text-slate-500" : "text-slate-400"}`}>•</span>
                        <span className={`${isDark ? "text-slate-400" : "text-slate-500"} truncate max-w-[150px] sm:max-w-xs`}>
                          {asset.accountSource}
                        </span>
                      </div>
                      
                      {/* Look-Through overlap highlight if it's a mutual fund */}
                      {asset.category === "Mutual Funds" && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-bold border border-indigo-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          Look-Through: Contains overlapping Tech holdings
                        </div>
                      )}
                    </div>
                    
                    <div className="text-left sm:text-right shrink-0">
                      <div className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                        {formatINR(asset.value || 0)}
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        asset.taxStatus.includes("STCG") 
                          ? "text-amber-500" 
                          : asset.taxStatus.includes("Tax Exempt") 
                            ? "text-teal-500" 
                            : isDark ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {asset.taxStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: Sectors & Risk */}
          {(activeFilter === "All" || activeFilter === "Sectors") && matchedSectors.length > 0 && (
            <div className={`p-6 rounded-3xl border shadow-lg transition-all ${
              isDark ? "bg-slate-900/90 border-slate-800" : "bg-white "
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                <LayoutDashboard className="w-4 h-4" />
                Sectors & Risk Alerts ({matchedSectors.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedSectors.map((sectorName) => {
                  const data = sectorMap[sectorName];
                  const percent = totalNetWorth > 0 ? (data.totalValue / totalNetWorth) * 100 : 0;
                  const isOverExposed = percent > 35; // Example threshold
                  
                  return (
                    <div key={sectorName} className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      isOverExposed 
                        ? isDark ? "bg-rose-950/20 border-rose-900/50" : "bg-rose-50/50 border-rose-200"
                        : isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 "
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                            {sectorName}
                          </h4>
                          <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {data.assets.length} Assets
                          </span>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                          isOverExposed
                            ? "bg-rose-50 text-rose-700 rounded-full border-rose-500/20"
                            : "bg-teal-50 text-teal-700 rounded-full border-teal-500/20"
                        }`}>
                          {percent.toFixed(1)}% Weight
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        {isOverExposed ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span className="text-rose-500 font-medium">Over-exposed risk alert</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                            <span className="text-teal-500 font-medium">Balanced allocation</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: App Actions */}
          {(activeFilter === "All" || activeFilter === "Actions") && matchedActions.length > 0 && (
            <div className={`p-6 rounded-3xl border shadow-lg transition-all ${
              isDark ? "bg-slate-900/90 border-slate-800" : "bg-white "
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                <Zap className="w-4 h-4" />
                App Actions ({matchedActions.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {matchedActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.onClick}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isDark 
                          ? "bg-slate-950/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700" 
                          : "bg-slate-50  hover:bg-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-xl bg-gradient-to-br from-teal-600 to-teal-600 text-white shadow-md`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {action.label}
                        </h4>
                      </div>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {action.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
