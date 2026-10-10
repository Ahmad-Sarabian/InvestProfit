
import React from 'react';
import type { CalculationResult } from '../types';
import useCountUp from './useCountUp';

interface ResultCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string;
  accentBorderClass: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, value, description, icon, iconBgClass, accentBorderClass }) => (
  <div className={`bg-gray-800 p-5 rounded-xl shadow-lg flex items-start space-x-4 space-x-reverse border-t-4 ${accentBorderClass}`}>
    <div className={`flex-shrink-0 w-12 h-12 ${iconBgClass} rounded-lg flex items-center justify-center`}>
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
  onAddToComparison: () => void;
  isComparisonFull: boolean;
  isCurrentScenarioCompared: boolean;
  comparisonCount: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, initialInvestment, onAddToComparison, isComparisonFull, isCurrentScenarioCompared, comparisonCount }) => {
  const { finalCapital, totalProfit, totalWithdrawal, totalDeposit } = result;

  // Animate key figures
  const animatedFinalCapital = useCountUp(finalCapital);
  const animatedTotalProfit = useCountUp(totalProfit);
  const profitPercentage = initialInvestment > 0 ? (totalProfit / initialInvestment) * 100 : 0;
  const animatedProfitPercentage = useCountUp(profitPercentage);
  const animatedTotalWithdrawal = useCountUp(totalWithdrawal);
  const animatedTotalDeposit = useCountUp(totalDeposit);

  const getButtonText = () => {
    if (isCurrentScenarioCompared) return 'به لیست اضافه شد';
    if (isComparisonFull) return 'لیست مقایسه پر است';
    return 'افزودن به لیست مقایسه';
  };
  
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-2xl font-bold text-center mb-6">خلاصه نتایج</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard 
          title="ارزش نهایی سرمایه"
          value={formatCurrency(animatedFinalCapital)}
          description="موجودی شما در پایان دوره"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
          iconBgClass="bg-green-500"
          accentBorderClass="border-green-500"
        />
        <ResultCard 
          title="سود کل"
          value={formatCurrency(animatedTotalProfit)}
          description="مجموع سود کسب شده طی دوره"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>}
          iconBgClass="bg-blue-500"
          accentBorderClass="border-blue-500"
        />
        <ResultCard 
          title="بازده کل سرمایه (ROI)"
          value={`${animatedProfitPercentage.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}%`}
          description="نسبت سود خالص به هزینه سرمایه‌گذاری"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 100-4 2 2 0 000 4zM9 17a2 2 0 100-4 2 2 0 000 4zM17 17L7 7" /></svg>}
          iconBgClass="bg-purple-500"
          accentBorderClass="border-purple-500"
        />
        {totalWithdrawal > 0 && (
            <ResultCard 
            title="مجموع برداشت"
            value={formatCurrency(animatedTotalWithdrawal)}
            description="کل مبلغ برداشت شده طی دوره"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
            iconBgClass="bg-yellow-500"
            accentBorderClass="border-yellow-500"
            />
        )}
        {totalDeposit > 0 && (
            <ResultCard 
            title="مجموع واریز"
            value={formatCurrency(animatedTotalDeposit)}
            description="کل مبلغ واریز شده طی دوره"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
            iconBgClass="bg-cyan-500"
            accentBorderClass="border-cyan-500"
            />
        )}
      </div>
       <button
        onClick={onAddToComparison}
        disabled={isComparisonFull || isCurrentScenarioCompared}
        className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-800 flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-700"
      >
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {getButtonText()} ({comparisonCount}/3)
      </button>
    </div>
  );
};

export default ResultsDisplay;