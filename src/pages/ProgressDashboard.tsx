import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { generateMockProgress, generateHeatmapData, ACHIEVEMENTS, ProgressHistoryEntry } from '../data/mockProgress';
import TrendSparkline from '../components/charts/TrendSparkline';
import { Award, Flame, Calendar as CalendarIcon, TrendingUp, History, Lock, X } from 'lucide-react';

interface TrendCardProps {
  title: string;
  dataKey: 'beauty' | 'skin' | 'hair';
  color: string;
  data: ProgressHistoryEntry[];
}

const TrendCard = ({ title, dataKey, color, data }: TrendCardProps) => {
  const current = data[0][dataKey];
  const prev = data[1]?.[dataKey] || current;
  const delta = current - prev;
  
  return (
    <div className="p-5 rounded-2xl border border-aura-border bg-aura-panel glass-gradient">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-aura-muted mb-1">{title}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white leading-none">{current}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              delta >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {delta > 0 ? '+' : ''}{delta}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2">
        {/* Reverse array so chart goes past -> present (left to right) */}
        <TrendSparkline data={[...data].reverse()} dataKey={dataKey} color={color} />
      </div>
    </div>
  );
};

export default function ProgressDashboard() {
  const navigate = useNavigate();
  const { state, dispatch } = useAura();
  const result = state.analysisResult;
  const [history, setHistory] = useState<ProgressHistoryEntry[]>([]);
  const [heatmap, setHeatmap] = useState<number[]>([]);

  // Modal states for browsing past scans
  const [showPastModal, setShowPastModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ProgressHistoryEntry | null>(null);

  const handleRowClick = (record: ProgressHistoryEntry) => {
    setSelectedRecord(record);
    setShowPastModal(true);
  };

  const restorePastReport = (record: ProgressHistoryEntry) => {
    if (!result) return;
    const newResult = {
      ...result,
      beautyScore: record.beauty,
      skinHealth: {
        ...result.skinHealth,
        overallScore: record.skin,
        hydrationScore: Math.min(100, Math.round(record.skin * 0.98)),
        acneRiskScore: Math.min(100, Math.round((100 - record.skin) * 1.02)),
        uvDamageScore: Math.min(100, Math.round((100 - record.skin) * 0.95)),
        agingRiskScore: Math.min(100, Math.round((100 - record.skin) * 1.05)),
        measurements: {
          ...result.skinHealth.measurements,
          acne: Math.min(100, Math.round(record.skin * 0.95)),
          pigmentation: Math.min(100, Math.round(record.skin * 1.05)),
          redness: Math.min(100, Math.round(record.skin * 0.98)),
          oiliness: Math.min(100, Math.round(record.skin * 1.02)),
          dryness: Math.min(100, Math.round(record.skin * 0.97)),
        }
      },
      timestamp: new Date(record.date + ", " + new Date().getFullYear()).toLocaleDateString()
    };
    dispatch({ type: 'SET_ANALYSIS_RESULT', payload: newResult });
    setShowPastModal(false);
  };

  useEffect(() => {
    if (result) {
      setHistory(generateMockProgress(result));
      setHeatmap(generateHeatmapData());
    }
  }, [result]);

  if (!result || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <History size={48} className="text-purple-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostic History Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to load the history database.
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display font-display">Beauty Progress Tracking</h1>
          <p className="text-sm text-aura-muted mt-1">Monitor historical skin indices, routine compliance, and achievement milestones.</p>
        </div>
        <div className="flex items-center gap-3 bg-aura-panel border border-yellow-500/30 px-4 py-2.5 rounded-xl shadow-glow-cyan">
          <Flame size={20} className="text-yellow-500 animate-pulse" />
          <div>
            <div className="text-[9px] font-bold text-aura-muted uppercase tracking-wider leading-none mb-1">Current Streak</div>
            <div className="text-base font-bold text-yellow-500 leading-none">12 Days</div>
          </div>
        </div>
      </header>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <TrendCard title="Overall Skin Index" dataKey="beauty" color="#8b5cf6" data={history} />
        <TrendCard title="Epidermal Condition" dataKey="skin" color="#10b981" data={history} />
        <TrendCard title="Scalp & Hair Health" dataKey="hair" color="#06b6d4" data={history} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Heatmap & History List (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Consistency Heatmap */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-purple-400" />
                <h3 className="text-base font-bold text-white">Routine Consistency</h3>
              </div>
              <span className="text-[10px] font-mono text-aura-muted uppercase tracking-wider">Last 28 Days</span>
            </div>
            
            {/* Heatmap grid */}
            <div className="grid grid-cols-7 gap-2.5 mb-6">
              {heatmap.map((val, i) => {
                let cellColor = 'bg-white/5';
                if (val === 1) cellColor = 'bg-purple-900/20 text-purple-400';
                else if (val === 2) cellColor = 'bg-purple-800/40 text-purple-300';
                else if (val === 3) cellColor = 'bg-purple-600/60 text-purple-200';
                else if (val === 4) cellColor = 'bg-purple-500 text-white shadow-glow-secondary';

                return (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-md ${cellColor} transition-all duration-300`} 
                    title={`Adherence Score: ${val * 25}%`} 
                  />
                );
              })}
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-aura-muted font-bold">
              <span>Less Consistent</span>
              <div className="flex gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-white/5" />
                <div className="w-3.5 h-3.5 rounded bg-purple-950" />
                <div className="w-3.5 h-3.5 rounded bg-purple-900" />
                <div className="w-3.5 h-3.5 rounded bg-purple-700" />
                <div className="w-3.5 h-3.5 rounded bg-purple-500" />
              </div>
              <span>Highly Compliant</span>
            </div>
          </div>

          {/* Historical Scans list */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex-grow">
            <div className="flex items-center gap-2 mb-6">
              <History size={18} className="text-cyan-400" />
              <h3 className="text-base font-bold text-white">Historical Diagnostics Logs</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {history.slice(0, 4).map((record, i) => (
                <div 
                  key={i} 
                  onClick={() => handleRowClick(record)} 
                  className="flex justify-between items-center p-4 rounded-xl border border-aura-border bg-black/20 hover:border-purple-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-aura-border flex items-center justify-center font-bold text-sm text-purple-400 font-mono">
                      {record.beauty}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                        {i === 0 ? 'Current Telemetry scan' : `Dermatology scan log #${4 - i}`}
                      </h4>
                      <p className="text-[10px] text-aura-muted font-mono">{record.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition">
                    View
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Achievements (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-yellow-500" />
                <h3 className="text-base font-bold text-white">Achievement Vault</h3>
              </div>
              <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/25 px-2.5 py-1 rounded-full">
                {ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {ACHIEVEMENTS.map(ach => (
                <div 
                  key={ach.id} 
                  className={`p-3.5 rounded-xl border flex gap-3.5 items-start ${
                    ach.unlocked 
                      ? 'bg-black/25 border-yellow-500/20 text-white' 
                      : 'bg-black/10 border-aura-border/40 opacity-45'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-lg">
                      {ach.icon}
                    </div>
                    {!ach.unlocked && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-950 border border-aura-border flex items-center justify-center text-aura-muted">
                        <Lock size={8} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white leading-none mb-1">{ach.title}</h4>
                    <p className="text-[10px] text-aura-muted leading-relaxed m-0">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 border-t border-aura-border pt-6 text-center">
            <span className="text-[9px] font-bold text-aura-muted uppercase tracking-widest block mb-2">Next Badge Unlock Progress</span>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden w-full max-w-[240px] mx-auto border border-white/5">
              <div className="h-full bg-yellow-500 shadow-glow-cyan" style={{ width: '60%' }} />
            </div>
            <span className="text-[10px] font-bold text-yellow-500 block mt-2">60% to unlocking "Glow Royalty"</span>
          </div>
        </div>

      </div>

      {/* Historical Report Modal */}
      {showPastModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[1000] p-4 animate-fadeIn">
          
          <button 
            onClick={() => setShowPastModal(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/40 border border-white/10 hover:border-white/20 text-white transition"
          >
            <X size={18} />
          </button>

          <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 relative animate-scaleIn text-white">
            
            <div className="flex gap-3 items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <History size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold">Historical Diagnostics Report</h3>
                <p className="text-xs text-aura-muted mt-0.5">Recorded: {selectedRecord.date}</p>
              </div>
            </div>

            {/* Score Ring Display Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6 justify-items-center bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="text-center">
                <span className="text-xl font-bold font-mono text-purple-400 block">{selectedRecord.beauty}</span>
                <span className="text-[9px] text-aura-muted font-bold uppercase mt-1 block">Skin Score</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold font-mono text-emerald-400 block">{selectedRecord.skin}</span>
                <span className="text-[9px] text-aura-muted font-bold uppercase mt-1 block">Epidermal</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold font-mono text-cyan-400 block">{selectedRecord.hair}</span>
                <span className="text-[9px] text-aura-muted font-bold uppercase mt-1 block">Scalp</span>
              </div>
            </div>

            {/* Detail Stats */}
            <div className="flex flex-col gap-2.5 p-4 bg-black/40 border border-white/5 rounded-xl text-xs mb-6 text-aura-muted">
              <div className="flex justify-between">
                <span>Routine Adherence:</span>
                <span className="text-yellow-400 font-bold font-mono">{selectedRecord.routineAdherence}%</span>
              </div>
              <div className="flex justify-between">
                <span>Calibrated Active Formula:</span>
                <span className="text-emerald-400 font-bold font-mono">AURA-FORMULA-SEED</span>
              </div>
              <div className="flex justify-between">
                <span>Hardware Dispenser Sync:</span>
                <span className="text-cyan-400 font-bold font-mono">Completed ✓</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-end">
              <button 
                className="px-4 py-2 border border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-lg transition"
                onClick={() => setShowPastModal(false)}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition" 
                onClick={() => restorePastReport(selectedRecord)}
              >
                Restore Scan Data
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
