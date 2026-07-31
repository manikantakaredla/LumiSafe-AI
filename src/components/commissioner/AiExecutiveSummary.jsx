import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

export function AiExecutiveSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // In a real implementation, this would be a dedicated backend endpoint that 
    // aggregates data and passes it to Gemini AI for a natural language summary.
    // For now, we mock the generated output based on the Analytics APIs we just built.
    const fetchSummary = async () => {
      // Mocking the generation delay
      await new Promise(r => setTimeout(r, 800));
      
      setSummary({
        highestRiskWard: 'Ward 4 - Madhurawada',
        expectedSafetyImprovement: '+18%',
        criticalIncidents: 3,
        manualReviewsPending: 8,
        slaExceptions: 5,
        bestPerformingTeam: 'Alpha Team',
        estimatedRiskReduction: 'High',
        generatedAt: new Date().toLocaleTimeString()
      });
    };

    fetchSummary();
  }, []);

  if (!summary) return (
    <div className="bg-surface border border-border shadow-sm rounded-md p-4 animate-pulse">
      <div className="h-4 bg-secondary rounded w-1/4 mb-4"></div>
      <div className="h-2 bg-secondary rounded w-full mb-2"></div>
      <div className="h-2 bg-secondary rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] shadow-md rounded-md overflow-hidden flex flex-col md:flex-row">
      <div className="bg-[#1e293b]/50 p-4 flex flex-col justify-center items-center md:w-48 border-b md:border-b-0 md:border-r border-[#1e293b]">
        <Bot size={32} className="text-primary mb-2" />
        <h3 className="text-sm font-semibold text-slate-200 text-center uppercase tracking-wider">AI Executive<br/>Briefing</h3>
        <p className="text-[10px] text-slate-500 font-mono mt-2">Generated: {summary.generatedAt}</p>
      </div>
      
      <div className="p-4 flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-1">Highest Risk Ward</p>
          <p className="font-medium text-destructive">{summary.highestRiskWard}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-1">Safety Impact</p>
          <p className="font-medium text-success">{summary.expectedSafetyImprovement}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-1">Critical Incidents</p>
          <p className="font-medium text-warning">{summary.criticalIncidents} Active</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-1">Manual Reviews</p>
          <p className="font-medium text-warning">{summary.manualReviewsPending} Pending</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-1">SLA Exceptions</p>
          <p className="font-medium text-destructive">{summary.slaExceptions} Breaches</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-1">Best Performing</p>
          <p className="font-medium text-info">{summary.bestPerformingTeam}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-1">AI Assessment</p>
          <p className="text-sm text-slate-300">
            Immediate dispatch to Ward 4 is required to mitigate cascading electrical failures. 
            Estimated risk reduction is <span className="text-success font-semibold">{summary.estimatedRiskReduction}</span> if resolved within 4 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
