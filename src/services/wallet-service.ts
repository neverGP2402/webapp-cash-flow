import { buildApiUrl } from 'src/config/api';
import { ApiResponse, PaginatedApiResponse } from 'src/types';
import { getAuthHeaders } from 'src/services/auth-headers.service';
import type { Wallet, WalletFormData } from 'src/types/wallet';

export interface CreateWalletRequest extends WalletFormData {}
export interface UpdateWalletRequest extends Partial<WalletFormData> {}

export type WalletResponse = ApiResponse<Wallet>;
export type WalletsResponse = PaginatedApiResponse<Wallet>;

class WalletService {
  private baseUrl = buildApiUrl('/com/wallets');

  async getWallets(): Promise<Wallet[]> {
    const headers = getAuthHeaders();
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch wallets: ${response.statusText}`);
    }

    const result: WalletsResponse = await response.json();
    return result.data;
  }

  async getWallet(id: string): Promise<Wallet> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch wallet: ${response.statusText}`);
    }

    const result: WalletResponse = await response.json();
    return result.data;
  }

  async createWallet(data: CreateWalletRequest): Promise<Wallet> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create wallet: ${response.statusText}`);
    }

    const result: WalletResponse = await response.json();
    return result.data;
  }

  async updateWallet(id: string, data: UpdateWalletRequest): Promise<Wallet> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update wallet: ${response.statusText}`);
    }

    const result: WalletResponse = await response.json();
    return result.data;
  }

  async deleteWallet(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete wallet: ${response.statusText}`);
    }
  }
}

export const walletService = new WalletService();