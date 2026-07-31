import React, { useState } from 'react'
import { AlertTriangle, Search, Map as MapIcon, Phone, Shield } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function LandingScreen({ onStartReport, onTrack, onMap }) {
  const [trackId, setTrackId] = useState('')
  const { publicReports } = useAppStore()

  const handleTrack = (e) => {
    e.preventDefault()
    if (trackId.trim()) onTrack(trackId)
  }

  // Show recent reports if guest has submitted any in this session
  const recentReports = publicReports.slice(0, 2)

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
      
      <div className="text-center space-y-2 mt-4">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome to LumiSafe</h2>
        <p className="text-muted-foreground text-sm">Your smart city safety companion.</p>
      </div>

      <button 
        onClick={onStartReport}
        className="w-full bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 border border-primary/20"
      >
        <div className="w-16 h-16 bg-background/20 rounded-full flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold tracking-tight">Report Unsafe Street</h3>
          <p className="text-sm opacity-90 mt-1">Help us fix broken lights and dark spots instantly.</p>
        </div>
      </button>

      <form onSubmit={handleTrack} className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Search size={18} className="text-primary"/> Track My Report
        </h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter Report ID (e.g. REP-1234)" 
            value={trackId}
            onChange={e => setTrackId(e.target.value)}
            className="flex-1 bg-base border-border border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground/50 transition-colors"
          />
          <button type="submit" className="bg-secondary text-foreground px-5 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
            Track
          </button>
        </div>
        
        {recentReports.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Recent Reports</p>
            <div className="space-y-2">
              {recentReports.map(rep => (
                <button 
                  key={rep.id} 
                  onClick={() => onTrack(rep.id)}
                  className="w-full flex items-center justify-between text-sm bg-base border p-2 rounded hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-mono">{rep.id}</span>
                  <span className="text-success text-[10px] uppercase font-bold tracking-wider">{rep.status}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={onMap} className="bg-surface border border-border p-4 rounded-2xl flex flex-col items-center gap-3 hover:bg-secondary/50 hover:-translate-y-0.5 transition-all shadow-sm">
          <div className="p-3 bg-info/10 text-info rounded-full">
            <MapIcon size={24} />
          </div>
          <span className="text-sm font-medium text-foreground">Nearby Status</span>
        </button>
        <button className="bg-surface border border-border p-4 rounded-2xl flex flex-col items-center gap-3 hover:bg-secondary/50 transition-all opacity-60 cursor-not-allowed shadow-sm">
          <div className="p-3 bg-destructive/10 text-destructive rounded-full">
            <Phone size={24} />
          </div>
          <span className="text-sm font-medium text-foreground">Emergency</span>
        </button>
      </div>

    </div>
  )
}
