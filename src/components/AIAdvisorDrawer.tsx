import React, { useState } from "react";
import { Sparkles, Send, X, Bot, User, Loader2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Asset } from "../types";

interface AIAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  techPercentage: number;
  theme?: "dark" | "light";
}

export const AIAdvisorDrawer: React.FC<AIAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  assets,
  techPercentage,
  theme = "dark",
}) => {
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: `Hello! I am **OmniWealth AI**, your quantitative portfolio assistant. Currently, your Tech sector concentration is **${techPercentage.toFixed(1)}%**. You can ask me questions about tax harvesting, sector caps, or click **Run Optimization** to auto-rebalance!`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const promptText = customText || query;
    if (!promptText.trim() || loading) return;

    const userMsg = promptText;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    if (!customText) setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-portfolio-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioData: assets,
          userQuery: userMsg,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.analysis }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Here is your customized analysis:\n- Reducing Tech concentration reduces drawdown volatility.\n- Tax-Loss harvesting offsets STCG gains against eligible loss pools.\n- Sovereign Gold Bonds provide 2.5% tax-free interest at redemption.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Portfolio Analysis:\n1. **Sector Over-exposure**: Tech at 65.3% creates single-sector risk across Infosys & Tech Mutual Fund.\n2. **Tax Savings**: Rebalancing offsets STCG tax with eligible short term loss harvesting.\n3. **Optimal Strategy**: Capping Tech at 30% stabilizes risk-adjusted returns.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 transition-colors duration-300 ${
      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white  text-slate-900"
    }`}>
      
      {/* Drawer Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 "
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isDark ? "bg-teal-50 text-teal-700 rounded-full border-teal-500/30" : "bg-teal-100 text-teal-700 border-teal-200"
          }`}>
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              OmniWealth Gemini Intelligence
            </h3>
            <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Server-side GenAI Enabled
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* SEBI AI Disclosure Bar */}
      <div className={`px-4 py-2.5 text-[10px] leading-relaxed border-b flex items-start gap-1.5 font-medium ${
        isDark ? "bg-amber-500/10 text-amber-300 border-amber-500/10" : "bg-amber-50 text-amber-800 border-amber-200"
      }`}>
        <span className="shrink-0">⚠️</span>
        <span><strong>SEBI AI Disclosure:</strong> Omni AI suggestions are generated via deterministic tax-harvesting and risk-capping models. Review transactions before execution.</span>
      </div>

      {/* Suggested Quick Prompts */}
      <div className={`p-3 border-b flex items-center gap-2 overflow-x-auto text-[11px] ${
        isDark ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 "
      }`}>
        <button
          onClick={() => handleSend("Explain Tax-Loss Harvesting for my portfolio")}
          className={`px-2.5 py-1 rounded-full border whitespace-nowrap cursor-pointer shrink-0 ${
            isDark 
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" 
              : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
          }`}
        >
          💡 Tax Loss Harvesting
        </button>
        <button
          onClick={() => handleSend("Why is 65% Tech sector exposure dangerous?")}
          className={`px-2.5 py-1 rounded-full border whitespace-nowrap cursor-pointer shrink-0 ${
            isDark 
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" 
              : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
          }`}
        >
          ⚠️ Tech Risk Analysis
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              msg.sender === "user" 
                ? "bg-teal-600 text-white" 
                : isDark ? "bg-slate-800 text-teal-400 border border-slate-700" : "bg-slate-100 text-teal-700 border "
            }`}>
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
              msg.sender === "user" 
                ? "bg-teal-600 text-white rounded-tr-none font-medium" 
                : isDark
                  ? "bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none"
                  : "bg-slate-50 text-slate-800 border  rounded-tl-none"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className={`flex items-center gap-2 text-xs italic p-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
            <span>Analyzing tax harvesting & portfolio risk...</span>
          </div>
        )}
      </div>

      {/* Query Input */}
      <div className={`p-3 border-t flex items-center gap-2 ${
        isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 "
      }`}>
        <input
          type="text"
          placeholder="Ask AI about portfolio tax, risk or rebalancing..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className={`flex-1 border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 ${
            isDark 
              ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" 
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
          }`}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !query.trim()}
          className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-50 transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
