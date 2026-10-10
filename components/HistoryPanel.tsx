import React from 'react';
import type { SavedCalculation } from '../types';

interface HistoryPanelProps {
  history: SavedCalculation[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const formatCurrency = (value: number) => {
  const isNegative = value < -0.5;
  const absVal = Math.round(Math.abs(value));
  const numStr = new Intl.NumberFormat('fa-IR').format(absVal);
  return isNegative ? `-${numStr}` : numStr;
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onDelete, onClearAll }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-700 pt-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">تاریخچه محاسبات</h3>
        <button
          onClick={onClearAll}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          پاک کردن همه
        </button>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {history.map((item) => {
          const isRealLoss = item.result.hasInflation && (item.result.realTotalProfit ?? 0) < 0;

          return (
            <div key={item.id} className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between gap-2">
              <div className="flex-grow">
                <p className="text-sm font-semibold text-gray-200">
                  نتیجه نهایی: {formatCurrency(item.result.finalCapital)} تومان
                </p>
                {item.result.hasInflation && item.result.realFinalCapital !== undefined && (
                  <p className="text-xs text-amber-300 font-normal">
                    قدرت خرید واقعی: {formatCurrency(item.result.realFinalCapital)} تومان
                  </p>
                )}
                {item.result.hasInflation && item.result.realTotalProfit !== undefined && (
                  <p className={`text-xs font-normal ${isRealLoss ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isRealLoss ? 'زیان واقعی ناشی از تورم: ' : 'سود واقعی: '}
                    {formatCurrency(item.result.realTotalProfit)} تومان
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleString('fa-IR', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onLoad(item.id)}
                  className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  aria-label="بارگذاری محاسبه"
                  title="بارگذاری محاسبه"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.696a8.25 8.25 0 00-11.664 0l-3.181 3.183" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                  aria-label="حذف محاسبه"
                  title="حذف محاسبه"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPanel;
