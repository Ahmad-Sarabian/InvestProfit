
import React from 'react';
import type { MonthlyData } from '../types';

interface MonthlyBreakdownTableProps {
  monthlyBreakdown: MonthlyData[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fa-IR').format(Math.round(value));
};

const MonthlyBreakdownTable: React.FC<MonthlyBreakdownTableProps> = ({ monthlyBreakdown }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
       <h3 className="text-2xl font-bold text-center mb-6">گزارش ماه به ماه</h3>
       <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">ماه</th>
              <th scope="col" className="px-4 py-3">سرمایه اولیه</th>
              <th scope="col" className="px-4 py-3 text-green-400">سود ماه</th>
              <th scope="col" className="px-4 py-3 text-yellow-400">برداشت</th>
              <th scope="col" className="px-4 py-3 text-cyan-400">واریز</th>
              <th scope="col" className="px-4 py-3">سرمایه پایانی</th>
            </tr>
          </thead>
          <tbody>
            {monthlyBreakdown.map((row) => (
              <tr key={row.month} className="border-b border-gray-700 hover:bg-gray-700/50">
                <th scope="row" className="px-4 py-4 font-medium text-white whitespace-nowrap">
                  {row.month}
                </th>
                <td className="px-4 py-4">{formatCurrency(row.startCapital)}</td>
                <td className="px-4 py-4 text-green-400">+{formatCurrency(row.profit)}</td>
                <td className="px-4 py-4 text-yellow-400">{row.withdrawal > 0 ? `-${formatCurrency(row.withdrawal)}` : ' - '}</td>
                <td className="px-4 py-4 text-cyan-400">{row.deposit > 0 ? `+${formatCurrency(row.deposit)}` : ' - '}</td>
                <td className="px-4 py-4 font-bold">{formatCurrency(row.endCapital)}</td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
    </div>
  );
};

export default MonthlyBreakdownTable;
