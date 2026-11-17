export type PaymentMethod = "ach" | "credit_card" | "wire" | "check";

export interface CurrentCustomer {
  name: string;
  accountNumber: string;
}

export type ArKind = "invoices" | "payments" | "credit-memos";

export type ArTransactionType = "CustInvc" | "CustPymt" | "CustCred";

export interface ArTransaction {
  id: string;
  type: ArTransactionType;
  recordType: string;
  documentNumber: string;
  transactionNumber: string;
  displayName: string;
  transactionDate: string;
  dueDate: string | null;
  closeDate: string | null;
  status: { code: string; name: string };
  currency: { id: string; name: string };
  exchangeRate: number;
  amounts: {
    foreignTotal: number;
    foreignPaid: number | null;
    foreignUnpaid: number | null;
    foreignPaymentUsed: number | null;
    foreignPaymentUnused: number | null;
    baseTotal: number;
  };
  memo: string | null;
  voided: boolean;
  lastModifiedAt: string;
}

export interface ArListResponse {
  costCenter: AuthCostCenter;
  transactionType: ArTransactionType;
  dateRange: { from: string; to: string };
  pagination: {
    page: number;
    pageSize: number;
    returned: number;
    totalResults: number;
    totalPages: number;
    hasMore: boolean;
  };
  items: ArTransaction[];
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  userType: string;
  mustChangePassword: boolean;
  lastLoginAt: string;
}

export interface AuthClient {
  id: string;
  code: string;
  name: string;
}

export interface AuthCostCenter {
  id: string;
  code: string;
  name: string;
  client: AuthClient;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
  client: AuthClient | null;
  costCenters: AuthCostCenter[];
}

export interface MeResponse {
  user: AuthUser;
  client: AuthClient | null;
  costCenters: AuthCostCenter[];
}
