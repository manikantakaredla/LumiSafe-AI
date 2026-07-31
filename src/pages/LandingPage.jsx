import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Zap, Building2, AlertTriangle, CheckCircle2, ArrowRight, LightbulbOff, ShieldAlert } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-y-auto bg-white text-slate-800 font-sans flex flex-col">
      {/* Official Top Bar */}
      <div className="bg-slate-100 text-slate-600 py-2 px-8 text-xs flex justify-between items-center border-b border-slate-200">
        <span>Government of Andhra Pradesh</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">Skip to Main Content</a>
          <a href="#" className="hover:text-primary transition-colors">A-</a>
          <a href="#" className="hover:text-primary transition-colors">A</a>
          <a href="#" className="hover:text-primary transition-colors">A+</a>
        </div>
      </div>

      {/* Header */}
      <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <img src="/police-logo.jpg" alt="Police Logo" className="w-25 h-22 object-contain rounded-full shadow-sm" />
          <div className="border-l border-slate-300 pl-6 py-2">
            <h1 className="font-bold text-slate-900 text-lg uppercase tracking-wide">
              Greater Visakhapatnam Municipal Corporation
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Smart Street Lighting & Safety Decision Support System
            </p>
          </div>
        </div>
        
        <nav className="flex items-center gap-8">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Home</button>
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">About</button>
          <button onClick={() => navigate('/public')} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Public Portal</button>
          <button onClick={() => navigate('/login')} className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
            Officer Login
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative py-32 px-8 overflow-hidden">
          {/* Background Image with Dark Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-30" 
            style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/4/46/Aerial_View_of_Visakhapatnam.jpg')" }}
          >
          </div>
          <div className="absolute inset-0 bg-slate-900/80 z-0"></div>

          <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
            <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-md">
              Identify High-Risk Wards <br/> Before Incidents Increase
            </h2>
            <p className="text-xl text-slate-200 mb-12 max-w-2xl leading-relaxed font-light drop-shadow">
              Correlating street light failures with public safety incidents to enable data-driven resource allocation.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/public')} 
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-md font-medium text-base flex items-center gap-3 transition-colors shadow-sm"
              >
                <LightbulbOff size={20} /> Report Street Light
              </button>
              <button 
                onClick={() => navigate('/public')} 
                className="bg-red-600 text-white hover:bg-red-700 px-8 py-4 rounded-md font-medium text-base flex items-center gap-3 transition-colors shadow-sm"
              >
                <ShieldAlert size={20} /> Report Safety Concern
              </button>
              <button 
                onClick={() => navigate('/login')} 
                className="bg-slate-800 text-white hover:bg-slate-900 px-8 py-4 rounded-md font-medium text-base flex items-center gap-3 transition-colors shadow-sm"
              >
                <Building2 size={20} /> Department Login
              </button>
            </div>
          </div>
        </section>

        {/* Statistics Bar */}
        <section className="bg-white border-b border-slate-200 py-12 px-8">
           <div className="max-w-5xl mx-auto flex justify-between items-center">
             <div className="text-center flex-1">
               <span className="block text-4xl font-bold text-slate-800 mb-2">1,52,000</span>
               <span className="text-xs text-slate-500 uppercase tracking-widest">Street Lights</span>
             </div>
             <div className="w-px h-12 bg-slate-200"></div>
             <div className="text-center flex-1">
               <span className="block text-4xl font-bold text-slate-800 mb-2">98</span>
               <span className="text-xs text-slate-500 uppercase tracking-widest">Wards</span>
             </div>
             <div className="w-px h-12 bg-slate-200"></div>
             <div className="text-center flex-1">
               <span className="block text-4xl font-bold text-slate-800 mb-2">2,450</span>
               <span className="text-xs text-slate-500 uppercase tracking-widest">Complaints</span>
             </div>
             <div className="w-px h-12 bg-slate-200"></div>
             <div className="text-center flex-1">
               <span className="block text-4xl font-bold text-red-600 mb-2">64</span>
               <span className="text-xs text-slate-500 uppercase tracking-widest">High Risk Roads</span>
             </div>
          </div>
        </section>

        {/* Current Problem Comparison */}
        <section className="py-24 px-8 bg-slate-50 border-b border-slate-200">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center tracking-tight">System Architecture Integration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Existing System */}
              <div className="bg-white p-10 border border-slate-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-red-50 p-3 rounded-full text-red-600">
                    <AlertTriangle size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Current Process</h4>
                </div>
                
                <ul className="space-y-6 text-slate-600">
                   <li className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <span>Street Light Complaints</span>
                     <span className="font-semibold bg-slate-100 px-3 py-1 rounded">GVMC</span>
                   </li>
                   <li className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <span>Safety Incidents</span>
                     <span className="font-semibold bg-slate-100 px-3 py-1 rounded">Police</span>
                   </li>
                   <li className="text-red-600 font-medium pt-2 text-center">
                     Separate Departments → Reactive Repairs
                   </li>
                </ul>
              </div>

              {/* LumiSafe */}
              <div className="bg-white p-10 border border-slate-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-green-50 p-3 rounded-full text-green-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">LumiSafe Platform</h4>
                </div>
                
                <ul className="space-y-6 text-slate-600">
                   <li className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <span>Infrastructure + Safety Data</span>
                     <span className="font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded">Correlated</span>
                   </li>
                   <li className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <span>Repair Priorities</span>
                     <span className="font-semibold bg-green-50 text-green-700 px-3 py-1 rounded">Risk-Based</span>
                   </li>
                   <li className="text-green-600 font-medium pt-2 text-center">
                     Data-Driven Decisions → Safer Roads
                   </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-20 px-8 border-b border-slate-200 bg-white">
           <div className="max-w-5xl mx-auto text-center">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Standard Operating Procedure</h3>
             
             <div className="flex flex-wrap items-center justify-center gap-4">
               <span className="text-slate-600 font-medium">Citizen</span>
               <ArrowRight className="text-slate-300" size={16} />
               <span className="text-slate-600 font-medium">Complaint</span>
               <ArrowRight className="text-slate-300" size={16} />
               <span className="bg-slate-100 px-4 py-1.5 rounded-full text-slate-900 font-semibold text-sm">Risk Engine</span>
               <ArrowRight className="text-slate-300" size={16} />
               <span className="text-red-600 font-medium">Ward Score</span>
               <ArrowRight className="text-slate-300" size={16} />
               <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full font-semibold text-sm">Dashboard</span>
               <ArrowRight className="text-slate-300" size={16} />
               <span className="text-slate-600 font-medium">Dispatch</span>
               <ArrowRight className="text-slate-300" size={16} />
               <span className="text-green-600 font-medium">Complete</span>
             </div>
           </div>
        </section>

        {/* Features Core Modules */}
        <section className="py-24 px-8 max-w-5xl mx-auto w-full">
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center tracking-tight">Core DSS Modules</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-700"><MapPin size={24} /></div>
              <h3 className="font-semibold text-slate-900">Risk Mapping</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-700"><Zap size={24} /></div>
              <h3 className="font-semibold text-slate-900">Analysis</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-700"><AlertTriangle size={24} /></div>
              <h3 className="font-semibold text-slate-900">Smart Alerts</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-700"><CheckCircle2 size={24} /></div>
              <h3 className="font-semibold text-slate-900">Priority Repairs</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-700"><Building2 size={24} /></div>
              <h3 className="font-semibold text-slate-900">Allocation</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-700"><Shield size={24} /></div>
              <h3 className="font-semibold text-slate-900">Decision Support</h3>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-8 flex justify-between items-center text-sm">
        <div>© 2026 Greater Visakhapatnam Municipal Corporation.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Directory</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
