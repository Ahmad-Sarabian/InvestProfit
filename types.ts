export interface CalculationInput {
  initialInvestment: string;
  profitRate: string;
  durationInMonths: string;
  monthlyTransactionAmount: string;
  monthlyTransactionChange: string;
  transactionType: 'withdrawal' | 'deposit';
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  inflationRate?: string;
}

export interface MonthlyData {
  month: number;
  startCapital: number;
  profit: number;
  withdrawal: number;
  deposit: number;
  endCapital: number;
  realEndCapital?: number;
  realProfit?: number;
  realWithdrawal?: number;
  realDeposit?: number;
  realStartCapital?: number;
  deflator?: number;
}

export interface CalculationResult {
  finalCapital: number;
  totalProfit: number;
  totalWithdrawal: number;
  totalDeposit: number;
  monthlyBreakdown: MonthlyData[];
  inflationRate?: number;
  hasInflation?: boolean;
  realFinalCapital?: number;
  realTotalProfit?: number;
  realTotalWithdrawal?: number;
  realTotalDeposit?: number;
  realNetGain?: number;
}

export interface SavedCalculation {
  id: string;
  timestamp: number;
  inputs: CalculationInput;
  result: CalculationResult;
}

export type Theme = 'dark-blue' | 'light' | 'forest';
export type FontSize = 'sm' | 'md' | 'lg';
