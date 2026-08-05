import React from 'react';
import { Bell, X, AlertCircle, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface NotificationItemProps {
  type: 'error' | 'warning' | 'success';
  title: string;
  timestamp: string;
  body: string;
  actionText?: string;
  theme: 'light' | 'dark';
  onAction?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  timestamp,
  body,
  actionText,
  theme,
  onAction
}) => {
  const isDark = theme === 'dark';
  const iconMap = {
    error: <span className="text-xl">🚨</span>,
    warning: <span className="text-xl">⏳</span>,
    success: <span className="text-xl">✅</span>
  };

  return (
    <div className={`border-b p-4 transition-colors ${
      isDark 
        ? "border-slate-800 hover:bg-slate-800/40" 
        : "border-slate-100 hover:bg-slate-50"
    }`}>
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">
          {iconMap[type]}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h4>
            <span className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{timestamp}</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{body}</p>
          {actionText && (
            <button 
              onClick={onAction}
              className={`mt-2 flex cursor-pointer items-center gap-1 text-[11px] font-black transition-all hover:gap-1.5 hover:underline decoration-current/30 underline-offset-4 uppercase tracking-wider ${
                type === 'error' ? 'text-rose-500 hover:text-rose-400' : 'text-teal-600 hover:text-teal-500'
              }`}
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onSimulateRebalance?: () => void;
  onGoToTaxHub?: () => void;
  onViewAll?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  theme,
  onSimulateRebalance,
  onGoToTaxHub,
  onViewAll
}) => {
  if (!isOpen) return null;
  const isDark = theme === "dark";

  return (
    <div className={`absolute right-0 mt-2 w-80 md:w-96 rounded-2xl border shadow-xl origin-top-right overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50 transition-all ${
      isDark 
        ? "bg-slate-900 border-slate-800 text-white shadow-slate-950/50" 
        : "bg-white border-slate-200 text-slate-900"
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b px-4 py-3 ${
        isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/50"
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className={`h-4 w-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Smart Alerts (3 New)
          </h3>
        </div>
        <button className={`cursor-pointer text-[10px] font-bold transition-colors ${
          isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"
        }`}>
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="scrollbar-slim max-h-[400px] overflow-y-auto">
        <NotificationItem 
          type="error"
          title="Goal at Risk: Tech Volatility"
          timestamp="10 mins ago"
          body="Your 'House Downpayment' goal is exposed to sudden drops in Infosys (INFY). Consider rebalancing."
          actionText="Simulate Rebalance ➔"
          theme={theme}
          onAction={() => {
            onSimulateRebalance?.();
            onClose();
          }}
        />
        <NotificationItem 
          type="warning"
          title="Action Required: Tax Deadline"
          timestamp="2 hours ago"
          body="14 days remaining to harvest ₹62,000 in STCG losses before the quarter ends."
          actionText="Go to Tax Hub ➔"
          theme={theme}
          onAction={() => {
            onGoToTaxHub?.();
            onClose();
          }}
        />
        <NotificationItem 
          type="success"
          title="Data Sync Complete"
          timestamp="Yesterday"
          body="Your RBI Account Aggregator stream successfully pulled your latest Sovereign Gold Bond valuations."
          theme={theme}
        />
      </div>

      {/* Footer */}
      <div className={`border-t px-4 py-2.5 text-center ${
        isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/50"
      }`}>
        <button 
          onClick={() => {
            if (onViewAll) onViewAll();
            onClose();
          }}
          className={`text-[11px] font-bold hover:text-foreground cursor-pointer ${
            isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
};
