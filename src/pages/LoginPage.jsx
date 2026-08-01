import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Shield, AlertCircle, Lock, UserCheck, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth, setCurrentRole } = useAppStore();
  
  const [selectedPreset, setSelectedPreset] = useState('commissioner@gvmc.gov.in');
  const [email, setEmail] = useState('commissioner@gvmc.gov.in');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Real seeded accounts from MongoDB Atlas DB
  const PRESET_ACCOUNTS = [
    { name: 'Dr. A. Mallikarjuna, IAS (City Commissioner)', email: 'commissioner@gvmc.gov.in', role: 'Commissioner', targetRoute: '/app/dashboard' },
    { name: 'K. Ramesh (Superintending Engineer)', email: 'electrical.se@gvmc.gov.in', role: 'Electrical Supervisor', targetRoute: '/app/street-lights' },
    { name: 'P. Suresh (Team Alpha Field Engineer)', email: 'alpha@gvmc.gov.in', role: 'Field Engineer', targetRoute: '/app/field-engineer' },
    { name: 'GVMC Command & Control Centre (CCC)', email: 'ccc.ops@gvmc.gov.in', role: 'City Operations', targetRoute: '/app/operations' },
    { name: 'Sri Shanka Bratha Bagchi, IPS (Police CP)', email: 'police.cp@gvmc.gov.in', role: 'Police', targetRoute: '/app/operations' },
    { name: 'MVP Colony Police Station (SHO)', email: 'mvpu.police@gvmc.gov.in', role: 'Police', targetRoute: '/app/operations' },
    { name: 'Public Citizen Portal (No Login Required)', email: 'citizen@gmail.com', role: 'Public', targetRoute: '/public' },
    { name: 'Custom Login (Enter manually below)', email: 'custom', role: 'Admin', targetRoute: '/app/dashboard' }
  ];

  const handlePresetChange = (val) => {
    setSelectedPreset(val);
    setErrorMessage('');
    if (val === 'custom') {
      setEmail('');
      setPassword('');
    } else if (val === 'citizen@gmail.com') {
      navigate('/public');
    } else {
      setEmail(val);
      setPassword('password123');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (selectedPreset === 'citizen@gmail.com' || email === 'citizen@gmail.com') {
      navigate('/public');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Invalid credentials.');
      }

      // Successfully authenticated against DB!
      const { user, token } = data.data;
      setAuth(user, token);
      if (user.role) setCurrentRole(user.role);
      
      // Determine correct landing view
      if (user.role === 'Commissioner' || user.role === 'Executive') navigate('/app/dashboard');
      else if (user.role === 'Electrical Supervisor' || user.role === 'Electrical') navigate('/app/street-lights');
      else if (user.role === 'Field Engineer') navigate('/app/field-engineer');
      else if (user.role === 'Police' || user.role === 'City Operations') navigate('/app/operations');
      else navigate('/app/dashboard');

    } catch (err) {
      console.error('[Auth Error]', err);
      setErrorMessage(err.message || 'Unable to connect to LumiSafe Backend Server on Port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border shadow-md rounded-md overflow-hidden">
        
        <div className="bg-primary p-6 flex flex-col items-center text-center border-b border-border">
          <Shield className="text-primary-foreground mb-3" size={48} />
          <h1 className="font-bold text-xl text-primary-foreground tracking-tight">GVMC Secure Cloud Auth</h1>
          <p className="text-primary-foreground/80 text-xs mt-1">Smart Street Lighting & Crime Intelligence Platform</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2.5 rounded text-xs flex items-center gap-2 font-semibold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Select Official Designation</label>
            <select 
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              {PRESET_ACCOUNTS.map(r => (
                <option key={r.email} value={r.email}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Official Email ID</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@gvmc.gov.in"
                className="w-full bg-base border border-border rounded pl-3 pr-9 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono" 
              />
              <UserCheck size={16} className="absolute right-3 top-2.5 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Secure Password</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-base border border-border rounded pl-3 pr-9 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
              />
              <Lock size={16} className="absolute right-3 top-2.5 text-muted-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">Default seed credentials: password123</p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2.5 rounded shadow-sm transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Verifying with Atlas Cloud...' : 'Authenticate & Enter Portal'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="bg-secondary/30 p-4 text-center border-t border-border flex justify-between items-center px-6">
          <span className="text-[10px] text-muted-foreground font-semibold">GVMC & POLICE CCC INTERLOCK</span>
          <span className="text-[10px] text-accent font-bold">LIVE DB: CONNECTED</span>
        </div>
      </div>
    </div>
  );
}
