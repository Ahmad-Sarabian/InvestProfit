
import React from 'react';
import type { CalculationResult } from '../types';

interface ResultCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, value, description, icon, colorClass }) => (
  <div className={`bg-gray-800 p-5 rounded-xl shadow-lg flex items-start space-x-4 space-x-reverse`}>
    <div className={`flex-shrink-0 w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR', minimumFractionDigits: 0 }).format(value).replace('ریال', 'تومان').trim();
};

interface ResultsDisplayProps {
  result: CalculationResult;
  initialInvestment: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, initialInvestment }) => {
  const { finalCapital, totalProfit, totalWithdrawal, totalDeposit } = result;

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-2xl font-bold text-center mb-6">خلاصه نتایج</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard 
          title="ارزش نهایی سرمایه"
          value={formatCurrency(finalCapital)}
          description="موجودی شما در پایان دوره"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
          colorClass="bg-green-500"
        />
        <ResultCard 
          title="سود کل"
          value={formatCurrency(totalProfit)}
          description="مجموع سود کسب شده"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>}
          colorClass="bg-blue-500"
        />
        {totalWithdrawal > 0 && (
            <ResultCard 
            title="مجموع برداشت"
            value={formatCurrency(totalWithdrawal)}
            description="کل مبلغ برداشت شده طی دوره"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
            colorClass="bg-yellow-500"
            />
        )}
        {totalDeposit > 0 && (
            <ResultCard 
            title="مجموع واریز"
            value={formatCurrency(totalDeposit)}
            description="کل مبلغ واریز شده طی دوره"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
            colorClass="bg-cyan-500"
            />
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
