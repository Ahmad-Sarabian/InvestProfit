import React, { useState, useCallback, useEffect } from 'react';
import type { CalculationInput, CalculationResult, MonthlyData, SavedCalculation, Theme, FontSize } from './types';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import MonthlyBreakdownTable from './components/MonthlyBreakdownTable';
import DataChart from './components/DataChart';
import HistoryPanel from './components/HistoryPanel';
import ComparisonTable from './components/ComparisonTable';
import ThemeCustomizer from './components/ThemeCustomizer';
import PWAInstallButton from './components/PWAInstallButton';
import OfflineIndicator from './components/OfflineIndicator';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInput>({
    initialInvestment: '10000000',
    profitRate: '5',
    durationInMonths: '12',
    monthlyTransactionAmount: '0',
    monthlyTransactionChange: '0',
    transactionType: 'withdrawal',
    compoundingFrequency: 'monthly',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedCalculation[]>([]);
  const [comparisonScenarios, setComparisonScenarios] = useState<SavedCalculation[]>([]);
  const [theme, setTheme] = useState<Theme>('dark-blue');
  const [fontSize, setFontSize] = useState<FontSize>('md');

  useEffect(() => {
    try {
      const savedHistoryJSON = localStorage.getItem('investmentCalculatorHistory');
      if (savedHistoryJSON) {
        const savedHistory = JSON.parse(savedHistoryJSON);
        setHistory(savedHistory);
      }
      const savedTheme = localStorage.getItem('calculatorTheme') as Theme | null;
      const savedFontSize = localStorage.getItem('calculatorFontSize') as FontSize | null;
      if (savedTheme) setTheme(savedTheme);
      if (savedFontSize) setFontSize(savedFontSize);
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
  }, []);

  useEffect(() => {
    const body = document.body;
    
    // Set the theme and font-size classes directly, replacing previous ones.
    const themeClass = `theme-${theme}`;
    const fontClass = `font-size-${fontSize}`;
    body.className = `${themeClass} ${fontClass}`;

    // Persist settings to localStorage
    try {
        localStorage.setItem('calculatorTheme', theme);
        localStorage.setItem('calculatorFontSize', fontSize);
    } catch(e) {
        console.error("Failed to save settings to localStorage", e);
    }
  }, [theme, fontSize]);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value as any }));
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
    const profitRate = parseFloat(inputs.profitRate);
    const durationInMonths = parseInt(inputs.durationInMonths, 10);
    const initialMonthlyTransactionAmount = parseFloat(inputs.monthlyTransactionAmount);
    const monthlyTransactionChange = parseFloat(inputs.monthlyTransactionChange);

    if (
      isNaN(initialInvestment) || initialInvestment < 0 ||
      isNaN(profitRate) || profitRate < 0 ||
      isNaN(durationInMonths) || durationInMonths <= 0 ||
      isNaN(initialMonthlyTransactionAmount) || initialMonthlyTransactionAmount < 0 ||
      isNaN(monthlyTransactionChange)
    ) {
      setError('لطفاً تمام مقادیر را به صورت اعداد معتبر وارد کنید (سرمایه اولیه، سود و مبلغ تراکنش باید مثبت باشند).');
      return;
    }

    const rate = profitRate / 100;
    const effectiveMonthlyRate = rate;


    let currentCapital = initialInvestment;
    const monthlyBreakdown: MonthlyData[] = [];
    let totalProfit = 0;
    let currentMonthlyTransactionAmount = initialMonthlyTransactionAmount;
    
    for (let i = 1; i <= durationInMonths; i++) {
      const profit = currentCapital * effectiveMonthlyRate;
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

    const resultData = {
      finalCapital: currentCapital,
      totalProfit,
      totalWithdrawal,
      totalDeposit,
      monthlyBreakdown,
    };
    setResult(resultData);

    const newCalculation: SavedCalculation = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputs,
      result: resultData,
    };
    setHistory(prevHistory => {
      const updatedHistory = [newCalculation, ...prevHistory].slice(0, 10);
      try {
        localStorage.setItem('investmentCalculatorHistory', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage", e);
      }
      return updatedHistory;
    });

  }, [inputs]);

  const handleLoadCalculation = useCallback((id: string) => {
    const calculationToLoad = history.find(item => item.id === id);
    if (calculationToLoad) {
      setInputs(calculationToLoad.inputs);
      setResult(calculationToLoad.result);
      setError(null);
    }
  }, [history]);

  const handleDeleteCalculation = useCallback((id: string) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(item => item.id !== id);
      try {
        localStorage.setItem('investmentCalculatorHistory', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to update history in localStorage", e);
      }
      return updatedHistory;
    });
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('investmentCalculatorHistory');
    } catch (e) {
      console.error("Failed to clear history from localStorage", e);
    }
  }, []);

  const handleAddToComparison = useCallback(() => {
    if (result && comparisonScenarios.length < 3) {
      const isAlreadyAdded = comparisonScenarios.some(
        (scenario) => JSON.stringify(scenario.inputs) === JSON.stringify(inputs)
      );
      if (isAlreadyAdded) return;

      const newScenario: SavedCalculation = {
        id: `comp-${Date.now().toString()}`,
        timestamp: Date.now(),
        inputs,
        result,
      };
      setComparisonScenarios((prev) => [...prev, newScenario]);
    }
  }, [result, inputs, comparisonScenarios]);

  const handleRemoveFromComparison = useCallback((id: string) => {
    setComparisonScenarios((prev) => prev.filter((scenario) => scenario.id !== id));
  }, []);

  const handleClearComparison = useCallback(() => {
    setComparisonScenarios([]);
  }, []);

  const isComparisonFull = comparisonScenarios.length >= 3;
  const isCurrentScenarioCompared = result ? comparisonScenarios.some(s => JSON.stringify(s.inputs) === JSON.stringify(inputs)) : false;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8 relative">
           <div className="absolute top-0 left-0 p-2">
            <ThemeCustomizer
                theme={theme}
                fontSize={fontSize}
                onThemeChange={setTheme}
                onFontSizeChange={setFontSize}
            />
          </div>
          <div className="absolute top-0 right-0 p-2">
            <PWAInstallButton />
          </div>
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
              <HistoryPanel
                history={history}
                onLoad={handleLoadCalculation}
                onDelete={handleDeleteCalculation}
                onClearAll={handleClearHistory}
              />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {result ? (
              <div className="space-y-8">
                <ResultsDisplay
                  result={result}
                  initialInvestment={parseFloat(inputs.initialInvestment)}
                  onAddToComparison={handleAddToComparison}
                  isComparisonFull={isComparisonFull}
                  isCurrentScenarioCompared={isCurrentScenarioCompared}
                  comparisonCount={comparisonScenarios.length}
                />
                <DataChart data={result.monthlyBreakdown} />
                <MonthlyBreakdownTable monthlyBreakdown={result.monthlyBreakdown} />
                {comparisonScenarios.length > 0 && (
                   <ComparisonTable
                    scenarios={comparisonScenarios}
                    onRemove={handleRemoveFromComparison}
                    onClearAll={handleClearComparison}
                  />
                )}
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
      <OfflineIndicator />
    </div>
  );
};

export default App;