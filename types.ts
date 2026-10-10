export interface CalculationInput {
  initialInvestment: string;
  profitRate: string;
  durationInMonths: string;
  monthlyTransactionAmount: string;
  monthlyTransactionChange: string;
  transactionType: 'withdrawal' | 'deposit';
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
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

export interface SavedCalculation {
  id: string;
  timestamp: number;
  inputs: CalculationInput;
  result: CalculationResult;
}

export type Theme = 'dark-blue' | 'light' | 'forest';
export type FontSize = 'sm' | 'md' | 'lg';
