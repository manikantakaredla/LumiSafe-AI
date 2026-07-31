import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  'Within SLA': '#10b981', // Emerald
  'Exceeded SLA': '#ef4444', // Red
};

export function SlaComplianceChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-slate-500">No SLA data available</div>;
  }

  // data: [{ _id: 'Within SLA', count: 35 }, { _id: 'Exceeded SLA', count: 5 }]
  const formattedData = data.map(d => ({
    name: d._id,
    value: d.count
  }));

  return (
    <div className="h-full w-full bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col">
      <h3 className="text-slate-200 text-sm font-semibold mb-4 uppercase tracking-wider">SLA Compliance</h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#64748b'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
