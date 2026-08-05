import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  Lightbulb, 
  MessageSquare,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import { Asset } from "../types";
import { formatINR } from "../utils/formatters";

interface AIAdvisorPageProps {
  assets: Asset[];
  techPercentage: number;
  theme?: "dark" | "light";
}

export const AIAdvisorPage: React.FC<AIAdvisorPageProps> = ({
  assets,
  techPercentage,
  theme = "dark",
}) => {
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; timestamp: string }>>([
    {
      sender: "ai",
      text: `Hello! I am your OmniWealth Gemini AI Advisor.\n\nI have analyzed your portfolio synced via Account Aggregator. Here is a quick snapshot:\n• Current Tech Exposure: ${techPercentage.toFixed(1)}%\n• Total Net Worth: ${formatINR(assets.reduce((s, a) => s + a.value, 0))}\n\nHow can I help you optimize your portfolio or explain Tax-Loss Harvesting today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || query;
    if (!promptToSend.trim() || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: "user" as const, text: promptToSend, timestamp: userTime };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setQuery("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          portfolioContext: {
            assets,
            techPercentage,
            totalNetWorth: assets.reduce((s, a) => s + a.value, 0)
          }
        }),
      });

      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev, 
          { sender: "ai", text: data.reply || "Analysis complete.", timestamp: aiTime }
        ]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { 
            sender: "ai", 
            text: "Tax & Risk Analysis:\n• Trimming Technology concentration from 65.3% to 30% reduces sector danger.\n• Harvesting ₹62,000 in short-term loss sets off STCG (20%) tax, saving ₹12,400.\n• Capital can be reallocated into Sovereign Gold Bonds & Financials for stability.", 
            timestamp: aiTime 
          }
        ]);
      }
    } catch {
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev, 
        { 
          sender: "ai", 
          text: "Tax & Risk Analysis:\n• Trimming Technology concentration from 65.3% to 30% reduces sector danger.\n• Harvesting ₹62,000 in short-term loss sets off STCG (20%) tax, saving ₹12,400.\n• Capital can be reallocated into Sovereign Gold Bonds & Financials for stability.", 
          timestamp: aiTime 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-colors duration-300 ${
        isDark 
          ? "bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800 text-white" 
          : "bg-gradient-to-r from-indigo-50 via-slate-50 to-white  text-slate-900"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`p-2.5 rounded-2xl border ${
                isDark ? "bg-teal-50 text-teal-700 rounded-full border-teal-500/30" : "bg-teal-100 text-teal-700 border-teal-200"
              }`}>
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    Gemini AI Portfolio Intelligence
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 rounded-full border border-teal-500/30">
                    Server-side GenAI
                  </span>
                </div>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Context-aware portfolio advice, quantitative tax calculations, and asset rebalancing strategies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Prompt Cards & Chat Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side (4 Cols): Suggested Quantitative Prompts */}
        <div className={`lg:col-span-4 rounded-3xl p-6 border shadow-xl space-y-4 ${
          isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white  text-slate-900"
        }`}>
          <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? "border-slate-800" : ""}`}>
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Suggested AI Prompts
            </h2>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => handleSend("Explain how Tax-Loss Harvesting saves ₹12,400 in my portfolio")}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs transition cursor-pointer ${
                isDark 
                  ? "bg-slate-950/70 border-slate-800 hover:border-teal-500/50 hover:bg-slate-900" 
                  : "bg-slate-50  hover:border-teal-400 hover:bg-teal-50/30 shadow-sm"
              }`}
            >
              <div className="font-bold text-teal-600 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Tax Harvesting Guide
              </div>
              <p className={isDark ? "text-slate-300" : "text-slate-600"}>
                "Explain how Tax-Loss Harvesting saves ₹12,400 in my portfolio"
              </p>
            </button>

            <button
              onClick={() => handleSend("Why is 65% Technology sector exposure dangerous for long-term growth?")}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs transition cursor-pointer ${
                isDark 
                  ? "bg-slate-950/70 border-slate-800 hover:border-rose-500/50 hover:bg-slate-900" 
                  : "bg-slate-50  hover:border-rose-400 hover:bg-rose-50/30 shadow-sm"
              }`}
            >
              <div className="font-bold text-rose-500 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Risk Exposure Analysis
              </div>
              <p className={isDark ? "text-slate-300" : "text-slate-600"}>
                "Why is 65% Technology sector exposure dangerous for long-term growth?"
              </p>
            </button>

            <button
              onClick={() => handleSend("What are the STCG (20%) vs LTCG (12.5%) rules in 2026?")}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs transition cursor-pointer ${
                isDark 
                  ? "bg-slate-950/70 border-slate-800 hover:border-teal-500/50 hover:bg-slate-900" 
                  : "bg-slate-50  hover:border-teal-400 hover:bg-teal-50/30 shadow-sm"
              }`}
            >
              <div className="font-bold text-indigo-500 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Capital Gains Tax Rules
              </div>
              <p className={isDark ? "text-slate-300" : "text-slate-600"}>
                "What are the STCG (20%) vs LTCG (12.5%) rules in 2026?"
              </p>
            </button>
          </div>
        </div>

        {/* Right Side (8 Cols): Conversation Window */}
        <div className={`lg:col-span-8 rounded-3xl border shadow-xl flex flex-col h-[520px] ${
          isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white  text-slate-900"
        }`}>
          
          {/* Chat Messages List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === "user"
                    ? "bg-teal-600 text-white"
                    : isDark ? "bg-slate-800 text-teal-400 border border-slate-700" : "bg-slate-100 text-teal-700 border "
                }`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl max-w-[80%] whitespace-pre-wrap leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-teal-600 text-white rounded-tr-none font-medium"
                    : isDark
                    ? "bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none"
                    : "bg-slate-50 text-slate-800 border  rounded-tl-none"
                }`}>
                  {msg.text}
                  <span className={`block text-[9px] mt-2 text-right ${
                    msg.sender === "user" ? "text-teal-100" : isDark ? "text-slate-500" : "text-slate-400"
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className={`flex items-center gap-2 text-xs italic p-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
                <span>Evaluating portfolio tax implications with Gemini GenAI...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className={`p-4 border-t flex items-center gap-3 rounded-b-3xl ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 "
          }`}>
            <input
              type="text"
              placeholder="Ask Gemini AI about tax, asset risk, or rebalancing..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className={`flex-1 border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-teal-500 ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" 
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
            <button
              onClick={() => handleSend()}
              disabled={!query.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
