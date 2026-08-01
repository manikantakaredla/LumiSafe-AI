import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Shield, AlertCircle, Lock, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth, setCurrentRole } = useAppStore();
  
  const [email, setEmail] = useState('commissioner@gvmc.gov.in');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

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
      
      // Automatic Role-Based Intelligent Routing
      if (user.role === 'Commissioner' || user.role === 'Executive' || user.role === 'Admin' || user.role === 'Administrator') {
        navigate('/app/dashboard');
      } else if (user.role === 'Electrical Supervisor' || user.role === 'Electrical') {
        navigate('/app/street-lights');
      } else if (user.role === 'Field Engineer') {
        navigate('/app/field-engineer');
      } else if (user.role === 'Police' || user.role === 'City Operations') {
        navigate('/app/operations');
      } else {
        navigate('/app/dashboard');
      }

    } catch (err) {
      console.error('[Auth Error]', err);
      setErrorMessage(err.message || 'Unable to connect to LumiSafe Backend Server on Port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4 font-sans text-foreground">
      <div className="w-full max-w-md bg-surface border border-border shadow-lg rounded-xl overflow-hidden transition-all">
        
        <div className="bg-primary p-7 flex flex-col items-center text-center border-b border-border">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-3 border border-white/20 shadow-inner">
            <Shield className="text-primary-foreground" size={34} />
          </div>
          <h1 className="font-extrabold text-2xl text-primary-foreground tracking-tight">GVMC Officer Portal</h1>
          <p className="text-primary-foreground/80 text-xs mt-1 font-medium">LumiSafe Decision Intelligence Command</p>
        </div>

        <form onSubmit={handleLogin} className="p-7 space-y-5">
          
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/80 text-destructive p-3 rounded-lg text-xs flex items-center gap-2.5 font-bold animate-in fade-in">
              <AlertCircle size={17} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-2">Official Email ID</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@gvmc.gov.in"
                className="w-full bg-base border border-border rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono font-medium transition-colors" 
              />
              <UserCheck size={18} className="absolute right-3.5 top-3 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-2">Secure Password</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-base border border-border rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-medium" 
              />
              <Lock size={18} className="absolute right-3.5 top-3 text-muted-foreground" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm py-3 rounded-lg shadow-md hover:shadow-primary/20 transition-all mt-3 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? (
              <span>Verifying with Atlas Cloud...</span>
            ) : (
              <>
                <span>Authenticate & Enter Portal</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div className="bg-secondary/40 p-4 text-center border-t border-border/70 flex flex-col sm:flex-row justify-between items-center px-7 gap-2">
          <span className="text-[11px] text-muted-foreground font-extrabold tracking-wide">GVMC & POLICE INTERLOCK</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold font-mono">
            <CheckCircle2 size={13} /> ATLAS LIVE DB
          </span>
        </div>
      </div>
      
      <div className="mt-5 text-center">
        <Link to="/public" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
          Are you a citizen? Switch to the Public Incident Reporting Portal
        </Link>
      </div>
    </div>
  );
}
