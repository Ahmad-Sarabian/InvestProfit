import React, { useState } from 'react';
import type { MonthlyData } from '../types';

interface MonthlyBreakdownTableProps {
  monthlyBreakdown: MonthlyData[];
}

const formatCurrency = (value: number) => {
  const isNegative = value < -0.5;
  const absVal = Math.round(Math.abs(value));
  const numStr = new Intl.NumberFormat('fa-IR').format(absVal);
  return isNegative ? `-${numStr}` : numStr;
};

const MonthlyBreakdownTable: React.FC<MonthlyBreakdownTableProps> = ({ monthlyBreakdown }) => {
  const [showRealAdjusted, setShowRealAdjusted] = useState(false);

  const hasInflationData = monthlyBreakdown.some(
    (row) => row.realEndCapital !== undefined && row.deflator !== undefined && row.deflator > 1
  );

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div>
          <h3 className="text-2xl font-bold text-white">گزارش ماه به ماه</h3>
          {hasInflationData && showRealAdjusted && (
            <p className="text-xs text-amber-400 mt-1">
              مبالغ زیر به ارزش روز سرمایه‌گذاری و با کسر نرخ تورم تعدیل شده‌اند.
            </p>
          )}
        </div>

        {hasInflationData && (
          <div className="flex items-center rounded-lg bg-gray-700/80 p-1 border border-gray-600 text-xs">
            <button
              type="button"
              onClick={() => setShowRealAdjusted(false)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                !showRealAdjusted
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              ارزش اسمی
            </button>
            <button
              type="button"
              onClick={() => setShowRealAdjusted(true)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                showRealAdjusted
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              قدرت خرید واقعی (با تورم)
            </button>
          </div>
        )}
      </div>

      <div className="overflow-auto max-h-[60vh]">
        <table className="w-full text-sm text-right">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="sticky top-0 left-0 z-20 px-4 py-3 bg-gray-700">ماه</th>
              <th scope="col" className="sticky top-0 z-10 px-4 py-3 bg-gray-700">سرمایه اولیه</th>
              <th scope="col" className={`sticky top-0 z-10 px-4 py-3 bg-gray-700 ${showRealAdjusted ? 'text-amber-400' : 'text-green-400'}`}>
                {showRealAdjusted ? 'سود/زیان واقعی' : 'سود ماه'}
              </th>
              <th scope="col" className="sticky top-0 z-10 px-4 py-3 bg-gray-700 text-yellow-400">برداشت</th>
              <th scope="col" className="sticky top-0 z-10 px-4 py-3 bg-gray-700 text-cyan-400">واریز</th>
              <th scope="col" className="sticky top-0 z-10 px-4 py-3 bg-gray-700">
                {showRealAdjusted ? 'سرمایه با قدرت خرید امروز' : 'سرمایه پایانی'}
              </th>
            </tr>
          </thead>
          <tbody>
            {monthlyBreakdown.map((row) => {
              const startCapital = showRealAdjusted && row.realStartCapital !== undefined ? row.realStartCapital : row.startCapital;
              const profit = showRealAdjusted && row.realProfit !== undefined ? row.realProfit : row.profit;
              const withdrawal = showRealAdjusted && row.realWithdrawal !== undefined ? row.realWithdrawal : row.withdrawal;
              const deposit = showRealAdjusted && row.realDeposit !== undefined ? row.realDeposit : row.deposit;
              const endCapital = showRealAdjusted && row.realEndCapital !== undefined ? row.realEndCapital : row.endCapital;
              const isProfitNegative = profit < -0.5;

              return (
                <tr key={row.month} className="group border-b border-gray-700">
                  <th scope="row" className="sticky left-0 px-4 py-4 font-medium text-white whitespace-nowrap bg-gray-800 transition-colors duration-150 group-hover:bg-gray-700">
                    {row.month}
                  </th>
                  <td className="px-4 py-4 transition-colors duration-150 group-hover:bg-gray-700">{formatCurrency(startCapital)}</td>
                  <td className={`px-4 py-4 transition-colors duration-150 group-hover:bg-gray-700 ${isProfitNegative ? 'text-rose-400' : 'text-green-400'}`}>
                    {isProfitNegative ? formatCurrency(profit) : `+${formatCurrency(profit)}`}
                  </td>
                  <td className="px-4 py-4 text-yellow-400 transition-colors duration-150 group-hover:bg-gray-700">{withdrawal > 0 ? `-${formatCurrency(withdrawal)}` : ' - '}</td>
                  <td className="px-4 py-4 text-cyan-400 transition-colors duration-150 group-hover:bg-gray-700">{deposit > 0 ? `+${formatCurrency(deposit)}` : ' - '}</td>
                  <td className={`px-4 py-4 font-bold transition-colors duration-150 group-hover:bg-gray-700 ${showRealAdjusted ? 'text-amber-300' : ''}`}>
                    {formatCurrency(endCapital)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyBreakdownTable;