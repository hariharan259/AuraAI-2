import React from 'react';
import { SkinTwin, SkinAnalysisResult } from '../../types';
import { ShieldCheck, AlertOctagon, HelpCircle, ArrowUpRight, Heart, Brain, RefreshCw } from 'lucide-react';

interface SkinTwinDashboardProps {
  twin: SkinTwin;
  result: SkinAnalysisResult;
}

export default function SkinTwinDashboard({ twin, result }: SkinTwinDashboardProps) {
  const meas = result.measurements;

  // Face zones with dynamic colors/scores
  const zones = [
    { name: 'Forehead', score: meas.wrinkles, metric: 'Elasticity', status: meas.wrinkles >= 75 ? 'Strength' : meas.wrinkles < 60 ? 'Problem' : 'Risk' },
    { name: 'Nose', score: meas.oiliness, metric: 'Sebum', status: meas.oiliness >= 75 ? 'Strength' : meas.oiliness < 60 ? 'Problem' : 'Risk' },
    { name: 'Left Cheek', score: meas.dryness, metric: 'Moisture', status: meas.dryness >= 75 ? 'Strength' : meas.dryness < 60 ? 'Problem' : 'Risk' },
    { name: 'Right Cheek', score: meas.pigmentation, metric: 'Melanin', status: meas.pigmentation >= 75 ? 'Strength' : meas.pigmentation < 60 ? 'Problem' : 'Risk' },
    { name: 'Under Eyes', score: meas.eyeBags, metric: 'Circulation', status: meas.eyeBags >= 75 ? 'Strength' : meas.eyeBags < 60 ? 'Problem' : 'Risk' },
    { name: 'Chin & Jaw', score: meas.acne, metric: 'Clarity', status: meas.acne >= 75 ? 'Strength' : meas.acne < 60 ? 'Problem' : 'Risk' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Strength': return 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-glow-green';
      case 'Problem': return 'border-rose-500 text-rose-400 bg-rose-500/10 shadow-glow-red';
      default: return 'border-amber-500 text-amber-400 bg-amber-500/10 shadow-glow-cyan';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 3D-styled Face Grid Visualizer (Left) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-aura-muted mb-6 flex items-center gap-2">
          <Brain size={16} className="text-aura-cyan" /> Bio-Digital Scan Grid
        </h4>
        
        {/* Visual Simulated Head Model */}
        <div className="w-64 h-72 border border-dashed border-teal-500/20 rounded-3xl relative flex flex-col justify-between items-center p-6 bg-teal-950/5 overflow-hidden">
          <div className="absolute inset-0 bg-medical-radial opacity-40 pointer-events-none" />
          
          {/* Scanning line animation */}
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-aura-primary-light to-transparent top-0 animate-[scan_3s_ease-in-out_infinite]" style={{
            animation: 'scan 4s ease-in-out infinite'
          }} />
          <style>{`
            @keyframes scan {
              0%, 100% { top: 5%; }
              50% { top: 95%; }
            }
          `}</style>
          
          {/* Forehead Zone */}
          <div className="z-10 flex flex-col items-center">
            <div className={`px-2 py-1 border text-[10px] rounded-full font-bold flex items-center gap-1 ${getStatusColor(zones[0].status)}`}>
              <span>{zones[0].name}: {zones[0].score}%</span>
            </div>
            <div className="w-[1px] h-3 bg-aura-border mt-1" />
          </div>

          {/* Eye & Nose Row */}
          <div className="z-10 w-full flex justify-between px-2">
            {/* Left Cheek */}
            <div className="flex items-center gap-1">
              <div className={`px-2 py-1 border text-[10px] rounded-full font-bold ${getStatusColor(zones[2].status)}`}>
                <span>L-Cheek: {zones[2].score}%</span>
              </div>
            </div>
            
            {/* Under Eyes (Center Top) */}
            <div className="flex flex-col items-center">
              <div className={`px-2 py-1 border text-[10px] rounded-full font-bold ${getStatusColor(zones[4].status)}`}>
                <span>Eyes: {zones[4].score}%</span>
              </div>
            </div>

            {/* Right Cheek */}
            <div className="flex items-center gap-1">
              <div className={`px-2 py-1 border text-[10px] rounded-full font-bold ${getStatusColor(zones[3].status)}`}>
                <span>R-Cheek: {zones[3].score}%</span>
              </div>
            </div>
          </div>

          {/* Nose Zone */}
          <div className="z-10 flex flex-col items-center -mt-6">
            <div className={`px-2 py-1 border text-[10px] rounded-full font-bold ${getStatusColor(zones[1].status)}`}>
              <span>Nose: {zones[1].score}%</span>
            </div>
          </div>

          {/* Chin Zone */}
          <div className="z-10 flex flex-col items-center">
            <div className="w-[1px] h-3 bg-aura-border mb-1" />
            <div className={`px-2 py-1 border text-[10px] rounded-full font-bold ${getStatusColor(zones[5].status)}`}>
              <span>Chin: {zones[5].score}%</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-aura-muted mt-4 text-center">
          Scanner nodes match cellular reflection indices.<br/>
          <span className="text-emerald-400 font-semibold">Green</span> = Optimal | <span className="text-amber-400 font-semibold">Gold</span> = At Risk | <span className="text-rose-400 font-semibold">Red</span> = Active concern
        </p>
      </div>

      {/* Skin Twin Diagnostics (Right) */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        
        {/* Overview Box */}
        <div className="p-5 rounded-2xl bg-aura-panel border border-aura-border glass-gradient mb-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-aura-muted mb-2">Digital Twin Synthesis</h4>
          <p className="text-sm text-aura-text leading-relaxed m-0">{twin.currentSummary}</p>
        </div>

        {/* Areas Ledger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/20">
            <h5 className="text-xs font-bold uppercase text-emerald-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Strengths
            </h5>
            <ul className="space-y-2 text-[11px] text-aura-text pl-0 list-none m-0">
              {twin.strengthAreas.map((area, idx) => (
                <li key={idx} className="leading-tight">
                  <strong className="text-emerald-300 block">{area.title} ({area.score}%)</strong>
                  <span className="text-aura-muted">{area.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Problems */}
          <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-500/20">
            <h5 className="text-xs font-bold uppercase text-rose-400 mb-3 flex items-center gap-1.5">
              <AlertOctagon size={14} /> Concerns
            </h5>
            <ul className="space-y-2 text-[11px] text-aura-text pl-0 list-none m-0">
              {twin.problemAreas.map((area, idx) => (
                <li key={idx} className="leading-tight">
                  <strong className="text-rose-300 block">{area.title} ({area.score}%)</strong>
                  <span className="text-aura-muted">{area.description}</span>
                </li>
              ))}
              {twin.problemAreas.length === 0 && (
                <li className="text-aura-muted italic">No active severe concerns detected.</li>
              )}
            </ul>
          </div>

          {/* Risks */}
          <div className="p-4 rounded-xl bg-amber-950/10 border border-amber-500/20">
            <h5 className="text-xs font-bold uppercase text-amber-400 mb-3 flex items-center gap-1.5">
              <HelpCircle size={14} /> Risk Vectors
            </h5>
            <ul className="space-y-2 text-[11px] text-aura-text pl-0 list-none m-0">
              {twin.riskAreas.map((area, idx) => (
                <li key={idx} className="leading-tight">
                  <strong className="text-amber-300 block">{area.title}</strong>
                  <span className="text-aura-muted">{area.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Improvement opportunities */}
        <div className="p-5 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <h4 className="text-xs font-bold uppercase tracking-wider text-aura-muted mb-3 flex items-center gap-2">
            <ArrowUpRight size={14} className="text-aura-primary-light" /> Critical Clinical Advice
          </h4>
          <ul className="space-y-2 text-xs text-aura-text pl-4 list-disc m-0">
            {twin.improvementOpportunities.map((op, idx) => (
              <li key={idx} className="leading-normal">{op}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
