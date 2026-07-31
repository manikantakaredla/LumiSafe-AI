import React, { useState } from 'react'
import { MapPin, Camera, CheckCircle2, ChevronLeft, Upload, Loader2, Navigation, Search } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const CATEGORIES = [
  'Broken Street Light',
  'Completely Dark Area',
  'Light Flickering',
  'Pole Damaged',
  'Other'
]

export function ReportingWizard({ onCancel, onSuccess }) {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitReport, publicReports } = useAppStore()

  const handleNext = () => setStep(s => Math.min(3, s + 1))
  const handleBack = () => step === 1 ? onCancel() : setStep(s => s - 1)
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const res = await fetch('http://localhost:5000/api/complaints/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description: 'Citizen report via app',
          lat: 17.72 + (Math.random() - 0.5) * 0.05,
          lng: 83.31 + (Math.random() - 0.5) * 0.05
        })
      })
      const data = await res.json()
      setIsSubmitting(false)
      onSuccess(data.data.complaintId)
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      // fallback
      onSuccess('REP-ERROR')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <button 
        onClick={handleBack}
        className="flex items-center gap-1 text-muted-foreground mb-6 hover:text-foreground transition-colors w-fit"
      >
        <ChevronLeft size={20} />
        <span className="font-medium text-sm">Back</span>
      </button>

      <div className="flex items-center gap-2 mb-8">
        <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-border'}`} />
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Where is the problem?</h2>
              <p className="text-muted-foreground text-sm">Help us locate the issue precisely.</p>
            </div>
            
            <div className="space-y-3">
              <button onClick={handleNext} className="w-full bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 hover:bg-secondary transition-colors text-left group">
                <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                  <Navigation size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Use Current GPS</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Fastest option</p>
                </div>
              </button>
              
              <button onClick={handleNext} className="w-full bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 hover:bg-secondary transition-colors text-left group">
                <div className="p-3 bg-info/10 text-info rounded-full group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Select on Map</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Drop a pin exactly where it is</p>
                </div>
              </button>

              <button onClick={handleNext} className="w-full bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 hover:bg-secondary transition-colors text-left group">
                <div className="p-3 bg-foreground/10 text-foreground rounded-full group-hover:scale-110 transition-transform">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Search Address</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Type in a landmark or street</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">What do you see?</h2>
              <p className="text-muted-foreground text-sm">Select an issue and optionally attach a photo.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    category === cat 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'bg-surface border border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-surface/50 hover:bg-surface cursor-pointer transition-colors mt-6">
              <div className="p-4 bg-secondary rounded-full text-muted-foreground">
                <Camera size={32} />
              </div>
              <div>
                <p className="font-medium text-foreground">Tap to upload photo</p>
                <p className="text-xs text-muted-foreground mt-1">Helps AI prioritize the issue</p>
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!category}
              className={`w-full py-4 rounded-xl font-bold text-lg mt-8 transition-all ${
                category ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in text-center flex flex-col items-center justify-center h-full pb-20">
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={48} className="text-success" />
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight mb-2">Ready to Submit</h2>
            <p className="text-muted-foreground text-sm max-w-[250px]">
              Your report will be immediately sent to the city's AI operational network.
            </p>

            <div className="w-full bg-surface border border-border p-4 rounded-xl text-left mt-4 mb-8">
              <div className="flex justify-between border-b border-border/50 pb-2 mb-2">
                <span className="text-muted-foreground text-sm">Issue</span>
                <span className="font-medium">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Location</span>
                <span className="font-medium">Current GPS</span>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold text-lg bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 size={24} className="animate-spin" /> Analyzing...</>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
