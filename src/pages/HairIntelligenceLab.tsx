import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { Activity, ShieldAlert, Sparkles, AlertTriangle, ChevronRight } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';

export default function HairIntelligenceLab() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [selectedMetric, setSelectedMetric] = useState<string>('scalp');

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <Activity size={48} className="text-yellow-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to load the Hair Intelligence Lab.
        </p>
        <button 
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 shadow-glow-primary"
          onClick={() => navigate('/profile')}
        >
          Start Analysis
        </button>
      </div>
    );
  }

  const profile = result.profile;

  // Compute Hair Metrics dynamically based on profile parameters (sleep, water, stress)
  const stress = profile.stressLevel;
  const sleep = profile.sleepHours;
  const hydration = profile.waterIntake;

  const metrics = {
    density: {
      label: 'Follicular Density',
      score: Math.min(100, Math.max(40, Math.round(80 - stress * 1.5 - (8 - sleep) * 2))),
      state: '84 follicular shafts per cm²',
      projection: 'Day 90: +5% density expected under zinc/biotin load.',
      recovery: 'Introduce topical rosemary/caffeine extract and minoxidil complex.',
      confidence: 89
    },
    thickness: {
      label: 'Shaft Diameter (Thickness)',
      score: Math.min(100, Math.max(45, Math.round(78 - stress * 1.0 - (8 - sleep) * 1.5))),
      state: '72 micrometers (Healthy Normal)',
      projection: 'Day 60: Telogen follicles entering active growth phase.',
      recovery: 'Apply peptide complexes daily to root pathways to expand shaft diameter.',
      confidence: 86
    },
    growth: {
      label: 'Growth Rate Index',
      score: Math.min(100, Math.max(50, Math.round(82 - stress * 1.2 + (hydration - 8) * 1.0))),
      state: '0.35 mm per day (Standard)',
      projection: 'Day 30: Cellular mitosis acceleration in bulb matrix.',
      recovery: 'Maintain daily protein intake targets and vitamin D3 micro-dosing.',
      confidence: 91
    },
    fallRisk: {
      label: 'Follicle Fall Risk',
      score: Math.min(100, Math.max(10, Math.round(30 + stress * 4.5 + (8 - sleep) * 3))),
      state: 'Elevated Telogen shedding markers detected.',
      projection: 'Day 30: Shedding rate will stabilize with stress reduction.',
      recovery: 'Reduce cortisol triggers; apply DHT blocking complexes in scalp serums.',
      confidence: 93
    },
    scalp: {
      label: 'Scalp Barrier Health',
      score: Math.min(100, Math.max(45, Math.round(76 - stress * 1.5 + (hydration - 8) * 1.5))),
      state: 'Balanced sebum, trace localized redness.',
      projection: 'Day 14: Vascular redness reduces under tea tree micro-calibration.',
      recovery: 'Use pH-balanced sulfate-free shampoo; avoid high-heat blowdrying.',
      confidence: 88
    },
    dryness: {
      label: 'Dryness Index',
      score: Math.min(100, Math.max(10, Math.round(40 - (hydration - 8) * 4 + stress * 1.5))),
      state: 'Mild epidermal moisture loss in crown region.',
      projection: 'Day 7: Scalp hydration levels restore by drinking 9+ glasses of water.',
      recovery: 'Massage scalp weekly with squalane and jojoba protective oil blends.',
      confidence: 90
    },
    breakage: {
      label: 'Breakage Risk',
      score: Math.min(100, Math.max(15, Math.round(35 + stress * 2.0 - (hydration - 8) * 2.0))),
      state: 'Tensile strength indicates mild structural weakness.',
      projection: 'Day 45: Keratin bonds recover elasticity under conditioning.',
      recovery: 'Apply hydrolysed keratin conditioners and avoid fine tooth brushes.',
      confidence: 85
    },
    dandruff: {
      label: 'Sebaceous Flaking',
      score: Math.min(100, Math.max(10, Math.round(25 + stress * 3.5 - (8 - sleep) * 1.5))),
      state: 'Minimal fungal activity detected.',
      projection: 'Day 30: Fungal mantle remains balanced.',
      recovery: 'Introduce zinc pyrithione or ketoconazole shampoos once weekly.',
      confidence: 92
    },
    follicle: {
      label: 'Bulb Vitality Score',
      score: Math.min(100, Math.max(50, Math.round(79 - stress * 1.3 - (8 - sleep) * 1.5))),
      state: '92% of roots in active Anagen cycle.',
      projection: 'Day 90: Cellular replication rate accelerates by 15%.',
      recovery: 'Introduce scalp massage stimulation to promote oxygen-rich blood flow.',
      confidence: 87
    }
  };

  const selected = metrics[selectedMetric as keyof typeof metrics];

  // Helper to determine risk colors (for fallRisk or dandruff, higher score is bad; for others, higher is good)
  const isInverseMetric = selectedMetric === 'fallRisk' || selectedMetric === 'dandruff' || selectedMetric === 'dryness';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 mb-3">
          <Sparkles size={12} /> Trichological Research
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">Hair Intelligence Lab</h1>
        <p className="text-sm text-aura-muted mt-1">Advanced hair science center showing follicular density models and scalp health metrics.</p>
      </header>

      {/* Grid: Selector & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Metrics Toggles (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white mb-2">Trichology Markers</h3>
          
          {Object.entries(metrics).map(([key, data]) => {
            const isActive = selectedMetric === key;
            const isCritical = key === 'fallRisk' ? data.score >= 50 : data.score < 60;
            return (
              <button
                key={key}
                className={`p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] hover:-translate-y-0.5 flex justify-between items-center ${
                  isActive 
                    ? 'bg-yellow-950/20 border-yellow-500/50 shadow-glow-secondary' 
                    : 'bg-aura-panel border-aura-border hover:border-white/10'
                }`}
                onClick={() => setSelectedMetric(key)}
              >
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{data.label}</h4>
                  <span className="text-[9px] text-aura-muted">Confidence: {data.confidence}%</span>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className={`text-base font-extrabold font-mono ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {data.score}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Trichological Analysis (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <div className="flex justify-between items-center border-b border-aura-border pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 font-mono">Hair Science analysis</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selected.label}</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 border border-white/10 rounded-full bg-black/35 font-mono text-aura-muted">
                Confidence: {selected.confidence}%
              </span>
            </div>

            {/* Score Ring Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold text-aura-muted mb-2">
                <span>Value Percentage</span>
                <span className="text-white font-mono">{selected.score}%</span>
              </div>
              <ProgressBar 
                progress={selected.score} 
                colorClass={isInverseMetric 
                  ? (selected.score >= 50 ? 'bg-rose-500' : 'bg-emerald-500') 
                  : (selected.score >= 70 ? 'bg-emerald-500' : 'bg-rose-500')
                } 
              />
            </div>

            {/* Details cards */}
            <div className="grid grid-cols-1 gap-4">
              
              <div className="p-4 rounded-xl bg-black/35 border border-white/5">
                <h5 className="text-[10px] font-bold text-aura-muted uppercase tracking-wider mb-1">Current State</h5>
                <p className="text-xs text-white leading-relaxed">{selected.state}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/35 border border-white/5">
                <h5 className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-1">Future Projection</h5>
                <p className="text-xs text-white leading-relaxed">{selected.projection}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/35 border border-white/5">
                <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Recovery Plan</h5>
                <p className="text-xs text-white/95 leading-relaxed font-medium">{selected.recovery}</p>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-aura-border flex items-center justify-between">
              <span className="text-[10px] text-aura-muted font-mono flex items-center gap-1.5">
                <Activity size={12} className="text-yellow-400 animate-pulse" /> Diagnostics stream active
              </span>
              <button 
                className="text-[10px] font-bold text-yellow-400 flex items-center gap-0.5 hover:underline"
                onClick={() => navigate('/products')}
              >
                Find Recommended Products <ChevronRight size={12} />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
