import React from 'react';
import type { SavedCalculation } from '../types';

interface ComparisonTableProps {
  scenarios: SavedCalculation[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const formatCurrency = (value: number) => {
  const isNegative = value < -0.5;
  const absVal = Math.round(Math.abs(value));
  const numStr = new Intl.NumberFormat('fa-IR').format(absVal);
  return isNegative ? `-${numStr}` : numStr;
};

const transactionTypeLabels: Record<string, string> = {
  withdrawal: 'برداشت',
  deposit: 'واریز',
};

const ComparisonTable: React.FC<ComparisonTableProps> = ({ scenarios, onRemove, onClearAll }) => {
  if (scenarios.length === 0) {
    return null;
  }

  const metrics = [
    { label: 'سرمایه اولیه', key: 'initialInvestment', format: (val: any) => formatCurrency(Number(val)) + ' تومان' },
    { label: 'درصد سود ماهانه', key: 'profitRate', format: (val: any) => `${val}%` },
    { label: 'مدت (ماه)', key: 'durationInMonths' },
    { label: 'تورم سالانه', key: 'inflationRate', format: (val: any, inputs: any) => inputs.inflationRate && Number(inputs.inflationRate) > 0 ? `${inputs.inflationRate}%` : 'بدون تورم' },
    { label: 'تراکنش ماهانه', key: 'monthlyTransactionAmount', format: (val: any, inputs: any) => `${transactionTypeLabels[inputs.transactionType]} ${formatCurrency(Number(val))} تومان` },
    { label: 'ارزش نهایی (اسمی)', key: 'finalCapital', isResult: true, isHighlighted: true, format: (val: any) => formatCurrency(val) + ' تومان' },
    { label: 'ارزش واقعی (قدرت خرید)', key: 'realFinalCapital', isResult: true, isHighlighted: true, format: (val: any) => val !== undefined ? formatCurrency(val) + ' تومان' : '-' },
    { label: 'سود کل (اسمی)', key: 'totalProfit', isResult: true, format: (val: any) => formatCurrency(val) + ' تومان' },
    { label: 'سود (زیان) واقعی کل', key: 'realTotalProfit', isResult: true, format: (val: any) => val !== undefined ? formatCurrency(val) + ' تومان' : '-' },
    { label: 'مجموع برداشت', key: 'totalWithdrawal', isResult: true, format: (val: any) => formatCurrency(val) + ' تومان' },
    { label: 'مجموع واریز', key: 'totalDeposit', isResult: true, format: (val: any) => formatCurrency(val) + ' تومان' },
  ];

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">مقایسه سناریوها</h3>
        <button
          onClick={onClearAll}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          پاک کردن همه
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-300 border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th scope="col" className="px-4 py-3 text-left w-1/4">مشخصه</th>
              {scenarios.map((scenario, index) => (
                <th key={scenario.id} scope="col" className="px-4 py-3 text-center">
                  سناریو {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              if (metric.key === 'totalWithdrawal' && !scenarios.some(s => s.result.totalWithdrawal > 0)) return null;
              if (metric.key === 'totalDeposit' && !scenarios.some(s => s.result.totalDeposit > 0)) return null;
              if (metric.key === 'realFinalCapital' && !scenarios.some(s => s.result.hasInflation)) return null;
              if (metric.key === 'realTotalProfit' && !scenarios.some(s => s.result.hasInflation)) return null;
              if (metric.key === 'inflationRate' && !scenarios.some(s => s.inputs.inflationRate && Number(s.inputs.inflationRate) > 0)) return null;
              
              return (
                <tr key={metric.label} className={`border-b border-gray-700 ${metric.isHighlighted ? 'bg-blue-900/30' : ''}`}>
                  <th scope="row" className="px-4 py-4 font-medium text-left text-gray-200">
                    {metric.label}
                  </th>
                  {scenarios.map((scenario) => {
                    const value = metric.isResult 
                      ? scenario.result[metric.key as keyof typeof scenario.result]
                      : scenario.inputs[metric.key as keyof typeof scenario.inputs];
                    const displayValue = metric.format ? metric.format(value, scenario.inputs) : value;
                    const isNegative = typeof value === 'number' && value < -0.5;

                    return (
                      <td key={scenario.id} className={`px-4 py-4 text-center ${metric.isHighlighted ? 'font-bold text-lg text-white' : ''} ${isNegative ? 'text-rose-400' : ''}`}>
                        {displayValue}
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - scenarios.length }, (_, i) => <td key={`${metric.label}-empty-${i}`} className="px-4 py-4"></td>)}
                </tr>
              );
            })}
            <tr className="border-t border-gray-600">
              <th scope="row" className="px-4 py-4 font-medium text-left text-gray-200"></th>
              {scenarios.map((scenario) => (
                <td key={scenario.id} className="px-4 py-3 text-center">
                  <button
                    onClick={() => onRemove(scenario.id)}
                    className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                    aria-label="حذف سناریو"
                    title="حذف سناریو"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </td>
              ))}
              {Array.from({ length: 3 - scenarios.length }, (_, i) => <td key={`remove-empty-${i}`} className="px-4 py-4"></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;