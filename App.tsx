import React, { useState, useCallback, useEffect } from 'react';
import type { CalculationInput, CalculationResult, MonthlyData } from './types';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import MonthlyBreakdownTable from './components/MonthlyBreakdownTable';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInput>({
    initialInvestment: '10000000',
    monthlyProfitRate: '5',
    durationInMonths: '12',
    monthlyTransactionAmount: '0',
    monthlyTransactionChange: '0',
    transactionType: 'withdrawal',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleTransactionTypeChange = useCallback((type: 'withdrawal' | 'deposit') => {
    setInputs(prev => ({ ...prev, transactionType: type }));
  }, []);


  useEffect(() => {
    setResult(null);
  }, [inputs]);
  
  const handleCalculate = useCallback(() => {
    setError(null);
    setResult(null);

    const initialInvestment = parseFloat(inputs.initialInvestment);
    const monthlyProfitRate = parseFloat(inputs.monthlyProfitRate);
    const durationInMonths = parseInt(inputs.durationInMonths, 10);
    const initialMonthlyTransactionAmount = parseFloat(inputs.monthlyTransactionAmount);
    const monthlyTransactionChange = parseFloat(inputs.monthlyTransactionChange);

    if (
      isNaN(initialInvestment) || initialInvestment < 0 ||
      isNaN(monthlyProfitRate) || monthlyProfitRate < 0 ||
      isNaN(durationInMonths) || durationInMonths <= 0 ||
      isNaN(initialMonthlyTransactionAmount) || initialMonthlyTransactionAmount < 0 ||
      isNaN(monthlyTransactionChange)
    ) {
      setError('لطفاً تمام مقادیر را به صورت اعداد معتبر وارد کنید (سرمایه اولیه، سود و مبلغ تراکنش باید مثبت باشند).');
      return;
    }

    let currentCapital = initialInvestment;
    const monthlyBreakdown: MonthlyData[] = [];
    let totalProfit = 0;
    let currentMonthlyTransactionAmount = initialMonthlyTransactionAmount;
    
    for (let i = 1; i <= durationInMonths; i++) {
      const profit = currentCapital * (monthlyProfitRate / 100);
      const capitalAfterProfit = currentCapital + profit;
      
      let withdrawal = 0;
      let deposit = 0;
      const transactionAmountForCurrentMonth = Math.max(0, currentMonthlyTransactionAmount);

      if (inputs.transactionType === 'withdrawal' && transactionAmountForCurrentMonth > 0) {
        withdrawal = Math.min(transactionAmountForCurrentMonth, capitalAfterProfit);
      } else if (inputs.transactionType === 'deposit' && transactionAmountForCurrentMonth > 0) {
        deposit = transactionAmountForCurrentMonth;
      }

      const endCapital = capitalAfterProfit - withdrawal + deposit;
      
      monthlyBreakdown.push({
        month: i,
        startCapital: currentCapital,
        profit: profit,
        withdrawal: withdrawal,
        deposit: deposit,
        endCapital: endCapital,
      });

      currentCapital = endCapital;
      totalProfit += profit;
      
      currentMonthlyTransactionAmount += monthlyTransactionChange;
    }
    
    const totalWithdrawal = monthlyBreakdown.reduce((acc, month) => acc + month.withdrawal, 0);
    const totalDeposit = monthlyBreakdown.reduce((acc, month) => acc + month.deposit, 0);

    setResult({
      finalCapital: currentCapital,
      totalProfit,
      totalWithdrawal,
      totalDeposit,
      monthlyBreakdown,
    });

  }, [inputs]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">ماشین حساب سود سرمایه گذاری</h1>
          <p className="text-lg text-gray-400">آینده مالی خود را با محاسبه سود مرکب پیش‌بینی کنید.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg sticky top-8">
              <CalculatorForm 
                inputs={inputs}
                onInputChange={handleInputChange}
                onTransactionTypeChange={handleTransactionTypeChange}
                onCalculate={handleCalculate}
              />
              {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {result ? (
              <div className="space-y-8">
                <ResultsDisplay result={result} initialInvestment={parseFloat(inputs.initialInvestment)} />
                <MonthlyBreakdownTable monthlyBreakdown={result.monthlyBreakdown} />
              </div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center h-full min-h-[400px]">
                <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                <h3 className="text-2xl font-semibold text-gray-300">نتایج محاسبه اینجا نمایش داده می‌شود</h3>
                <p className="text-gray-500 mt-2">مقادیر را وارد کرده و روی دکمه "محاسبه" کلیک کنید.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;