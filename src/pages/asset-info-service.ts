import { buildApiUrl } from 'src/config/api';
import { ApiResponse } from 'src/types';
import { getAuthHeaders } from 'src/services/auth-headers.service';

export interface CreateAssetInfoRequest {
  asset_id: number;
  wallet_id: number;
  amount: number;
  price: number;
  unit_id: number;
  transaction_date: string;
  origin?: string;
  status?: string;
  description?: string;
}

export type AssetInfoResponse = ApiResponse<any>;

class AssetInfoService {
  private baseUrl = buildApiUrl('/asset/info-assets');

  async createAssetInfo(payload: CreateAssetInfoRequest): Promise<AssetInfoResponse> {
    const headers = getAuthHeaders();
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create asset info: ${response.statusText}`);
    }

    return response.json();
  }
}

export const assetInfoService = new AssetInfoService();