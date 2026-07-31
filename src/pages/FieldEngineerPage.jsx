import React, { useState } from 'react'
import { HardHat, Camera, UploadCloud, CheckCircle2, AlertTriangle, Loader2, MapPin, Clock } from 'lucide-react'

export function FieldEngineerPage() {
  const [activeTask, setActiveTask] = useState(null);
  const [beforePhoto, setBeforePhoto] = useState(false);
  const [afterPhoto, setAfterPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const tasks = [
    { id: 'TASK-102', complaintId: 'CMP-8821', type: 'Pole Damaged', ward: 'Ward 18', loc: 'Beach Road near YMCA', priority: 'Critical', status: completed ? 'Pending Verification' : 'Assigned', time: 'Assigned 1h ago' }
  ];

  const handleComplete = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCompleted(true);
      setActiveTask(null);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6 overflow-y-auto bg-base text-foreground font-sans max-w-4xl mx-auto">
      <div className="shrink-0 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
            <HardHat /> Field Engineer Mobile View
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Team Alpha - active repair assignments and verification uploads.</p>
        </div>
      </div>

      {!activeTask && (
        <div className="flex-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">My Assigned Tasks</h2>
          <div className="grid grid-cols-1 gap-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-surface border border-border shadow-sm rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-primary/50">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-bold text-foreground">{task.id}</span>
                    <span className="text-[10px] bg-secondary text-foreground px-2 py-0.5 rounded font-bold">{task.complaintId}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${task.priority === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{task.priority} Risk</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{task.type}</h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1"><MapPin size={12}/> {task.loc} ({task.ward})</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {task.time}</span>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto">
                  {task.status === 'Pending Verification' ? (
                     <div className="bg-success/10 border border-success/30 px-4 py-2 rounded-lg text-success text-center">
                        <CheckCircle2 size={16} className="inline-block mr-1 mb-0.5"/> 
                        <span className="font-bold text-sm">Pending Verification</span>
                     </div>
                  ) : (
                    <button 
                      onClick={() => setActiveTask(task.id)}
                      className="w-full sm:w-auto bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      Start Repair Work
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTask && (
        <div className="bg-surface border border-border shadow-sm rounded-xl p-6 animate-in slide-in-from-bottom-4 duration-300">
           <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
             <div>
                <h2 className="text-xl font-bold text-foreground">Task: {activeTask}</h2>
                <p className="text-sm text-muted-foreground mt-1">Beach Road near YMCA</p>
             </div>
             <button onClick={() => setActiveTask(null)} className="text-sm font-semibold text-muted-foreground hover:text-foreground">Cancel</button>
           </div>

           <form onSubmit={handleComplete} className="space-y-6">
              
              <div className="bg-secondary/30 border border-border rounded-lg p-4">
                 <h3 className="text-sm font-bold text-foreground mb-4">Required Evidence Uploads</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Before Photo */}
                    <div 
                      onClick={() => setBeforePhoto(true)}
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${beforePhoto ? 'border-success bg-success/5' : 'border-border hover:bg-secondary/20'}`}
                    >
                       {beforePhoto ? (
                         <>
                           <CheckCircle2 size={32} className="text-success mb-2" />
                           <p className="text-sm font-bold text-success">Before Photo Uploaded</p>
                         </>
                       ) : (
                         <>
                           <Camera size={32} className="text-muted-foreground mb-2" />
                           <p className="text-sm font-bold text-foreground">Upload Before Photo</p>
                           <p className="text-xs text-muted-foreground mt-1">Show the damaged state</p>
                         </>
                       )}
                    </div>

                    {/* After Photo */}
                    <div 
                      onClick={() => setAfterPhoto(true)}
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${afterPhoto ? 'border-success bg-success/5' : 'border-border hover:bg-secondary/20'}`}
                    >
                       {afterPhoto ? (
                         <>
                           <CheckCircle2 size={32} className="text-success mb-2" />
                           <p className="text-sm font-bold text-success">After Photo Uploaded</p>
                         </>
                       ) : (
                         <>
                           <Camera size={32} className="text-muted-foreground mb-2" />
                           <p className="text-sm font-bold text-foreground">Upload After Photo</p>
                           <p className="text-xs text-muted-foreground mt-1">Show the repaired state</p>
                         </>
                       )}
                    </div>
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Completion Notes</label>
                <textarea required rows="3" placeholder="Replaced pole and verified voltage. All systems nominal." className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"></textarea>
              </div>

              <div className="bg-info/10 border border-info/20 rounded-lg p-4 flex gap-3">
                 <MapPin className="text-info shrink-0" size={20}/>
                 <p className="text-xs text-info leading-relaxed">
                   <strong>GPS Verified:</strong> Submitting this form will securely stamp your current location (17.7250° N, 83.3150° E) and time to validate the repair.
                 </p>
              </div>

              <button 
                type="submit" 
                disabled={!beforePhoto || !afterPhoto || isSubmitting} 
                className="w-full bg-success text-success-foreground font-bold py-3 rounded-lg shadow-sm hover:bg-success/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit & Request Supervisor Verification'}
              </button>
           </form>
        </div>
      )}

    </div>
  )
}
