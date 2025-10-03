export type TransactionStatus = "success" | "failed" | "pending";

export interface Transaction {
  id: string;
  amountInPaise: number;
  currency: string;
  customerName: string;
  method: string;
  createdAt: string; // ISO string
  status: TransactionStatus;
}



