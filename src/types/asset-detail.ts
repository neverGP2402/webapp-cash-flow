import type { IconifyName } from 'src/components/iconify/register-icons';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: 'gold' | 'crypto' | 'currency' | 'diamond' | 'silver' | 'cash' | 'bank_account' | 'other';
  icon?: IconifyName;
  color?: string;
  holdingAmount: number;
  averageBuyPrice: number;
  currentMarketPrice: number;
  totalInvested: number;
  currentValue: number;
  unrealizedProfit: number;
  realizedProfit: number;
  profitPercentage: number;
  status: 'profit' | 'loss' | 'neutral';
  lastUpdated: string;
  createdAt: string;
}

export interface AssetPerformance {
  averageBuyPrice: number;
  currentMarketPrice: number;
  totalInvested: number;
  currentValue: number;
  unrealizedProfit: number;
  realizedProfit: number;
  profitPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  weekChange: number;
  weekChangePercentage: number;
  monthChange: number;
  monthChangePercentage: number;
  yearChange: number;
  yearChangePercentage: number;
}

export interface AssetChartPoint {
  timestamp: string;
  value: number;
  profit: number;
  profitPercentage: number;
}

export interface AssetAllocation {
  assetValue: number;
  totalPortfolioValue: number;
  allocationPercentage: number;
  rank: number;
  totalAssets: number;
}

export interface AssetTimelineEvent {
  id: string;
  type: 'buy' | 'sell' | 'price_update' | 'transfer' | 'profit_distribution' | 'other';
  title: string;
  amount: number;
  quantity?: number;
  price?: number;
  wallet?: string;
  note?: string;
  timestamp: string;
  icon?: string;
  color?: string;
}

export interface AssetTransaction {
  id: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalValue: number;
  wallet: string;
  timestamp: string;
  note?: string;
  currentValue: number;
  profit: number;
  profitPercentage: number;
}

export interface AssetInsight {
  id: string;
  type: 'performance' | 'profit' | 'growth' | 'comparison' | 'recommendation';
  title: string;
  description: string;
  value?: number;
  percentage?: number;
  icon?: string;
  color?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AssetDetailData {
  asset: Asset;
  performance: AssetPerformance;
  chartData: AssetChartPoint[];
  allocation: AssetAllocation;
  timeline: AssetTimelineEvent[];
  transactions: AssetTransaction[];
  insights: AssetInsight[];
}

export type AssetChartPeriod = '7D' | '30D' | '90D' | '1Y' | 'ALL';

export interface AssetQuickAction {
  id: string;
  label: string;
  icon: string;
  action: 'buy' | 'sell' | 'update_price' | 'view_history' | 'transfer';
  disabled?: boolean;
}
