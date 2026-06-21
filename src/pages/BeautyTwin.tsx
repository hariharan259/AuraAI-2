import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { Sparkles, Moon, Droplet, Smile, ShieldCheck, User, Apple, Activity, Trophy } from 'lucide-react';

export default function BeautyTwin() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  // Simulation Sliders
  const [sleep, setSleep] = useState(7);
  const [hydration, setHydration] = useState(8);
  const [stress, setStress] = useState(5);
  const [diet, setDiet] = useState(6);
  const [routine, setRoutine] = useState(80);
  const [exercise, setExercise] = useState(3);

  // Simulated Outputs
  const [skinScore, setSkinScore] = useState(70);
  const [hairScore, setHairScore] = useState(75);
  const [beautyScore, setBeautyScore] = useState(72);
  const [confidenceScore, setConfidenceScore] = useState(70);

  useEffect(() => {
    if (result) {
      const baseSkin = result.skinHealth.overallScore;
      const baseHair = 78;

      // Factors calculation
      const sleepFactor = (sleep - 7.5) * 1.5;
      const hydrationFactor = (hydration - 8) * 1.2;
      const stressFactor = (5 - stress) * 1.8;
      const dietFactor = (diet - 6) * 1.4;
      const routineFactor = (routine - 80) * 0.15;
      const exerciseFactor = (exercise - 3) * 1.1;

      const totalDelta = sleepFactor + hydrationFactor + stressFactor + dietFactor + routineFactor + exerciseFactor;

      const computedSkin = Math.min(100, Math.max(40, Math.round(baseSkin + totalDelta * 0.6)));
      const computedHair = Math.min(100, Math.max(45, Math.round(baseHair + totalDelta * 0.4)));
      const computedBeauty = Math.min(100, Math.max(40, Math.round((computedSkin * 0.65 + computedHair * 0.35))));
      const computedConfidence = Math.min(100, Math.max(30, Math.round(
        72 + (sleep - 7.5) * 1.2 + (hydration - 8) * 0.8 + (5 - stress) * 2.5 + (diet - 6) * 1.0 + (routine - 80) * 0.15 + (exercise - 3) * 2.0
      )));

      setSkinScore(computedSkin);
      setHairScore(computedHair);
      setBeautyScore(computedBeauty);
      setConfidenceScore(computedConfidence);
    }
  }, [result, sleep, hydration, stress, diet, routine, exercise]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <Sparkles size={48} className="text-pink-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Analyze your skin profile first to initiate your AI Digital Twin.
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
  const baseBeauty = Math.round(baseSkin * 0.65 + baseHair * 0.35);
  const baseConfidence = 72;

  // Percentage improvement helper
  const getImprovementPct = (predicted: number, current: number) => {
    const diff = predicted - current;
    if (diff === 0) return '0%';
    const pct = Math.round((diff / current) * 100);
    return `${pct > 0 ? '+' : ''}${pct}%`;
  };

  const getAuraColor = () => {
    if (beautyScore >= 85) return 'from-cyan-500/30 to-purple-500/30';
    if (beautyScore >= 70) return 'from-purple-500/20 to-pink-500/20';
    return 'from-red-500/20 to-orange-500/20';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 border border-pink-500/30 text-pink-400 mb-3">
          <Sparkles size={12} /> Digital Beauty Twin Center
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">AI Beauty Twin</h1>
        <p className="text-sm text-aura-muted mt-1">Simulate changes in environment and daily habits to predict future aesthetics.</p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sliders (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col gap-6">
          <h3 className="text-sm font-bold text-white mb-2">Lifestyle Simulation Controls</h3>

          {/* Sleep */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1 text-aura-muted">
                <Moon size={14} className="text-purple-400" /> Sleep Duration
              </span>
              <span className="font-bold text-white font-mono">{sleep} hrs</span>
            </div>
            <input 
              type="range" min="4" max="10" step="0.5" value={sleep} 
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer bg-black/40 rounded-lg h-1.5"
            />
          </div>

          {/* Hydration */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1 text-aura-muted">
                <Droplet size={14} className="text-cyan-400" /> Hydration Level
              </span>
              <span className="font-bold text-white font-mono">{hydration} glasses</span>
            </div>
            <input 
              type="range" min="2" max="12" value={hydration} 
              onChange={(e) => setHydration(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer bg-black/40 rounded-lg h-1.5"
            />
          </div>

          {/* Stress */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1 text-aura-muted">
                <Smile size={14} className="text-amber-400" /> Stress Factor
              </span>
              <span className="font-bold text-white font-mono">{stress}/10</span>
            </div>
            <input 
              type="range" min="1" max="10" value={stress} 
              onChange={(e) => setStress(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer bg-black/40 rounded-lg h-1.5"
            />
          </div>

          {/* Diet */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1 text-aura-muted">
                <Apple size={14} className="text-emerald-400" /> Diet Quality
              </span>
              <span className="font-bold text-white font-mono">{diet}/10</span>
            </div>
            <input 
              type="range" min="1" max="10" value={diet} 
              onChange={(e) => setDiet(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer bg-black/40 rounded-lg h-1.5"
            />
          </div>

          {/* Routine */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1 text-aura-muted">
                <ShieldCheck size={14} className="text-pink-400" /> Routine Consistency
              </span>
              <span className="font-bold text-white font-mono">{routine}%</span>
            </div>
            <input 
              type="range" min="10" max="100" step="5" value={routine} 
              onChange={(e) => setRoutine(parseInt(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer bg-black/40 rounded-lg h-1.5"
            />
          </div>

          {/* Exercise */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1 text-aura-muted">
                <Activity size={14} className="text-teal-400" /> Exercise Frequency
              </span>
              <span className="font-bold text-white font-mono">{exercise} days/wk</span>
            </div>
            <input 
              type="range" min="0" max="7" value={exercise} 
              onChange={(e) => setExercise(parseInt(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer bg-black/40 rounded-lg h-1.5"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-4 border-t border-aura-border mt-2">
            <div className="text-[10px] font-bold text-aura-muted uppercase mb-3">Or choose a preset:</div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                className="py-2 px-3 bg-cyan-950/25 hover:bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-100 hover:border-cyan-400"
                onClick={() => { setSleep(8.5); setHydration(10); setStress(2); setDiet(8); setRoutine(95); setExercise(5); }}
              >
                🌿 Perfect Calm
              </button>
              <button 
                className="py-2 px-3 bg-rose-950/25 hover:bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-100 hover:border-rose-400"
                onClick={() => { setSleep(4.5); setHydration(3); setStress(9); setDiet(3); setRoutine(30); setExercise(0); }}
              >
                🔥 High Burnout
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Comparative Grid & Visual twin (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Avatar Render */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient relative overflow-hidden flex flex-col md:flex-row items-center gap-8 min-h-[220px]">
            <div className={`absolute inset-0 bg-gradient-to-tr ${getAuraColor()} opacity-25 filter blur-3xl pointer-events-none transition-all duration-700`} />
            
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center border border-white/5 rounded-full bg-black/35 shadow-inner">
              <div className="absolute w-28 h-28 rounded-full border-2 border-dashed border-pink-500/25 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center relative z-10">
                <User size={44} className="text-white/70" />
              </div>
            </div>

            <div className="flex-1 w-full relative z-10 text-center md:text-left">
              <h4 className="text-sm font-bold text-white mb-2">Digital Twin Simulation Status</h4>
              <p className="text-xs text-aura-muted leading-relaxed">
                By adjusting lifestyle factors, you can observe real-time predicted changes in structural cell proteins, moisture density, scalp oxygen flows, and systemic micro-inflammation markers.
              </p>
            </div>
          </div>

          {/* Matrix table */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <h3 className="text-sm font-bold text-white mb-4">Simulated Matrix Table</h3>
            
            <div className="flex flex-col gap-3">
              
              {/* Row: Skin */}
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/25 border border-white/5">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400" />
                  <span className="text-xs font-bold text-white">Skin Health</span>
                </div>
                <div className="flex gap-8 text-xs font-mono">
                  <span className="text-aura-muted">Base: {baseSkin}</span>
                  <span className="text-white font-bold">Sim: {skinScore}</span>
                  <span className={skinScore >= baseSkin ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {getImprovementPct(skinScore, baseSkin)}
                  </span>
                </div>
              </div>

              {/* Row: Hair */}
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/25 border border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span className="text-xs font-bold text-white">Hair Health</span>
                </div>
                <div className="flex gap-8 text-xs font-mono">
                  <span className="text-aura-muted">Base: {baseHair}</span>
                  <span className="text-white font-bold">Sim: {hairScore}</span>
                  <span className={hairScore >= baseHair ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {getImprovementPct(hairScore, baseHair)}
                  </span>
                </div>
              </div>

              {/* Row: Beauty */}
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/25 border border-white/5">
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-purple-400" />
                  <span className="text-xs font-bold text-white">Beauty Score</span>
                </div>
                <div className="flex gap-8 text-xs font-mono">
                  <span className="text-aura-muted">Base: {baseBeauty}</span>
                  <span className="text-white font-bold">Sim: {beautyScore}</span>
                  <span className={beautyScore >= baseBeauty ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {getImprovementPct(beautyScore, baseBeauty)}
                  </span>
                </div>
              </div>

              {/* Row: Confidence */}
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/25 border border-white/5">
                <div className="flex items-center gap-2">
                  <Smile size={14} className="text-pink-400" />
                  <span className="text-xs font-bold text-white">Confidence Score</span>
                </div>
                <div className="flex gap-8 text-xs font-mono">
                  <span className="text-aura-muted">Base: {baseConfidence}</span>
                  <span className="text-white font-bold">Sim: {confidenceScore}</span>
                  <span className={confidenceScore >= baseConfidence ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {getImprovementPct(confidenceScore, baseConfidence)}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
