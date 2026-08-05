import React, { useState } from "react";
import { X, Bell, Sparkles, AlertCircle, Clock, CheckCircle2, ShieldAlert, Info } from "lucide-react";

interface NotificationLog {
  id: string;
  type: "error" | "warning" | "success" | "info";
  category: "Risk" | "Tax" | "System";
  title: string;
  body: string;
  timestamp: string;
  isUnread: boolean;
  actionText?: string;
  actionType?: "rebalance" | "tax-hub";
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  onGoToTaxHub?: () => void;
  onSimulateRebalance?: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  onGoToTaxHub,
  onSimulateRebalance,
}) => {
  const isDark = theme === "dark";

  const [notifications, setNotifications] = useState<NotificationLog[]>([
    {
      id: "1",
      type: "error",
      category: "Risk",
      title: "Goal at Risk: Tech Volatility",
      body: "Your 'House Downpayment' goal is exposed to sudden drops in Infosys (INFY). Consider rebalancing.",
      timestamp: "10 mins ago",
      isUnread: true,
      actionText: "Simulate Rebalance ➔",
      actionType: "rebalance",
    },
    {
      id: "2",
      type: "warning",
      category: "Tax",
      title: "Action Required: Tax Deadline",
      body: "14 days remaining to harvest ₹62,000 in STCG losses before the quarter ends.",
      timestamp: "2 hours ago",
      isUnread: true,
      actionText: "Go to Tax Hub ➔",
      actionType: "tax-hub",
    },
    {
      id: "3",
      type: "success",
      category: "System",
      title: "Data Sync Complete",
      body: "Your RBI Account Aggregator stream successfully pulled your latest Sovereign Gold Bond valuations.",
      timestamp: "Yesterday",
      isUnread: false,
    },
    {
      id: "4",
      type: "info",
      category: "Risk",
      title: "Risk Profile Strategy Updated",
      body: "Your risk profile was optimized automatically based on standard allocation patterns & market conditions.",
      timestamp: "2 days ago",
      isUnread: false,
    },
    {
      id: "5",
      type: "success",
      category: "Tax",
      title: "Harvesting Plan Generated",
      body: "AI Advisor successfully scanned your portfolio and generated an optimized tax harvesting report.",
      timestamp: "3 days ago",
      isUnread: false,
    },
    {
      id: "6",
      type: "warning",
      category: "System",
      title: "Connection Alert: CAMS Feed",
      body: "CAMS feed experienced high latency earlier today. Transactions are fully synchronized now.",
      timestamp: "4 days ago",
      isUnread: false,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "Risk" | "Tax" | "System">("All");

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: !n.isUnread } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return n.isUnread;
    return n.category === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20"><ShieldAlert className="w-4 h-4" /></div>;
      case "warning":
        return <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20"><AlertCircle className="w-4 h-4" /></div>;
      case "success":
        return <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><CheckCircle2 className="w-4 h-4" /></div>;
      default:
        return <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20"><Info className="w-4 h-4" /></div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className={`w-screen max-w-md border-l shadow-2xl flex flex-col transition-all duration-300 transform translate-x-0 ${
          isDark 
            ? "bg-slate-900 border-slate-800 text-white" 
            : "bg-white border-slate-200 text-slate-900"
        }`}>
          {/* Header */}
          <div className={`p-6 border-b flex items-center justify-between ${
            isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/50"
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <Bell className={`w-5 h-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h2 className="text-base font-extrabold tracking-tight">Notifications & Logs</h2>
              </div>
              <p className={`text-[11px] mt-0.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Real-time regulatory & portfolio strategy updates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleMarkAllRead}
                className={`text-xs font-bold transition-all hover:underline ${
                  isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"
                }`}
              >
                Mark all read
              </button>
              <button 
                onClick={onClose}
                className={`p-1.5 rounded-xl border transition-all ${
                  isDark 
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white" 
                    : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className={`px-6 py-4 border-b flex items-center gap-1.5 overflow-x-auto scrollbar-none ${
            isDark ? "border-slate-800 bg-slate-950/20" : "border-slate-100 bg-slate-50/20"
          }`}>
            {(["All", "Unread", "Risk", "Tax", "System"] as const).map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border whitespace-nowrap ${
                    isActive
                      ? "bg-teal-600 text-white border-teal-500 shadow-sm"
                      : isDark
                      ? "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-slim">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 ${
                  isDark ? "bg-slate-950 text-slate-700" : "bg-slate-100 text-slate-400"
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold">No alerts found</h3>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  There are no notifications matching your active filter.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-4 relative group ${
                    isDark 
                      ? "bg-slate-950/40 border-slate-800 hover:border-slate-700" 
                      : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                  } ${notif.isUnread ? (isDark ? "ring-1 ring-teal-500/20" : "ring-1 ring-teal-500/10") : ""}`}
                >
                  {/* Read/Unread dot indicator */}
                  {notif.isUnread && (
                    <span className="absolute top-4 right-4 w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                  )}

                  {/* Left Icon */}
                  <div className="shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        notif.category === "Risk" 
                          ? "bg-rose-500/10 text-rose-500 border border-rose-500/10"
                          : notif.category === "Tax"
                          ? "bg-teal-500/10 text-teal-500 border border-teal-500/10"
                          : "bg-sky-500/10 text-sky-500 border border-sky-500/10"
                      }`}>
                        {notif.category}
                      </span>
                      <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        {notif.timestamp}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold mt-1.5 leading-snug">
                      {notif.title}
                    </h4>

                    <p className={`text-xs mt-1 leading-relaxed ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {notif.body}
                    </p>

                    {/* Action button */}
                    {notif.actionText && (
                      <button 
                        onClick={() => {
                          if (notif.actionType === "rebalance" && onSimulateRebalance) {
                            onSimulateRebalance();
                          } else if (notif.actionType === "tax-hub" && onGoToTaxHub) {
                            onGoToTaxHub();
                          }
                          onClose();
                        }}
                        className="mt-3 text-[11px] font-black uppercase tracking-wider text-teal-600 hover:text-teal-500 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {notif.actionText}
                      </button>
                    )}

                    {/* Inline Quick Dismiss for Demo interactivity */}
                    <button
                      onClick={() => handleToggleRead(notif.id)}
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-400 hover:text-slate-300 cursor-pointer"
                    >
                      {notif.isUnread ? "Mark Read" : "Mark Unread"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Info */}
          <div className={`p-6 border-t text-xs ${
            isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/50"
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 shrink-0 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                AI Smart Alerts evaluate risk vectors every 10 minutes from synced RBI FIP channels.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
