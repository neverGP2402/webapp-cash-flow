/**
 * Types for Add Asset page
 */

export interface AssetType {
  asset_id: string;
  asset_name: string;
  asset_code: string;
  icon?: string;
  category?: string;
}

export interface Wallet {
  wallet_id: string;
  wallet_name: string;
  wallet_type: string;
  bank_name?: string;
  icon?: string;
}

export interface Unit {
  unit_id: string;
  unit_name: string;
  unit_code: string;
  symbol?: string;
}

export interface ExchangeRate {
  rate_id: string;
  asset_id: string;
  buy_price: number;
  sell_price: number;
  updated_at: string;
  source?: string;
}

export interface AssetOrigin {
  id: string;
  name: string;
  name_en: string;
}

export interface AssetStatus {
  id: string;
  name: string;
  name_en: string;
  color?: string;
}

export interface AddAssetFormData {
  asset_id: string;
  wallet_id: string;
  amount: number;
  price: number;
  origin: string;
  status: string;
  description: string;
  unit_id: string;
  transaction_date: string;
}

export interface AssetOverview {
  currentValue: number;
  purchaseValue: number;
  profit: number;
  profitPercent: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface QuickInsight {
  type: 'positive' | 'negative' | 'neutral';
  message: string;
  message_en: string;
}