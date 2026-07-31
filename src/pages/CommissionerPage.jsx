import React, { useState, useEffect } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { OperationsBrief } from '@/components/commissioner/OperationsBrief'
import { AiExecutiveSummary } from '@/components/commissioner/AiExecutiveSummary'
import { CompactKPIs } from '@/components/commissioner/CompactKPIs'

import { ResolutionTrendsChart } from '@/components/analytics/ResolutionTrendsChart'
import { SlaComplianceChart } from '@/components/analytics/SlaComplianceChart'
import { VerificationStatsChart } from '@/components/analytics/VerificationStatsChart'
import { TeamPerformanceChart } from '@/components/analytics/TeamPerformanceChart'

export function CommissionerPage() {
  const [trendsData, setTrendsData] = useState([]);
  const [slaData, setSlaData] = useState([]);
  const [verificationData, setVerificationData] = useState([]);
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trendsRes, slaRes, verRes, teamRes] = await Promise.all([
          fetch('/api/v1/analytics/trends').then(res => res.json()),
          fetch('/api/v1/analytics/sla').then(res => res.json()),
          fetch('/api/v1/analytics/verification').then(res => res.json()),
          fetch('/api/v1/analytics/teams').then(res => res.json())
        ]);
        
        if (trendsRes.success) setTrendsData(trendsRes.data.resolutionTrends);
        if (slaRes.success) setSlaData(slaRes.data);
        if (verRes.success) setVerificationData(verRes.data);
        if (teamRes.success) setTeamData(teamRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
    };

    fetchAnalytics();
  }, []);
  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-4 overflow-y-auto">
      <div className="shrink-0 flex items-center justify-between mb-2">
        <Breadcrumbs />
      </div>

      <section className="shrink-0 animate-in fade-in slide-in-from-bottom-1 duration-500">
        <AiExecutiveSummary />
      </section>

      {/* Section 1: Operations Brief (Hero - 100% Width) */}
      <section className="shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <OperationsBrief />
      </section>

      {/* Section 2: Compact KPIs (Horizontal Row) */}
      <section className="shrink-0 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-backwards">
        <CompactKPIs />
      </section>

      {/* Section 3: Analytics Grid (Dense, Palantir-like) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-backwards flex-1 min-h-[500px]">
        {/* Left Column */}
        <div className="flex flex-col gap-4 h-full">
          <div className="h-1/2">
            <ResolutionTrendsChart data={trendsData} />
          </div>
          <div className="h-1/2 flex gap-4">
            <div className="w-1/2">
              <SlaComplianceChart data={slaData} />
            </div>
            <div className="w-1/2">
              <VerificationStatsChart data={verificationData} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 h-full">
          <div className="h-1/2">
            <TeamPerformanceChart data={teamData} />
          </div>
          <div className="h-1/2">
             <div className="flex h-full items-center justify-center bg-surface border border-border text-muted-foreground rounded-lg">
                Ward Performance Heatmap Placeholder
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
