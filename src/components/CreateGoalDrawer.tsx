import React, { useState } from 'react';
import { X, Target, Calendar, IndianRupee, Sparkles, CheckCircle2, Circle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CreateGoalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const CreateGoalDrawer: React.FC<CreateGoalDrawerProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const isDark = theme === "dark";

  // Form State
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetYear, setTargetYear] = useState("2026");

  // Mock mapped assets state
  const [selectedAssets, setSelectedAssets] = useState<Record<string, boolean>>({
    'infosys': true,
    'tech-growth': true,
    'sgb': false
  });

  const toggleAsset = (id: string) => {
    setSelectedAssets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Dark Overlay for dimming background */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className={`relative w-full max-w-md h-full flex flex-col shadow-2xl transition-transform animate-in slide-in-from-right duration-300 rounded-l-3xl overflow-hidden ${
        isDark ? "bg-slate-900 border-l border-slate-800" : "bg-white border-l "
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-5 flex items-center justify-between border-b ${
          isDark ? "border-slate-800 bg-slate-950/50" : "border-slate-100 bg-slate-50/80"
        }`}>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <span>🎯</span> Create Financial Goal
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-200 text-slate-500 hover:text-slate-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Step 1: Goal Parameters */}
          <div className="space-y-4">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Step 1: Goal Parameters
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Goal Name
                </label>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    <Target className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g., House Downpayment"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all border focus:ring-2 ${
                      isDark 
                        ? "bg-slate-950/50 border-slate-700 text-white placeholder-slate-600 focus:border-teal-500/50 focus:ring-teal-500/20" 
                        : "bg-slate-50  text-slate-900 placeholder-slate-400 focus:border-teal-500/50 focus:ring-teal-500/20"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Target Amount (₹)
                </label>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <input 
                    type="number" 
                    placeholder="25,00,000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all border focus:ring-2 ${
                      isDark 
                        ? "bg-slate-950/50 border-slate-700 text-white placeholder-slate-600 focus:border-teal-500/50 focus:ring-teal-500/20" 
                        : "bg-slate-50  text-slate-900 placeholder-slate-400 focus:border-teal-500/50 focus:ring-teal-500/20"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Target Year
                </label>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <select 
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all border appearance-none focus:ring-2 ${
                      isDark 
                        ? "bg-slate-950/50 border-slate-700 text-white focus:border-teal-500/50 focus:ring-teal-500/20" 
                        : "bg-slate-50  text-slate-900 focus:border-teal-500/50 focus:ring-teal-500/20"
                    }`}
                  >
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                    <option value="2035">2035+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Map Existing Assets */}
          <div className="space-y-4">
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Step 2: Map Existing Assets
              </h3>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Select synced Account Aggregator assets to dedicate towards this goal.
              </p>
            </div>

            <div className="space-y-3">
              {/* Asset Card 1 */}
              <div 
                onClick={() => toggleAsset('infosys')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedAssets['infosys']
                    ? isDark ? "bg-teal-500/10 border-teal-500/40" : "bg-teal-50 border-teal-200"
                    : isDark ? "bg-slate-950/30 border-slate-800 hover:border-slate-700" : "bg-white  hover:border-slate-300"
                }`}
              >
                <div className={`mt-0.5 ${selectedAssets['infosys'] ? "text-teal-500" : isDark ? "text-slate-600" : "text-slate-300"}`}>
                  {selectedAssets['infosys'] ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-900"}`}>Infosys Ltd</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                      isDark ? "bg-rose-50 text-rose-700 rounded-full" : "bg-rose-50 text-rose-700 rounded-full"
                    }`}>
                      <AlertTriangle className="w-3 h-3" /> Equity/High Risk
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                    ₹4,50,000 available
                  </span>
                </div>
              </div>

              {/* Asset Card 2 */}
              <div 
                onClick={() => toggleAsset('tech-growth')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedAssets['tech-growth']
                    ? isDark ? "bg-teal-500/10 border-teal-500/40" : "bg-teal-50 border-teal-200"
                    : isDark ? "bg-slate-950/30 border-slate-800 hover:border-slate-700" : "bg-white  hover:border-slate-300"
                }`}
              >
                <div className={`mt-0.5 ${selectedAssets['tech-growth'] ? "text-teal-500" : isDark ? "text-slate-600" : "text-slate-300"}`}>
                  {selectedAssets['tech-growth'] ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-900"}`}>Tech Growth MF</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                      isDark ? "bg-rose-50 text-rose-700 rounded-full" : "bg-rose-50 text-rose-700 rounded-full"
                    }`}>
                      <AlertTriangle className="w-3 h-3" /> Equity/High Risk
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                    ₹3,20,000 available
                  </span>
                </div>
              </div>

              {/* Asset Card 3 */}
              <div 
                onClick={() => toggleAsset('sgb')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedAssets['sgb']
                    ? isDark ? "bg-teal-500/10 border-teal-500/40" : "bg-teal-50 border-teal-200"
                    : isDark ? "bg-slate-950/30 border-slate-800 hover:border-slate-700" : "bg-white  hover:border-slate-300"
                }`}
              >
                <div className={`mt-0.5 ${selectedAssets['sgb'] ? "text-teal-500" : isDark ? "text-slate-600" : "text-slate-300"}`}>
                  {selectedAssets['sgb'] ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-900"}`}>Sovereign Gold Bond</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                      isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600"
                    }`}>
                      <ShieldCheck className="w-3 h-3" /> Safe/Debt
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                    ₹2,30,000 available
                  </span>
                </div>
              </div>

            </div>
          </div>
          
        </div>

        {/* Step 3: AI Action (Footer) */}
        <div className={`p-6 border-t ${
          isDark ? "border-slate-800 bg-slate-950/80" : " bg-white"
        }`}>
          <button 
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-teal-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>✨ Map Assets & Run AI Risk Check</span>
          </button>
          <p className={`text-center text-[10px] mt-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            OmniWealth AI will analyze your timeline against the volatility of selected assets.
          </p>
        </div>

      </div>
    </div>
  );
};
