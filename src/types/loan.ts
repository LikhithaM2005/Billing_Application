export type Loan = {
  id: string;
  amount: number;
  interestRate: number;
  term: number; // in months
  status: "active" | "paid" | "defaulted";
  startDate: string;
  endDate: string;
  monthlyPayment: number;
};