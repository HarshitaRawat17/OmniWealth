import React, { useState } from "react";
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceDot,
  Label
} from "recharts";
import { 
  ShieldCheck, 
  TrendingUp, 
  PieChart as PieIcon, 
  Layers,
  Zap,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Asset } from "../types";
import { 
  formatINR, 
  calculateCategorySummaries, 
  CATEGORY_COLORS
} from "../utils/formatters";

interface GraphicalViewProps {
  assets: Asset[];
  techPercentage: number;
  isOptimized: boolean;
  onRunOptimization: () => void;
  theme?: "dark" | "light";
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload || !payload.event) return null;

  let color = "#10B981";
  if (payload.event === "sip") color = "#10B981";
  else if (payload.event === "dividend") color = "#3B82F6";
  else if (payload.event === "rebalance") color = "#F59E0B";
  else if (payload.event === "withdrawal") color = "#EF4444";

  return (
    <g key={`${payload.month}-${payload.event}`}>
      <circle cx={cx} cy={cy} r={7} fill={color} opacity={0.3} />
      <circle cx={cx} cy={cy} r={4} fill={color} stroke="#FFFFFF" strokeWidth={1.5} />
    </g>
  );
};

export const GraphicalView: React.FC<GraphicalViewProps> = ({
  assets,
  techPercentage,
  isOptimized,
  onRunOptimization,
  theme = "dark",
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [chartMode, setChartMode] = useState<"asset" | "sector" | "holding">("asset");
  const [timeframe, setTimeframe] = useState<"1W" | "1M" | "1Y" | "ALL">("1Y");
  const [mainViewMode, setMainViewMode] = useState<"asset" | "sector">("asset");
  const [isTechExpanded, setIsTechExpanded] = useState(true);

  const isDark = theme === "dark";

  // Historical Net Worth Data Simulation per timeframe
  const trendData1W = [
    { month: "Mon", value: 1170700 },
    { month: "Tue", value: 1173000 },
    { month: "Wed", value: 1171200 },
    { month: "Thu", value: 1175500, event: "sip", eventLabel: "SIP Invested" },
    { month: "Fri", value: 1178000 },
    { month: "Today", value: 1180000 },
  ];

  const trendData1M = [
    { month: "Jul 10", value: 1155800 },
    { month: "Jul 17", value: 1162000, event: "dividend", eventLabel: "Dividend Received" },
    { month: "Jul 24", value: 1168000 },
    { month: "Today", value: 1180000 },
  ];

  const trendData1Y = [
    { month: "Aug '25", value: 850000 },
    { month: "Sep '25", value: 875000, event: "sip", eventLabel: "SIP Invested" },
    { month: "Oct '25", value: 860000, event: "withdrawal", eventLabel: "Large Withdrawal" },
    { month: "Nov '25", value: 890000, event: "sip", eventLabel: "SIP Invested" },
    { month: "Dec '25", value: 920000, event: "dividend", eventLabel: "Dividend Received" },
    { month: "Jan '26", value: 955000 },
    { month: "Feb '26", value: 940000, event: "withdrawal", eventLabel: "Large Withdrawal" },
    { month: "Mar '26", value: 980000, event: "sip", eventLabel: "SIP Invested" },
    { month: "Apr '26", value: 1025000, event: "rebalance", eventLabel: "Rebalance Executed" },
    { month: "May '26", value: 1080000, event: "sip", eventLabel: "SIP Invested" },
    { month: "Jun '26", value: 1120000, event: "dividend", eventLabel: "Dividend Received" },
    { month: "Today", value: 1180000, event: "rebalance", eventLabel: "Rebalance Executed" },
  ];

  const trendDataALL = [
    { month: "Q1 '24", value: 830000, event: "sip", eventLabel: "SIP Invested" },
    { month: "Q2 '24", value: 855000 },
    { month: "Q3 '24", value: 880000, event: "dividend", eventLabel: "Dividend Received" },
    { month: "Q4 '24", value: 910000, event: "rebalance", eventLabel: "Rebalance Executed" },
    { month: "Q1 '25", value: 950000 },
    { month: "Q2 '25", value: 1000000, event: "sip", eventLabel: "SIP Invested" },
    { month: "Q3 '25", value: 1050000, event: "withdrawal", eventLabel: "Large Withdrawal" },
    { month: "Q4 '25", value: 1100000, event: "sip", eventLabel: "SIP Invested" },
    { month: "Q1 '26", value: 1150000, event: "dividend", eventLabel: "Dividend Received" },
    { month: "Today", value: 1180000, event: "rebalance", eventLabel: "Rebalance Executed" },
  ];

  const timeframeConfig = {
    "1W": {
      subtitle: "+0.8% • +₹9,300",
      data: trendData1W,
    },
    "1M": {
      subtitle: "+2.1% • +₹24,200",
      data: trendData1M,
    },
    "1Y": {
      subtitle: "+18.4% • +₹1,80,000",
      data: trendData1Y,
    },
    "ALL": {
      subtitle: "+42.1% • +₹3,50,000",
      data: trendDataALL,
    }
  };

  const currentTrendConfig = timeframeConfig[timeframe] || timeframeConfig["1Y"];
  const historicalData = currentTrendConfig.data;
  const categorySummaries = calculateCategorySummaries(assets);
  const totalNetWorth = assets.reduce((sum, a) => sum + (a.value || 0), 0);

  // Sector Data for Demo
  const sectorData = [
    { category: "Technology", value: totalNetWorth * 0.653, percentage: 65.3, color: "#EF4444" }, // Red warning
    { category: "Banking & Financials", value: totalNetWorth * 0.153, percentage: 15.3, color: "#3B82F6" },
    { category: "Gold & Commodities", value: totalNetWorth * 0.194, percentage: 19.5, color: "#F59E0B" } // 65.3+15.3+19.5 = 100
  ];
  
  // Holdings Data for Demo
  const holdingData = assets.map((a, i) => ({
    category: a.name,
    value: a.value,
    percentage: (a.value / totalNetWorth) * 100,
    color: CATEGORY_COLORS[a.category as keyof typeof CATEGORY_COLORS] || "#10B981"
  }));

  const chartData = chartMode === "asset" 
    ? categorySummaries 
    : chartMode === "sector" 
    ? sectorData 
    : holdingData;

  // Available categories list
  const availableCategories: string[] = ["All", ...(Array.from(new Set(assets.map(a => a.category))) as string[])];

  // Filtered assets based on selected category
  const filteredAssets = selectedCategory === "All" 
    ? assets 
    : assets.filter(a => a.category === selectedCategory);

  const filteredTotalValue = filteredAssets.reduce((s, a) => s + (a.value || 0), 0);

  const assetClassBreakdown = [
    { category: "Direct Equities", value: 625400, percentage: 53, color: "#10B981" },
    { category: "Mutual Funds", value: 318600, percentage: 27, color: "#3B82F6" },
    { category: "SGBs / Gold", value: 224200, percentage: 19, color: "#F59E0B" },
    { category: "Liquid / Cash", value: 11800, percentage: 1, color: "#64748B" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Unified Multi-Graph Visualizer Card */}
      <div className={`p-6 md:p-8 rounded-[32px] border transition-all duration-500 relative overflow-hidden ${
        isDark ? "bg-slate-900/60 border-slate-800 shadow-2xl shadow-slate-950/50" : "bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      }`}>
        
        {/* Primary Capsule Hierarchy - Parent Toggle */}
        <div className="flex justify-center mb-10">
          <div className={`inline-flex p-1.5 rounded-2xl border ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 shadow-inner"
          }`}>
            <button
              onClick={() => setMainViewMode("asset")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                mainViewMode === "asset"
                  ? (isDark ? "bg-teal-600 text-white shadow-lg shadow-teal-900/40" : "bg-white text-teal-700 shadow-md border border-teal-100")
                  : (isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800")
              }`}
            >
              <span>📊</span> Asset Class View
            </button>
            <button
              onClick={() => setMainViewMode("sector")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                mainViewMode === "sector"
                  ? (isDark ? "bg-teal-600 text-white shadow-lg shadow-teal-900/40" : "bg-white text-teal-700 shadow-md border border-teal-100")
                  : (isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800")
              }`}
            >
              <span>⚠️</span> Sector Risk Heatmap
            </button>
          </div>
        </div>

        {/* Consolidated Layout */}
        <div className="w-full">
          
          <AnimatePresence mode="wait">
            {mainViewMode === "asset" ? (
              <motion.div
                key="asset"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                {/* View 1 Top: Interactive Donut Chart and Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  {/* Left: Donut Chart */}
                  <div className="h-80 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={assetClassBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={90}
                          outerRadius={125}
                          paddingAngle={6}
                          dataKey="value"
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(null)}
                          stroke="none"
                        >
                          {assetClassBreakdown.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                              className="transition-opacity duration-300 outline-none"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className={`p-3 rounded-2xl border shadow-2xl ${
                                  isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white text-gray-950"
                                }`}>
                                  <p className="text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-1">
                                    {payload[0].payload.category}
                                  </p>
                                  <p className="text-sm font-black text-teal-500">
                                    {formatINR(payload[0].value as number)} ({payload[0].payload.percentage}%)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    
                    {/* Total Portfolio Value Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Total Value</span>
                      <span className={`text-xl font-black ${isDark ? "text-white" : "text-gray-950"}`}>₹11,80,000</span>
                    </div>
                  </div>

                  {/* Right: Asset Class Description & Details */}
                  <div className="space-y-6">
                    <div className="text-left">
                      <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-950"}`}>Asset Class Distribution</h3>
                      <p className={`text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>Current strategic allocation</p>
                    </div>

                    {/* Legend Labels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {assetClassBreakdown.map((cat, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-800/10 bg-slate-50/5 hover:bg-slate-50/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                            <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>{cat.category}</span>
                          </div>
                          <div className="text-right">
                            <span className={`block text-xs font-black ${isDark ? "text-white" : "text-gray-950"}`}>{formatINR(cat.value)}</span>
                            <span className="text-[10px] font-bold text-teal-500">{cat.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider Line */}
                <div className={`border-t ${isDark ? "border-slate-800" : "border-slate-200"}`} />

                {/* View 1 Bottom: Portfolio Performance Line Chart */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-left">
                      <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-950"}`}>Portfolio Performance</h3>
                      <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400">{currentTrendConfig.subtitle}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> SIP Invested
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Dividend
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Rebalanced
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Withdrawal
                        </span>
                      </div>
                    </div>

                    {/* Timeframe Selector */}
                    <div className={`inline-flex p-1 rounded-xl border self-start sm:self-center ${
                      isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50"
                    }`}>
                      {(["1W", "1M", "1Y", "ALL"] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            timeframe === tf
                              ? (isDark ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20" : "bg-white text-teal-700 shadow-sm border border-teal-100")
                              : (isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800")
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="4 4" 
                          vertical={false} 
                          stroke={isDark ? "#1E293B" : "#E2E8F0"} 
                          strokeOpacity={0.5}
                        />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: isDark ? "#64748B" : "#64748B", fontWeight: 700 }}
                          dy={15}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: isDark ? "#64748B" : "#64748B", fontWeight: 700 }}
                          domain={[800000, 1200000]}
                          ticks={[800000, 900000, 1000000, 1100000, 1200000]}
                          tickFormatter={(val) => `₹${val/100000}L`}
                          dx={-10}
                        />
                        <Tooltip 
                          cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className={`p-4 rounded-2xl border shadow-2xl ${
                                  isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white text-gray-950"
                                }`}>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{data.month.toUpperCase()}</p>
                                  
                                  {data.event && (
                                    <p className="text-xs font-bold mb-2 text-foreground">
                                      {data.event === "sip" && "🟢 SIP Executed (+₹25,000)"}
                                      {data.event === "dividend" && "🔵 Dividend Received (+₹12,500)"}
                                      {data.event === "rebalance" && "🟡 Rebalance Executed"}
                                      {data.event === "withdrawal" && "🔴 Large Withdrawal (-₹50,000)"}
                                    </p>
                                  )}

                                  <div className="flex items-baseline gap-1.5">
                                    <p className="text-lg font-black text-teal-500 tracking-tight">
                                      {formatINR(data.value as number)}
                                    </p>
                                    <span className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                      (Total Portfolio Value)
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="linear" 
                          dataKey="value" 
                          stroke="#10B981" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorNetWorth)" 
                          animationDuration={2000}
                          dot={<CustomDot />}
                          activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: isDark ? '#0F172A' : '#FFFFFF' }}
                        />
                        
                        {/* Today Marker */}
                        <ReferenceDot 
                          x="Today" 
                          y={1180000} 
                          r={0} 
                          isFront={true}
                        >
                          <Label 
                            value="Today: ₹11,80,000 (Combined Assets)" 
                            position="top" 
                            offset={15}
                            fill={isDark ? "#10B981" : "#059669"}
                            fontSize={10}
                            fontWeight={800}
                            className="font-sans italic"
                          />
                        </ReferenceDot>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sector"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Look-Through Sector Risk Heatmap Header */}
                <div className="text-left max-w-2xl">
                  <h3 className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-950"}`}>Look-Through Sector Risk Heatmap</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    AI-powered look-through scans the holdings of underlying mutual funds and ETFs to find hidden overlapping risk, revealing true exposure metrics.
                  </p>
                </div>

                {/* Heatmap Area with mathematical vertical cap line */}
                <div className="relative pt-8 pb-4">
                  {/* SEBI Safety Line */}
                  <div 
                    className="absolute top-0 bottom-0 left-[30%] border-l border-dashed border-rose-500/80 z-20 pointer-events-none"
                    style={{ left: "30%" }}
                  >
                    <div className="absolute top-0 -translate-y-6 left-1/2 -translate-x-1/2 bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md border border-rose-500/20 whitespace-nowrap z-30 shadow-md">
                      SEBI Recommended Exposure Cap (30%)
                    </div>
                  </div>

                  {/* Progressive bars */}
                  <div className="space-y-8 relative z-0">
                    
                    {/* Technology bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className={isDark ? "text-slate-300" : "text-slate-700"}>Technology Sector</span>
                        <span className="text-rose-500 font-extrabold flex items-center gap-1.5 animate-pulse">
                          65.3% Concentration (Critical Risk)
                        </span>
                      </div>
                      <div className={`h-5 w-full rounded-full overflow-hidden p-[2px] ${isDark ? "bg-slate-950 border border-slate-800" : "bg-slate-100 border border-slate-200"}`}>
                        <div 
                          className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.4)] transition-all duration-1000" 
                          style={{ width: "65.3%" }} 
                        />
                      </div>

                      {/* Look-Through AI Micro-Breakdown Expandable Chip */}
                      <div className="pt-2">
                        <button
                          onClick={() => setIsTechExpanded(!isTechExpanded)}
                          className={`w-full text-left p-3.5 rounded-2xl border flex flex-col gap-2 transition-all ${
                            isDark 
                              ? "bg-rose-500/10 hover:bg-rose-500/15 border-rose-500/20 text-rose-200" 
                              : "bg-rose-50 hover:bg-rose-100/70 border-rose-100 text-rose-800"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2.5">
                              <Zap className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                              <span className="text-xs font-black uppercase tracking-wider text-rose-500">
                                Look-Through AI Breakdown
                              </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-rose-400 transition-transform ${isTechExpanded ? "rotate-180" : ""}`} />
                          </div>
                          
                          <AnimatePresence initial={false}>
                            {isTechExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="text-xs font-medium leading-relaxed pt-2 border-t border-rose-500/10">
                                  Includes <strong className="font-bold text-rose-600 dark:text-rose-400">47.3% Direct Stocks (Infosys/TCS)</strong> + <strong className="font-bold text-rose-600 dark:text-rose-400">18.0% Hidden Exposure</strong> inside Tech Growth Mutual Funds.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>

                    {/* Financial Services bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className={isDark ? "text-slate-300" : "text-slate-700"}>Financial Services</span>
                        <span className="text-emerald-500 font-extrabold">20.0% Concentration (Safe)</span>
                      </div>
                      <div className={`h-5 w-full rounded-full overflow-hidden p-[2px] ${isDark ? "bg-slate-950 border border-slate-800" : "bg-slate-100 border border-slate-200"}`}>
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000" 
                          style={{ width: "20.0%" }} 
                        />
                      </div>
                    </div>

                    {/* Commodities / Gold bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className={isDark ? "text-slate-300" : "text-slate-700"}>Commodities / Gold</span>
                        <span className="text-blue-500 font-extrabold">14.7% Concentration (Safe)</span>
                      </div>
                      <div className={`h-5 w-full rounded-full overflow-hidden p-[2px] ${isDark ? "bg-slate-950 border border-slate-800" : "bg-slate-100 border border-slate-200"}`}>
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000" 
                          style={{ width: "14.7%" }} 
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
