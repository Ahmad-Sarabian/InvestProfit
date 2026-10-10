
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
       <div className="overflow-auto max-h-[60vh]">
        <table className="w-full text-sm text-right">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="sticky top-0 left-0 z-20 px-4 py-3 bg-gray-700">ماه</th>
              <th scope="col" className="sticky top-0 z-10 px-4 py-3 bg-gray-700">سرمایه اولیه</th>
              <th scope="col" className="sticky top-0 z-10 px-4 py-3 bg-gray-700 text-green-400">سود ماه</th>
              <th scope="col" className="sticky top-0 z-10 px-4 py-3 bg-gray-700 text-yellow-400">برداشت</th>
              <th scope="col" className="sticky top-0 z-10 px-4 py-3 bg-gray-700 text-cyan-400">واریز</th>
              <th scope="col" className="sticky top-0 z-10 px-4 py-3 bg-gray-700">سرمایه پایانی</th>
            </tr>
          </thead>
          <tbody>
            {monthlyBreakdown.map((row) => (
              <tr key={row.month} className="group border-b border-gray-700">
                <th scope="row" className="sticky left-0 px-4 py-4 font-medium text-white whitespace-nowrap bg-gray-800 transition-colors duration-150 group-hover:bg-gray-700">
                  {row.month}
                </th>
                <td className="px-4 py-4 transition-colors duration-150 group-hover:bg-gray-700">{formatCurrency(row.startCapital)}</td>
                <td className="px-4 py-4 text-green-400 transition-colors duration-150 group-hover:bg-gray-700">+{formatCurrency(row.profit)}</td>
                <td className="px-4 py-4 text-yellow-400 transition-colors duration-150 group-hover:bg-gray-700">{row.withdrawal > 0 ? `-${formatCurrency(row.withdrawal)}` : ' - '}</td>
                <td className="px-4 py-4 text-cyan-400 transition-colors duration-150 group-hover:bg-gray-700">{row.deposit > 0 ? `+${formatCurrency(row.deposit)}` : ' - '}</td>
                <td className="px-4 py-4 font-bold transition-colors duration-150 group-hover:bg-gray-700">{formatCurrency(row.endCapital)}</td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
    </div>
  );
};

export default MonthlyBreakdownTable;