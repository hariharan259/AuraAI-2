import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { ClipboardList, Sun, Moon, Calendar, Target, CheckSquare, Square, CheckCircle } from 'lucide-react';

export default function RoutinePlanner() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  // Track checked steps for AM and PM
  const [completedAM, setCompletedAM] = useState<Record<number, boolean>>({});
  const [completedPM, setCompletedPM] = useState<Record<number, boolean>>({});
  const [completedWeekly, setCompletedWeekly] = useState<Record<number, boolean>>({});

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <ClipboardList size={48} className="text-emerald-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to configure your skincare routine.
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

  const routine = result.routine;

  // Toggle step completeness
  const toggleAM = (step: number) => {
    setCompletedAM(prev => ({ ...prev, [step]: !prev[step] }));
  };

  const togglePM = (step: number) => {
    setCompletedPM(prev => ({ ...prev, [step]: !prev[step] }));
  };

  const toggleWeekly = (idx: number) => {
    setCompletedWeekly(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Calculate current completion percentage
  const totalSteps = routine.morning.length + routine.night.length;
  const completedSteps = Object.values(completedAM).filter(Boolean).length + Object.values(completedPM).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Page Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            <ClipboardList size={12} /> AI Routine Engine
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display">AI Routine Planner</h1>
          <p className="text-sm text-aura-muted mt-1">Bespoke daily and weekly cellular skincare routines matching your exact analysis results.</p>
        </div>

        {/* Adherence Progress */}
        <div className="p-4 rounded-xl border border-aura-border bg-aura-panel glass-gradient w-full md:w-64">
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="text-aura-muted">Today's Adherence</span>
            <span className="text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-black/45 rounded-full overflow-hidden mb-1">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[9px] text-aura-muted">Check off completed steps to log compliance history.</span>
        </div>
      </header>

      {/* Routine Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Morning Routine (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <div className="flex items-center gap-2 mb-6 border-b border-aura-border pb-3">
            <Sun size={20} className="text-amber-400 animate-spin" style={{ animationDuration: '40s' }} />
            <h3 className="text-base font-bold text-white">Morning Routine</h3>
            <span className="text-xs text-aura-muted ml-auto">{routine.morning.length} Steps</span>
          </div>

          <div className="flex flex-col gap-4">
            {routine.morning.map((item, idx) => {
              const isChecked = !!completedAM[item.step];
              return (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border transition-all duration-300 flex gap-4 ${isChecked ? 'bg-emerald-950/10 border-emerald-500/25 opacity-70' : 'bg-black/30 border-aura-border'}`}
                >
                  <button 
                    onClick={() => toggleAM(item.step)}
                    className={`shrink-0 self-start mt-0.5 text-xl transition ${isChecked ? 'text-emerald-400' : 'text-aura-muted hover:text-white'}`}
                  >
                    {isChecked ? <CheckCircle size={20} /> : <Square size={20} />}
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-xs font-bold ${isChecked ? 'line-through text-aura-muted' : 'text-white'}`}>
                        Step {item.step}: {item.productType}
                      </h4>
                      <span className="text-[10px] text-aura-muted bg-black/20 px-2 py-0.5 rounded-full border border-white/5 font-mono">
                        {item.duration}
                      </span>
                    </div>
                    <div className="text-xs text-white/80 font-medium mb-1">{item.product}</div>
                    <p className="text-[11px] text-aura-muted leading-relaxed mb-2">{item.why}</p>
                    <div className="text-[10px] font-medium text-emerald-400/90 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-md">
                      💡 {item.tip}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Night Routine (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <div className="flex items-center gap-2 mb-6 border-b border-aura-border pb-3">
            <Moon size={20} className="text-purple-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">Night Routine</h3>
            <span className="text-xs text-aura-muted ml-auto">{routine.night.length} Steps</span>
          </div>

          <div className="flex flex-col gap-4">
            {routine.night.map((item, idx) => {
              const isChecked = !!completedPM[item.step];
              return (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border transition-all duration-300 flex gap-4 ${isChecked ? 'bg-emerald-950/10 border-emerald-500/25 opacity-70' : 'bg-black/30 border-aura-border'}`}
                >
                  <button 
                    onClick={() => togglePM(item.step)}
                    className={`shrink-0 self-start mt-0.5 text-xl transition ${isChecked ? 'text-emerald-400' : 'text-aura-muted hover:text-white'}`}
                  >
                    {isChecked ? <CheckCircle size={20} /> : <Square size={20} />}
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-xs font-bold ${isChecked ? 'line-through text-aura-muted' : 'text-white'}`}>
                        Step {item.step}: {item.productType}
                      </h4>
                      <span className="text-[10px] text-aura-muted bg-black/20 px-2 py-0.5 rounded-full border border-white/5 font-mono">
                        {item.duration}
                      </span>
                    </div>
                    <div className="text-xs text-white/80 font-medium mb-1">{item.product}</div>
                    <p className="text-[11px] text-aura-muted leading-relaxed mb-2">{item.why}</p>
                    <div className="text-[10px] font-medium text-purple-400/90 bg-purple-500/5 border border-purple-500/10 px-2.5 py-1 rounded-md">
                      💡 {item.tip}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Weekly & Monthly Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly Treatment Schedule (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <div className="flex items-center gap-2 mb-6 border-b border-aura-border pb-3">
            <Calendar size={18} className="text-cyan-400" />
            <h3 className="text-base font-bold text-white">Weekly Intensive Treatments</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routine.weekly?.map((weekItem, idx) => {
              const isChecked = !!completedWeekly[idx];
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col gap-2 transition ${isChecked ? 'bg-emerald-950/10 border-emerald-500/25 opacity-70' : 'bg-black/35 border-aura-border'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">{weekItem.day}</span>
                    <button 
                      onClick={() => toggleWeekly(idx)}
                      className="text-xs font-bold text-aura-muted hover:text-white"
                    >
                      {isChecked ? 'Completed' : 'Mark Done'}
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-white">{weekItem.treatment}</h4>
                  <div className="text-[11px] text-white/90">{weekItem.product} ({weekItem.duration})</div>
                  <p className="text-[10px] text-aura-muted leading-relaxed mt-1">{weekItem.why}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Goals (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col gap-5">
          <div className="flex items-center gap-2 mb-2 border-b border-aura-border pb-3">
            <Target size={18} className="text-pink-400" />
            <h3 className="text-base font-bold text-white">Monthly Goals & Focus</h3>
          </div>

          <div className="flex flex-col gap-4">
            {routine.monthly?.map((monthItem, idx) => (
              <div key={idx} className="flex gap-4 p-3 rounded-xl bg-black/20 border border-aura-border">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/25 flex items-center justify-center shrink-0 text-xs font-bold text-pink-400">
                  W{idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{monthItem.treatment}</h4>
                  <div className="text-[10px] text-pink-300 font-mono mb-1">{monthItem.cycle}</div>
                  <p className="text-[10px] text-aura-muted leading-relaxed">{monthItem.why}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
