import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  'APPROVED': '#10b981', // Emerald
  'MANUAL_REVIEW': '#f59e0b', // Amber
  'REJECTED': '#ef4444', // Red
};

export function VerificationStatsChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-slate-500">No verification data</div>;
  }

  // data: [{ _id: 'APPROVED', count: 35, avgConfidence: 89 }]
  const formattedData = data.map(d => ({
    name: d._id,
    value: d.count,
    avgConfidence: Math.round(d.avgConfidence || 0)
  }));

  return (
    <div className="h-full w-full bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col">
      <h3 className="text-slate-200 text-sm font-semibold mb-4 uppercase tracking-wider">AI Verification Rates</h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={70}
              paddingAngle={1}
              dataKey="value"
              stroke="#0f172a"
              strokeWidth={2}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#64748b'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
              itemStyle={{ color: '#e2e8f0' }}
              formatter={(value, name, props) => [`${value} (Avg Conf: ${props.payload.avgConfidence}%)`, name]}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
