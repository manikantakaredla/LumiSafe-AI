import React, { useState } from 'react'
import { LandingScreen } from './LandingScreen'
import { ReportingWizard } from './ReportingWizard'
import { ReportTracker } from './ReportTracker'
import { CitizenMap } from './CitizenMap'
import { ShieldCheck } from 'lucide-react'

export function PublicPortal() {
  // 'landing', 'reporting', 'tracking', 'map'
  const [currentView, setCurrentView] = useState('landing')
  const [activeReportId, setActiveReportId] = useState(null)

  const handleStartReport = () => setCurrentView('reporting')
  const handleTrackReport = (id) => {
    setActiveReportId(id)
    setCurrentView('tracking')
  }
  const handleViewMap = () => setCurrentView('map')
  const handleGoHome = () => setCurrentView('landing')

  return (
    <div className="h-full bg-background flex flex-col font-sans">
      <header className="p-4 flex items-center justify-center border-b border-border/30 bg-surface/50 shadow-sm z-10">
        <div 
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" 
          onClick={handleGoHome}
        >
          <ShieldCheck className="text-primary" size={24} />
          <h1 className="text-lg font-bold text-foreground tracking-tight">LumiSafe Citizen</h1>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto relative bg-base">
        {currentView === 'landing' && (
          <LandingScreen 
            onStartReport={handleStartReport} 
            onTrack={handleTrackReport} 
            onMap={handleViewMap} 
          />
        )}
        {currentView === 'reporting' && (
          <ReportingWizard 
            onCancel={handleGoHome} 
            onSuccess={handleTrackReport} 
          />
        )}
        {currentView === 'tracking' && (
          <ReportTracker 
            reportId={activeReportId} 
            onBack={handleGoHome} 
          />
        )}
        {currentView === 'map' && (
          <CitizenMap 
            onBack={handleGoHome} 
          />
        )}
      </main>
    </div>
  )
}
