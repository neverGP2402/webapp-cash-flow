import { buildApiUrl } from 'src/config/api';
import { getAuthHeaders } from 'src/services/auth-headers.service';
import { Category, Wallet } from 'src/types/config-transaction';

class ConfigTransactionService {
  private categoryUrl = buildApiUrl('/common/categories');
  private walletUrl = buildApiUrl('/common/wallets');

  // Categories
  async getCategories() {
    const response = await fetch(this.categoryUrl, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  async upsertCategory(data: Partial<Category>) {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${this.categoryUrl}/${data.id}` : this.categoryUrl;
    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Wallets
  async getWallets() {
    const response = await fetch(this.walletUrl, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch wallets');
    return response.json();
  }

  async upsertWallet(data: Partial<Wallet>) {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${this.walletUrl}/${data.id}` : this.walletUrl;
    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(type: 'category' | 'wallet', id: number) {
    const url = type === 'category' ? `${this.categoryUrl}/${id}` : `${this.walletUrl}/${id}`;
    return fetch(url, { method: 'DELETE', headers: getAuthHeaders() });
  }
}

export const configTransactionService = new ConfigTransactionService();