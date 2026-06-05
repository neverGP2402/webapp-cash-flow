export type CategoryType = 'INCOME' | 'EXPENSE';

export interface TransactionCategory {
  id: string;
  code: string;
  name: string;
  type: CategoryType | string;
  is_deleted: boolean;
}

export interface TransactionCategoryFormData {
  code: string;
  name: string;
  type: CategoryType;
  description: string;
}

export interface TransactionCategoryPayload {
  code: string;
  name: string;
  type: CategoryType;
}
