import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { ShieldAlert, Sun, Droplets, AlertTriangle, ShieldCheck, Activity, HelpCircle } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';

export default function BeautyRisk() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [activeTab, setActiveTab] = useState<'skin' | 'hair'>('skin');

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <ShieldAlert size={48} className="text-red-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to load the Beauty Risk Intelligence dashboard.
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

  const profile = result.profile;
  const health = result.skinHealth;
  const stress = profile.stressLevel;
  const sleep = profile.sleepHours;
  const hydration = profile.waterIntake;

  // Probability calculations
  const skinRisks = [
    {
      name: 'Acne & Follicle Flare Risk',
      probability: health.acneRiskScore,
      description: 'Acidity and sebum clogging in the sebaceous duct pathways prompting bacterial growth.',
      prevention: 'Cleanse twice daily with 2% salicylic acid cleansers; integrate non-comedogenic squalane moisturizers.'
    },
    {
      name: 'UV Damage & Pigment Risk',
      probability: health.uvDamageScore,
      description: 'Degradation of stratum corneum defenses under direct ultraviolet sunlight exposure.',
      prevention: 'Apply titanium or zinc oxide broad-spectrum mineral blocks block daily, reapply in midday.'
    },
    {
      name: 'Accelerated Aging Risk',
      probability: health.agingRiskScore,
      description: 'Degradation of dermal matrices and collagen structure thinning over time.',
      prevention: 'Apply retinol compounds at night; prioritize antioxidant Vitamin C and E intake.'
    },
    {
      name: 'Hyperpigmentation Melasma Risk',
      probability: Math.min(100, Math.max(0, Math.round(health.uvDamageScore * 1.1))),
      description: 'Uneven melanogenesis producing dark spots and post-inflammatory pigmentation.',
      prevention: 'Incorporate tyrosinase inhibitors like alpha arbutin or topical azelaic acid complexes.'
    },
    {
      name: 'Dehydration & TEWL Risk',
      probability: Math.min(100, Math.max(0, Math.round(100 - health.hydrationScore))),
      description: 'Compromised intercellular lipid mantle leading to high transepidermal water loss rates.',
      prevention: 'Use ceramide-rich repair balms; apply multi-weight humectants on slightly damp skin.'
    }
  ];

  const hairRisks = [
    {
      name: 'Follicular Hair Fall Risk',
      probability: Math.min(100, Math.max(0, Math.round(100 - 78 + stress * 3 + (8 - sleep) * 2))),
      description: 'Active follicle roots entering premature telogen (resting/shedding) cycle.',
      prevention: 'Reduce cortisol triggers; apply daily rosemary-caffeine extracts to scalp pathways.'
    },
    {
      name: 'Scalp Irritation & Damage Risk',
      probability: Math.min(100, Math.max(0, Math.round(32 + stress * 2 + (8 - sleep) * 1.5))),
      description: 'Localised scalp micro-capillary vasodilation or fungal barrier imbalance.',
      prevention: 'Use pH-balanced sulfate-free shampoos; restrict high-temperature hair straightener contact.'
    },
    {
      name: 'Fiber Breakage Risk',
      probability: Math.min(100, Math.max(0, Math.round(28 + (10 - hydration) * 4.5))),
      description: 'Tensile shaft weakness due to moisture evaporation or chemical damage.',
      prevention: 'Utilize hydrolysed keratin hair conditioners; limit bleaching operations.'
    },
    {
      name: 'Follicle Thinning Risk',
      probability: Math.min(100, Math.max(0, Math.round(35 + (profile.age - 20) * 0.8 + stress * 1.5))),
      description: 'Shrinkage of hair root bulbs leading to finer shaft structures.',
      prevention: 'Apply copper-peptide complexes directly to crown paths to expand bulb size.'
    }
  ];

  const currentRisks = activeTab === 'skin' ? skinRisks : hairRisks;

  const getRiskLevel = (p: number) => {
    if (p >= 70) return { text: 'CRITICAL THREAT', color: 'text-rose-400', progressColor: 'bg-rose-500', card: 'border-rose-500/20 bg-rose-950/10' };
    if (p >= 40) return { text: 'MODERATE WARNING', color: 'text-amber-400', progressColor: 'bg-amber-500', card: 'border-amber-500/20 bg-amber-950/10' };
    return { text: 'STABLE / LOW RISK', color: 'text-emerald-400', progressColor: 'bg-emerald-500', card: 'border-emerald-500/20 bg-emerald-950/10' };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-3">
          <ShieldAlert size={12} /> Clinical Risk monitoring
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">Beauty Risk Intelligence</h1>
        <p className="text-sm text-aura-muted mt-1">Real-time danger indicator mapping probability limits for skin conditions and trichological issues.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-black/45 rounded-xl border border-aura-border max-w-sm mb-8">
        <button
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'skin' ? 'bg-rose-600 text-white shadow-glow-secondary' : 'text-aura-muted hover:text-white'
          }`}
          onClick={() => setActiveTab('skin')}
        >
          Skin Threats
        </button>
        <button
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'hair' ? 'bg-rose-600 text-white shadow-glow-secondary' : 'text-aura-muted hover:text-white'
          }`}
          onClick={() => setActiveTab('hair')}
        >
          Hair & Scalp Threats
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Risk Cards List (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {currentRisks.map((risk, idx) => {
            const meta = getRiskLevel(risk.probability);
            return (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border glass-gradient flex flex-col gap-4 transition-all ${meta.card}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">{risk.name}</h3>
                    <span className="text-[10px] text-aura-muted">Probability index: {risk.probability}%</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                    {meta.text}
                  </span>
                </div>

                <p className="text-xs text-aura-muted leading-relaxed">{risk.description}</p>
                
                <ProgressBar progress={risk.probability} colorClass={meta.progressColor} />

                <div className="p-3 rounded-lg bg-black/35 border border-white/5 text-[11px] leading-relaxed text-white/95">
                  <span className="font-bold text-cyan-400">Prevention Strategy:</span> {risk.prevention}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Matrix (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <h3 className="text-base font-bold text-white mb-3">Threat Core Analysis</h3>
            <p className="text-xs text-aura-muted leading-relaxed mb-6">
              Ensuring your daily habits align with the recommended preventative actions can lower compound aging and follicle shedding index parameters by 45%.
            </p>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between">
                <span className="text-aura-muted">Critical Threats</span>
                <span className="font-bold text-rose-400">
                  {currentRisks.filter(r => r.probability >= 70).length} Detected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-aura-muted">Moderate Warnings</span>
                <span className="font-bold text-amber-400">
                  {currentRisks.filter(r => r.probability >= 40 && r.probability < 70).length} Flagged
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-aura-border font-bold">
                <span className="text-white">Aggregate Risk</span>
                <span className="text-white">
                  {Math.round(currentRisks.reduce((a, b) => a + b.probability, 0) / currentRisks.length)}%
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
