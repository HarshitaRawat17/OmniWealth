export type AssetCategory = 
  | "Stocks"
  | "Mutual Funds"
  | "Sovereign Gold Bonds"
  | "Fixed Income & Bonds"
  | "REITs / Real Estate"
  | "Cash & Equivalents";

export type AssetSector = 
  | "Technology"
  | "Banking & Financials"
  | "Gold & Commodities"
  | "Consumer Goods / FMCG"
  | "Healthcare & Pharma"
  | "Energy & Infrastructure";

export type TaxStatus = 
  | "STCG (20%)"
  | "LTCG (12.5%)"
  | "Tax Exempt (Maturity)"
  | "Debt Slab Rate"
  | "Tax Harvesting Eligible";

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number;
  sector: AssetSector;
  taxStatus: TaxStatus;
  accountSource?: string;
  units?: number;
  navOrPrice?: number;
  notes?: string;
}

export interface SectorExposure {
  sector: AssetSector;
  value: number;
  percentage: number;
  riskLevel: "CRITICAL_DANGER" | "HIGH_WARNING" | "MODERATE" | "SAFE_OPTIMAL";
  warningMessage?: string;
}

export interface AssetCategorySummary {
  category: AssetCategory;
  value: number;
  percentage: number;
  color: string;
}

export interface OptimizationLog {
  timestamp: string;
  techPercentageBefore: number;
  techPercentageAfter: number;
  taxSavedINR: number;
  actionsTaken: string[];
}

export interface AccountAggregatorSource {
  id: string;
  name: string;
  type: string;
  status: "CONNECTED" | "SYNCING" | "ERROR";
  lastSyncedAt: string;
  assetCount: number;
  totalValue: number;
  logoIcon?: string;
}
