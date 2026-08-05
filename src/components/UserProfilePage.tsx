import React, { useState, useRef } from "react";
import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Lock,
  Moon,
  Sun,
  FileText,
  Download,
  Upload,
  Plus,
  X,
  Check,
  Shield,
  Smartphone,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Eye,
  EyeOff,
  FileSpreadsheet,
  BadgeCheck,
  ArrowUpRight,
  ArrowRight,
  Database,
  LogOut
} from "lucide-react";
import { AccountAggregatorSource, Asset } from "../types";
import { formatINR } from "../utils/formatters";

interface UserProfilePageProps {
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  sources?: AccountAggregatorSource[];
  onOpenAAModal?: () => void;
  totalNetWorth?: number;
  assets?: Asset[];
  riskProfile: "Conservative" | "Moderate" | "Aggressive";
  taxSlab: "10%" | "20%" | "30%";
  onNavigateToTax: () => void;
  onNavigateToAA: () => void;
  onLogout?: () => void;
}

interface LinkedAccount {
  id: string;
  institutionName: string;
  category: string;
  accountMasked: string;
  status: "Active" | "Pending";
  lastSynced: string;
  iconBg: string;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  theme = "dark",
  onToggleTheme,
  sources = [],
  onOpenAAModal,
  totalNetWorth = 1380000,
  assets = [],
  riskProfile,
  taxSlab,
  onNavigateToTax,
  onNavigateToAA,
  onLogout
}) => {
  const isDark = theme === "dark";

  // Section 1: User Hero info
  const [userName] = useState("Arjun V. Singhania");
  const [userInitials] = useState("AS");
  const [maskedPan] = useState("ABCDE****F");
  const [upiId] = useState("arjun.singhania@okhdfcbank");
  const [phoneMasked] = useState("+91 98200 •••20");

  // Section 2: Connected Feeds (Account Aggregators)
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([
    {
      id: "zerodha-1",
      institutionName: "Zerodha Demat & Trading",
      category: "Equities & F&O Holdings",
      accountMasked: "Demat •••• 8492",
      status: "Active",
      lastSynced: "Just now",
      iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      id: "cams-1",
      institutionName: "CAMS Mutual Funds",
      category: "CAMS & KFintech Folios",
      accountMasked: "PAN •••• E1234F",
      status: "Active",
      lastSynced: "2 hrs ago",
      iconBg: "bg-teal-50 text-teal-700 rounded-full border-teal-500/20"
    },
    {
      id: "hdfc-bank-1",
      institutionName: "HDFC Bank Private Banking",
      category: "Savings & Auto-Debit NACH",
      accountMasked: "A/C •••• 3910",
      status: "Active",
      lastSynced: "Today",
      iconBg: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  ]);

  // Modal state for adding a new feed account
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNewInst, setSelectedNewInst] = useState("Groww Securities");
  const [customAccountNo, setCustomAccountNo] = useState("98204910293");

  // Section 4: Statements & Data
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImportingCas, setIsImportingCas] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  // Section 5: Preferences & Security
  const [biometricLock, setBiometricLock] = useState(true);
  const [autoHarvestAlerts, setAutoHarvestAlerts] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  // Handlers for Add New Account
  const handleAddNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewInst) return;

    const newAcc: LinkedAccount = {
      id: `acc-${Date.now()}`,
      institutionName: selectedNewInst,
      category: "AA Linked Feed",
      accountMasked: `A/C •••• ${customAccountNo.slice(-4) || "8912"}`,
      status: "Active",
      lastSynced: "Just now",
      iconBg: "bg-teal-500/10 text-teal-500 border-teal-500/20"
    };

    setLinkedAccounts((prev) => [...prev, newAcc]);
    setIsAddModalOpen(false);
  };

  // CAS PDF Import Simulation
  const handleTriggerCasImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImportingCas(true);
      setImportSuccessMsg(null);
      setTimeout(() => {
        setIsImportingCas(false);
        setImportSuccessMsg(`Successfully imported ${file.name} — 14 MF folios & 4 demat holdings synchronized.`);
        setTimeout(() => setImportSuccessMsg(null), 5000);
      }, 1200);
    }
  };

  // Portfolio Export Simulation
  const handleExportPortfolio = () => {
    setIsExporting(true);
    setExportSuccessMsg(null);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccessMsg("Portfolio Summary & Tax Harvest Ledger downloaded as OMNIWEALTH_PORTFOLIO_2026.pdf");
      setTimeout(() => setExportSuccessMsg(null), 5000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Hidden input for CAS PDF Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.cas"
        className="hidden"
      />

      {/* Header title block */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Profile & Settings
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 rounded-full border border-teal-500/20 flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-teal-500" />
            100% RBI AA Compliant
          </span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: USER HERO CARD (Google Pay / PhonePe Indian Fintech Style)
         ========================================================================= */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-lg transition-all ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-white"
          : "bg-white  text-slate-900"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          
          {/* Left: Avatar initial, Name, Subtitles */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Circular Profile Initial Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-teal-600 via-teal-600 to-cyan-600 p-0.5 shadow-md">
                <div className={`w-full h-full rounded-full flex items-center justify-center font-black text-xl sm:text-2xl tracking-tight ${
                  isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"
                }`}>
                  {userInitials}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Name, PAN Masked & SEBI KYC Verified Badge */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h2 className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {userName}
                </h2>
                
                {/* 🟢 SEBI KYC Verified Badge */}
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 rounded-full border border-teal-500/30 flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-teal-500 block" />
                  SEBI KYC Verified
                </span>
              </div>

              {/* Regulatory Tags Row */}
              <div className="flex flex-wrap items-center gap-2 mb-3 text-[10px] font-semibold">
                <span className={`px-2 py-0.5 rounded-md border ${
                  isDark ? "bg-slate-950/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                  SEBI Reg No: <span className="font-bold text-teal-600 dark:text-teal-400">INA000020606 (RIA)</span>
                </span>
                <span className={`px-2 py-0.5 rounded-md border ${
                  isDark ? "bg-slate-950/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                  BASL ID: <span className="font-bold text-teal-600 dark:text-teal-400">2319</span>
                </span>
              </div>

              {/* Masked PAN and UPI ID */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-slate-500">PAN:</span>
                  <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                    isDark ? "bg-slate-800 text-slate-200 border border-slate-700" : "bg-slate-100 text-slate-800 border "
                  }`}>
                    {maskedPan}
                  </span>
                </div>
                <span>•</span>
                <span>UPI: <strong className={isDark ? "text-slate-200" : "text-slate-800"}>{upiId}</strong></span>
                <span>•</span>
                <span>{phoneMasked}</span>
              </div>
            </div>
          </div>

          {/* Right: Net Worth Quick Chip */}
          <div className={`w-full sm:w-auto px-4 py-3 rounded-2xl border text-left sm:text-right ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 "
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
              Total Portfolio Value
            </span>
            <span className={`text-base sm:text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>
              {formatINR(totalNetWorth)}
            </span>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 2: CONNECTED FEEDS SUMMARY CARD
         ========================================================================= */}
      <div className={`p-6 rounded-3xl border shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-white"
          : "bg-white text-slate-900"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${
            isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold tracking-tight">Connected Data Feeds</h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                3 Active
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Zerodha Demat • CAMS Mutual Funds • HDFC Bank
            </p>
          </div>
        </div>
        
        <button
          onClick={onNavigateToAA}
          className="text-xs font-bold text-teal-600 hover:text-teal-500 transition-colors uppercase tracking-wider flex items-center gap-1.5 shrink-0"
        >
          Manage Connections ➔
        </button>
      </div>

      {/* =========================================================================
          SECTION 3: RISK & TAX PROFILE CARD (Read-Only Summary)
         ========================================================================= */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-white"
          : "bg-white text-slate-900"
      }`}>
        <div>
          <h3 className="text-base font-extrabold tracking-tight mb-1">
            Active Strategy Profile
          </h3>
          <p className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Risk: <span className={isDark ? "text-white" : "text-slate-900"}>{riskProfile}</span> &nbsp;|&nbsp; Tax Bracket: <span className={isDark ? "text-white" : "text-slate-900"}>{taxSlab}</span>
          </p>
        </div>
        
        <button
          onClick={onNavigateToTax}
          className="text-xs font-bold text-teal-600 hover:text-teal-500 transition-colors uppercase tracking-wider flex items-center gap-1 shrink-0"
        >
          Adjust in Tax & Optimization Engine <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* =========================================================================
          SECTION 4: STATEMENTS & DATA
         ========================================================================= */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-lg transition-all ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-white"
          : "bg-white  text-slate-900"
      }`}>
        <div className="pb-4 mb-5 border-b  dark:border-slate-800">
          <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-500" />
            Statements & Data
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Button 1: Import CAS PDF */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 "
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 rounded-full">
                  <Upload className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-extrabold">Import CAS PDF</h4>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Upload Consolidated Account Statement from CAMS, KFintech, NSDL, or CDSL to auto-update folios.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTriggerCasImport}
              disabled={isImportingCas}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 shadow-sm"
              }`}
            >
              {isImportingCas ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-500" />
                  <span>Parsing CAS PDF...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-teal-500" />
                  <span>Import CAS PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Button 2: Export Portfolio Summary */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 "
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700 rounded-full">
                  <Download className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-extrabold">Export Portfolio Summary</h4>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Download complete portfolio valuation, sector allocation heatmap & tax-loss harvesting report.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportPortfolio}
              disabled={isExporting}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-teal-600 hover:bg-teal-500 text-white"
                  : "bg-teal-600 hover:bg-teal-500 text-white shadow-sm"
              }`}
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Summary...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Portfolio Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success notification messages */}
        {importSuccessMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{importSuccessMsg}</span>
          </div>
        )}

        {exportSuccessMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{exportSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 5: PREFERENCES & SECURITY (Dark Mode & Biometric Lock)
         ========================================================================= */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-lg transition-all ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-white"
          : "bg-white  text-slate-900"
      }`}>
        <div className="pb-4 mb-5 border-b  dark:border-slate-800">
          <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-500" />
            Preferences & Security
          </h3>
        </div>

        <div className="space-y-4">
          {/* 5B: Biometric Lock Toggle Switch */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 "
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                isDark ? "bg-slate-900 border-slate-700 text-teal-400" : "bg-white  text-teal-600"
              }`}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">Biometric Lock</span>
                <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Require Face ID, Touch ID, or screen PIN when opening OmniWealth
                </span>
              </div>
            </div>

            {/* Switch Control */}
            <button
              type="button"
              onClick={() => setBiometricLock(!biometricLock)}
              className={`w-12 h-7 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                biometricLock ? "bg-teal-500 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
            </button>
          </div>

          {/* Additional Clean PhonePe style toggle: Tax-Loss Harvesting Notifications */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 "
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                isDark ? "bg-slate-900 border-slate-700 text-teal-400" : "bg-white  text-teal-600"
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">Automated Tax-Loss Harvesting Alerts</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAutoHarvestAlerts(!autoHarvestAlerts)}
              className={`w-12 h-7 rounded-full transition-all p-1 flex items-center cursor-pointer ${
                autoHarvestAlerts ? "bg-teal-500 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 6: PRIMARY BANK CARD (Payouts & Auto-Debit)
         ========================================================================= */}
      <div className={`p-6 rounded-3xl border shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-white"
          : "bg-white text-slate-900"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${
            isDark ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-teal-50 text-teal-600 border border-teal-200"
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold tracking-tight">Primary Bank (Payouts & Auto-Debit)</h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                e-NACH Active
              </span>
            </div>
            <p className={`text-xs mt-1 font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              HDFC Bank •••• 3910 &nbsp;|&nbsp; IFSC: HDFC0001234
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 7: FOOTER ACTIONS CARD
         ========================================================================= */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-white"
          : "bg-white text-slate-900"
      }`}>
        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
          <a
            href="#support"
            onClick={(e) => e.preventDefault()}
            className="hover:text-teal-500 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Support & Help</span>
          </a>
          <span className="text-slate-300 dark:text-slate-800 hidden sm:inline">|</span>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="hover:text-teal-500 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Terms & SEBI Disclosures</span>
          </a>
        </div>

        <button
          onClick={onLogout}
          className="px-5 py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 border border-rose-500/20 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm w-full md:w-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* =========================================================================
          MODAL: Add New Account Aggregator Feed
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className={`relative z-10 w-full max-w-md p-6 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white  text-slate-900"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-500" />
                <h3 className="font-extrabold text-base">Add New Account</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className={`p-1.5 rounded-xl border transition cursor-pointer ${
                  isDark ? "bg-slate-800 hover:bg-slate-700 border-slate-700" : "bg-slate-100 hover:bg-slate-200 border-slate-300"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewAccount} className="mt-4 space-y-4">
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Select Institution / Broker
                </label>
                <select
                  value={selectedNewInst}
                  onChange={(e) => setSelectedNewInst(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500 ${
                    isDark
                      ? "bg-slate-950 border-slate-800 text-white"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                >
                  <option value="Groww Securities">Groww Securities (Equities & MF)</option>
                  <option value="AngelOne Wealth">AngelOne Wealth Demat</option>
                  <option value="ICICI Bank Wealth">ICICI Bank Wealth Management</option>
                  <option value="SBI Capital Markets">SBI Capital Markets</option>
                  <option value="Kotak Securities">Kotak Securities Demat</option>
                </select>
              </div>

              <div>
                <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Account / Demat Identifier (Last 4 Digits)
                </label>
                <input
                  type="text"
                  value={customAccountNo}
                  onChange={(e) => setCustomAccountNo(e.target.value)}
                  placeholder="e.g. 8492"
                  className={`w-full p-3 rounded-xl border text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500 ${
                    isDark
                      ? "bg-slate-950 border-slate-800 text-white"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs transition shadow-md cursor-pointer"
                >
                  Link via RBI AA Consent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
