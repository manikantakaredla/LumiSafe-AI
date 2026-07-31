import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ResolutionTrendsChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-slate-500">No trend data available</div>;
  }

  // data from backend: { _id: "2026-07-01", avgResolutionTime: 120, completedCount: 5 }
  const formattedData = data.map(d => ({
    date: d._id.substring(5), // "07-01"
    avgTime: Math.round(d.avgResolutionTime),
    count: d.completedCount
  }));

  return (
    <div className="h-full w-full bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col">
      <h3 className="text-slate-200 text-sm font-semibold mb-4 uppercase tracking-wider">Resolution Time Trends (Mins)</h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Line type="monotone" dataKey="avgTime" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
