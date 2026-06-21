import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import {
  Send, CheckCircle2, Flame, Smile, Frown, Meh,
  TrendingUp, TrendingDown, Minus, BookOpen, Plus, ArrowRight
} from 'lucide-react';

interface Mood {
  id: 'great' | 'okay' | 'bad';
  icon: React.ReactNode;
  label: string;
  color: string;
  borderColor: string;
  bgGlow: string;
}

const MOODS: Mood[] = [
  { id: 'great', icon: <Smile size={22} />, label: 'Great', color: 'text-emerald-400', borderColor: 'border-emerald-500/30', bgGlow: 'bg-emerald-500/10' },
  { id: 'okay', icon: <Meh size={22} />, label: 'Okay', color: 'text-yellow-400', borderColor: 'border-yellow-500/30', bgGlow: 'bg-yellow-500/10' },
  { id: 'bad', icon: <Frown size={22} />, label: 'Rough', color: 'text-red-400', borderColor: 'border-red-500/30', bgGlow: 'bg-red-500/10' },
];

const SKIN_FEELINGS = [
  'Hydrated', 'Oily', 'Dry', 'Itchy', 'Sensitive', 'Balanced', 'Glowing', 'Dull', 'Tight', 'Irritated'
];

const QUICK_TAGS = [
  { label: '☀️ Wore SPF', id: 'spf' },
  { label: '💧 Drank 8 glasses', id: 'water' },
  { label: '😴 8h sleep', id: 'sleep' },
  { label: '🥗 Ate clean', id: 'clean_eat' },
  { label: '🏃 Exercised', id: 'exercise' },
  { label: '🧴 AM Routine', id: 'am_routine' },
  { label: '🌙 PM Routine', id: 'pm_routine' },
  { label: '🧘 Low stress', id: 'low_stress' },
];

interface JournalInsight {
  type: 'positive' | 'warning' | 'info';
  text: string;
}

function generateJournalInsight(entry: { mood: string | null; skinFeelings: string[]; tags: string[]; note: string }) {
  const insights: JournalInsight[] = [];
  if (entry.tags.includes('spf') && entry.tags.includes('am_routine')) {
    insights.push({ type: 'positive', text: 'Perfect AM combo! SPF + routine = maximum photoprotection today. 🌟' });
  }
  if (entry.tags.includes('sleep') && entry.tags.includes('pm_routine')) {
    insights.push({ type: 'positive', text: 'Full recovery cycle tonight. Night routine + 8h sleep triggers peak skin repair.' });
  }
  if (entry.mood === 'bad' && entry.tags.includes('low_stress')) {
    insights.push({ type: 'info', text: 'Skin can feel rough even on low-stress days. Check hydration levels.' });
  }
  if (entry.skinFeelings.includes('Oily') && !entry.tags.includes('clean_eat')) {
    insights.push({ type: 'warning', text: 'High sebum often correlates with diet. Try logging meals for 3 days.' });
  }
  if (entry.skinFeelings.includes('Hydrated')) {
    insights.push({ type: 'positive', text: 'Hydration signals are strong! Your barrier is functioning well today.' });
  }
  if (insights.length === 0) {
    insights.push({ type: 'info', text: 'Keep logging daily. Patterns emerge after 7 entries and drive smarter AI analysis.' });
  }
  return insights;
}

interface HistoricalEntry {
  date: string;
  mood: 'great' | 'okay' | 'bad';
  score: number;
  skinFeelings: string[];
  tags: string[];
}

function getMockHistory(): HistoricalEntry[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { date: new Date(now - day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'great', score: 82, skinFeelings: ['Hydrated', 'Glowing'], tags: ['spf', 'water', 'am_routine', 'pm_routine'] },
    { date: new Date(now - 2 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'okay', score: 76, skinFeelings: ['Balanced'], tags: ['am_routine', 'exercise'] },
    { date: new Date(now - 3 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'bad', score: 68, skinFeelings: ['Dry', 'Tight'], tags: ['pm_routine'] },
    { date: new Date(now - 4 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'great', score: 80, skinFeelings: ['Hydrated'], tags: ['spf', 'water', 'sleep', 'am_routine', 'pm_routine', 'low_stress'] },
    { date: new Date(now - 5 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'okay', score: 74, skinFeelings: ['Oily', 'Balanced'], tags: ['am_routine', 'clean_eat'] },
    { date: new Date(now - 6 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'great', score: 79, skinFeelings: ['Glowing'], tags: ['spf', 'exercise', 'sleep'] },
  ];
}

export default function SkinJournal() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [step, setStep] = useState<'check' | 'insights' | 'history'>('check');
  const [entry, setEntry] = useState<{
    mood: 'great' | 'okay' | 'bad' | null;
    skinFeelings: string[];
    tags: string[];
    note: string;
    submitted: boolean;
  }>({
    mood: null,
    skinFeelings: [],
    tags: [],
    note: '',
    submitted: false,
  });
  const [insights, setInsights] = useState<JournalInsight[]>([]);
  const [history] = useState<HistoricalEntry[]>(getMockHistory());
  const [streak] = useState(7);
  const [showNoteInput, setShowNoteInput] = useState(false);

  const toggleFeeling = (f: string) => {
    setEntry(e => ({
      ...e,
      skinFeelings: e.skinFeelings.includes(f) ? e.skinFeelings.filter(x => x !== f) : [...e.skinFeelings, f]
    }));
  };

  const toggleTag = (id: string) => {
    setEntry(e => ({
      ...e,
      tags: e.tags.includes(id) ? e.tags.filter(x => x !== id) : [...e.tags, id]
    }));
  };

  const handleSubmit = () => {
    const generatedInsights = generateJournalInsight(entry);
    setInsights(generatedInsights);
    setEntry(e => ({ ...e, submitted: true }));
    setStep('insights');
  };

  const canSubmit = entry.mood && entry.skinFeelings.length > 0;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <BookOpen size={48} className="text-purple-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">Skin Journal Closed</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to unlock daily skin tracking.
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 mb-3">
            <Flame size={12} /> {streak}-Day Journal Streak
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display font-display">Daily Skin Journal</h1>
          <p className="text-sm text-aura-muted mt-1">{today}</p>
        </div>
        <div className="flex gap-3 self-stretch sm:self-auto justify-end">
          <button
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              step === 'check' || step === 'insights'
                ? 'bg-purple-600 text-white shadow-glow-secondary'
                : 'border border-aura-border text-aura-muted hover:text-white'
            }`}
            onClick={() => setStep('check')}
          >
            Today's Check-in
          </button>
          <button
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              step === 'history'
                ? 'bg-purple-600 text-white shadow-glow-secondary'
                : 'border border-aura-border text-aura-muted hover:text-white'
            }`}
            onClick={() => setStep('history')}
          >
            <BookOpen size={14} /> History Log
          </button>
        </div>
      </header>

      {/* Today Check-in view */}
      {step === 'check' && !entry.submitted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Mood selector */}
            <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <h4 className="text-sm font-bold text-white mb-4">How does your skin look & feel today?</h4>
              <div className="grid grid-cols-3 gap-3">
                {MOODS.map(m => {
                  const isSelected = entry.mood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setEntry(e => ({ ...e, mood: m.id }))}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 font-bold text-xs transition-all duration-300 ${
                        isSelected 
                          ? `${m.borderColor} ${m.bgGlow} ${m.color} shadow-glow-primary scale-[1.02]` 
                          : 'border-aura-border bg-black/20 text-aura-muted hover:border-aura-border/80'
                      }`}
                    >
                      <div className={isSelected ? m.color : 'text-gray-400'}>{m.icon}</div>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skin Feelings tag selector */}
            <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <h4 className="text-sm font-bold text-white mb-4">Active Skin Characteristics</h4>
              <div className="flex flex-wrap gap-2.5">
                {SKIN_FEELINGS.map(f => {
                  const isSelected = entry.skinFeelings.includes(f);
                  return (
                    <button
                      key={f}
                      onClick={() => toggleFeeling(f)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                        isSelected 
                          ? 'bg-purple-600 text-white shadow-glow-secondary' 
                          : 'bg-black/20 border border-aura-border text-aura-muted hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Personal Note */}
            <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              {!showNoteInput ? (
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="w-full py-3.5 border border-dashed border-aura-border hover:border-purple-500/40 rounded-xl text-xs font-semibold text-aura-muted hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Append Personal Daily Log Note...
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">Journal Daily Note</label>
                  <textarea
                    placeholder="e.g. Cleared flare-up on right cheek. Drank plenty of liquids today. Skin feels balanced..."
                    value={entry.note}
                    onChange={e => setEntry(prev => ({ ...prev, note: e.target.value }))}
                    rows={3}
                    className="w-full bg-black/45 border border-aura-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              )}
            </div>

            <button
              className="py-4 bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-500 hover:to-purple-500 text-white font-bold rounded-xl transition shadow-glow-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              <Send size={16} /> Submit Daily Journal Check-in
            </button>
          </div>

          {/* Right Column: Activities & Streaks (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Today's Habits / Activities */}
            <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <h4 className="text-sm font-bold text-white mb-2">Daily Habits</h4>
              <p className="text-[11px] text-aura-muted mb-4">Tag elements that influenced your skin barrier health today.</p>
              
              <div className="flex flex-col gap-2.5">
                {QUICK_TAGS.map(tag => {
                  const isSelected = entry.tags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`w-full p-3 rounded-xl border flex justify-between items-center text-xs font-bold transition-all duration-350 ${
                        isSelected 
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 shadow-glow-green' 
                          : 'border-aura-border bg-black/25 text-aura-muted hover:border-aura-border/80 hover:text-white'
                      }`}
                    >
                      <span>{tag.label}</span>
                      {isSelected && <CheckCircle2 size={14} className="text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Consistency banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/15 to-purple-500/15 border border-yellow-500/25">
              <div className="flex items-center gap-2 font-bold text-yellow-500 text-sm mb-2.5">
                <Flame size={18} className="animate-pulse" />
                <span>Consistency Reward System</span>
              </div>
              <p className="text-[11px] text-aura-muted leading-relaxed m-0">
                You are on a <strong>7-Day streak</strong>! Keeping up daily journal check-ins unlocks skin passport achievement badges and refines AI prediction algorithms by <strong>34%</strong>.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* AI Insights and submission summary */}
      {step === 'insights' && (
        <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-fadeIn">
          
          {/* Submission Success block */}
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/10 to-teal-950/10 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl animate-pulse">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white">Daily Check-in Logged</h3>
            <p className="text-xs text-aura-muted max-w-sm m-0">
              Entry successfully archived for Day {streak}. Real-time analytics have updated your skin condition forecast.
            </p>
          </div>

          {/* AI generated insights list */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base text-purple-400">✨</span>
              <h3 className="text-base font-bold text-white">Real-Time AI Insights</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {insights.map((ins, i) => {
                let statusBg = 'bg-black/30 border-aura-border';
                let textCol = 'text-aura-muted';

                if (ins.type === 'positive') {
                  statusBg = 'bg-emerald-500/5 border-emerald-500/20';
                  textCol = 'text-emerald-400';
                } else if (ins.type === 'warning') {
                  statusBg = 'bg-amber-500/5 border-amber-500/20';
                  textCol = 'text-amber-400';
                }

                return (
                  <div key={i} className={`p-4 rounded-xl border ${statusBg} text-xs leading-relaxed`}>
                    <p className={`font-semibold ${textCol} m-0`}>{ins.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Details Badge */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Daily Entry Digest</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/25 text-[10px] font-bold text-purple-400 capitalize">
                {entry.mood} mood
              </span>
              {entry.skinFeelings.map(f => (
                <span key={f} className="px-2.5 py-1 rounded bg-black/40 border border-aura-border text-[10px] font-bold text-aura-muted">
                  {f}
                </span>
              ))}
              {entry.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  {QUICK_TAGS.find(q => q.id === t)?.label}
                </span>
              ))}
            </div>
            {entry.note && (
              <p className="text-xs text-aura-muted font-mono leading-relaxed italic border-t border-aura-border/60 pt-3 mt-3 m-0">
                "{entry.note}"
              </p>
            )}
          </div>

          <div className="flex gap-4 justify-center mt-2">
            <button 
              className="px-5 py-3 border border-aura-border hover:border-white/20 text-xs font-bold rounded-xl text-white transition flex items-center gap-1.5"
              onClick={() => setStep('history')}
            >
              <BookOpen size={14} /> Open History
            </button>
            <button 
              className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition shadow-glow-secondary flex items-center gap-1"
              onClick={() => navigate('/report')}
            >
              View Skin Report <ArrowRight size={14} />
            </button>
          </div>

        </div>
      )}

      {/* History log view */}
      {step === 'history' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          
          {/* Header Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-purple-500/5 to-cyan-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <Flame size={20} className="animate-bounce" />
                <span className="font-bold text-sm">Consistent Daily Logging</span>
              </div>
              <p className="text-xs text-aura-muted leading-relaxed m-0">
                Regular daily check-ins boost overall diagnostic prediction accuracy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <span className="text-[10px] font-bold text-aura-muted uppercase tracking-wider block mb-2">7-Day Average Skin Score</span>
              <div className="text-3xl font-extrabold font-display text-purple-400 font-mono leading-none">
                {Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)}
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1.5">+4 vs baseline references</span>
            </div>

          </div>

          {/* Historical Logs List */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <h3 className="text-base font-bold text-white mb-6">Historical Logs</h3>
            
            <div className="flex flex-col gap-3">
              {history.map((h, i) => {
                const moodObj = MOODS.find(m => m.id === h.mood);
                const trend = i < history.length - 1 
                  ? h.score > history[i + 1].score ? 'up' 
                    : h.score < history[i + 1].score ? 'down' 
                    : 'flat'
                  : 'flat';

                return (
                  <div 
                    key={i} 
                    className="p-4 rounded-xl border border-aura-border bg-black/20 hover:border-purple-500/35 transition flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                        moodObj 
                          ? `${moodObj.borderColor} ${moodObj.bgGlow} ${moodObj.color}` 
                          : 'border-aura-border bg-black/25 text-aura-muted'
                      }`}>
                        {moodObj?.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">{h.date}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {h.skinFeelings.map(f => (
                            <span key={f} className="px-2 py-0.5 rounded bg-black/40 text-[9px] font-bold text-aura-muted">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-lg font-bold text-purple-400 font-mono leading-none block">{h.score}</span>
                        <span className="text-[8px] text-aura-muted font-bold uppercase tracking-widest leading-none mt-0.5">Score</span>
                      </div>
                      <div className={
                        trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-aura-muted'
                      }>
                        {trend === 'up' ? <TrendingUp size={16} /> : trend === 'down' ? <TrendingDown size={16} /> : <Minus size={16} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
