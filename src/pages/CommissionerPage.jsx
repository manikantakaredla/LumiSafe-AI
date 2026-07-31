import React from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { OperationsBrief } from '@/components/commissioner/OperationsBrief'
import { CompactKPIs } from '@/components/commissioner/CompactKPIs'
import { GisWorkspace } from '@/components/gis/GisWorkspace'
import { OperationsTimeline } from '@/components/commissioner/OperationsTimeline'
import { AiRecommendations } from '@/components/commissioner/AiRecommendations'
import { SystemHealth } from '@/components/commissioner/SystemHealth'

export function CommissionerPage() {
  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-4 overflow-y-auto">
      <div className="shrink-0 flex items-center justify-between mb-2">
        <Breadcrumbs />
      </div>

      {/* Section 1: Operations Brief (Hero - 100% Width) */}
      <section className="shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <OperationsBrief />
      </section>

      {/* Section 2: Compact KPIs (Horizontal Row) */}
      <section className="shrink-0 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-backwards">
        <CompactKPIs />
      </section>

      {/* Section 3: GIS (70%) & Timeline (30%) */}
      <section className="flex flex-col lg:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-backwards h-[500px]">
        <div className="lg:w-[70%] h-full">
          <GisWorkspace />
        </div>
        <div className="lg:w-[30%] h-full">
          <OperationsTimeline />
        </div>
      </section>

      {/* Section 4: AI Recommendations (70%) & System Health (30%) */}
      <section className="flex flex-col lg:flex-row gap-4 pb-4 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200 fill-mode-backwards">
        <div className="lg:w-[70%] min-h-[250px]">
          <AiRecommendations />
        </div>
        <div className="lg:w-[30%] min-h-[250px]">
          <SystemHealth />
        </div>
      </section>
    </div>
  )
}
