
import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { MonthlyData } from '../types';

interface DataChartProps {
  data: MonthlyData[];
}

const currencyFormatter = (value: number) => {
    if (Math.abs(value) >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(value) >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `${(value / 1_000).toFixed(0)}K`;
    }
    return value.toString();
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fa-IR').format(Math.round(value));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600 p-4 rounded-lg shadow-lg text-sm">
        <p className="label font-bold text-white mb-2">{`ماه ${label}`}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="py-1">
            {`${p.name}: ${formatCurrency(p.value)} تومان`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const DataChart: React.FC<DataChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-2xl font-bold text-center mb-6">روند رشد سرمایه</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 30,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="month" stroke="#A0AEC0" tick={{ fill: '#A0AEC0' }} unit=" ماه" />
            <YAxis
              stroke="#A0AEC0"
              tick={{ fill: '#A0AEC0' }}
              tickFormatter={currencyFormatter}
              label={{ value: 'مبلغ (تومان)', angle: -90, position: 'insideLeft', fill: '#A0AEC0', dx: -25 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#E2E8F0', paddingTop: '20px' }} />
            <Bar dataKey="profit" name="سود" fill="#48BB78" />
            <Bar dataKey="withdrawal" name="برداشت" fill="#F6E05E" />
            <Bar dataKey="deposit" name="واریز" fill="#4FD1C5" />
            <Line type="monotone" dataKey="endCapital" name="سرمایه پایانی" stroke="#4299E1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataChart;
