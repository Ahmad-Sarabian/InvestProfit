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
  badge?: string;
  valueColorClass?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  iconBgClass, 
  accentBorderClass, 
  badge,
  valueColorClass = "text-white"
}) => (
  <div className={`bg-gray-800 p-5 rounded-xl shadow-lg flex items-start space-x-4 space-x-reverse border-t-4 ${accentBorderClass} relative`}>
    <div className={`flex-shrink-0 w-12 h-12 ${iconBgClass} rounded-lg flex items-center justify-center`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-gray-400">{title}</p>
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-700/80 text-gray-200 border border-gray-600">
            {badge}
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold mt-0.5 truncate ${valueColorClass}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

const formatCurrency = (value: number) => {
  const isNegative = value < -0.5;
  const absVal = Math.round(Math.abs(value));
  const numStr = new Intl.NumberFormat('fa-IR').format(absVal);
  return isNegative ? `-${numStr} تومان` : `${numStr} تومان`;
};

interface ResultsDisplayProps {
  result: CalculationResult;
  initialInvestment: number;
  onAddToComparison: () => void;
  isComparisonFull: boolean;
  isCurrentScenarioCompared: boolean;
  comparisonCount: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  result, 
  initialInvestment, 
  onAddToComparison, 
  isComparisonFull, 
  isCurrentScenarioCompared, 
  comparisonCount 
}) => {
  const { 
    finalCapital, 
    totalProfit, 
    totalWithdrawal, 
    totalDeposit, 
    hasInflation, 
    inflationRate, 
    realFinalCapital, 
    realTotalProfit,
    realTotalWithdrawal,
    realTotalDeposit 
  } = result;

  // Animate key figures
  const animatedFinalCapital = useCountUp(finalCapital);
  const animatedTotalProfit = useCountUp(totalProfit);
  const profitPercentage = initialInvestment > 0 ? (totalProfit / initialInvestment) * 100 : 0;
  const animatedProfitPercentage = useCountUp(profitPercentage);
  const animatedTotalWithdrawal = useCountUp(totalWithdrawal);
  const animatedTotalDeposit = useCountUp(totalDeposit);

  // Animated real purchasing power figures
  const effectiveRealProfit = realTotalProfit ?? (hasInflation && realFinalCapital !== undefined ? realFinalCapital - initialInvestment : totalProfit);
  const animatedRealFinalCapital = useCountUp(realFinalCapital ?? finalCapital);
  const animatedRealTotalProfit = useCountUp(effectiveRealProfit);
  
  const realROI = (hasInflation && initialInvestment > 0)
    ? (effectiveRealProfit / initialInvestment) * 100
    : profitPercentage;
  const animatedRealROI = useCountUp(realROI);

  const isRealLoss = hasInflation && effectiveRealProfit < 0;

  const getButtonText = () => {
    if (isCurrentScenarioCompared) return 'به لیست اضافه شد';
    if (isComparisonFull) return 'لیست مقایسه پر است';
    return 'افزودن به لیست مقایسه';
  };
  
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h3 className="text-2xl font-bold text-white">خلاصه نتایج</h3>
        {hasInflation && inflationRate && inflationRate > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-900/40 text-amber-300 border border-amber-600/50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            محاسبه شده با تورم سالانه {inflationRate.toLocaleString('fa-IR')}%
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard 
          title="ارزش نهایی سرمایه (اسمی)"
          value={formatCurrency(animatedFinalCapital)}
          description="موجودی حساب شما در پایان دوره"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          }
          iconBgClass="bg-green-500"
          accentBorderClass="border-green-500"
          badge="اسمی"
        />

        {hasInflation && realFinalCapital !== undefined ? (
          <ResultCard 
            title="ارزش واقعی سرمایه (قدرت خرید امروز)"
            value={formatCurrency(animatedRealFinalCapital)}
            description="ارزش موجودی نهایی تعدیل‌شده با نرخ تورم"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            iconBgClass="bg-amber-500"
            accentBorderClass="border-amber-500"
            badge="قدرت خرید"
          />
        ) : (
          <ResultCard 
            title="سود کل"
            value={formatCurrency(animatedTotalProfit)}
            description="مجموع سود کسب شده طی دوره"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path>
              </svg>
            }
            iconBgClass="bg-blue-500"
            accentBorderClass="border-blue-500"
          />
        )}

        {hasInflation && realTotalProfit !== undefined && (
          isRealLoss ? (
            <ResultCard 
              title="زیان واقعی ناشی از تورم"
              value={formatCurrency(animatedRealTotalProfit)}
              description="کاهش خالص قدرت خرید دارایی نسبت به روز اول"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              }
              iconBgClass="bg-rose-600"
              accentBorderClass="border-rose-600"
              badge="زیان واقعی"
              valueColorClass="text-rose-400"
            />
          ) : (
            <ResultCard 
              title="سود واقعی کل (با احتساب تورم)"
              value={formatCurrency(animatedRealTotalProfit)}
              description="افزایش خالص قدرت خرید پس از کسر اثر تورم"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path>
                </svg>
              }
              iconBgClass="bg-blue-500"
              accentBorderClass="border-blue-500"
              badge="سود واقعی"
              valueColorClass="text-emerald-400"
            />
          )
        )}

        <ResultCard 
          title={
            hasInflation 
              ? (realROI < 0 ? "افت قدرت خرید (Real ROI)" : "بازده واقعی (Real ROI)")
              : "بازده کل سرمایه (ROI)"
          }
          value={`${(hasInflation ? animatedRealROI : animatedProfitPercentage).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}%`}
          description={
            hasInflation 
              ? (realROI < 0 ? "درصد کاهش قدرت خرید دارایی به دلیل پیشی گرفتن تورم" : "نرخ رشد واقعی قدرت خرید پس از کسر اثر تورم")
              : "نسبت سود خالص به هزینه سرمایه‌گذاری"
          }
          icon={
            hasInflation && realROI < 0 ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 100-4 2 2 0 000 4zM9 17a2 2 0 100-4 2 2 0 000 4zM17 17L7 7" />
              </svg>
            )
          }
          iconBgClass={hasInflation && realROI < 0 ? "bg-rose-600" : "bg-purple-500"}
          accentBorderClass={hasInflation && realROI < 0 ? "border-rose-600" : "border-purple-500"}
          badge={hasInflation ? (realROI < 0 ? "بازده منفی" : "بازده مثبت") : undefined}
          valueColorClass={hasInflation && realROI < 0 ? "text-rose-400" : "text-white"}
        />

        {totalWithdrawal > 0 && (
          <ResultCard 
            title="مجموع برداشت"
            value={formatCurrency(animatedTotalWithdrawal)}
            description={hasInflation && realTotalWithdrawal ? `ارزش واقعی با احتساب تورم: ${formatCurrency(realTotalWithdrawal)}` : "کل مبلغ برداشت شده طی دوره"}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            }
            iconBgClass="bg-yellow-500"
            accentBorderClass="border-yellow-500"
          />
        )}

        {totalDeposit > 0 && (
          <ResultCard 
            title="مجموع واریز"
            value={formatCurrency(animatedTotalDeposit)}
            description={hasInflation && realTotalDeposit ? `ارزش واقعی با احتساب تورم: ${formatCurrency(realTotalDeposit)}` : "کل مبلغ واریز شده طی دوره"}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
            iconBgClass="bg-cyan-500"
            accentBorderClass="border-cyan-500"
          />
        )}
      </div>

      {hasInflation && realFinalCapital !== undefined && (
        <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${
          isRealLoss 
            ? 'bg-rose-950/30 border-rose-800/60' 
            : 'bg-gray-900/60 border-gray-700/80'
        }`}>
          <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
            isRealLoss 
              ? 'bg-rose-500/20 text-rose-400' 
              : 'bg-amber-500/10 text-amber-400'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-200">تحلیل اثر تورم بر قدرت خرید:</p>
            <p className="text-gray-400 mt-1 leading-relaxed">
              ارزش نهایی اسمی شما برابر با <strong className="text-white">{formatCurrency(finalCapital)}</strong> است، اما به دلیل تورم سالانه {inflationRate?.toLocaleString('fa-IR')}%، ارزش نهایی به قدرت خرید امروز معادل <strong className="text-amber-300">{formatCurrency(realFinalCapital)}</strong> خواهد بود.
              {isRealLoss ? (
                <span className="text-rose-400 block mt-1.5 font-medium">
                  ⚠ نرخ تورم از سود سرمایه‌گذاری بیشتر بوده و قدرت خرید شما معادل {formatCurrency(Math.abs(effectiveRealProfit))} ({Math.abs(realROI).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪) کاهش یافته است (زیان واقعی قدرت خرید).
                </span>
              ) : (
                <span className="text-emerald-400 block mt-1.5 font-medium">
                  ✓ نرخ سود شما موفق به پوشش تورم شده و قدرت خرید واقعی شما معادل {formatCurrency(effectiveRealProfit)} ({realROI.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪) افزایش یافته است.
                </span>
              )}
            </p>
          </div>
        </div>
      )}

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