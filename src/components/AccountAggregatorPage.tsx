import React, { useState } from "react";
import { 
  ShieldCheck, 
  RefreshCw, 
  Database, 
  Server, 
  Lock, 
  CheckCircle2, 
  ArrowUpRight, 
  Shield, 
  Clock, 
  FileCheck2,
  KeyRound,
  Radio,
  ChevronDown,
  ChevronUp,
  Pause,
  Zap
} from "lucide-react";
import { AccountAggregatorSource } from "../types";
import { formatINR } from "../utils/formatters";

interface AccountAggregatorPageProps {
  sources: AccountAggregatorSource[];
  lastSyncedAt: string;
  isSyncing: boolean;
  onRefreshSync: () => void;
  onOpenAASetup: () => void;
  theme?: "dark" | "light";
}

export const AccountAggregatorPage: React.FC<AccountAggregatorPageProps> = ({
  sources,
  lastSyncedAt,
  isSyncing,
  onRefreshSync,
  onOpenAASetup,
  theme = "dark",
}) => {
  const isDark = theme === "dark";
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleAccordion = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalAggregated = sources.reduce((sum, s) => sum + s.totalValue, 0);

  const getAssetsList = (name: string) => {
    if (name.includes("NSDL") || name.includes("CDSL")) {
      return [
        { name: "Infosys Ltd", value: 450000 },
        { name: "HDFC Bank", value: 180000 }
      ];
    } else if (name.includes("CAMS") || name.includes("KFintech")) {
      return [
        { name: "Tech Growth Opportunities Fund", value: 320000 }
      ];
    } else if (name.includes("RBI Retail Direct")) {
      return [
        { name: "Sovereign Gold Bond", value: 230000 }
      ];
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden transition-colors duration-300 ${
        isDark 
          ? "bg-slate-900/80 border-slate-800 text-white shadow-xl" 
          : "bg-white  text-slate-900 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`p-2.5 rounded-2xl border ${
                isDark ? "bg-teal-50 text-teal-700 rounded-full border-teal-500/30" : "bg-teal-100 text-teal-700 border-teal-300"
              }`}>
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    RBI Account Aggregator Network Hub
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 rounded-full border border-teal-500/30">
                    Live FIP Stream
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center shrink-0">
            <div className="flex items-center shadow-md rounded-xl overflow-hidden">
              <button
                onClick={onRefreshSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50 border-r border-teal-700/50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Syncing..." : "Sync"}</span>
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            </div>
          </div>
        </div>

        {/* Network Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/60">
          <div className={`p-4 rounded-2xl border ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-white  shadow-sm"
          }`}>
            <span className={`text-[11px] font-medium block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Aggregated Net Worth
            </span>
            <span className="text-xl font-black text-teal-600">{formatINR(totalAggregated)}</span>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-white  shadow-sm"
          }`}>
            <span className={`text-[11px] font-medium block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Connected FIP Nodes
            </span>
            <span className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
              {sources.length} Active Feeds
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-white  shadow-sm"
          }`}>
            <span className={`text-[11px] font-medium block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Consent Status
            </span>
            <span className="text-xs font-bold text-teal-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Valid till July 2027
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-white  shadow-sm"
          }`}>
            <span className={`text-[11px] font-medium block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Last Successful Pulse
            </span>
            <span className={`text-xs font-bold mt-1 block ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              {lastSyncedAt}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col gap-6">
        
        {/* AA Connections Card (New) */}
        <div className={`rounded-2xl p-4 md:p-5 border shadow-md flex flex-col md:flex-row items-center justify-between gap-4 ${
          isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white  text-slate-900"
        }`}>
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-base font-bold">Account Aggregator Connections</h3>
            </div>
          </div>
          <button
            onClick={onOpenAASetup}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Zap className="w-4 h-4" /> Link New Institution via AA
          </button>
        </div>

        {/* FIP Stream Listing */}
        <div className={`rounded-3xl p-6 border shadow-xl space-y-4 ${
          isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white  text-slate-900"
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-slate-800" : ""}`}>
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-teal-500" />
              <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Financial Information Providers (FIPs)
              </h2>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
              isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 "
            }`}>
              {sources.length} Verified Institutions
            </span>
          </div>

          <div className="space-y-3">
            {sources.map((src) => {
              const isExpanded = expandedIds.has(src.id);
              const subAssets = getAssetsList(src.name);

              return (
                <div
                  key={src.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isDark 
                      ? "bg-slate-900/90 border-slate-800 shadow-xl" 
                      : "bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                  }`}
                >
                  <div
                    onClick={() => toggleAccordion(src.id)}
                    className={`p-5 md:py-6 md:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${
                      isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl border shrink-0 ${
                        isDark ? "bg-slate-800 text-teal-400 border-slate-700" : "bg-white text-teal-700  shadow-sm"
                      }`}>
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>{src.name}</h3>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${isDark ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : "bg-teal-50 text-teal-700 border-teal-200"}`}>
                            AA Consent Verified
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {src.type} • {src.assetCount} Tracked Instruments
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                      <div className="text-left sm:text-right">
                        <span className={`text-base font-black block ${isDark ? "text-white" : "text-slate-900"}`}>
                          {formatINR(src.totalValue)}
                        </span>
                        <span className="text-[11px] text-teal-600 font-semibold flex items-center gap-1 sm:justify-end">
                          <Radio className="w-3 h-3 text-teal-500 animate-pulse" /> Synced {src.lastSyncedAt}
                        </span>
                      </div>
                      <div className={`shrink-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && subAssets && (
                    <div className={`border-t px-4 py-3 ${isDark ? "border-slate-800 bg-slate-900/40" : " bg-white"}`}>
                      <ul className="space-y-2 ml-14">
                        {subAssets.map((asset, idx) => (
                          <li key={idx} className="flex items-center justify-between text-sm">
                            <span className={isDark ? "text-slate-300" : "text-slate-700"}>{asset.name}</span>
                            <span className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{formatINR(asset.value)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
