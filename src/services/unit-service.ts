import { buildApiUrl } from 'src/config/api';
import { ApiResponse, PaginatedApiResponse, CreateRequest, UpdateRequest } from 'src/types';
import { getAuthHeaders } from 'src/services/auth-headers.service';

export interface UnitData {
  id: number;
  code: string;
  name: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by_user_id: number;
  updated_by_user_id: number;
}

export type CreateUnitRequest = CreateRequest;
export type UpdateUnitRequest = UpdateRequest;

export type PaginatedUnitsResponse = PaginatedApiResponse<UnitData>;
export type UnitResponse = ApiResponse<UnitData>;

class UnitService {
  private baseUrl = buildApiUrl('/common/units');

  async getUnits(page: number = 1, limit: number = 100): Promise<UnitData[]> {
    const headers = getAuthHeaders();
    const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`);
    }

    const result: PaginatedUnitsResponse = await response.json();
    return result.data;
  }

  async getUnit(id: number): Promise<UnitData> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch unit: ${response.statusText}`);
    }

    const result: UnitResponse = await response.json();
    return result.data;
  }

  async createUnit(data: CreateUnitRequest): Promise<UnitData> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create unit: ${response.statusText}`);
    }

    const result: UnitResponse = await response.json();
    return result.data;
  }

  async updateUnit(id: number, data: UpdateUnitRequest): Promise<UnitData> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update unit: ${response.statusText}`);
    }

    const result: UnitResponse = await response.json();
    return result.data;
  }

  async deleteUnit(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete unit: ${response.statusText}`);
    }
  }
}

export const unitService = new UnitService();
