import { buildApiUrl } from 'src/config/api';
import { ApiResponse, PaginatedApiResponse, CreateRequest, UpdateRequest } from 'src/types';
import { getAuthHeaders } from 'src/services/auth-headers.service';

export interface AssetTypeData {
  id: string;
  code: string;
  name: string;
  icon: string;
  unit_id: string;
  type: 'PHYSICAL' | 'DIGITAL' | 'CASH';
  createdAt: string;
  createdBy: string;
}

export interface CreateAssetTypeRequest extends CreateRequest {
  icon: string;
  unit_id: string;
  type: 'PHYSICAL' | 'DIGITAL' | 'CASH';
}

export interface UpdateAssetTypeRequest extends UpdateRequest {
  icon?: string;
  unit_id?: string;
  type?: 'PHYSICAL' | 'DIGITAL' | 'CASH';
}

export type PaginatedAssetTypesResponse = PaginatedApiResponse<AssetTypeData>;
export type AssetTypeResponse = ApiResponse<AssetTypeData>;

class AssetService {
  private baseUrl = buildApiUrl('/common/assets');

  async getAssetTypes(): Promise<AssetTypeData[]> {
    const headers = getAuthHeaders();
    console.log('Asset Service Headers:', headers);
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch asset types: ${response.statusText}`);
    }

    const result: PaginatedAssetTypesResponse = await response.json();
    return result.data;
  }

  async getAssetType(id: string): Promise<AssetTypeData> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch asset type: ${response.statusText}`);
    }

    const result: AssetTypeResponse = await response.json();
    return result.data;
  }

  async createAssetType(data: CreateAssetTypeRequest): Promise<AssetTypeData> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create asset type: ${response.statusText}`);
    }

    const result: AssetTypeResponse = await response.json();
    return result.data;
  }

  async updateAssetType(id: string, data: UpdateAssetTypeRequest): Promise<AssetTypeData> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update asset type: ${response.statusText}`);
    }

    const result: AssetTypeResponse = await response.json();
    return result.data;
  }

  async deleteAssetType(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete asset type: ${response.statusText}`);
    }
  }
}

export const assetService = new AssetService();
