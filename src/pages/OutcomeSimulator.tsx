import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { runOutcomePredictor } from '../services/aiEngine';
import ForecastLine from '../components/charts/ForecastLine';
import ScoreRing from '../components/ui/ScoreRing';
import { 
  Sliders, Moon, Droplets, Wind, Activity, ArrowRight, 
  Save, TrendingUp, AlertCircle, Sparkles, RefreshCw 
} from 'lucide-react';
import { SimulatorParams } from '../types';

export default function OutcomeSimulator() {
  const navigate = useNavigate();
  const { state, dispatch } = useAura();
  const result = state.analysisResult;
  const { simulatorParams } = state;

  const [localParams, setLocalParams] = useState<SimulatorParams>(simulatorParams);
  const [forecast, setForecast] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Before/After comparison slider state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let clientX: number | undefined;
    
    if ('touches' in e) {
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
      }
    } else {
      clientX = e.clientX;
    }
    
    if (clientX === undefined) return;
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    handleMouseMove(e);
  };

  // Add touchmove/mousemove window listeners for smoother dragging outside boundaries
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    
    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('touchmove', handleGlobalMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Initialize forecast
  useEffect(() => {
    if (result) {
      // Simulate base skin and hair indices
      const mockSkin = { overallScore: result.skinHealth.overallScore };
      const mockHair = { overallScore: 78 };
      setForecast(runOutcomePredictor(mockSkin, mockHair, result.profile, localParams));
    }
  }, [result]); // eslint-disable-line

  if (!result || !forecast) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <Sliders size={48} className="text-purple-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Skincare Scan Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to load the simulator datasets.
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

  const updateParam = (field: keyof SimulatorParams, val: number) => {
    setLocalParams(prev => ({ ...prev, [field]: val }));
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const mockSkin = { overallScore: result.skinHealth.overallScore };
      const mockHair = { overallScore: 78 };
      setForecast(runOutcomePredictor(mockSkin, mockHair, result.profile, localParams));
      setIsSimulating(false);
    }, 600);
  };

  const handleSave = () => {
    dispatch({ type: 'SET_SIMULATOR_PARAMS', payload: localParams });
    navigate('/forecast');
  };

  const getImpactLabel = (field: keyof SimulatorParams) => {
    if (!result.profile) return 'Neutral';
    
    // Baseline mapping
    let base = 0;
    if (field === 'sleepHours') base = result.profile.sleepHours;
    else if (field === 'waterIntake') base = result.profile.waterIntake;
    else if (field === 'stressLevel') base = result.profile.stressLevel;
    else if (field === 'routineAdherence') base = 50; // midpoint baseline

    const current = localParams[field];
    if (field === 'routineAdherence') {
      return current > 50 ? 'Positive' : current < 50 ? 'Negative' : 'Neutral';
    }
    if (field === 'stressLevel') {
      return current < base ? 'Positive' : current > base ? 'Negative' : 'Neutral';
    }
    return current > base ? 'Positive' : current < base ? 'Negative' : 'Neutral';
  };

  const impactColor = (field: keyof SimulatorParams) => {
    const label = getImpactLabel(field);
    return label === 'Positive' ? 'text-emerald-400' : label === 'Negative' ? 'text-red-400' : 'text-aura-muted';
  };

  const baseScore = forecast.current.overallScore;
  const projectedScore = forecast.day90.overallScore;
  const delta = projectedScore - baseScore;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-3">
            <TrendingUp size={12} /> Predictive Bio-Simulator
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display">Outcome Trajectory Simulator</h1>
          <p className="text-sm text-aura-muted mt-1">Calibrate compliance variables and visualize projected day 90 barrier improvements.</p>
        </div>
        <div className="flex gap-3 self-stretch sm:self-auto justify-end">
          <button 
            className="px-4 py-2 border border-aura-border hover:border-white/20 text-xs font-bold text-white hover:bg-white/5 rounded-xl transition"
            onClick={() => {
              if (result.profile) {
                setLocalParams({
                  sleepHours: result.profile.sleepHours,
                  waterIntake: result.profile.waterIntake,
                  stressLevel: result.profile.stressLevel,
                  routineAdherence: 80,
                  dietQuality: result.profile.dietQuality,
                  exerciseFreq: result.profile.exerciseFreq
                });
              }
            }}
          >
            Reset to Baseline
          </button>
          <button 
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition shadow-glow-primary flex items-center gap-1.5"
            onClick={handleSave}
          >
            <Save size={14} /> Save Config
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sliders Panel (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-aura-border">
            <Sliders size={18} className="text-purple-400" />
            <h3 className="text-base font-bold text-white">Scenario Parameters</h3>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Sleep Hours Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Moon size={14} className="text-purple-400" /> Sleep Hours / Night
                </span>
                <span className="font-mono text-purple-400">{localParams.sleepHours}h</span>
              </div>
              <input 
                type="range" 
                min={4} 
                max={10} 
                step={0.5} 
                value={localParams.sleepHours} 
                onChange={e => updateParam('sleepHours', Number(e.target.value))} 
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-aura-muted mt-1.5">
                <span>4h (Impairment)</span>
                <span className={`font-semibold ${impactColor('sleepHours')}`}>
                  {getImpactLabel('sleepHours')} Impact
                </span>
                <span>10h (Restorative)</span>
              </div>
            </div>

            {/* Water Intake Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Droplets size={14} className="text-cyan-400" /> Water Volume / Day
                </span>
                <span className="font-mono text-cyan-400">{localParams.waterIntake} Glasses</span>
              </div>
              <input 
                type="range" 
                min={2} 
                max={15} 
                step={1} 
                value={localParams.waterIntake} 
                onChange={e => updateParam('waterIntake', Number(e.target.value))} 
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-aura-muted mt-1.5">
                <span>2 Glasses</span>
                <span className={`font-semibold ${impactColor('waterIntake')}`}>
                  {getImpactLabel('waterIntake')} Impact
                </span>
                <span>15 Glasses</span>
              </div>
            </div>

            {/* Stress Level Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Wind size={14} className="text-red-400" /> Systemic Stress Index
                </span>
                <span className="font-mono text-red-400">{localParams.stressLevel}/10</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={10} 
                step={1} 
                value={localParams.stressLevel} 
                onChange={e => updateParam('stressLevel', Number(e.target.value))} 
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-aura-muted mt-1.5">
                <span>1 (Calm)</span>
                <span className={`font-semibold ${impactColor('stressLevel')}`}>
                  {getImpactLabel('stressLevel')} Impact
                </span>
                <span>10 (Severe)</span>
              </div>
            </div>

            {/* Routine Adherence Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Activity size={14} className="text-yellow-400" /> Routine Adherence
                </span>
                <span className="font-mono text-yellow-400">{localParams.routineAdherence}%</span>
              </div>
              <input 
                type="range" 
                min={10} 
                max={100} 
                step={10} 
                value={localParams.routineAdherence} 
                onChange={e => updateParam('routineAdherence', Number(e.target.value))} 
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <div className="flex justify-between text-[10px] text-aura-muted mt-1.5">
                <span>10% (Sporadic)</span>
                <span className={`font-semibold ${impactColor('routineAdherence')}`}>
                  {getImpactLabel('routineAdherence')} Impact
                </span>
                <span>100% (Strict)</span>
              </div>
            </div>

          </div>

          <button 
            className="w-full mt-8 py-3 bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-glow-primary transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            {isSimulating ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Recalibrating Forecast Models...
              </>
            ) : (
              <>
                <TrendingUp size={16} /> Compute Scenario Output
              </>
            )}
          </button>
        </div>

        {/* Right Column: Visual Before/After & Trajectory Forecast (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Top Panel: Split Selfie & Score Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Split Screen interactive selfie widget (7 cols) */}
            <div className="md:col-span-7 rounded-2xl border border-aura-border bg-black/40 overflow-hidden relative select-none" style={{ minHeight: '260px' }}>
              <div 
                ref={sliderRef}
                className="absolute inset-0 cursor-ew-resize w-full h-full"
                onMouseMove={handleMove}
                onTouchMove={handleMove}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
              >
                {isSimulating && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none">
                    <RefreshCw size={24} className="text-teal-400 animate-spin" />
                  </div>
                )}
                
                {/* Left Side Selfie - Baseline */}
                {state.photoUrl ? (
                  <img 
                    src={state.photoUrl} 
                    alt="Baseline Selfie" 
                    className="w-full h-full object-cover filter brightness-[0.8] saturate-[0.8] pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full bg-aura-panel flex items-center justify-center text-xs text-aura-muted">No scan photo loaded</div>
                )}
                <span className="absolute bottom-3 left-3 z-10 px-2 py-0.5 bg-black/75 border border-white/10 rounded text-[9px] font-mono text-aura-muted leading-none">
                  Baseline
                </span>

                {/* Right Side Selfie - Day 90 (Clipped) */}
                {state.photoUrl && (
                  <img 
                    src={state.photoUrl} 
                    alt="Projected Selfie" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{
                      clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                      filter: `
                        brightness(${100 + (delta * 1.5)}%) 
                        contrast(${100 + (delta * 0.8)}%) 
                        saturate(${100 + (delta * 2)}%) 
                        sepia(${delta < 0 ? Math.abs(delta) * 2 : 0}%)
                        blur(${delta < -5 ? 1 : 0}px)
                      `
                    }}
                  />
                )}
                <span className="absolute bottom-3 right-3 z-10 px-2.5 py-0.5 bg-teal-600/90 border border-teal-500/30 rounded text-[9px] font-mono text-white leading-none">
                  Day 90 Projected
                </span>

                {/* Split line divider */}
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)] z-10 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                />
                
                {/* Knob */}
                <div 
                  className="absolute top-1/2 w-8 h-8 rounded-full bg-zinc-950 border border-teal-400 shadow-glow-primary flex items-center justify-center text-[10px] text-white font-bold pointer-events-none z-10"
                  style={{ left: `${sliderPosition}%`, transform: 'translate(-50%, -50%)' }}
                >
                  ↔
                </div>
              </div>
            </div>

            {/* Score Rings (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              
              <div className="p-4 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col items-center justify-center flex-1 text-center">
                <span className="text-[10px] font-bold text-aura-muted uppercase tracking-wider mb-2">Baseline</span>
                <ScoreRing score={baseScore} size={85} label="" />
              </div>

              <div className="p-4 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col items-center justify-center flex-1 text-center relative overflow-hidden">
                <div className={`absolute inset-0 opacity-10 pointer-events-none ${delta >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-[10px] font-bold text-aura-muted uppercase tracking-wider mb-2">Day 90 Target</span>
                <ScoreRing score={projectedScore} size={85} label="" />
                
                <span className={`text-xs font-mono font-bold mt-2 ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {delta >= 0 ? `+${delta}` : delta} Score Change
                </span>
              </div>

            </div>

          </div>

          {/* Bottom Panel: Chart Trajectory */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-base font-bold text-white">Projected Dermal Trajectory</h4>
                <p className="text-[10px] text-aura-muted mt-0.5">Line map tracking progress over 90 days</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-aura-muted">
                  <span className="w-2.5 h-1 bg-purple-500 rounded-full" /> Overall Index
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-aura-muted">
                  <span className="w-2.5 h-1 bg-emerald-500 rounded-full" /> Skin Index
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-aura-muted">
                  <span className="w-2.5 h-1 bg-cyan-500 rounded-full" /> Hair Index
                </div>
              </div>
            </div>

            <div className="h-[250px] relative">
              <ForecastLine data={forecast.chartData} />
            </div>
          </div>

          {/* Warning label for negative trends */}
          {delta < 0 && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/25 flex gap-3 animate-pulse">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">Barrier Regression Warning</h5>
                <p className="text-xs text-aura-muted m-0">
                  Your simulated lifestyle parameter mix creates a negative trend. Increase sleep volume, water intake, or routine compliance to preserve barrier integrity.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
