import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { Dna, ShieldAlert, Heart, Calendar, Zap, ArrowDownCircle } from 'lucide-react';

export default function BioAge() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <Dna size={48} className="text-cyan-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to load biological age data.
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
  const actualAge = profile.age;

  // Formulas for Biological Ages
  const skinScore = result.skinHealth.overallScore;
  const skinBioAge = Math.max(18, Math.round(actualAge + (75 - skinScore) * 0.22));
  
  const hairScore = 78; // baseline hair
  const sleepPenalty = (8 - profile.sleepHours) * 0.4;
  const stressPenalty = (profile.stressLevel - 4) * 0.3;
  const hairBioAge = Math.max(18, Math.round(actualAge + (75 - hairScore) * 0.2 + sleepPenalty + stressPenalty));

  // Visual offsets for SVG rings
  const calculateStrokeDashOffset = (age: number, maxAge = 100) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const percentage = (age / maxAge) * 100;
    return circumference - (percentage / 100) * circumference;
  };

  const ringCircumference = 2 * Math.PI * 40;

  // Age status
  const getAgeStatus = (bio: number, chronological: number) => {
    const diff = bio - chronological;
    if (diff <= -3) return { text: 'Optimal Cellular Longevity', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (diff <= 2) return { text: 'Normal Aging Track', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
    return { text: 'Accelerated Aging Markers', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
  };

  const skinStatus = getAgeStatus(skinBioAge, actualAge);
  const hairStatus = getAgeStatus(hairBioAge, actualAge);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Page Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
          <Dna size={12} /> Longevity & Cellular Age
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">Biological Age Diagnostics</h1>
        <p className="text-sm text-aura-muted mt-1">Comparison metrics between chronological years and skin/hair cell telomere indicators.</p>
      </header>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Actual Chronological Age */}
        <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-aura-muted mb-4">Chronological Age</div>
          
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke="var(--aura-purple)" strokeWidth="8" fill="transparent" 
                strokeDasharray={ringCircumference}
                strokeDashoffset={calculateStrokeDashOffset(actualAge)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-4xl font-extrabold font-display text-white">{actualAge}</div>
          </div>
          
          <span className="text-xs text-aura-muted mt-2">Physical years since baseline birth</span>
        </div>

        {/* Skin Biological Age */}
        <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-aura-muted mb-4">Skin Biological Age</div>
          
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke="var(--aura-cyan)" strokeWidth="8" fill="transparent" 
                strokeDasharray={ringCircumference}
                strokeDashoffset={calculateStrokeDashOffset(skinBioAge)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-4xl font-extrabold font-display text-cyan-400">{skinBioAge}</div>
          </div>
          
          <div className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${skinStatus.bg} ${skinStatus.color}`}>
            {skinStatus.text}
          </div>
        </div>

        {/* Hair Biological Age */}
        <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-aura-muted mb-4">Hair Biological Age</div>
          
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke="var(--aura-gold)" strokeWidth="8" fill="transparent" 
                strokeDasharray={ringCircumference}
                strokeDashoffset={calculateStrokeDashOffset(hairBioAge)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-4xl font-extrabold font-display text-yellow-500">{hairBioAge}</div>
          </div>
          
          <div className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${hairStatus.bg} ${hairStatus.color}`}>
            {hairStatus.text}
          </div>
        </div>

      </div>

      {/* Factors and Solutions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Age Acceleration Factors (7 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col gap-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert size={18} className="text-cyan-400" /> Age Acceleration Factors
          </h3>

          <div className="flex flex-col gap-4">
            
            {/* Factor 1: UV-Induced Photoaging */}
            <div className="p-4 rounded-xl bg-black/30 border border-aura-border flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-white">
                <span>UV Radiation (Photoaging)</span>
                <span className={result.skinHealth.uvDamageScore > 50 ? 'text-amber-400' : 'text-emerald-400'}>
                  {result.skinHealth.uvDamageScore > 50 ? 'Moderate Activity' : 'Low Activity'}
                </span>
              </div>
              <p className="text-[11px] text-aura-muted leading-relaxed">
                UV rays damage keratinocytes and trigger collagenase enzymes that break down elastin fibers. This causes structural sagging and hyperpigmentation (sun spots), accelerating cutaneous biological age.
              </p>
              <div className="text-[10px] font-bold text-cyan-400">Recommendation: Use SPF 50 mineral block daily and reapply every 3 hours.</div>
            </div>

            {/* Factor 2: Cortisol & Inflammaging */}
            <div className="p-4 rounded-xl bg-black/30 border border-aura-border flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-white">
                <span>Elevated Cortisol (Inflammaging)</span>
                <span className={profile.stressLevel > 6 ? 'text-rose-400' : 'text-emerald-400'}>
                  {profile.stressLevel > 6 ? 'High Cortisol Load' : 'Minimal Stress Load'}
                </span>
              </div>
              <p className="text-[11px] text-aura-muted leading-relaxed">
                Chronic psychological stress produces high levels of cortisol. Elevated cortisol impairs the epidermal lipid synthesis pathway, causing micro-inflammation ("inflammaging") and premature barrier collapse.
              </p>
              <div className="text-[10px] font-bold text-cyan-400">Recommendation: Implement nightly 10-minute mindfulness breathing to regulate circulatory stress.</div>
            </div>

            {/* Factor 3: Advanced Glycation End-Products (AGEs) */}
            <div className="p-4 rounded-xl bg-black/30 border border-aura-border flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-white">
                <span>Glycation (Dietary Glycemic Index)</span>
                <span className={profile.dietQuality < 5 ? 'text-rose-400' : 'text-emerald-400'}>
                  {profile.dietQuality < 5 ? 'Elevated Glycation Risk' : 'Optimal Glycation Resistance'}
                </span>
              </div>
              <p className="text-[11px] text-aura-muted leading-relaxed">
                High glycemic food intake reacts chemically with collagen and elastin fibers in a process called glycation. This forms stiff structures called Advanced Glycation End-products (AGEs), leading to skin wrinkling.
              </p>
              <div className="text-[10px] font-bold text-cyan-400">Recommendation: Shift diet towards antioxidant-dense berries, leafy vegetables, and high omega-3 fatty acids.</div>
            </div>

          </div>

        </div>

        {/* Right: Cellular Longevity Checklist (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col gap-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Heart size={18} className="text-pink-400" /> Longevity Therapies
          </h3>
          <p className="text-xs text-aura-muted leading-relaxed">
            Targeted molecular and lifestyle changes to slow biological cellular aging.
          </p>

          <div className="flex flex-col gap-4">
            
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/25 flex items-center justify-center shrink-0 text-purple-400">
                <Zap size={12} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Antioxidant Defense</h4>
                <p className="text-[10px] text-aura-muted mt-0.5">Topical Vitamin C & E neutralize free radicals before they attack cellular nuclei.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center shrink-0 text-cyan-400">
                <Dna size={12} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Retinoid Mitosis</h4>
                <p className="text-[10px] text-aura-muted mt-0.5">Retinoids stimulate structural fibroblasts, increasing overall collagen secretion.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 text-emerald-400">
                <Calendar size={12} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Circadian Alignment</h4>
                <p className="text-[10px] text-aura-muted mt-0.5">Consistency in routine aligns skin cell clock genes, optimizing nightly tissue repairs.</p>
              </div>
            </div>

          </div>

          <div className="mt-4 p-4 rounded-xl border border-purple-500/20 bg-purple-950/10 flex flex-col gap-2">
            <div className="text-[10px] font-bold text-purple-300 uppercase">Simulated Projections</div>
            <p className="text-[10px] text-aura-muted leading-relaxed">
              Following the recommendations can reduce biological skin age by an estimated 2.5 years over 90 days.
            </p>
            <button 
              className="mt-2 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg transition"
              onClick={() => navigate('/beauty-twin')}
            >
              Simulate Regeneration
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
