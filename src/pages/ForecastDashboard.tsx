import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { runOutcomePredictor } from '../services/aiEngine';
import ForecastLine from '../components/charts/ForecastLine';
import ProgressBar from '../components/ui/ProgressBar';
import { Calendar, Target, ShieldCheck, Zap, Activity, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  label: string;
  current: number;
  projected: number;
  color: string;
  borderColor: string;
}

const MetricCard = ({ label, current, projected, color, borderColor }: MetricCardProps) => {
  const delta = projected - current;
  return (
    <div className="p-5 rounded-xl border border-aura-border bg-aura-panel glass-gradient">
      <div className="text-[10px] font-bold uppercase tracking-wider text-aura-muted mb-3">{label}</div>
      <div className="flex items-end gap-3 mb-1">
        <div className={`text-3xl font-extrabold font-display leading-none ${color}`}>{projected}</div>
        <div className={`text-xs font-bold pb-0.5 ${delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-red-400' : 'text-aura-muted'}`}>
          {delta > 0 ? '+' : ''}{delta} from baseline ({current})
        </div>
      </div>
    </div>
  );
};

export default function ForecastDashboard() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;
  const [tab, setTab] = useState<'day30' | 'day60' | 'day90'>('day30');
  const [forecast, setForecast] = useState<any>(null);

  useEffect(() => {
    if (result) {
      const mockSkin = { overallScore: result.skinHealth.overallScore };
      const mockHair = { overallScore: 78 };
      setForecast(runOutcomePredictor(mockSkin, mockHair, result.profile, state.simulatorParams));
    }
  }, [result, state.profile, state.simulatorParams]);

  if (!result || !forecast) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <Calendar size={48} className="text-purple-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Skincare Scan Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to load the forecasting datasets.
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

  // Map tabs to indices
  const forecastKeyMap = {
    day30: 4, // index 4 is Day 28
    day60: 8, // index 8 is Day 56
    day90: 12 // index 12 is Day 84
  };

  const selectedIndex = forecastKeyMap[tab];
  const projectedOverall = forecast.chartData[selectedIndex].overall;
  const projectedSkin = forecast.chartData[selectedIndex].skin;
  const projectedHair = forecast.chartData[selectedIndex].hair;

  const baseData = {
    overallScore: forecast.current.overallScore,
    skinScore: forecast.current.overallScore, // baseline skin
    hairScore: 75 // baseline hair
  };

  const currentData = {
    overallScore: projectedOverall,
    skinScore: projectedSkin,
    hairScore: projectedHair,
    confidence: Math.round(92 - (selectedIndex * 1.2)) // slightly decaying confidence over time
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Page Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-3">
          <TrendingUp size={12} /> Predictive Diagnostics
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">AI outcome Forecast</h1>
        <p className="text-sm text-aura-muted mt-1">Projected beauty trajectory based on compliance models and active formulation matches.</p>
      </header>

      {/* Tab bar */}
      <div className="flex gap-2 p-1 bg-black/45 rounded-xl border border-aura-border max-w-md mb-8">
        {(['day30', 'day60', 'day90'] as const).map(t => (
          <button
            key={t}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              tab === t
                ? 'bg-purple-600 text-white shadow-glow-secondary'
                : 'text-aura-muted hover:text-white'
            }`}
            onClick={() => setTab(t)}
          >
            {t === 'day30' ? '30 Days' : t === 'day60' ? '60 Days' : '90 Days'}
          </button>
        ))}
      </div>

      {/* Grid: Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          label="Overall Skin Index" 
          current={baseData.overallScore} 
          projected={currentData.overallScore} 
          color="text-purple-400" 
          borderColor="border-purple-500/30"
        />
        <MetricCard 
          label="Epidermal Condition" 
          current={baseData.skinScore} 
          projected={currentData.skinScore} 
          color="text-emerald-400" 
          borderColor="border-emerald-500/30"
        />
        <MetricCard 
          label="Scalp & Hair" 
          current={baseData.hairScore} 
          projected={currentData.hairScore} 
          color="text-cyan-400" 
          borderColor="border-cyan-500/30"
        />
        
        {/* Forecast Confidence Card */}
        <div className="p-5 rounded-xl border border-aura-border bg-aura-panel glass-gradient flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-aura-muted mb-2">Model Confidence</div>
            <div className="text-2xl font-bold font-mono text-yellow-500 mb-3">{currentData.confidence}%</div>
          </div>
          <ProgressBar progress={currentData.confidence} colorClass="bg-yellow-500" />
        </div>
      </div>

      {/* Chart and Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Chart (7 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white">Projected Recovery Curve</h3>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded-full">
              Timeline: {tab === 'day30' ? '30 Days' : tab === 'day60' ? '60 Days' : '90 Days'}
            </span>
          </div>
          <div className="h-[300px] relative">
            <ForecastLine data={forecast.chartData.slice(0, selectedIndex + 1)} />
          </div>
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-aura-border">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-aura-muted">
              <span className="w-2.5 h-1 bg-purple-500 rounded-full" /> Overall Index
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-aura-muted">
              <span className="w-2.5 h-1 bg-emerald-500 rounded-full" /> Skin Index
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-aura-muted">
              <span className="w-2.5 h-1 bg-cyan-500 rounded-full" /> Hair Index
            </div>
          </div>
        </div>

        {/* Right: Milestones (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex-grow">
            <h3 className="text-base font-bold text-white mb-6">Projected Milestones</h3>
            <div className="flex flex-col gap-5">
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center shrink-0 text-purple-400">
                  <Target size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Sebum & Acne Stabilization</h4>
                  <p className="text-[11px] text-aura-muted leading-relaxed">
                    Localized breakouts will clear up near Day 14 as salicylic acid regulates pore lipid loads.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 text-emerald-400">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Barrier Restoration</h4>
                  <p className="text-[11px] text-aura-muted leading-relaxed">
                    Skin hydration and redness stabilize by Day 28, restoring compromised corneum defenses.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center shrink-0 text-cyan-400">
                  <Activity size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Cellular Radiance Shift</h4>
                  <p className="text-[11px] text-aura-muted leading-relaxed">
                    Melanocyte output normalizes by Day 60, resulting in optimal pigment tone homeostasis.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Compliance acceleration panel */}
          <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-950/10 shadow-glow-secondary">
            <div className="flex items-center gap-2 font-bold text-xs text-purple-300 mb-2">
              <Zap size={14} className="text-purple-400 animate-pulse" /> Accelerate Your Trajectory
            </div>
            <p className="text-[11px] text-aura-muted leading-relaxed mb-4">
              Your adherence is configured at {state.simulatorParams.routineAdherence}%. Increasing this parameter to 90%+ accelerates overall barrier recovery by an estimated 15 days.
            </p>
            <button 
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition"
              onClick={() => navigate('/simulator')}
            >
              Adjust Scenario Config
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
