import React from 'react';
import { Target, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

export function PatrolSimulator() {
  const simulation = {
    target: 'MG Road Corridor',
    unit: 'Patrol Alpha',
    expectedRiskReduction: 'High (-35% Incident Probability)',
    coverageImprovement: '+12% Sector Patrol Density',
    estimatedArrivalTime: '8 mins',
    expectedSafetyImprovement: '+18% Women Safety Index'
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded flex flex-col mt-4">
      <div className="p-3 border-b border-[#1e293b] bg-primary/10 flex items-center gap-2">
        <Target size={16} className="text-primary" />
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Patrol Simulator</h3>
      </div>
      
      <div className="p-4">
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Simulating dispatch of <span className="font-semibold text-info">{simulation.unit}</span> to <span className="font-semibold text-warning">{simulation.target}</span>.
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-success/10 rounded mt-0.5 border border-success/20">
              <TrendingDown size={14} className="text-success" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Risk Reduction</p>
              <p className="text-sm font-semibold text-slate-200">{simulation.expectedRiskReduction}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-info/10 rounded mt-0.5 border border-info/20">
              <Target size={14} className="text-info" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Coverage Improvement</p>
              <p className="text-sm font-semibold text-slate-200">{simulation.coverageImprovement}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-warning/10 rounded mt-0.5 border border-warning/20">
              <Clock size={14} className="text-warning" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Estimated Arrival</p>
              <p className="text-sm font-semibold text-slate-200">{simulation.estimatedArrivalTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-primary/10 rounded mt-0.5 border border-primary/20">
              <ShieldCheck size={14} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Safety Improvement</p>
              <p className="text-sm font-semibold text-slate-200">{simulation.expectedSafetyImprovement}</p>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded text-xs font-semibold transition-colors">
          EXECUTE DISPATCH
        </button>
      </div>
    </div>
  );
}
