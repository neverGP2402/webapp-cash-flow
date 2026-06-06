import { buildApiUrl } from 'src/config/api';
import { getAuthHeaders } from 'src/services/auth-headers.service';
import { Wallet, WalletFormData } from 'src/types/wallet';

class WalletService {
  private baseUrl = buildApiUrl('/common/wallets');

  async getWallets(): Promise<Wallet[]> {
    const headers = getAuthHeaders();

    const response = await fetch(this.baseUrl, {
      headers,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch wallets');
    return result.data;
  }

  async createWallet(data: WalletFormData): Promise<any> {
    const headers = getAuthHeaders();

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateWallet(id: number, data: WalletFormData): Promise<any> {
    const headers = getAuthHeaders();

    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteWallet(id: number): Promise<any> {
    const headers = getAuthHeaders();

    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers,
    });
    return response;
  }
}

export const walletService = new WalletService();