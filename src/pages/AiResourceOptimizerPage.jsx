import React, { useState } from 'react'
import { BrainCircuit, DollarSign, Users, Target, Loader2, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react'

export function AiResourceOptimizerPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setIsOptimized(true);
    }, 2000);
  };

  const currentBudget = 1500000;
  const usedBudget = isOptimized ? 450000 : 0;
  const remainingBudget = currentBudget - usedBudget;

  const teams = [
    { name: 'Team Alpha', focus: 'High-Risk Electrical Repairs', cost: '₹150,000', assigned: isOptimized ? 'Ward 18 (Critical)' : 'Unassigned', status: isOptimized ? 'Active' : 'Standby' },
    { name: 'Team Beta', focus: 'Routine Maintenance', cost: '₹120,000', assigned: isOptimized ? 'Ward 4 (High)' : 'Unassigned', status: isOptimized ? 'Active' : 'Standby' },
    { name: 'Team Gamma', focus: 'Preventative Replacements', cost: '₹180,000', assigned: isOptimized ? 'Ward 11 (Medium)' : 'Unassigned', status: isOptimized ? 'Active' : 'Standby' }
  ];

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6 overflow-y-auto bg-base text-foreground font-sans">
      <div className="shrink-0 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
            <BrainCircuit /> AI Resource Optimizer
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Autonomous budget and field team allocation based on real-time risk scores.</p>
        </div>
        
        {!isOptimized && (
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
          >
            {isOptimizing ? <Loader2 size={18} className="animate-spin" /> : <BrainCircuit size={18} />} 
            {isOptimizing ? 'Calculating...' : 'Run Optimization AI'}
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary/10 p-2 rounded-lg"><DollarSign size={20} className="text-primary"/></div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Monthly Budget</p>
           </div>
           <p className="text-2xl font-black text-foreground">₹{(currentBudget/100000).toFixed(1)}L</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-warning/10 p-2 rounded-lg"><TrendingUp size={20} className="text-warning"/></div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Allocated Funds</p>
           </div>
           <p className="text-2xl font-black text-foreground">₹{(usedBudget/100000).toFixed(1)}L</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-success/10 p-2 rounded-lg"><CheckCircle2 size={20} className="text-success"/></div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Remaining Budget</p>
           </div>
           <p className="text-2xl font-black text-foreground">₹{(remainingBudget/100000).toFixed(1)}L</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-info/10 p-2 rounded-lg"><Users size={20} className="text-info"/></div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Teams</p>
           </div>
           <p className="text-2xl font-black text-foreground">{isOptimized ? '3' : '0'}/12</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Col: Plan summary */}
        <div className="lg:col-span-1 bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
           <div className="p-4 border-b border-border bg-secondary/30">
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Target size={16} className="text-primary"/> Strategy Overview
              </h2>
           </div>
           <div className="p-6 flex flex-col gap-6">
              {isOptimized ? (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    <div className="bg-success/10 border border-success/20 p-4 rounded-xl text-center">
                       <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
                       <h3 className="font-bold text-success text-lg">Optimization Complete</h3>
                       <p className="text-xs text-success mt-1">Resources allocated for maximum impact.</p>
                    </div>
                    
                    <div>
                       <h4 className="text-sm font-bold text-foreground mb-3">AI Mitigation Targets</h4>
                       <ul className="space-y-3 text-sm text-muted-foreground">
                         <li className="flex gap-2 items-start"><AlertTriangle size={16} className="text-destructive shrink-0 mt-0.5" /> Prevent 68% projected crime spike in Ward 18.</li>
                         <li className="flex gap-2 items-start"><AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" /> Restore 120 dark spots near Women's Colleges.</li>
                         <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" /> Maintain 20% budget buffer for emergencies.</li>
                       </ul>
                    </div>
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                    <BrainCircuit size={48} className="text-border mb-4" />
                    <h3 className="font-bold text-foreground">Awaiting Optimization</h3>
                    <p className="text-xs text-muted-foreground mt-2">Click "Run Optimization AI" to allow the system to analyze risk matrices and budget constraints.</p>
                 </div>
              )}
           </div>
        </div>

        {/* Right Col: Teams list */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
           <div className="p-4 border-b border-border bg-secondary/30">
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users size={16} className="text-primary"/> Team Assignments
              </h2>
           </div>
           <div className="p-6">
             <div className="space-y-4">
               {teams.map((team, idx) => (
                 <div key={idx} className={`border p-4 rounded-xl transition-all duration-500 ${isOptimized ? 'bg-base border-primary/20 shadow-sm' : 'bg-secondary/10 border-border opacity-60'}`}>
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="font-bold text-foreground text-lg">{team.name}</h3>
                       <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{team.focus}</p>
                     </div>
                     <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${team.status === 'Active' ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground'}`}>
                       {team.status}
                     </span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                     <div>
                       <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Target Location</p>
                       <p className={`font-mono text-sm font-semibold ${isOptimized ? 'text-primary' : 'text-foreground'}`}>{team.assigned}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Resource Cost</p>
                       <p className="font-mono text-sm font-semibold text-foreground">{team.cost}</p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
