import React from 'react';
import type { CalculationInput } from '../types';

interface InputGroupProps {
  label: string;
  name: keyof CalculationInput;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit: string;
  placeholder?: string;
  tooltipText: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange, unit, placeholder, tooltipText }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <label htmlFor={name as string} className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="tooltip">
        <svg className="w-4 h-4 text-gray-500 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <span className="tooltiptext">{tooltipText}</span>
      </div>
    </div>
    <div className="relative">
      <input
        type="number"
        id={name as string}
        name={name as string}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 pr-20 text-lg transition duration-300 ease-in-out"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-gray-400 sm:text-sm">{unit}</span>
      </div>
    </div>
  </div>
);


interface CalculatorFormProps {
  inputs: CalculationInput;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTransactionTypeChange: (type: 'withdrawal' | 'deposit') => void;
  onCalculate: () => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ inputs, onInputChange, onTransactionTypeChange, onCalculate }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };
  
  const activeClass = "bg-blue-600 text-white";
  const inactiveClass = "bg-transparent text-gray-300 hover:bg-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white mb-6">ورودی‌های محاسبه</h2>
      <InputGroup 
        label="سرمایه اولیه"
        name="initialInvestment"
        value={inputs.initialInvestment}
        onChange={onInputChange}
        unit="تومان"
        tooltipText="مبلغی که در ابتدا برای سرمایه‌گذاری وارد می‌کنید."
      />
      <InputGroup 
        label="درصد سود ماهانه"
        name="profitRate"
        value={inputs.profitRate}
        onChange={onInputChange}
        unit="%"
        tooltipText="درصد سودی که به صورت ماهانه به سرمایه شما اضافه می‌شود."
      />
      <InputGroup 
        label="مدت سرمایه‌گذاری"
        name="durationInMonths"
        value={inputs.durationInMonths}
        onChange={onInputChange}
        unit="ماه"
        tooltipText="تعداد کل ماه‌هایی که قصد دارید سرمایه‌گذاری خود را ادامه دهید."
      />
      
      <div className="border-t border-gray-700 pt-6">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-700 p-1 mb-3">
            <button type="button" onClick={() => onTransactionTypeChange('deposit')} className={`w-full font-bold py-2 px-4 rounded-md text-sm transition-colors duration-300 ${inputs.transactionType === 'deposit' ? activeClass : inactiveClass}`}>
              واریز ماهانه
            </button>
            <button type="button" onClick={() => onTransactionTypeChange('withdrawal')} className={`w-full font-bold py-2 px-4 rounded-md text-sm transition-colors duration-300 ${inputs.transactionType === 'withdrawal' ? activeClass : inactiveClass}`}>
              برداشت ماهانه
            </button>
        </div>
        <div className="space-y-4">
          <InputGroup 
            label={inputs.transactionType === 'withdrawal' ? 'مبلغ برداشت ماهانه (اولین ماه)' : 'مبلغ واریز ماهانه (اولین ماه)'}
            name="monthlyTransactionAmount"
            value={inputs.monthlyTransactionAmount}
            onChange={onInputChange}
            unit="تومان"
            tooltipText="مبلغ ثابتی که در ابتدای هر ماه قصد واریز یا برداشت آن را دارید."
          />
          <InputGroup 
            label="میزان تغییرات ماهانه (اختیاری)"
            name="monthlyTransactionChange"
            value={inputs.monthlyTransactionChange}
            onChange={onInputChange}
            unit="تومان"
            placeholder="مثال: 100000- برای کاهش"
            tooltipText="مبلغی که به صورت ماهانه به مبلغ واریز/برداشت شما اضافه یا از آن کم می‌شود. برای کاهش، از عدد منفی استفاده کنید (مثال: 100000-)."
          />
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-800 flex items-center justify-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-6m-3 3h.01M9 17h.01M9 14h.01M12 17h.01M15 17h.01M15 14h.01M15 11h.01M12 14h.01M9 11h.01M12 11h.01M12 8h.01M15 8h.01M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"></path></svg>
        محاسبه کن
      </button>
    </form>
  );
};

export default CalculatorForm;