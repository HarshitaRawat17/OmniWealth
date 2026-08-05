import { Asset, SectorExposure, AssetCategorySummary, AssetSector, AssetCategory } from "../types";

// Format currency in Indian numbering system (e.g., ₹11,80,000)
export function formatINR(amount: number): string {
  if (isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactINR(amount: number): string {
  if (isNaN(amount)) return "₹0";
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return formatINR(amount);
}

export function formatPercent(val: number): string {
  return `${val.toFixed(1)}%`;
}

// Category colors for Recharts pie chart
export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  "Stocks": "#3B82F6", // Vibrant Blue
  "Mutual Funds": "#8B5CF6", // Purple
  "Sovereign Gold Bonds": "#EAB308", // Gold / Amber
  "Fixed Income & Bonds": "#10B981", // Emerald Green
  "REITs / Real Estate": "#F97316", // Orange
  "Cash & Equivalents": "#06B6D4", // Cyan
};

export const SECTOR_COLOR_MAP: Record<AssetSector, { bg: string; text: string; border: string; accent: string }> = {
  "Technology": {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    accent: "#EF4444",
  },
  "Banking & Financials": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    accent: "#10B981",
  },
  "Gold & Commodities": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    accent: "#F59E0B",
  },
  "Consumer Goods / FMCG": {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    accent: "#3B82F6",
  },
  "Healthcare & Pharma": {
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/30",
    accent: "#14B8A6",
  },
  "Energy & Infrastructure": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    accent: "#6366F1",
  },
};

// Calculate Sector Exposure from asset list
export function calculateSectorExposures(assets: Asset[]): SectorExposure[] {
  const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);
  if (totalValue === 0) return [];

  const sectorTotals: Record<string, number> = {};

  assets.forEach((asset) => {
    const sec = asset.sector || "Other";
    sectorTotals[sec] = (sectorTotals[sec] || 0) + (asset.value || 0);
  });

  const allSectors: AssetSector[] = [
    "Technology",
    "Banking & Financials",
    "Gold & Commodities",
    "Consumer Goods / FMCG",
    "Healthcare & Pharma",
    "Energy & Infrastructure",
  ];

  return allSectors.map((sector) => {
    const val = sectorTotals[sector] || 0;
    const pct = totalValue > 0 ? (val / totalValue) * 100 : 0;

    let riskLevel: SectorExposure["riskLevel"] = "SAFE_OPTIMAL";
    let warningMessage = undefined;

    if (sector === "Technology") {
      if (pct > 50) {
        riskLevel = "CRITICAL_DANGER";
        warningMessage = "Danger: High Sector Over-exposure across Direct Stocks & Mutual Funds";
      } else if (pct > 35) {
        riskLevel = "HIGH_WARNING";
        warningMessage = "Warning: Technology allocation exceeds safe threshold (35%)";
      } else if (pct > 0) {
        riskLevel = "SAFE_OPTIMAL";
        warningMessage = "Optimal: Sector risk rebalanced within safe 30% cap";
      }
    } else if (pct > 40) {
      riskLevel = "HIGH_WARNING";
      warningMessage = `Warning: High concentration in ${sector}`;
    }

    return {
      sector,
      value: val,
      percentage: pct,
      riskLevel,
      warningMessage,
    };
  });
}

// Calculate Category Summary for Recharts Pie Chart
export function calculateCategorySummaries(assets: Asset[]): AssetCategorySummary[] {
  const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);
  const categoryTotals: Record<string, number> = {};

  assets.forEach((asset) => {
    const cat = asset.category || "Stocks";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (asset.value || 0);
  });

  return Object.entries(categoryTotals)
    .filter(([_, val]) => val > 0)
    .map(([cat, val]) => ({
      category: cat as AssetCategory,
      value: val,
      percentage: totalValue > 0 ? (val / totalValue) * 100 : 0,
      color: CATEGORY_COLORS[cat as AssetCategory] || "#94A3B8",
    }));
}
