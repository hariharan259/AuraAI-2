import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { Microscope, ShieldAlert, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';

export default function SkinHealthLab() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [selectedMetric, setSelectedMetric] = useState<string>('barrier');

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <Microscope size={48} className="text-cyan-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to load the Skin Health Lab.
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

  const skin = result.skinHealth;
  const meas = skin.measurements;

  // 9 Skin Metrics Mapping
  const metrics = {
    acne: {
      label: 'Acne & Congestion',
      score: meas.acne,
      status: meas.acne >= 75 ? 'Optimal Clarity' : meas.acne >= 60 ? 'Mild Clogging' : 'Active Congestion',
      severity: meas.acne >= 75 ? 'Low' : meas.acne >= 60 ? 'Moderate' : 'Severe',
      rootCause: 'Elevated sebum secretion reacting with trapped keratinocytes.',
      action: 'Apply lipophilic 2% salicylic acid exfoliant nightly.',
      timeline: '14-21 Days',
      confidence: skin.confidence.acne,
      zone: 'Cheeks & Chin'
    },
    pigmentation: {
      label: 'Pigmentation Index',
      score: meas.pigmentation,
      status: meas.pigmentation >= 75 ? 'Homogeneous Tone' : 'Localized Melanogenesis',
      severity: meas.pigmentation >= 75 ? 'Low' : 'Moderate',
      rootCause: 'Overactive melanocytes triggered by thermal/UV environmental factors.',
      action: 'Utilize topical tyrosinase inhibitors (alpha arbutin, niacinamide).',
      timeline: '28-45 Days',
      confidence: skin.confidence.pigmentation,
      zone: 'Cheeks & Forehead'
    },
    hydration: {
      label: 'Epidermal Hydration',
      score: skin.hydrationScore,
      status: skin.hydrationScore >= 80 ? 'Optimal Turgor' : skin.hydrationScore >= 60 ? 'Mild Dehydration' : 'Stratum Dryness',
      severity: skin.hydrationScore >= 80 ? 'Low' : 'Moderate',
      rootCause: 'Compromised intercellular lipids increasing transepidermal water loss.',
      action: 'Apply multi-weight hyaluronic acid followed by ceramide sealants.',
      timeline: '7 Days',
      confidence: skin.confidence.hydration,
      zone: 'All Zones'
    },
    barrier: {
      label: 'Skin Barrier Strength',
      score: skin.overallScore,
      status: skin.overallScore >= 80 ? 'Robust Lipids' : 'Compromised Mantle',
      severity: skin.overallScore >= 80 ? 'Low' : 'Moderate',
      rootCause: 'Depletion of natural ceramides, fatty acids, and cholesterol ratios.',
      action: 'Apply physiological lipid restoration creams daily.',
      timeline: '21 Days',
      confidence: 94,
      zone: 'All Zones'
    },
    uvDamage: {
      label: 'UV Damage Score',
      score: 100 - skin.uvDamageScore, // showing safety score
      status: skin.uvDamageScore < 30 ? 'Minimal UV Impact' : 'Active Melasma Risk',
      severity: skin.uvDamageScore < 30 ? 'Low' : 'Moderate',
      rootCause: 'Cumulative ultraviolet radiation exposure breaking down cell membranes.',
      action: 'Incorporate Vitamin C in mornings and SPF 50 daily.',
      timeline: '60 Days',
      confidence: skin.confidence.pigmentation,
      zone: 'Forehead & Nose'
    },
    pores: {
      label: 'Pore Health Score',
      score: meas.poreVisibility,
      status: meas.poreVisibility >= 75 ? 'Refined Pores' : 'Dilated Follicles',
      severity: meas.poreVisibility >= 75 ? 'Low' : 'Moderate',
      rootCause: 'Loss of follicular elastin support combined with lipid congestion.',
      action: 'Introduce 10% niacinamide serums to regulate pore lining size.',
      timeline: '30 Days',
      confidence: 91,
      zone: 'T-Zone'
    },
    oil: {
      label: 'Oil Balance Score',
      score: meas.oiliness,
      status: meas.oiliness >= 70 ? 'Optimal Sebum' : 'Hyper-seborrhea',
      severity: meas.oiliness >= 70 ? 'Low' : 'Moderate',
      rootCause: 'Genetic hyper-reactivity of androgen receptors in sebaceous glands.',
      action: 'Use clay-based zinc cleansers to absorb excess lipid structures.',
      timeline: '14 Days',
      confidence: 93,
      zone: 'T-Zone'
    },
    redness: {
      label: 'Redness & Sensitivity',
      score: meas.redness,
      status: meas.redness >= 75 ? 'Stable Capillaries' : 'Vasodilation Alert',
      severity: meas.redness >= 75 ? 'Low' : 'Moderate',
      rootCause: 'Vascular inflammatory response or thin epidermal barrier defenses.',
      action: 'Use soothing centella asiatica extracts and copper peptides.',
      timeline: '10 Days',
      confidence: skin.confidence.sensitivity,
      zone: 'Cheeks & Nose'
    },
    aging: {
      label: 'Aging Resistance',
      score: 100 - skin.agingRiskScore,
      status: skin.agingRiskScore < 30 ? 'Resilient Dermis' : 'Collagen Thinning',
      severity: skin.agingRiskScore < 30 ? 'Low' : 'Moderate',
      rootCause: 'Degradation of collagen and elastin matrices due to oxidative stress.',
      action: 'Apply night retinoids to upregulate dermal cell mitosis.',
      timeline: '90-120 Days',
      confidence: skin.confidence.wrinkles,
      zone: 'Periorbital & Forehead'
    }
  };

  const selected = metrics[selectedMetric as keyof typeof metrics];

  // Severity color helper
  const getSeverityBadgeColor = (sev: string) => {
    if (sev === 'Low') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
    if (sev === 'Moderate') return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
          <Microscope size={12} /> Clinical Lab Diagnostics
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">Skin Health Lab</h1>
        <p className="text-sm text-aura-muted mt-1">Dermatological micro-diagnostics detailing active cell markers and barrier strength.</p>
      </header>

      {/* Grid: Interactive Diagram & Metric Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Metrics Toggles (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white mb-2">Diagnostic Markers</h3>
          
          {Object.entries(metrics).map(([key, data]) => {
            const isActive = selectedMetric === key;
            return (
              <button
                key={key}
                className={`p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] hover:-translate-y-0.5 flex justify-between items-center ${
                  isActive 
                    ? 'bg-cyan-950/20 border-cyan-500/50 shadow-glow-cyan' 
                    : 'bg-aura-panel border-aura-border hover:border-white/10'
                }`}
                onClick={() => setSelectedMetric(key)}
              >
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{data.label}</h4>
                  <span className="text-[10px] text-aura-muted font-mono">{data.zone}</span>
                </div>
                <div className="text-right">
                  <span className={`text-base font-extrabold font-mono ${data.score >= 80 ? 'text-emerald-400' : data.score >= 60 ? 'text-cyan-400' : 'text-rose-400'}`}>
                    {data.score}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Laboratory Analytics (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <div className="flex justify-between items-center border-b border-aura-border pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">Telemetry details</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selected.label}</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${getSeverityBadgeColor(selected.severity)}`}>
                Severity: {selected.severity}
              </span>
            </div>

            {/* Score Ring Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold text-aura-muted mb-2">
                <span>Metric Quality Score</span>
                <span className="text-white font-mono">{selected.score}/100</span>
              </div>
              <ProgressBar progress={selected.score} colorClass={selected.score >= 80 ? 'bg-emerald-500' : selected.score >= 60 ? 'bg-cyan-500' : 'bg-rose-500'} />
            </div>

            {/* Details cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl bg-black/35 border border-white/5">
                <h5 className="text-[10px] font-bold text-aura-muted uppercase tracking-wider mb-1">Current Cellular Status</h5>
                <p className="text-xs text-white leading-relaxed">{selected.status}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/35 border border-white/5">
                <h5 className="text-[10px] font-bold text-aura-muted uppercase tracking-wider mb-1">Expected Recovery Timeline</h5>
                <p className="text-xs text-white leading-relaxed">{selected.timeline}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/35 border border-white/5 md:col-span-2">
                <h5 className="text-[10px] font-bold text-aura-muted uppercase tracking-wider mb-1">Root Cause / Trigger Factor</h5>
                <p className="text-xs text-white/90 leading-relaxed">{selected.rootCause}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/35 border border-white/5 md:col-span-2">
                <h5 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Prescribed Clinical Action</h5>
                <p className="text-xs text-white/90 leading-relaxed font-medium">{selected.action}</p>
              </div>

            </div>

            {/* Confidence indicator */}
            <div className="mt-6 pt-4 border-t border-aura-border flex items-center justify-between">
              <span className="text-[10px] text-aura-muted font-mono flex items-center gap-1.5">
                <Activity size={12} className="text-cyan-400 animate-pulse" /> Sensor Confidence: <strong>{selected.confidence}%</strong>
              </span>
              <button 
                className="text-[10px] font-bold text-cyan-400 flex items-center gap-0.5 hover:underline"
                onClick={() => navigate('/care-planner')}
              >
                Apply to Care Planner <ChevronRight size={12} />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
