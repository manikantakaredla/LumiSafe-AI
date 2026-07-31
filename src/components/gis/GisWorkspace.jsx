import React from 'react'
import { IntelligenceMap } from './IntelligenceMap'
import { LayerManager } from './LayerManager'
import { OperationsToolbar } from './OperationsToolbar'
import { TimeSlider } from './TimeSlider'
import { OperationsOverview } from './OperationsOverview'
import { MapLegend } from './MapLegend'

export function GisWorkspace() {
  return (
    <div className="relative w-full h-full bg-base overflow-hidden rounded-md border border-border shadow-sm flex flex-col">
      <IntelligenceMap />
      <LayerManager />
      <OperationsToolbar />
      <TimeSlider />
      <OperationsOverview />
      <MapLegend />
    </div>
  )
}
