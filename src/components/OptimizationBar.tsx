import React, { useState } from "react";
import { Zap, Loader2, ShieldAlert, Sparkles, CheckCircle2, ArrowUpRight } from "lucide-react";
import confetti from "canvas-confetti";

interface OptimizationBarProps {
  onRunOptimization: () => void;
  isOptimized: boolean;
  techPercentage: number;
  theme?: "dark" | "light";
}

export const OptimizationBar: React.FC<OptimizationBarProps> = ({
  onRunOptimization,
  isOptimized,
  techPercentage,
  theme = "dark",
}) => {
  const isDark = theme === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    "Analyzing cross-asset Tech overlap (65.3%)...",
    "Calculating tax-loss harvesting STCG/LTCG offsets...",
    "Rebalancing Tech concentration cap to 30.0%...",
    "Finalizing cross-asset ledger entry...",
  ];

  const handleClick = () => {
    if (isLoading) return;
    setIsLoading(true);
    setLoadingStep(0);

    // Step sequence during the 1-second calculation
    const timer1 = setTimeout(() => setLoadingStep(1), 300);
    const timer2 = setTimeout(() => setLoadingStep(2), 650);
    const timer3 = setTimeout(() => setLoadingStep(3), 900);

    const timerFinal = setTimeout(() => {
      setIsLoading(false);
      onRunOptimization();

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.8 },
          colors: ["#10B981", "#3B82F6", "#F59E0B", "#14B8A6"],
        });
      } catch (e) {
        console.log("Confetti trigger skipped");
      }
    }, 1100);
  };

  const isHighRisk = techPercentage > 35;

  return (
    <div className="sticky bottom-4 z-20 max-w-5xl mx-auto px-4 mt-8">
      <div className={`p-4 md:p-5 rounded-2xl backdrop-blur-xl border-2 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden transition-colors duration-300 ${
        isDark 
          ? "bg-slate-900/95 border-teal-500/50 shadow-teal-950/60" 
          : "bg-white/95 border-teal-500 shadow-teal-500/15"
      }`}>
        
        {/* Glow backdrop pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-teal-500/10 to-transparent pointer-events-none" />

        {/* Info Text */}
        <div className="flex items-center gap-3 relative z-10">
          <div className={`p-2.5 rounded-xl border shrink-0 ${
            isDark 
              ? "bg-teal-50 text-teal-700 rounded-full border-teal-500/30" 
              : "bg-teal-100 text-teal-700 border-teal-200"
          }`}>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                Automated Portfolio Engine
              </span>
              {isHighRisk && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                  isDark 
                    ? "bg-rose-50 text-rose-700 rounded-full border-rose-500/30" 
                    : "bg-rose-100 text-rose-700 border-rose-200"
                }`}>
                  Risk Alert: 65% Tech
                </span>
              )}
            </div>
            <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {isOptimized
                ? "Portfolio is currently optimized at safe 30% Tech cap. Click again to re-verify."
                : "One-click algorithm reduces Tech risk to 30% & saves ₹12,400 via tax harvesting."}
            </p>
          </div>
        </div>

        {/* Glowing Optimization Button */}
        <div className="w-full sm:w-auto relative z-10">
          <button
            id="run-one-click-optimization"
            onClick={handleClick}
            disabled={isLoading}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-sm text-white shadow-xl flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${
              isLoading
                ? "bg-slate-800 text-slate-300 cursor-wait border border-slate-700"
                : isOptimized
                ? "bg-gradient-to-r from-teal-600 via-teal-600 to-teal-600 hover:from-teal-500 hover:to-teal-500 shadow-teal-900/50 ring-2 ring-teal-400/40"
                : "bg-gradient-to-r from-teal-500 via-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-teal-500/30 ring-2 ring-teal-400/80 animate-pulse"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>{steps[loadingStep]}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-amber-300" />
                <span>[ ⚡ Run One-Click Portfolio Optimization ]</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
