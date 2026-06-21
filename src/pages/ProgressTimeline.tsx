import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { Activity, Sparkles, Shield, ChevronRight, Zap, Target } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';

export default function ProgressTimeline() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [activeDay, setActiveDay] = useState<number>(90);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <Activity size={48} className="text-purple-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to load the Progress & Timeline Center.
        </p>
        <button 
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition shadow-glow-primary"
          onClick={() => navigate('/profile')}
        >
          Start Analysis
        </button>
      </div>
    );
  }

  const baseSkin = result.skinHealth.overallScore;
  const baseHair = 78;
  const baseBeauty = result.beautyScore;

  const milestones = [
    {
      day: 0,
      label: 'Today',
      phase: 'Baseline Evaluation',
      skinScore: baseSkin,
      hairScore: baseHair,
      beautyScore: baseBeauty,
      lifestyleImpact: 'Current habits (sleep, water, stress) mapped to baseline cell structures.',
      improvements: 'Diagnostic phase; mapping skin condition parameters and formulating morning/evening active compound balances.'
    },
    {
      day: 30,
      label: '30 Days',
      phase: 'Acclimation & Recovery',
      skinScore: Math.min(100, baseSkin + 4),
      hairScore: Math.min(100, baseHair + 2),
      beautyScore: Math.min(100, baseBeauty + 3),
      lifestyleImpact: 'Consistent sleep and hydration routines restore cell mitosis speeds.',
      improvements: 'BHA active compounds clear pore congestion; cellular water retention levels increase, fading dryness wrinkles.'
    },
    {
      day: 60,
      label: '60 Days',
      phase: 'Epidermal Healing',
      skinScore: Math.min(100, baseSkin + 7),
      hairScore: Math.min(100, baseHair + 4),
      beautyScore: Math.min(100, baseBeauty + 6),
      lifestyleImpact: 'Low cortisol stress levels stabilize vascular micro-vessel expansion.',
      improvements: 'Melanogenesis rate slows down; hyperpigmentation melasma spots fade; hair follicle bulbs strengthen.'
    },
    {
      day: 90,
      label: '90 Days',
      phase: 'Barrier Fortification',
      skinScore: Math.min(100, baseSkin + 10),
      hairScore: Math.min(100, baseHair + 6),
      beautyScore: Math.min(100, baseBeauty + 8),
      lifestyleImpact: 'Deep circadian alignment optimizes nocturnal stratum corneum lipid repair.',
      improvements: 'Intercellular lipids are fully reinforced with ceramides; skin elasticity expands; hair thickness increases.'
    },
    {
      day: 180,
      label: '180 Days',
      phase: 'Aesthetic Stabilisation',
      skinScore: Math.min(100, baseSkin + 13),
      hairScore: Math.min(100, baseHair + 8),
      beautyScore: Math.min(100, baseBeauty + 11),
      lifestyleImpact: 'Synergy of complete nutritional diet boosts dermal antioxidant defenses.',
      improvements: 'Telomere cellular length indicators show stable longevity; skin biological age drops by an estimated 2.5y.'
    },
    {
      day: 365,
      label: '365 Days',
      phase: 'Peak Radiance Homeostasis',
      skinScore: Math.min(100, baseSkin + 16),
      hairScore: Math.min(100, baseHair + 11),
      beautyScore: Math.min(100, baseBeauty + 14),
      lifestyleImpact: 'Perfect alignment of environment calibration with custom vanity dosing.',
      improvements: 'Skin cells show robust immunity to environmental oxidative stressors; scalp follicle density reaches peak levels.'
    }
  ];

  const currentMilestone = milestones.find(m => m.day === activeDay) || milestones[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-3">
          <Activity size={12} /> Projections & Milestones
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">Progress & Timeline Center</h1>
        <p className="text-sm text-aura-muted mt-1">Interactive future projections charting expected biological milestones across 365 days of compliance.</p>
      </header>

      {/* Stepper Timeline Navigation */}
      <div className="flex justify-between items-center gap-2 p-4 bg-black/45 border border-aura-border rounded-2xl mb-8 overflow-x-auto">
        {milestones.map(m => {
          const isActive = activeDay === m.day;
          return (
            <button
              key={m.day}
              className={`flex-1 py-3 px-4 rounded-xl text-center transition min-w-[100px] border ${
                isActive 
                  ? 'bg-purple-950/20 border-purple-500/50 text-white font-bold shadow-glow-secondary' 
                  : 'bg-aura-panel border-aura-border text-aura-muted hover:text-white'
              }`}
              onClick={() => setActiveDay(m.day)}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider mb-0.5">{m.label}</div>
              <span className="text-base font-extrabold font-mono">{m.beautyScore}</span>
            </button>
          );
        })}
      </div>

      {/* Details Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Milestones (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <div className="flex justify-between items-center border-b border-aura-border pb-4 mb-6">
            <div>
              <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">Milestone targets</span>
              <h3 className="text-base font-bold text-white mt-0.5">{currentMilestone.phase}</h3>
            </div>
            <span className="text-xs font-bold text-purple-300 font-mono">Day {currentMilestone.day}</span>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Skin progress */}
            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>Skin Health Target</span>
                <span className="font-mono text-cyan-400">{currentMilestone.skinScore}%</span>
              </div>
              <ProgressBar progress={currentMilestone.skinScore} colorClass="bg-cyan-500" />
            </div>

            {/* Hair progress */}
            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>Hair Health Target</span>
                <span className="font-mono text-yellow-400">{currentMilestone.hairScore}%</span>
              </div>
              <ProgressBar progress={currentMilestone.hairScore} colorClass="bg-yellow-500" />
            </div>

            {/* Dynamic text blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-xl bg-black/35 border border-white/5">
                <h5 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Expected Skin & Hair Upgrades</h5>
                <p className="text-xs text-white/90 leading-relaxed">{currentMilestone.improvements}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/35 border border-white/5">
                <h5 className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1">Lifestyle & Compliance Impact</h5>
                <p className="text-xs text-white/90 leading-relaxed">{currentMilestone.lifestyleImpact}</p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Longevity Summary (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
              <Target size={16} className="text-pink-400" /> Progression Index
            </h3>
            <p className="text-xs text-aura-muted leading-relaxed">
              Active cell rejuvenation requires compliance. Over a 365-day scale, a constant morning and evening routine increases your baseline skin health from <strong>{baseSkin}%</strong> to <strong>{Math.min(100, baseSkin + 16)}%</strong>.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-aura-border">
            <button 
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition"
              onClick={() => navigate('/simulator')}
            >
              Adjust Adherence Simulator
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
