// Debt Management Types

export interface DebtOverview {
  totalOwed: number;
  totalOwedToMe: number;
  totalPaid: number;
  totalRemaining: number;
  upcomingDue: number;
  overdue: number;
}

export interface Counterparty {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
  type: 'individual' | 'company';
}

export interface Debt {
  id: string;
  counterparty: Counterparty;
  type: 'borrowing' | 'lending';
  paymentType: 'installment' | 'oneTime';
  contractNumber?: string;
  principal: number;
  paidAmount: number;
  remainingAmount: number;
  interestRate?: number;
  startDate: string;
  dueDate: string;
  status: 'active' | 'paid' | 'overdue' | 'pending' | 'cancelled';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  paymentDate: string;
  method: 'cash' | 'bank' | 'transfer' | 'other';
  note?: string;
  createdAt: string;
}

export interface DebtTimelineItem {
  id: string;
  type: 'payment' | 'due' | 'reminder';
  debtId: string;
  debt: Debt;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
  note?: string;
}

export interface DebtChart {
  date: string;
  debt: number;
  paid: number;
  remaining: number;
}

export interface CounterpartyAnalytics {
  counterparty: Counterparty;
  totalDebt: number;
  totalPaid: number;
  onTimeRate: number;
  overdueCount: number;
  transactionCount: number;
}

export interface DebtWarning {
  id: string;
  type: 'overdue' | 'upcoming' | 'highInterest' | 'unpaid';
  debtId: string;
  debt: Debt;
  severity: 'low' | 'medium' | 'high';
  message: string;
  days?: number;
  interestRate?: number;
}

export interface DebtFilterOptions {
  search: string;
  type: 'all' | 'borrowing' | 'lending';
  status: 'all' | 'active' | 'paid' | 'overdue' | 'pending';
  paymentType: 'all' | 'installment' | 'oneTime';
  dateRange: 'all' | 'today' | '7days' | '30days' | 'thisMonth' | 'thisYear' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
}

export interface DebtFormData {
  counterpartyId: string;
  type: 'borrowing' | 'lending';
  paymentType: 'installment' | 'oneTime';
  amount: number;
  interestRate?: number;
  startDate: string;
  dueDate: string;
  description?: string;
  contractNumber?: string;
}

export interface DebtManagementData {
  overview: DebtOverview;
  debts: Debt[];
  timeline: DebtTimelineItem[];
  charts: DebtChart[];
  counterpartyAnalytics: CounterpartyAnalytics[];
  warnings: DebtWarning[];
}

// Debt Detail Drawer Types
export interface DebtDetailDrawerProps {
  open: boolean;
  debt: Debt | null;
  onClose: () => void;
  onPayNow?: (debtId: string) => void;
  onUpdate?: (debtId: string) => void;
  onAddPayment?: (debtId: string) => void;
  onMarkComplete?: (debtId: string) => void;
}

export interface DebtPaymentDetail {
  id: string;
  debtId: string;
  amount: number;
  paymentDate: string;
  method: 'cash' | 'bank' | 'transfer' | 'other';
  status: 'completed' | 'pending' | 'cancelled';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DebtContract {
  contractNumber: string;
  signedDate: string;
  loanType: 'personal' | 'business' | 'mortgage' | 'other';
  paymentCycle: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  attachments?: ContractAttachment[];
  notes?: string;
}

export interface ContractAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
}

export interface DebtAnalysis {
  repaymentTrend: AnalysisDataPoint[];
  remainingDebt: AnalysisDataPoint[];
  monthlyPayment: AnalysisDataPoint[];
}

export interface AnalysisDataPoint {
  date: string;
  value: number;
}

export interface PaymentSchedule {
  nextPaymentDate: string;
  nextPaymentAmount: number;
  remainingPayments: number;
  totalRemaining: number;
  isOverdue: boolean;
  daysUntilDue: number;
}
