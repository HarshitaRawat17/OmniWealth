import React from "react";
import { X, ShieldCheck, CheckCircle2, RefreshCw, Server, Lock, ExternalLink, Database } from "lucide-react";
import { AccountAggregatorSource } from "../types";
import { formatINR } from "../utils/formatters";

interface AccountAggregatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: AccountAggregatorSource[];
  lastSyncedAt: string;
  isSyncing: boolean;
  onRefresh: () => void;
  theme?: "dark" | "light";
}

export const AccountAggregatorModal: React.FC<AccountAggregatorModalProps> = ({
  isOpen,
  onClose,
  sources,
  lastSyncedAt,
  isSyncing,
  onRefresh,
  theme = "dark",
}) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";
  const totalAggregated = sources.reduce((sum, s) => sum + s.totalValue, 0);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200 ${
      isDark ? "bg-slate-950/80" : "bg-slate-900/40"
    }`}>
      <div 
        className={`rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 relative overflow-hidden border transition-colors duration-300 ${
          isDark 
            ? "bg-slate-900 border-slate-800 text-white" 
            : "bg-white  text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b pb-4 ${
          isDark ? "border-slate-800" : ""
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${
              isDark ? "bg-teal-50 text-teal-700 rounded-full border-teal-500/30" : "bg-teal-50 text-teal-700 rounded-full border-teal-200"
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                RBI Account Aggregator Network
              </h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Encrypted, read-only Financial Data Access (FIP-FIU Consent)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition cursor-pointer ${
              isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className={`rounded-2xl p-4 border flex items-center justify-between ${
          isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 "
        }`}>
          <div>
            <span className={`text-xs block font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Aggregated Net Worth
            </span>
            <span className="text-2xl font-black text-teal-600">{formatINR(totalAggregated)}</span>
          </div>
          <div className="text-right">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${
              isDark 
                ? "bg-teal-50 text-teal-700 rounded-full border-teal-500/20" 
                : "bg-teal-100 text-teal-800 border-teal-200"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Active Consent Valid till 2027
            </span>
            <p className={`text-[11px] mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Last synced: {lastSyncedAt}
            </p>
          </div>
        </div>

        {/* Sources List */}
        <div className="space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            <Database className="w-3.5 h-3.5 text-teal-500" /> Synced Financial Information Providers (FIPs)
          </h4>

          <div className="space-y-2">
            {sources.map((src) => (
              <div
                key={src.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                  isDark 
                    ? "bg-slate-950/60 border-slate-800 hover:border-slate-700" 
                    : "bg-slate-50  hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    isDark ? "bg-slate-800 text-teal-400 border-slate-700" : "bg-white text-teal-700 "
                  }`}>
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{src.name}</h5>
                    <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{src.type} • {src.assetCount} Assets</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold block ${isDark ? "text-white" : "text-slate-900"}`}>{formatINR(src.totalValue)}</span>
                  <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" /> Synced {src.lastSyncedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Controls */}
        <div className={`pt-2 flex items-center justify-between border-t ${
          isDark ? "border-slate-800" : ""
        }`}>
          <div className={`flex items-center gap-2 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-bit AES End-to-End Encryption</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing Feeds..." : "Force Re-Sync"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
