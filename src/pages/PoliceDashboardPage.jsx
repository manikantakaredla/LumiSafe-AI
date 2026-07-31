import React from 'react';
import { AiUnsafeCorridors } from '@/components/police/AiUnsafeCorridors';
import { PatrolSimulator } from '@/components/police/PatrolSimulator';
import { JointOperationsPanel } from '@/components/police/JointOperationsPanel';
import { ExplainableRecommendations } from '@/components/police/ExplainableRecommendations';
import { PoliceOperationsMap } from '@/components/police/PoliceOperationsMap';

export function PoliceDashboardPage() {
  return (
    <div className="h-full w-full bg-[#020817] text-slate-200 flex flex-col overflow-hidden font-sans">
      
      {/* 3-Column Tactical Layout */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Panel: Corridors & Simulation (25%) */}
        <div className="w-1/4 flex flex-col h-full overflow-y-auto pr-1">
          <AiUnsafeCorridors />
          <PatrolSimulator />
        </div>

        {/* Center Panel: Map (50%) */}
        <div className="w-2/4 flex flex-col h-full relative">
          <PoliceOperationsMap />
        </div>

        {/* Right Panel: Joint Ops & Context (25%) */}
        <div className="w-1/4 flex flex-col h-full overflow-y-auto pl-1">
          <JointOperationsPanel />
          <ExplainableRecommendations />
        </div>

      </div>
    </div>
  );
}
