import { buildApiUrl } from 'src/config/api';
import { getAuthHeaders } from 'src/services/auth-headers.service';

export interface WalletData {
  id: number;
  name: string;
  code: string;
  type: string;
}

class WalletPageService {
  private baseUrl = buildApiUrl('/common/wallets');

  async getWallets(): Promise<WalletData[]> {
    const headers = getAuthHeaders();
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch wallets');
    return result.data;
  }
}

export const walletService = new WalletPageService();