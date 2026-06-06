import { buildApiUrl } from 'src/config/api';
import { ApiResponse, PaginatedApiResponse } from 'src/types';
import { getAuthHeaders } from 'src/services/auth-headers.service';

export interface TransactionData {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  category_id: number;
  amount: number;
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  formality_transaction: 'CASH' | 'BANK' | 'OTHER';
  wallet_id: number;
  description: string;
  bill_image?: string;
}

export type TransactionsResponse = ApiResponse<{
  data: TransactionData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

export type TransactionResponse = ApiResponse<TransactionData>;

class TransactionService {
  private baseUrl = buildApiUrl('/transaction');

  async getTransactions(params: {
    page?: number;
    limit?: number;
    type?: string;
    wallet_id?: string | number;
    category_id?: string | number;
    status?: string;
  }) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });

    const headers = getAuthHeaders();

    const response = await fetch(`${this.baseUrl}?${query}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    const result: TransactionsResponse = await response.json();
    return result.data;
  }

  async createTransaction(data: TransactionData | FormData) {
    const isFormData = data instanceof FormData;
    const headers = getAuthHeaders();
    if (isFormData) delete headers['Content-Type']; // Để trình duyệt tự set boundary cho multipart/form-data

    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Failed to create transaction: ${response.statusText}`);
    return response.json();
  }

  async updateTransaction(id: string | number, data: Partial<TransactionData> | FormData) {
    const isFormData = data instanceof FormData;
    const headers = getAuthHeaders();
    if (isFormData) delete headers['Content-Type'];

    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Failed to update transaction: ${response.statusText}`);
    return response.json();
  }

  async deleteTransaction(id: string | number) {
    const headers = getAuthHeaders();

    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) throw new Error(`Failed to delete transaction: ${response.statusText}`);
    return response.json();
  }
}

export const transactionService = new TransactionService();