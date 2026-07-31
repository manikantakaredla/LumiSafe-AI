import React, { useState } from 'react';
import { LightbulbOff, ShieldAlert, Map, Clock, CheckCircle2, ArrowLeft, Loader2, Search, MapPin, Camera, UploadCloud } from 'lucide-react';
import { GVMC_ZONES } from '@/lib/constants';

export function PublicPortal() {
  const [activeView, setActiveView] = useState('grid'); // 'grid', 'lightForm', 'safetyForm', 'tracking'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [trackId, setTrackId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessId(`CMP-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 1500);
  };

  const handleTrack = () => {
    if (!trackId) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveView('tracking');
    }, 800);
  };

  const reset = () => {
    setActiveView('grid');
    setSuccessId(null);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-base text-foreground font-sans flex flex-col">
      {/* Header */}
      <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 shrink-0 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/gvmc-logo.png" alt="GVMC Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="font-bold text-primary text-lg leading-tight tracking-tight">GVMC Public Grievance Portal</h1>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Govt of Andhra Pradesh</p>
          </div>
        </div>
        {activeView !== 'grid' && (
          <button onClick={reset} className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Portal
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        {activeView === 'grid' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground">Welcome to the Citizen Portal</h2>
              <p className="text-muted-foreground mt-2">
                Report street lighting failures or women's safety concerns due to poor infrastructure. Your reports help GVMC prioritize repairs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Report Street Light */}
              <div onClick={() => setActiveView('lightForm')} className="bg-surface border border-border shadow-sm rounded-xl p-6 hover:border-primary/50 hover:shadow transition-all cursor-pointer flex flex-col group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <LightbulbOff size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Report Street Light Issue</h3>
                </div>
                <p className="text-sm text-muted-foreground flex-1 mb-6">
                  Report lights not working, flickering, damaged poles, or exposed wires.
                </p>
                <button className="bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg shadow-sm w-full transition-colors group-hover:bg-primary/90">
                  File a Lighting Complaint
                </button>
              </div>

              {/* Card 2: Report Women's Safety */}
              <div onClick={() => setActiveView('safetyForm')} className="bg-surface border border-border shadow-sm rounded-xl p-6 hover:border-destructive/50 hover:shadow transition-all cursor-pointer flex flex-col group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-destructive/10 p-3 rounded-full text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors">
                    <ShieldAlert size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Report Safety Concern</h3>
                </div>
                <p className="text-sm text-muted-foreground flex-1 mb-6">
                  Report unsafe areas or poor lighting leading to harassment. This increases ward risk score.
                </p>
                <button className="bg-destructive text-destructive-foreground font-semibold py-2.5 rounded-lg shadow-sm w-full transition-colors group-hover:bg-destructive/90">
                  Report Safety Concern
                </button>
              </div>

              {/* Card 3: Track Complaint */}
              <div className="bg-surface border border-border shadow-sm rounded-xl p-6 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-secondary p-3 rounded-full text-foreground">
                    <Clock size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Track Complaint</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your Complaint ID to track its status from received to completed.
                </p>
                <div className="flex gap-2 mt-auto">
                  <input 
                    type="text" 
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    placeholder="e.g. CMP-8821" 
                    className="flex-1 bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                  <button onClick={handleTrack} disabled={isSubmitting} className="bg-secondary text-foreground border border-border font-semibold px-4 rounded-lg hover:bg-secondary/80 transition-colors shadow-sm flex items-center justify-center min-w-[80px]">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Track'}
                  </button>
                </div>
              </div>

              {/* Card 4: Community Safety Map */}
              <div className="bg-surface border border-border shadow-sm rounded-xl p-6 hover:border-info/50 hover:shadow transition-all cursor-pointer flex flex-col group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-info/10 p-3 rounded-full text-info group-hover:bg-info group-hover:text-info-foreground transition-colors">
                    <Map size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Community Safety Map</h3>
                </div>
                <p className="text-sm text-muted-foreground flex-1 mb-6">
                  View live street light failures, high-risk areas, and repairs in progress.
                </p>
                <button className="bg-info text-info-foreground font-semibold py-2.5 rounded-lg shadow-sm w-full transition-colors group-hover:bg-info/90">
                  Open Public Map
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LIGHTING FORM */}
        {activeView === 'lightForm' && (
          <div className="max-w-2xl mx-auto bg-surface border border-border shadow-sm rounded-xl p-8 animate-in slide-in-from-bottom-4 duration-300">
            {successId ? (
              <div className="text-center py-12">
                <CheckCircle2 size={64} className="text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Complaint Submitted</h2>
                <p className="text-muted-foreground mb-6">Thank you. Your complaint has been registered and routed to the Electrical Department.</p>
                <div className="bg-base border border-border rounded-lg p-4 inline-block mb-8">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Your Tracking ID</p>
                  <p className="text-2xl font-mono font-bold text-primary">{successId}</p>
                </div>
                <br/>
                <button onClick={reset} className="bg-primary text-primary-foreground font-semibold py-2 px-6 rounded shadow-sm hover:bg-primary/90 transition-colors">Return to Portal</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                  <LightbulbOff size={24} className="text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Report Street Light Issue</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Ward</label>
                    <select required className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                      <option value="">Select Ward</option>
                      {GVMC_ZONES.map(zone => (
                        <optgroup key={zone.name} label={zone.name}>
                          {zone.wards.map(ward => (
                            <option key={ward} value={ward}>{ward}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Issue Type</label>
                    <select required className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                      <option value="">Select Issue</option>
                      <option value="not_working">Light Not Working</option>
                      <option value="flickering">Flickering</option>
                      <option value="damaged">Pole Damaged</option>
                      <option value="exposed">Wire Exposed</option>
                      <option value="always_on">Always ON</option>
                      <option value="always_off">Always OFF</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Location Details</label>
                  <div className="flex gap-2">
                    <input type="text" required placeholder="e.g. Beach Road near YMCA" className="flex-1 bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    <button type="button" className="bg-secondary text-foreground px-4 py-2 rounded-lg border border-border flex items-center gap-2 hover:bg-secondary/80 transition-colors text-xs font-bold whitespace-nowrap">
                       <MapPin size={14} className="text-primary"/> Use GPS
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Photo Evidence (Optional)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-secondary/20 transition-colors cursor-pointer">
                     <Camera size={24} className="text-muted-foreground mb-2" />
                     <p className="text-xs font-semibold text-foreground">Click to upload or take a photo</p>
                     <p className="text-[10px] text-muted-foreground mt-1">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</label>
                  <textarea rows="3" placeholder="Provide any additional details..." className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit Complaint'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* SAFETY FORM */}
        {activeView === 'safetyForm' && (
          <div className="max-w-2xl mx-auto bg-surface border border-border shadow-sm rounded-xl p-8 animate-in slide-in-from-bottom-4 duration-300">
            {successId ? (
              <div className="text-center py-12">
                <CheckCircle2 size={64} className="text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Concern Reported</h2>
                <p className="text-muted-foreground mb-6">Your report has been received. This area's risk score has been updated for immediate GVMC attention.</p>
                <div className="bg-base border border-border rounded-lg p-4 inline-block mb-8">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Your Tracking ID</p>
                  <p className="text-2xl font-mono font-bold text-destructive">{successId}</p>
                </div>
                <br/>
                <button onClick={reset} className="bg-destructive text-destructive-foreground font-semibold py-2 px-6 rounded shadow-sm hover:bg-destructive/90 transition-colors">Return to Portal</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                  <ShieldAlert size={24} className="text-destructive" />
                  <h2 className="text-xl font-bold text-foreground">Report Women's Safety Concern</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Ward</label>
                    <select required className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-destructive">
                      <option value="">Select Ward</option>
                      {GVMC_ZONES.map(zone => (
                        <optgroup key={zone.name} label={zone.name}>
                          {zone.wards.map(ward => (
                            <option key={ward} value={ward}>{ward}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Category</label>
                    <select required className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-destructive">
                      <option value="">Select Category</option>
                      <option value="poor_lighting">Poor Lighting</option>
                      <option value="unsafe_street">Unsafe Street</option>
                      <option value="suspicious">Suspicious Activity</option>
                      <option value="harassment">Frequent Harassment Spot</option>
                      <option value="isolated">Isolated Area</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Location Details</label>
                  <div className="flex gap-2">
                    <input type="text" required placeholder="Exact location..." className="flex-1 bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-destructive" />
                    <button type="button" className="bg-secondary text-foreground px-4 py-2 rounded-lg border border-border flex items-center gap-2 hover:bg-secondary/80 transition-colors text-xs font-bold whitespace-nowrap">
                       <MapPin size={14} className="text-destructive"/> Use GPS
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Photo Evidence (Optional)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-secondary/20 transition-colors cursor-pointer">
                     <Camera size={24} className="text-muted-foreground mb-2" />
                     <p className="text-xs font-semibold text-foreground">Click to upload or take a photo</p>
                     <p className="text-[10px] text-muted-foreground mt-1">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</label>
                  <textarea rows="3" required placeholder="Describe the safety concern..." className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-destructive"></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-destructive text-destructive-foreground font-bold py-3 rounded-lg shadow-sm hover:bg-destructive/90 transition-colors flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit Safety Concern'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TRACKING RESULTS */}
        {activeView === 'tracking' && (
          <div className="max-w-2xl mx-auto bg-surface border border-border shadow-sm rounded-xl p-8 animate-in fade-in duration-300">
             <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <Search size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Complaint Tracking: <span className="font-mono text-primary">{trackId}</span></h2>
              </div>

              <div className="relative pl-6 border-l-2 border-border space-y-8 my-8">
                 <div className="relative">
                   <div className="absolute -left-[35px] bg-success text-success-foreground w-6 h-6 rounded-full flex items-center justify-center border-[3px] border-surface"><CheckCircle2 size={14}/></div>
                   <h4 className="font-bold text-foreground text-sm">Complaint Received</h4>
                   <p className="text-xs text-muted-foreground">Today, 09:42 AM</p>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[35px] bg-success text-success-foreground w-6 h-6 rounded-full flex items-center justify-center border-[3px] border-surface"><CheckCircle2 size={14}/></div>
                   <h4 className="font-bold text-foreground text-sm">Assigned to Field Team Alpha</h4>
                   <p className="text-xs text-muted-foreground">Today, 10:15 AM</p>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[33px] bg-primary w-5 h-5 rounded-full border-[3px] border-surface animate-pulse"></div>
                   <h4 className="font-bold text-primary text-sm">Under Repair</h4>
                   <p className="text-xs text-muted-foreground">Team Alpha is on-site at Beach Road.</p>
                 </div>
                 <div className="relative opacity-40">
                   <div className="absolute -left-[33px] bg-border w-5 h-5 rounded-full border-[3px] border-surface"></div>
                   <h4 className="font-bold text-foreground text-sm">Completed</h4>
                   <p className="text-xs text-muted-foreground">Pending verification.</p>
                 </div>
              </div>

              <button onClick={reset} className="w-full bg-secondary text-foreground font-semibold py-2.5 rounded-lg border border-border hover:bg-secondary/80 transition-colors">Track Another</button>
          </div>
        )}

      </main>

      <footer className="bg-surface border-t border-border py-6 px-8 text-center mt-auto shrink-0">
        <p className="text-xs text-muted-foreground font-semibold">
          © 2026 Greater Visakhapatnam Municipal Corporation.
        </p>
      </footer>
    </div>
  );
}
