import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';

export function CityHealthScore() {
  const [score, setScore] = useState(84.2);

  useEffect(() => {
    // Simulate continuous updates based on analytics
    const interval = setInterval(() => {
      setScore(prev => {
        const variance = (Math.random() * 0.4) - 0.2; // +/- 0.2
        return parseFloat((prev + variance).toFixed(1));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-[#1e293b]/50 pb-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck size={14} className="text-success" /> City Health Score
        </h3>
        <span className="text-2xl font-mono font-bold text-success flex items-baseline gap-1">
          {score}
          <span className="text-xs text-slate-500 font-sans">/ 100</span>
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-500">Safety Imprv</span>
          <span className="text-success font-semibold flex items-center gap-1"><TrendingUp size={10} /> +2.4%</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-500">Open Risks</span>
          <span className="text-destructive font-semibold flex items-center gap-1"><AlertCircle size={10} /> 12</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-500">SLA Compl.</span>
          <span className="text-info font-semibold">94.5%</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-500">AI Predict</span>
          <span className="text-primary font-semibold">Stable</span>
        </div>
      </div>
    </div>
  );
}
