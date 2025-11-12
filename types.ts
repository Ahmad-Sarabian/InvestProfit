export interface CalculationInput {
  initialInvestment: string;
  monthlyProfitRate: string;
  durationInMonths: string;
  monthlyTransactionAmount: string;
  monthlyTransactionChange: string;
  transactionType: 'withdrawal' | 'deposit';
}

export interface MonthlyData {
  month: number;
  startCapital: number;
  profit: number;
  withdrawal: number;
  deposit: number;
  endCapital: number;
}

export interface CalculationResult {
  finalCapital: number;
  totalProfit: number;
  totalWithdrawal: number;
  totalDeposit: number;
  monthlyBreakdown: MonthlyData[];
}