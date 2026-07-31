import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function TeamPerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-slate-500">No team data available</div>;
  }

  // data: [{ teamName: 'Alpha Team', avgRepairTime: 45, avgTravelTime: 12, completedCount: 5 }]
  // Sort by completedCount desc to show most active teams first
  const sortedData = [...data].sort((a, b) => b.completedCount - a.completedCount).slice(0, 5);

  return (
    <div className="h-full w-full bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col">
      <h3 className="text-slate-200 text-sm font-semibold mb-4 uppercase tracking-wider">Top Teams by Volume</h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis dataKey="teamName" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={80} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
              itemStyle={{ color: '#e2e8f0' }}
              cursor={{ fill: '#1e293b' }}
            />
            <Bar dataKey="completedCount" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
