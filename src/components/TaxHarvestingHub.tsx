import React, { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  FileSpreadsheet, 
  RotateCcw,
  Percent,
  ShieldAlert,
  Download,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Asset } from "../types";
import { formatINR } from "../utils/formatters";

interface TaxHarvestingHubProps {
  assets: Asset[];
  isOptimized: boolean;
  onRunOptimization: () => void;
  techPercentage: number;
  theme?: "dark" | "light";
  riskProfile: "Conservative" | "Moderate" | "Aggressive";
  taxSlab: "10%" | "20%" | "30%";
  setRiskProfile: (v: "Conservative" | "Moderate" | "Aggressive") => void;
  setTaxSlab: (v: "10%" | "20%" | "30%") => void;
}

export const TaxHarvestingHub: React.FC<TaxHarvestingHubProps> = ({
  assets,
  isOptimized,
  onRunOptimization,
  techPercentage,
  theme = "dark",
  riskProfile,
  taxSlab,
  setRiskProfile,
  setTaxSlab,
}) => {
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<"stcg_ltcg" | "rebalance">("stcg_ltcg");
  const [expandedHoldings, setExpandedHoldings] = useState<string[]>([]);

  const toggleHolding = (name: string) => {
    setExpandedHoldings(prev => 
      prev.includes(name) 
        ? prev.filter(h => h !== name) 
        : [...prev, name]
    );
  };

  const HoldingAccordion = ({ 
    name, 
    type, 
    value, 
    invested, 
    gainLoss, 
    isGain, 
    tag, 
    tagColor,
    isLtcg = false
  }: { 
    name: string, 
    type: string, 
    value: string, 
    invested: string, 
    gainLoss: string, 
    isGain: boolean,
    tag: string,
    tagColor: string,
    isLtcg?: boolean
  }) => {
    const isExpanded = expandedHoldings.includes(name);
    
    return (
      <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 "
      } ${isLtcg ? "border-l-4 border-l-teal-500" : "border-l-4 border-l-red-500"}`}>
        
        {/* Header Bar */}
        <button 
          onClick={() => toggleHolding(name)}
          className={`w-full flex items-center justify-between p-4 cursor-pointer transition-colors ${
            isDark ? "hover:bg-slate-900/50" : "hover:bg-slate-100/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{name}</h3>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-500"
            }`}>{type}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right flex flex-col items-end gap-0.5">
              <span className={`text-sm font-extrabold block leading-none ${isDark ? "text-white" : "text-slate-900"}`}>{value}</span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                isGain 
                  ? "bg-teal-50 text-teal-700 rounded-full border-teal-500/20" 
                  : "bg-rose-50 text-rose-700 rounded-full border-rose-500/20"
              }`}>
                {isGain ? "+" : ""}{gainLoss}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={`w-4 h-4 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
            </motion.div>
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-4 pb-4 space-y-4">
                <div className="flex">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${tagColor}`}>
                    {tag}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-2.5 rounded-xl border ${isDark ? "bg-slate-900/40 border-slate-800" : "bg-white "}`}>
                    <span className={`text-xs font-extrabold uppercase tracking-wider text-gray-600 block mb-0.5"}`}>
                      Invested Amount
                    </span>
                    <span className={`text-sm font-black ${isDark ? "text-slate-200" : "text-slate-800"}`}>{invested}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDark ? "bg-slate-900/40 border-slate-800" : "bg-white "}`}>
                    <span className={`text-xs font-extrabold uppercase tracking-wider text-gray-600 block mb-0.5"}`}>
                      Current Valuation
                    </span>
                    <span className={`text-sm font-black ${isDark ? "text-slate-200" : "text-slate-800"}`}>{value}</span>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-xl border ${
                  isDark ? "bg-slate-900/20 border-slate-800" : "bg-slate-100/50 "
                }`}>
                  <span className={`text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Unrealized {isGain ? "Gain" : "Loss"}
                  </span>
                  <span className={`text-sm font-black ${isGain ? "text-teal-500" : "text-rose-500"}`}>
                    {isGain ? "+" : ""}{gainLoss}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Calculations
  const totalPortfolioValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);
  const stcgEligibleValue = assets.filter((a) => a.taxStatus.includes("STCG")).reduce((s, a) => s + a.value, 0);
  const ltcgEligibleValue = assets.filter((a) => a.taxStatus.includes("LTCG")).reduce((s, a) => s + a.value, 0);

  // Dynamic Calculations based on Risk Profile & Tax Slab
  const taxRateMap = { "10%": 0.1, "20%": 0.2, "30%": 0.3 };
  const currentTaxRate = taxRateMap[taxSlab] || 0.3;
  
  const initialTaxLiability = 124000 * currentTaxRate;
  const projectedLossHarvest = riskProfile === "Aggressive" ? 62000 : riskProfile === "Moderate" ? 45000 : 30000;
  const taxSavings = projectedLossHarvest * currentTaxRate;
  const optimizedTaxLiability = initialTaxLiability - taxSavings;

  const riskScoreBefore = 82;
  const riskScoreAfter = riskProfile === "Aggressive" ? 55 : riskProfile === "Moderate" ? 34 : 20;
  const techCap = riskProfile === "Aggressive" ? "40.0%" : riskProfile === "Moderate" ? "30.0%" : "20.0%";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* AI Strategy Controls Bar */}
      <div className={`p-4 md:p-6 rounded-2xl border shadow-sm transition-colors duration-300 ${
        isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-teal-500" />
              AI Strategy Controls
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
            {/* Risk Profile Toggle */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Risk Profile
              </span>
              <Tooltip.Provider delayDuration={200}>
                <div className={`flex items-center p-1 rounded-xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  {(["Conservative", "Moderate", "Aggressive"] as const).map(p => {
                    const tooltipText = {
                      Conservative: "Conservative: 35% Equity / 50% Debt / 15% Gold — Capital preservation focus",
                      Moderate: "Moderate: 50% Equity / 35% Debt / 15% Gold — Balanced long-term growth",
                      Aggressive: "Aggressive: 65% Equity / 25% Debt / 10% Gold — High growth compounding",
                    }[p];

                    return (
                      <Tooltip.Root key={p}>
                        <Tooltip.Trigger asChild>
                          <button
                            onClick={() => setRiskProfile(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              riskProfile === p
                                ? (isDark ? "bg-slate-800 text-teal-400 shadow-sm" : "bg-white text-teal-700 shadow-sm border border-slate-200")
                                : (isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700")
                            }`}
                          >
                            {p}
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            side="top"
                            sideOffset={6}
                            className="z-50 max-w-xs overflow-hidden rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-xl border border-slate-800 animate-in fade-in-0 zoom-in-95 duration-150"
                          >
                            {tooltipText}
                            <Tooltip.Arrow className="fill-slate-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    );
                  })}
                </div>
              </Tooltip.Provider>
            </div>

            {/* Tax Slab Toggle */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Applicable Tax Slab
              </span>
              <div className={`flex items-center p-1 rounded-xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                {(["10%", "20%", "30%"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTaxSlab(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      taxSlab === t
                        ? (isDark ? "bg-slate-800 text-teal-400 shadow-sm" : "bg-white text-teal-700 shadow-sm border border-slate-200")
                        : (isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700")
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header Banner */}
      <div className={`p-4 md:p-6 rounded-2xl border relative overflow-hidden transition-colors duration-300 ${
        isDark 
          ? "bg-slate-900/80 border-slate-800 text-white shadow-xl" 
          : "bg-white  text-slate-900 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-xl border ${
                isDark ? "bg-teal-50 text-teal-700 rounded-full border-teal-500/40" : "bg-teal-200 text-teal-900 border-teal-300"
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-base md:text-lg font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    Cross-Asset Tax-Loss Harvesting Engine
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 rounded-full border border-teal-500/30">
                    2026 IT Act Compliant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-teal-500/20">
          <div className={`p-2 rounded-xl border ${
            isDark ? "bg-slate-950/70 border-slate-800" : "bg-white  shadow-sm"
          }`}>
            <span className={`text-[11px] font-medium block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Tax Savings Realized
            </span>
            <span className="text-xl font-black text-teal-600">
              {isOptimized ? formatINR(taxSavings) : `₹0 (Potential ${formatINR(taxSavings)})`}
            </span>
          </div>

          <div className={`p-3 rounded-2xl border ${
            isDark ? "bg-slate-950/70 border-slate-800" : "bg-white  shadow-sm"
          }`}>
            <span className={`text-[11px] font-medium block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Harvestable Capital Loss
            </span>
            <span className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
              {formatINR(projectedLossHarvest)}
            </span>
          </div>

          <div className={`p-3 rounded-2xl border ${
            isDark ? "bg-slate-950/70 border-slate-800" : "bg-white  shadow-sm"
          }`}>
            <span className={`text-[11px] font-medium block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              STCG (20%) Asset Base
            </span>
            <span className={`text-base font-black ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              {formatINR(stcgEligibleValue)}
            </span>
          </div>

          <div className={`p-3 rounded-2xl border ${
            isDark ? "bg-slate-950/70 border-slate-800" : "bg-white  shadow-sm"
          }`}>
            <span className={`text-[11px] font-medium block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              LTCG (12.5%) Asset Base
            </span>
            <span className={`text-base font-black ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              {formatINR(ltcgEligibleValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className={`flex items-center gap-2 p-1.5 rounded-2xl border w-fit ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 "
      }`}>
        <button
          onClick={() => setActiveTab("stcg_ltcg")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "stcg_ltcg"
              ? "bg-teal-600 text-white shadow"
              : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📊 STCG vs LTCG Breakdown
        </button>
        <button
          onClick={() => setActiveTab("rebalance")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "rebalance"
              ? "bg-teal-600 text-white shadow"
              : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          🔄 Risk Diagnosis & Rebalance Engine
        </button>
      </div>

  

      {/* Tab Content 2: STCG vs LTCG */}
      {activeTab === "stcg_ltcg" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Short-Term Holdings */}
          <div className={`rounded-3xl p-6 border shadow-xl flex flex-col space-y-4 ${
            isDark ? "bg-slate-900/80 border-slate-800" : "bg-white "
          }`}>
            <h2 className="text-base font-bold flex items-center gap-2 mb-2 text-rose-500">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
              Short-Term Holdings (STCG - 20% Tax Slab)
            </h2>
            <div className="space-y-4">
              <HoldingAccordion 
                name="Infosys Ltd" 
                type="Stock" 
                value="₹4,50,000" 
                invested="₹5,12,000" 
                gainLoss="₹62,000" 
                isGain={false} 
                tag="⚡ Eligible for Loss Harvest" 
                tagColor="bg-amber-500/10 text-amber-600 border border-amber-500/20" 
              />
              <HoldingAccordion 
                name="Reliance Ind" 
                type="Stock" 
                value="₹1,20,000" 
                invested="₹1,05,000" 
                gainLoss="₹15,000" 
                isGain={true} 
                tag="⏳ 42 Days to LTCG" 
                tagColor="bg-blue-500/10 text-blue-500 border border-blue-500/20" 
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Long-Term Holdings */}
          <div className={`rounded-3xl p-6 border shadow-xl flex flex-col space-y-4 ${
            isDark ? "bg-slate-900/80 border-slate-800" : "bg-white "
          }`}>
            <h2 className="text-base font-bold flex items-center gap-2 mb-2 text-teal-500">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              Long-Term Holdings (LTCG - 12.5% Tax Slab & Tax Exempt)
            </h2>
            <div className="space-y-4">
              <HoldingAccordion 
                name="HDFC Bank" 
                type="Stock" 
                value="₹1,80,000" 
                invested="₹1,40,000" 
                gainLoss="₹40,000" 
                isGain={true} 
                tag="12.5% Tax Rate" 
                tagColor="bg-slate-500/10 text-slate-500 border border-slate-500/20" 
                isLtcg={true}
              />
              <HoldingAccordion 
                name="Tech Growth MF" 
                type="Mutual Fund" 
                value="₹3,20,000" 
                invested="₹2,10,000" 
                gainLoss="₹1,10,000" 
                isGain={true} 
                tag="12.5% Tax Rate" 
                tagColor="bg-slate-500/10 text-slate-500 border border-slate-500/20" 
                isLtcg={true}
              />
              <HoldingAccordion 
                name="Sovereign Gold Bond (SGB)" 
                type="Bonds" 
                value="₹2,30,000" 
                invested="₹1,90,000" 
                gainLoss="₹40,000" 
                isGain={true} 
                tag="0% Tax Free" 
                tagColor="bg-teal-50 text-teal-700 rounded-full border border-teal-500/20" 
                isLtcg={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Rebalance Simulator */}
      {activeTab === "rebalance" && (
        <div className={`rounded-3xl p-6 border shadow-xl space-y-6 ${
          isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white  text-slate-900"
        }`}>
          {/* Header / Warning Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col gap-1 ${
            isDark ? "bg-rose-950/40 border-rose-900/50" : "bg-rose-50 border-rose-200"
          }`}>
            <h2 className="text-sm font-bold flex items-center gap-2 text-rose-500">
              🚨 Sector Risk Heatmap: Critical Over-exposure (65.3%)
            </h2>
            <p className={`text-xs ${isDark ? "text-rose-300/80" : "text-rose-800/80"}`}>
              Your Technology holdings represent 65.3% of your net worth (Exceeds 30% safety cap).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Un-Optimized */}
            <div className={`p-6 rounded-2xl border shadow-sm ${
              isDark ? "bg-slate-950/70 border-rose-500/30" : "bg-rose-50/50 border-rose-200"
            }`}>
              <div className="flex items-center justify-between mb-4 border-b pb-3 border-rose-500/20">
                <span className="text-sm font-bold text-rose-500 uppercase tracking-wider">
                  CURRENT PORTFOLIO
                </span>
                <span className="px-2 py-1 rounded bg-rose-50 text-rose-700 rounded-full text-[10px] font-black border border-rose-500/20">
                  Un-Optimized
                </span>
              </div>
              <ul className="space-y-4 text-xs">
                <li className="flex flex-col gap-1">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Portfolio Risk Score</span>
                  <span className="font-extrabold text-rose-500 text-sm">{riskScoreBefore}/100 (High Danger)</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Tech Concentration</span>
                  <span className="font-extrabold text-rose-500 text-sm">65.3%</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Estimated Tax Liability</span>
                  <span className={`font-bold text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{formatINR(initialTaxLiability)}</span>
                </li>
              </ul>
            </div>

            {/* Right Column: AI Proposed Solution */}
            <div className={`p-6 rounded-2xl border shadow-sm ${
              isDark ? "bg-teal-950/20 border-teal-500/40" : "bg-white "
            }`}>
              <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isDark ? "border-teal-500/20" : "border-slate-100"}`}>
                <span className="text-sm font-bold text-teal-600 uppercase tracking-wider">
                  AFTER OPTIMIZATION (AI Recommended)
                </span>
                <span className="px-2 py-1 rounded bg-teal-50 text-teal-700 rounded-full text-[10px] font-black border border-teal-500/20">
                  Post-Rebalance
                </span>
              </div>
              <ul className="space-y-4 text-xs">
                <li className="flex flex-col gap-1">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Portfolio Risk Score</span>
                  <span className="font-extrabold text-teal-600 text-sm">{riskScoreAfter}/100 ({riskProfile === "Aggressive" ? "Moderate" : riskProfile === "Moderate" ? "Balanced" : "Safe"})</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Tech Concentration</span>
                  <span className="font-extrabold text-teal-600 text-sm">{techCap} (Safely Capped)</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Estimated Tax Liability</span>
                  <span className="font-extrabold text-teal-600 text-sm">{formatINR(optimizedTaxLiability)} (Save {formatINR(taxSavings)})</span>
                </li>
                <li className="flex flex-col gap-1 pt-2 border-t border-teal-500/20">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Action Plan</span>
                  <span className="font-bold text-teal-600 text-sm">Rebalance ₹3.5L across SGB & Banking</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onRunOptimization}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-500 hover:to-teal-500 text-white font-black text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>⚡ Execute ₹3.5L Rebalance & Harvest Loss</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
