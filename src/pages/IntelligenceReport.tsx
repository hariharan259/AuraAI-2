import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import ScoreRing from '../components/ui/ScoreRing';
import SkinRiskRadar from '../components/charts/SkinRiskRadar';
import SkinTwinDashboard from '../components/ui/SkinTwinDashboard';
import { exportAnalysisToPDF } from '../services/pdfReport';
import { 
  Sliders, Download, AlertTriangle, Lightbulb, 
  Info, Microscope, FlaskConical, ArrowRight, 
  X, Sparkles, CheckCircle2, TrendingUp, Sparkle
} from 'lucide-react';
import { INGREDIENT_DATABASE, Ingredient } from '../data/ingredients';
import { UserProfile, SkinAnalysisResult, SkincareRoutineItem } from '../types';

// Helper to generate ingredient intelligence based on user profile and analysis
function getIngredientIntelligence(profile: UserProfile, skinHealth: SkinAnalysisResult) {
  const recs: Ingredient[] = [];
  const interactions: string[] = [];
  const risks: string[] = [];

  // Categorized selection
  if (profile.skinType === 'oily') {
    recs.push(INGREDIENT_DATABASE.niacinamide);
    recs.push(INGREDIENT_DATABASE.salicylicAcid);
  } else if (profile.skinType === 'dry') {
    recs.push(INGREDIENT_DATABASE.niacinamide);
    recs.push(INGREDIENT_DATABASE.centella);
  } else if (profile.skinType === 'sensitive') {
    recs.push(INGREDIENT_DATABASE.centella);
    recs.push(INGREDIENT_DATABASE.azelaicAcid);
  } else {
    recs.push(INGREDIENT_DATABASE.niacinamide);
    recs.push(INGREDIENT_DATABASE.vitaminC);
  }

  // Concern matches
  const concernIds = skinHealth.concerns.map(c => c.id);
  if (concernIds.includes('acne') && !recs.some(r => r.id === 'salicylicAcid')) {
    recs.push(INGREDIENT_DATABASE.salicylicAcid);
  }
  if (concernIds.includes('pigmentation') && !recs.some(r => r.id === 'alphaArbutin')) {
    recs.push(INGREDIENT_DATABASE.alphaArbutin);
  }
  if (concernIds.includes('wrinkles') && !recs.some(r => r.id === 'retinol')) {
    recs.push(INGREDIENT_DATABASE.retinol);
  }

  // Fallbacks
  if (recs.length < 3) {
    recs.push(INGREDIENT_DATABASE.centella);
  }

  recs.forEach(r => {
    if (r.risks) risks.push(...r.risks);
    if (r.interactions) interactions.push(...r.interactions);
  });

  const uniqueRisks = Array.from(new Set(risks)).slice(0, 3);
  const uniqueInteractions = Array.from(new Set(interactions)).slice(0, 3);

  // Default formulas
  let formulaName = `AURA-SERUM-${profile.age}${profile.skinType.toUpperCase().substring(0, 2)}`;
  let base = 'Hyaluronic Acid 1.5% Gel Base';
  let compounds: Array<{ name: string; percentage: number }> = [];

  if (profile.skinType === 'oily') {
    compounds = [
      { name: 'Niacinamide', percentage: 5.0 },
      { name: 'Salicylic Acid', percentage: 1.5 },
      { name: 'Zinc PCA', percentage: 1.0 }
    ];
  } else if (profile.skinType === 'dry') {
    compounds = [
      { name: 'Niacinamide', percentage: 4.0 },
      { name: 'Squalane', percentage: 2.0 },
      { name: 'Panthenol', percentage: 2.0 }
    ];
  } else if (profile.skinType === 'sensitive') {
    compounds = [
      { name: 'Centella Extract', percentage: 3.0 },
      { name: 'Panthenol', percentage: 2.5 },
      { name: 'Allantoin', percentage: 0.5 }
    ];
  } else {
    compounds = [
      { name: 'Vitamin C', percentage: 10.0 },
      { name: 'Niacinamide', percentage: 3.0 },
      { name: 'Hyaluronic Acid', percentage: 1.5 }
    ];
  }

  return {
    customFormula: {
      name: formulaName,
      base,
      compounds
    },
    recommendations: recs,
    interactions: uniqueInteractions,
    risks: uniqueRisks
  };
}

export default function IntelligenceReport() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;
  const [routineTab, setRoutineTab] = useState<'morning' | 'night' | 'weekly' | 'monthly'>('morning');
  const [showAuraCard, setShowAuraCard] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Formulation Sandbox state
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxCompounds, setSandboxCompounds] = useState<Array<{ name: string; percentage: number }>>([]);
  const [safetyScore, setSafetyScore] = useState(100);
  const [safetyAlerts, setSafetyAlerts] = useState<string[]>([]);
  const [customFormulaCode, setCustomFormulaCode] = useState('');
  const [customFormulaState, setCustomFormulaState] = useState<any>(null);

  // Set up local custom formula state based on analysis payload
  useEffect(() => {
    if (result) {
      const intel = getIngredientIntelligence(result.profile, result.skinHealth);
      setCustomFormulaState(intel);
    }
  }, [result]);

  const openSandbox = () => {
    if (customFormulaState && customFormulaState.customFormula) {
      const initial = customFormulaState.customFormula.compounds.map((c: any) => ({
        name: c.name,
        percentage: parseFloat(c.percentage) || 1.0
      }));
      setSandboxCompounds(initial);
      
      const name = customFormulaState.customFormula.name;
      const match = name.match(/AURA-[A-Z0-9-]+/);
      setCustomFormulaCode(match ? match[0] : `AURA-${result?.profile.age}${result?.profile.skinType.toUpperCase().substring(0,2)}`);
      
      const check = runSafetyChecks(initial);
      setSafetyScore(check.score);
      setSafetyAlerts(check.alerts);
      setShowSandbox(true);
    }
  };

  const runSafetyChecks = (compounds: Array<{ name: string; percentage: number }>) => {
    let score = 100;
    let alerts: string[] = [];

    compounds.forEach(c => {
      const pct = c.percentage;
      if (c.name === 'Retinol' && pct > 1.5) {
        score -= 20;
        alerts.push(`High Retinol warning (${pct}%): Potential skin flaking or dryness. Recommended concentration <= 1.0%.`);
      }
      if (c.name === 'Salicylic Acid' && pct > 2.0) {
        score -= 15;
        alerts.push(`High Salicylic Acid warning (${pct}%): Risk of stinging or irritation. Recommended standard: <= 2.0%.`);
      }
      if (c.name === 'Vitamin C' && pct > 15.0) {
        score -= 10;
        alerts.push(`High Vitamin C warning (${pct}%): Acidic formulas may irritate sensitive tissue. Recommended <= 10.0%.`);
      }
      if (pct > 5.0 && c.name !== 'Vitamin C') {
        score -= 5;
        alerts.push(`Concentration limit exceeded: ${c.name} at ${pct}% is higher than usual over-the-counter limits.`);
      }
    });

    const names = compounds.map(c => c.name.toLowerCase());
    if (names.includes('retinol') && names.includes('vitamin c')) {
      score -= 25;
      alerts.push('Retinol + Vitamin C conflict: Concurrent application compromises formula pH and skin barriers. Alternate: C in AM, Retinol in PM.');
    }
    if (names.includes('salicylic acid') && names.includes('retinol')) {
      score -= 25;
      alerts.push('Salicylic Acid + Retinol conflict: High risk of over-exfoliation. Alternate nights.');
    }

    if (result?.profile && result.profile.skinType === 'sensitive') {
      const highActives = compounds.filter(c => ['Retinol', 'Salicylic Acid', 'Alpha Arbutin', 'Vitamin C'].includes(c.name) && c.percentage > 1.0);
      if (highActives.length > 0) {
        score -= 10;
        alerts.push(`Sensitive skin safety protocol: High active dosages (${highActives.map(a => a.name).join(', ')}) can cause irritation.`);
      }
    }

    return { score: Math.max(0, score), alerts };
  };

  useEffect(() => {
    if (sandboxCompounds.length > 0) {
      const check = runSafetyChecks(sandboxCompounds);
      setSafetyScore(check.score);
      setSafetyAlerts(check.alerts);
    }
  }, [sandboxCompounds]);

  const updateSandboxCompound = (idx: number, value: number) => {
    setSandboxCompounds(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], percentage: value };
      return next;
    });
  };

  const saveSandboxFormula = () => {
    if (customFormulaState) {
      const updatedFormula = {
        ...customFormulaState,
        customFormula: {
          ...customFormulaState.customFormula,
          name: `AuraAI Custom Serum ${customFormulaCode}`,
          compounds: sandboxCompounds.map(c => ({
            name: c.name,
            percentage: c.percentage
          }))
        }
      };
      setCustomFormulaState(updatedFormula);
      setShowSandbox(false);
    }
  };

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <Microscope size={48} className="text-purple-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Intelligence Report Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please complete your skincare intake profile and perform a skin analysis scan first.
        </p>
        <button 
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 shadow-glow-primary"
          onClick={() => navigate('/profile')}
        >
          Begin Diagnostics
        </button>
      </div>
    );
  }

  const { skinHealth, skinTwin, routine, beautyScore, lifestyleScore } = result;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display">Dermatology Intelligence Report</h1>
          <p className="text-aura-muted text-xs font-mono mt-1">Generated: {result.timestamp} • Passport: {result.skinPassportId}</p>
        </div>
        <button 
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 shadow-glow-primary flex items-center gap-2 self-stretch sm:self-auto justify-center"
          onClick={() => exportAnalysisToPDF(result)}
        >
          <Download size={14} /> Download Clinical Report PDF
        </button>
      </header>

      {/* Executive Scores Dashboard */}
      <section className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-medical-radial opacity-50 pointer-events-none" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Executive Diagnostics Index</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-items-center">
          <ScoreRing score={beautyScore} size={110} label="Beauty Intel" />
          <ScoreRing score={skinHealth.overallScore} size={110} label="Skin Health" />
          <ScoreRing score={78} size={110} label="Hair Health" />
          <ScoreRing score={lifestyleScore} size={110} label="Lifestyle Score" />
          <ScoreRing score={94} size={110} label="Forecast Acc" />
        </div>
      </section>


      {/* Interactive Holographic Aura Card Promotion */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/10 via-teal-950/10 to-purple-950/10 border border-purple-500/20 glass-gradient flex flex-col md:flex-row justify-between items-center gap-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex-1 min-w-[280px]">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full mb-3">
            Social Sharing Node
          </span>
          <h3 className="text-xl font-bold text-white mb-2">Claim Your Digital Aura Passport Card</h3>
          <p className="text-sm text-aura-muted leading-relaxed mb-6">
            Synthesize a rare, interactive holographic <strong>Skin Aura Trading Card</strong> detailing your dermatological archetype, active ingredient percentages, and system status to share on social feeds.
          </p>
          
          <div className="flex gap-4">
            <button 
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 shadow-glow-secondary flex items-center gap-1.5"
              onClick={() => setShowAuraCard(true)}
            >
              <Sparkles size={14} /> Open Holographic Card
            </button>
            <button 
              className="px-4 py-2.5 border border-aura-border hover:border-purple-500/30 text-aura-muted hover:text-white text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 bg-black/20"
              onClick={() => alert("Skincare archetype successfully linked to your Aura Passport!")}
            >
              Link Archetype
            </button>
          </div>
        </div>

        {/* Visual Teaser Mockup */}
        <div className="flex-shrink-0 flex items-center justify-center cursor-pointer" onClick={() => setShowAuraCard(true)}>
          <div className="w-[180px] h-[240px] rounded-2xl bg-gradient-to-br from-teal-500/20 via-purple-500/10 to-pink-500/20 border border-white/10 shadow-2xl relative flex flex-col justify-between p-4 transform hover:scale-[1.03] transition-all duration-500 group overflow-hidden">
            {/* Holographic light sweep */}
            <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            <div className="flex justify-between items-center text-[8px] font-mono text-aura-muted">
              <span>AURA SYSTEM</span>
              <span>#{Math.floor(beautyScore * 14.8)}</span>
            </div>
            <div className="flex flex-col items-center gap-1 py-4">
              <span className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">{beautyScore}</span>
              <span className="text-[8px] font-bold text-teal-400 uppercase tracking-widest">Aura Score</span>
            </div>
            <div className="text-[10px] font-bold text-center border-t border-white/5 pt-2 text-purple-300">
              {skinHealth.overallScore > 75 ? 'GLOW CORE' : 'BARRIER SHIELD'}
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Diagnostics radar & Twin face model */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Skin Twin face model (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Bio-Digital Skin Twin</h3>
            <span className="text-[10px] text-aura-muted uppercase tracking-widest font-mono block mb-4">3D Epidermal Coordinate Assessment</span>
          </div>
          
          <div className="flex-grow flex items-center justify-center py-4">
            <SkinTwinDashboard twin={skinTwin} result={skinHealth} />
          </div>

          <div className="border-t border-aura-border/60 pt-4 mt-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Twin Barrier Summary</h4>
            <p className="text-xs text-aura-muted leading-relaxed italic m-0">
              "{skinTwin.currentSummary}"
            </p>
          </div>
        </div>

        {/* Skin Risk Radar (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Dermatological Risks</h3>
            <span className="text-[10px] text-aura-muted uppercase tracking-widest font-mono block mb-4">Vulnerability Vector Analysis</span>
          </div>
          
          <div className="flex-grow min-h-[250px] flex items-center justify-center">
            <SkinRiskRadar 
              acneRisk={skinHealth.acneRiskScore}
              uvDamage={skinHealth.uvDamageScore}
              pigmentation={100 - skinHealth.measurements.pigmentation}
              dehydration={100 - skinHealth.hydrationScore}
              agingRisk={skinHealth.agingRiskScore}
              sensitivity={100 - skinHealth.measurements.redness}
            />
          </div>

          <div className="border-t border-aura-border/60 pt-4 mt-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Identified Skin Concerns</h4>
            <div className="flex flex-col gap-2">
              {skinHealth.concerns.length > 0 ? (
                skinHealth.concerns.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-2.5 rounded-lg bg-black/30 border border-aura-border text-xs">
                    <span className="font-semibold text-gray-200">{c.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      c.severity === 'Severe' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {c.severity}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Dermal barrier parameters normal. No concerns detected.
                </div>
              )}
            </div>
          </div>
        </div>

      </section>

      {/* Ingredient Intelligence */}
      {customFormulaState && (
        <section className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient mb-8">
          <div className="flex items-center gap-3 border-b border-aura-border pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow-green">
              <FlaskConical size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Active Ingredient Intelligence</h3>
              <p className="text-xs text-aura-muted">Custom compound design & safety profiling</p>
            </div>
          </div>

          {/* Bespoke AI Formulation Card */}
          <div className="p-6 rounded-xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/10 to-cyan-950/10 mb-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-full bg-medical-radial opacity-30 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                    Bespoke AI Formulation
                  </span>
                  <button 
                    className="px-2 py-0.5 bg-black/40 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-[9px] font-mono rounded flex items-center gap-1 transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-[1px]"
                    onClick={openSandbox}
                  >
                    <Sliders size={10} /> Open Sandbox
                  </button>
                </div>
                <h4 className="text-xl font-bold font-display text-white">{customFormulaState.customFormula.name}</h4>
                <p className="text-xs text-aura-muted mt-0.5">Base Carrier: {customFormulaState.customFormula.base}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FlaskConical size={22} />
              </div>
            </div>

            {/* Compound blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {customFormulaState.customFormula.compounds.map((c: any, idx: number) => (
                <div key={idx} className="p-3 bg-black/30 border border-aura-border rounded-lg flex flex-col justify-center">
                  <span className="text-lg font-bold text-emerald-400 font-mono">{c.percentage.toFixed(1)}%</span>
                  <span className="text-[10px] font-bold text-aura-muted uppercase tracking-wider mt-0.5">{c.name}</span>
                </div>
              ))}
            </div>

            {/* Smart Dispenser Integration */}
            <div className="p-4 bg-black/40 border border-aura-border rounded-xl mb-4 text-xs">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-2">Aura Smart Dispenser Integration</span>
              <ul className="list-none p-0 m-0 flex flex-col gap-2 text-aura-muted">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">🧬</span>
                  <span>Smart cartridge system mixes target formulations automatically on daily syncs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">🧪</span>
                  <span>Monitors humidity and local UV readings to dynamic-adjust barrier-load ratios.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t border-emerald-500/10">
              <div>
                <span className="text-[9px] font-bold text-aura-muted uppercase block">Hardware Bundle Promotion</span>
                <span className="text-xl font-bold text-emerald-400 font-display">$149 <span className="text-xs text-aura-muted font-normal">+ $49/mo</span></span>
              </div>
              <button 
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 shadow-glow-green"
                onClick={() => alert("Pre-order cartridge bundle successfully queued!")}
              >
                Pre-order Smart Dispenser
              </button>
            </div>
          </div>

          {/* Actives Recommendations list */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Prescribed Active Therapeutics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customFormulaState.recommendations.map((ing: any) => (
                <div key={ing.id} className="p-4 rounded-xl border border-aura-border bg-black/20 hover:border-purple-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{ing.icon}</span>
                        <span className="font-bold text-sm text-white truncate">{ing.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                        {ing.concentration}
                      </span>
                    </div>
                    <p className="text-xs text-aura-muted leading-relaxed mb-4">{ing.mechanism}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ing.benefits.slice(0, 2).map((b: string) => (
                      <span key={b} className="text-[9px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risks & conflicts warning block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customFormulaState.interactions.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
                <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-1.5">Ingredient Interactions</h5>
                  <ul className="list-disc pl-4 text-xs text-aura-muted flex flex-col gap-1.5 m-0">
                    {customFormulaState.interactions.map((int: string, i: number) => <li key={i}>{int}</li>)}
                  </ul>
                </div>
              </div>
            )}
            {customFormulaState.risks.length > 0 && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-3">
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1.5">Usage Risks & Precautions</h5>
                  <ul className="list-disc pl-4 text-xs text-aura-muted flex flex-col gap-1.5 m-0">
                    {customFormulaState.risks.map((risk: string, i: number) => <li key={i}>{risk}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>

        </section>
      )}

      {/* Routine Planner */}
      <section className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient mb-8">
        <div className="flex items-center gap-3 border-b border-aura-border pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-glow-secondary">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Clinical Routine Schedule</h3>
            <p className="text-xs text-aura-muted">Personalized AM, PM, and treatment sequences</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-black/45 rounded-xl border border-aura-border max-w-md mb-6">
          {(['morning', 'night', 'weekly', 'monthly'] as const).map(tab => (
            <button
              key={tab}
              className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all duration-300 no-lift ${
                routineTab === tab
                  ? 'bg-purple-600 text-white shadow-glow-secondary'
                  : 'text-aura-muted hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setRoutineTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Routine Steps */}
        <div className="flex flex-col gap-4">
          {routineTab === 'weekly' ? (
            routine.weekly.map((step: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-aura-border bg-black/20 flex gap-4 items-start">
                <div className="w-12 py-1 rounded bg-purple-500/10 border border-purple-500/25 flex flex-col items-center justify-center text-purple-400 font-bold text-xs">
                  {step.day.substring(0, 3)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{step.treatment}</h4>
                    <span className="text-[10px] text-aura-muted font-mono">{step.duration}</span>
                  </div>
                  <p className="text-xs text-purple-400 mb-1.5 font-semibold">{step.product}</p>
                  <p className="text-xs text-aura-muted leading-relaxed m-0">{step.why}</p>
                </div>
              </div>
            ))
          ) : routineTab === 'monthly' ? (
            routine.monthly.map((step: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-aura-border bg-black/20 flex gap-4 items-start">
                <div className="w-12 py-1 rounded bg-cyan-500/10 border border-cyan-500/25 flex flex-col items-center justify-center text-cyan-400 font-bold text-xs text-center leading-none">
                  Cycle
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{step.treatment}</h4>
                    <span className="text-[10px] text-aura-muted font-mono">{step.cycle}</span>
                  </div>
                  <p className="text-xs text-cyan-400 mb-1.5 font-semibold">{step.product}</p>
                  <p className="text-xs text-aura-muted leading-relaxed m-0">{step.why}</p>
                </div>
              </div>
            ))
          ) : (
            (routine[routineTab] as SkincareRoutineItem[]).map((step: SkincareRoutineItem) => (
              <div key={step.step} className="p-4 rounded-xl border border-aura-border bg-black/20 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-aura-border flex items-center justify-center text-xs font-bold text-purple-400">
                  {step.step}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{step.productType}</h4>
                    <span className="text-[10px] text-aura-muted font-mono">{step.duration}</span>
                  </div>
                  <p className="text-xs text-purple-400 mb-1.5 font-semibold">{step.product}</p>
                  <p className="text-xs text-aura-muted leading-relaxed mb-3 m-0">{step.why}</p>
                  {step.tip && (
                    <div className="p-2.5 rounded bg-black/30 border border-aura-border/40 text-[10px] text-aura-muted flex items-start gap-2">
                      <Lightbulb size={12} className="text-yellow-400 shrink-0 mt-0.5" />
                      <span>{step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Outcome Simulator CTA banner */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/10 via-purple-950/10 to-teal-950/10 border border-teal-500/25 glass-gradient flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-teal-950/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-glow-primary flex-shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Outcome & Aging Trajectory Simulator</h4>
            <p className="text-xs text-aura-muted mt-0.5">Simulate stress, sleep, and compliance scenarios to forecast your 30-day dermal recovery curve.</p>
          </div>
        </div>
        <button 
          className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 shadow-glow-primary flex items-center gap-1.5 self-stretch md:self-auto justify-center"
          onClick={() => navigate('/simulator')}
        >
          Launch Simulator <ArrowRight size={16} />
        </button>
      </section>

      {/* Holographic Card Modal */}
      {showAuraCard && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center z-[1000] p-4 animate-fadeIn">
          {/* Close button */}
          <button 
            onClick={() => { setShowAuraCard(false); setCardFlipped(false); }}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/40 border border-white/10 hover:border-white/20 text-white transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white/10"
          >
            <X size={20} />
          </button>

          {/* Interactive Card */}
          <div className="relative w-[320px] h-[450px] [perspective:1000px] mb-8 group">
            <div 
              className={`relative w-full h-full duration-700 [transform-style:preserve-3d] cursor-pointer ${
                cardFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
              onClick={() => setCardFlipped(!cardFlipped)}
            >
              {/* Card Front */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl bg-gradient-to-br from-purple-600/30 via-teal-500/20 to-pink-500/30 border border-white/15 p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
                <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 animate-pulse" />
                <div className="flex justify-between items-center text-[9px] font-mono text-aura-muted">
                  <span className="flex items-center gap-1"><Sparkle size={10} className="text-purple-400" /> AURA PASSPORT</span>
                  <span>#{result.skinPassportId.split('-').pop()}</span>
                </div>

                <div className="flex flex-col items-center gap-2 py-8 relative">
                  {/* Glowing background aura */}
                  <div className={`absolute w-36 h-36 rounded-full blur-[40px] opacity-40 animate-pulse ${
                    skinHealth.overallScore > 75 ? 'bg-cyan-500' : 'bg-purple-500'
                  }`} />
                  <span className="text-6xl font-extrabold text-white tracking-tight relative drop-shadow-md">
                    {beautyScore}
                  </span>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest relative">Aura Index Score</span>
                  <span className="text-[9px] text-aura-muted font-mono mt-1">Status: Optimized ✓</span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center text-[10px] mb-3">
                    <span className="text-aura-muted font-mono uppercase">Archetype:</span>
                    <span className="font-bold text-white">{skinHealth.overallScore > 75 ? 'GLOW HYBRID' : 'BARRIER SHIELD'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[8px] text-aura-muted block font-mono">HYDRATION</span>
                      <span className="font-bold text-cyan-400">{skinHealth.hydrationScore}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-aura-muted block font-mono">ACNE RISK</span>
                      <span className="font-bold text-red-400">{skinHealth.acneRiskScore}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-aura-muted block font-mono">AGE RISK</span>
                      <span className="font-bold text-amber-400">{skinHealth.agingRiskScore}</span>
                    </div>
                  </div>
                  <div className="text-[8px] text-center text-aura-muted/60 mt-4">
                    Tap to view compound matrix 🔄
                  </div>
                </div>
              </div>

              {/* Card Back */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-gradient-to-br from-black to-zinc-950 border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center text-[9px] font-mono text-aura-muted">
                  <span className="flex items-center gap-1"><FlaskConical size={10} className="text-emerald-400" /> SYNTESIZED COMPLEX</span>
                  <span>REV: 2.4.0</span>
                </div>

                <div className="flex-grow py-6 flex flex-col justify-center gap-3">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">Active Formula Dosage</span>
                    {customFormulaState.customFormula.compounds.map((c: any, i: number) => (
                      <div key={i} className="flex justify-between text-gray-200 py-0.5">
                        <span>{c.name}</span>
                        <span className="font-bold text-emerald-400 font-mono">{c.percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px]">
                    <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-2">Biosensors Readings</span>
                    <div className="flex justify-between py-0.5 text-aura-muted">
                      <span>UV Index:</span>
                      <span className="text-white font-semibold">Moderate (4.2)</span>
                    </div>
                    <div className="flex justify-between py-0.5 text-aura-muted">
                      <span>Ambient Humidity:</span>
                      <span className="text-white font-semibold">68%</span>
                    </div>
                    <div className="flex justify-between py-0.5 text-aura-muted">
                      <span>Sync Status:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 size={10} /> Linked</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[8px] text-center text-aura-muted/60 mb-2">
                    Tap to view Aura Score 🔄
                  </div>
                  <div className="text-[8px] font-mono text-center border-t border-white/5 pt-2 text-aura-muted/80 uppercase tracking-wider">
                    Aura Operating System • Hardware Enabled
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="flex gap-4 w-full max-w-[320px]">
            <button 
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 shadow-glow-secondary"
              onClick={() => alert("Selfie Trading Card downloaded to photos!")}
            >
              Download Card Image
            </button>
            <button 
              className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold rounded-xl text-xs transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5"
              onClick={() => alert("Copied unique URL share token to clipboard!")}
            >
              Copy Link
            </button>
          </div>

        </div>
      )}

      {/* Formulation Sandbox Modal */}
      {showSandbox && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[1000] p-4 animate-fadeIn text-white">
          <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 relative animate-scaleIn">
            
            <button 
              onClick={() => setShowSandbox(false)}
              className="absolute top-4 right-4 text-aura-muted hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <X size={18} />
            </button>

            <div className="flex gap-3 items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FlaskConical size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold">Compound Formulation Sandbox</h3>
                <p className="text-xs text-aura-muted mt-0.5">Manually adjust active dosage ratios</p>
              </div>
            </div>

            {/* Safety Score meter */}
            <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-4 mb-6">
              <div className="text-center">
                <span className={`text-xl font-bold font-mono ${
                  safetyScore >= 80 ? 'text-emerald-400' : safetyScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {safetyScore}%
                </span>
                <span className="text-[8px] text-aura-muted uppercase tracking-widest block font-bold mt-0.5">Safety</span>
              </div>
              <div className="flex-grow">
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      safetyScore >= 80 ? 'bg-emerald-500' : safetyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${safetyScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-aura-muted block mt-1.5">
                  {safetyScore >= 80 ? '✓ Optimized safety parameters.' : safetyScore >= 60 ? '⚠ Elevated caution: Check conflicts.' : '☠ Extreme caution: Unsafe active dosing.'}
                </span>
              </div>
            </div>

            {/* Compound Sliders */}
            <div className="flex flex-col gap-4 mb-6">
              {sandboxCompounds.map((comp, idx) => {
                const isVitaminC = comp.name === 'Vitamin C';
                const isRetinol = comp.name === 'Retinol';
                const max = isVitaminC ? 20 : isRetinol ? 2 : 5;
                const step = isRetinol ? 0.1 : 0.5;

                return (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-300">{comp.name}</span>
                      <span className="text-emerald-400 font-mono">{comp.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min={0.1}
                        max={max}
                        step={step}
                        value={comp.percentage} 
                        onChange={e => updateSandboxCompound(idx, parseFloat(e.target.value))}
                        className="flex-grow h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <span className="text-[10px] text-aura-muted font-mono w-8 text-right">Max {max}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warnings list */}
            {safetyAlerts.length > 0 && (
              <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg flex flex-col gap-1.5 mb-6 max-h-[100px] overflow-y-auto">
                {safetyAlerts.map((alt, i) => (
                  <div key={i} className="text-[10px] text-red-300 flex items-start gap-1">
                    <span className="text-red-400 font-bold shrink-0">⚠</span>
                    <span>{alt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Sandbox footer actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button 
                className="px-4 py-2 border border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 bg-black/20"
                onClick={() => setShowSandbox(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:opacity-50 shadow-glow-green"
                onClick={saveSandboxFormula}
                disabled={safetyScore < 40}
              >
                Synthesize Formula
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
