export type Loan = {
  id: string;
  amount: number;
  interestRate?: number;
  term?: number; // in months
  status: "active" | "paid" | "defaulted";
  startDate?: string;
  endDate?: string;
  monthlyPayment?: number;
  description?: string;
  items?: LoanItem[];
  createdAt?: string;
  recoveredAmount?: number;
};

export type LoanItem = {
  amount: string;
  disbursed_at: string;
  payment_method: string;
  txn_id: string;
};

export type Customer = {
  customer_name: string;
  first_name: string;
  last_name: string;
  customer_phone?: string;
  customer_phone_alternate?: string;
  customer_email?: string;
  customer_address?: string;
};