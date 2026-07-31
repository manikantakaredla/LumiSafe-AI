import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Loader2, Cpu, Activity, Info, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const BriefingCard = ({ data }) => {
  const { overview, topTeams, summaryText } = data;
  return (
    <div className="bg-surface border border-border rounded p-3 text-sm space-y-3">
      <div className="flex items-center gap-2 text-primary font-semibold border-b border-border/50 pb-2">
        <Activity size={16} /> Operations Briefing
      </div>
      <p className="text-foreground text-xs leading-relaxed">{summaryText}</p>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-base p-2 rounded border border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Active Complaints</p>
          <p className="font-mono text-lg text-destructive">{overview?.totalComplaintsToday || 0}</p>
        </div>
        <div className="bg-base p-2 rounded border border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Resolved</p>
          <p className="font-mono text-lg text-success">{overview?.resolvedToday || 0}</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider mb-2">Top Teams</p>
        <div className="space-y-1">
          {topTeams?.map(t => (
            <div key={t._id} className="flex justify-between items-center text-xs bg-base p-1.5 rounded border border-border/50">
              <span className="text-foreground">{t.name}</span>
              <span className="font-mono text-success">{t.completed} done</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExplanationCard = ({ data }) => {
  return (
    <div className="bg-surface border border-border rounded p-3 text-sm space-y-3">
      <div className="flex items-center gap-2 text-info font-semibold border-b border-border/50 pb-2">
        <Info size={16} /> System Explanation
      </div>
      
      {data.recommendation && (
        <div className="bg-info/10 border border-info/20 p-2 rounded text-xs text-foreground">
          {data.recommendation.action || data.recommendation}
        </div>
      )}

      <div>
        <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider mb-1.5">Decision Factors</p>
        <ul className="space-y-1">
          {data.factors?.map((f, i) => (
            <li key={i} className="flex items-center gap-1.5 text-xs text-foreground">
              <span className="w-1 h-1 bg-muted-foreground rounded-full" /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between pt-2 border-t border-border/50">
        <span className="text-[10px] font-mono text-muted-foreground uppercase">Confidence: {data.confidence || 'HIGH'}</span>
        {data.predictedImpact && (
          <span className="text-[10px] font-mono text-success uppercase">{data.predictedImpact}</span>
        )}
      </div>
    </div>
  );
};

const DataGridCard = ({ data, title }) => {
  return (
    <div className="bg-surface border border-border rounded p-3 text-sm space-y-3">
      <div className="flex items-center gap-2 text-warning font-semibold border-b border-border/50 pb-2">
        <BarChart3 size={16} /> {title}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-base border-b border-border/50">
            <tr>
              {data.columns?.map(c => (
                <th key={c} className="p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows?.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-base">
                {row.map((cell, j) => (
                  <td key={j} className="p-2 font-medium text-foreground">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FallbackCard = ({ data, title }) => (
  <div className="bg-surface border border-border rounded p-3 text-sm space-y-2">
    <div className="flex items-center gap-2 text-muted-foreground font-semibold border-b border-border/50 pb-2">
      <Cpu size={16} /> {title}
    </div>
    <p className="text-xs text-foreground leading-relaxed">{data.text}</p>
  </div>
);

export function CopilotPanel() {
  const { copilotHistory, addCopilotMessage, rightDrawer } = useAppStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [copilotHistory, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const query = input.trim();
    setInput('');
    addCopilotMessage({ role: 'user', content: query });
    setIsLoading(true);

    try {
      // Build context if drawer entity is selected
      const context = {};
      if (rightDrawer.entityId && rightDrawer.entityType && !useAppStore.getState().copilotMode) {
         context.entityId = rightDrawer.entityId;
         context.entityType = rightDrawer.entityType;
      }

      const res = await fetch('http://localhost:5000/api/v1/copilot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context })
      });
      const data = await res.json();
      
      if (data.success) {
        addCopilotMessage({ role: 'copilot', response: data.data });
      } else {
        addCopilotMessage({ role: 'copilot', response: { type: 'TEXT', title: 'Error', data: { text: data.error } } });
      }
    } catch (err) {
      addCopilotMessage({ role: 'copilot', response: { type: 'TEXT', title: 'Connection Error', data: { text: 'Failed to connect to Copilot Engine.' } } });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResponse = (response) => {
    switch (response.type) {
      case 'BRIEFING_CARD': return <BriefingCard data={response.data} />;
      case 'EXPLANATION_CARD': return <ExplanationCard data={response.data} />;
      case 'DATA_GRID': return <DataGridCard data={response.data} title={response.title} />;
      default: return <FallbackCard data={response.data} title={response.title} />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* History Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {copilotHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
            <Cpu size={32} />
            <p className="text-sm font-medium">Operations Copilot Ready</p>
            <p className="text-xs text-center">Ask for briefings, explanations, or data.</p>
          </div>
        )}
        
        {copilotHistory.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.role === 'user' ? (
              <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded font-mono text-[11px] max-w-[85%]">
                 {msg.content}
              </div>
            ) : (
              <div className="w-full mt-1">
                {renderResponse(msg.response)}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
            <Loader2 size={14} className="animate-spin" /> Processing operational query...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-base border-t border-border shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <Terminal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter operational command or query..."
            className="w-full bg-surface border border-border rounded pl-9 pr-10 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded disabled:opacity-50 transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
        <div className="flex gap-2 mt-2 px-1 overflow-x-auto scrollbar-hide">
          {['Generate morning brief', 'Unsafe corridors', 'Explain Ward 4 recommendation'].map(s => (
            <button 
              key={s} 
              type="button"
              onClick={() => setInput(s)}
              className="shrink-0 text-[10px] font-mono bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border/50 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
