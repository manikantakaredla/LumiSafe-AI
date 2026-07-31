import React from 'react'
import { Sparkles } from 'lucide-react'

const RECS = [
  { id: 1, text: 'Reallocate 3 Police units to Zone B due to impending protest.', confidence: 92 },
  { id: 2, text: 'Schedule predictive maintenance for Water Pump #4 (85% failure risk).', confidence: 85 },
  { id: 3, text: 'Delay road repair on MG Road to avoid severe traffic collision with ongoing event.', confidence: 78 },
]

export function AiRecommendations() {
  return (
    <div className="bg-surface border rounded h-full flex flex-col">
      <div className="p-3 border-b flex items-center gap-2">
        <Sparkles size={16} className="text-info" />
        <h3 className="text-sm font-semibold text-foreground">Strategic AI Recommendations</h3>
      </div>
      <div className="p-0 flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-base border-b sticky top-0">
            <tr>
              <th className="px-4 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider font-normal">Recommendation</th>
              <th className="px-4 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider font-normal w-32">Confidence</th>
              <th className="px-4 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider font-normal w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {RECS.map(rec => (
              <tr key={rec.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-3 text-foreground">{rec.text}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{rec.confidence}%</span>
                    <div className="h-1.5 w-16 bg-base rounded overflow-hidden">
                      <div className="h-full bg-info rounded" style={{ width: `${rec.confidence}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button className="text-[11px] font-semibold bg-secondary hover:bg-secondary/80 text-foreground px-2 py-1 rounded transition-colors">
                    REVIEW
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
