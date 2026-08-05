import React, { useState } from "react";
import { X, Phone, User, CheckCircle2, ChevronRight, Search, FileText, CheckSquare, Square, Building2, Zap, Smartphone, KeyRound } from "lucide-react";

interface AccountAggregatorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  theme?: "dark" | "light";
}

export const AccountAggregatorSetupModal: React.FC<AccountAggregatorSetupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  theme = "dark",
}) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mobile, setMobile] = useState("");
  const [pan, setPan] = useState("");
  const [otp, setOtp] = useState("");
  
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set(["cdsl", "cams", "hdfc"]));

  const toggleAccount = (id: string) => {
    const next = new Set(selectedAccounts);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAccounts(next);
  };

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile && pan) setStep(2);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length >= 4) setStep(3);
  };

  const handleConsent = () => {
    onSuccess();
    onClose();
    setTimeout(() => {
      setStep(1);
      setMobile("");
      setPan("");
      setOtp("");
    }, 500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200 ${
      isDark ? "bg-slate-950/80" : "bg-slate-900/40"
    }`}>
      <div 
        className={`rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden border transition-colors duration-300 ${
          isDark 
            ? "bg-slate-900 border-slate-800 text-white" 
            : "bg-white  text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className={`flex items-start justify-between mb-8`}>
          <div>
            <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <Zap className="w-5 h-5 text-teal-500" /> Link New Institution
            </h3>
            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Connect via RBI Account Aggregator
            </p>
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

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 ${
                step === s 
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-900/30" 
                  : step > s
                    ? "bg-teal-50 text-teal-700 rounded-full"
                    : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`h-1 w-full rounded-full ${
                  step > s ? "bg-teal-500/30" : isDark ? "bg-slate-800" : "bg-slate-100"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Mobile & PAN */}
        {step === 1 && (
          <form onSubmit={handleFetch} className="space-y-5 animate-in slide-in-from-right-4">
            <div className="space-y-4">
              <div>
                <label className={`text-[11px] font-bold block mb-1.5 uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Mobile Number linked to Bank
                </label>
                <div className="relative">
                  <Smartphone className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all ${
                      isDark ? "bg-slate-950 border-slate-700 text-white placeholder-slate-600" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`text-[11px] font-bold block mb-1.5 uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  PAN Number
                </label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  <input
                    type="text"
                    required
                    placeholder="Enter PAN to fetch linked accounts"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm uppercase focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all ${
                      isDark ? "bg-slate-950 border-slate-700 text-white placeholder-slate-600" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-900/20 transition-all cursor-pointer"
            >
              Fetch Linked Accounts <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in slide-in-from-right-4">
            <div className="text-center space-y-2 mb-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6 text-teal-500" />
              </div>
              <h4 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Enter OTP</h4>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Sent to +91 {mobile || "9876543210"}
              </p>
            </div>
            
            <div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full text-center tracking-[1em] text-2xl font-bold border rounded-xl px-4 py-4 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all ${
                  isDark ? "bg-slate-950 border-slate-700 text-white placeholder-slate-700" : "bg-white border-slate-300 text-slate-900 placeholder-slate-300"
                }`}
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-900/20 transition-all cursor-pointer"
            >
              Verify & Proceed <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 3: Account Selection Checklist */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div>
              <h4 className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Select Accounts to Sync</h4>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Found the following accounts linked to your PAN.
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                { id: "cdsl", name: "CDSL Demat", type: "Stocks & Bonds", icon: Building2 },
                { id: "cams", name: "CAMS Mutual Funds", type: "Mutual Funds", icon: FileText },
                { id: "hdfc", name: "HDFC Bank", type: "Savings & Deposits", icon: Building2 }
              ].map((acc) => {
                const Icon = acc.icon;
                const isSelected = selectedAccounts.has(acc.id);
                return (
                  <div
                    key={acc.id}
                    onClick={() => toggleAccount(acc.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? isDark ? "bg-teal-950/30 border-teal-500/50" : "bg-teal-50 border-teal-300"
                        : isDark ? "bg-slate-950/50 border-slate-800 hover:border-slate-700" : "bg-white  hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected
                          ? isDark ? "bg-teal-50 text-teal-700 rounded-full" : "bg-teal-100 text-teal-700"
                          : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{acc.name}</h5>
                        <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{acc.type}</p>
                      </div>
                    </div>
                    <div>
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-teal-500" />
                      ) : (
                        <Square className={`w-5 h-5 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleConsent}
              disabled={selectedAccounts.size === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-900/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Grant Consent & Sync
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
