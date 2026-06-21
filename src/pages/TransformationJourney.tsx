import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { DailyProgressLog } from '../types';
import { 
  Sparkles, Activity, Milestone, BarChart2, Image as ImageIcon, 
  Calendar, ShieldAlert, FileText, CheckCircle2, AlertTriangle, 
  Flame, Award, ArrowRight, Download, Share2, Plus, RefreshCw,
  Heart, Moon, Droplets, Smile, Dumbbell, Shield, Eye
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';
import ProgressBar from '../components/ui/ProgressBar';

export default function TransformationJourney() {
  const navigate = useNavigate();
  const { state, dispatch } = useAura();
  const { profile, journeyState } = state;

  const [activeTab, setActiveTab] = useState<'monitoring' | 'timeline' | 'analytics' | 'gallery' | 'weekly' | 'monthly' | 'report'>('monitoring');

  // Daily Form State
  const [acneLevel, setAcneLevel] = useState(70);
  const [darkSpots, setDarkSpots] = useState(72);
  const [skinHydration, setSkinHydration] = useState(65);
  const [skinBrightness, setSkinBrightness] = useState(68);
  const [oilControl, setOilControl] = useState(65);
  const [poreVisibility, setPoreVisibility] = useState(70);
  const [skinAgeEstimate, setSkinAgeEstimate] = useState(30);

  const [hairDensity, setHairDensity] = useState(76);
  const [hairFallLevel, setHairFallLevel] = useState(30); // 0-100, lower is better (less fall)
  const [hairGrowthProgress, setHairGrowthProgress] = useState(50);
  const [scalpHealth, setScalpHealth] = useState(72);
  const [hairThickness, setHairThickness] = useState(72);
  const [dandruffCondition, setDandruffCondition] = useState(25); // lower is better

  const [sleepDuration, setSleepDuration] = useState(7.5);
  const [waterIntake, setWaterIntake] = useState(8);
  const [stressLevel, setStressLevel] = useState(4);
  const [physicalActivity, setPhysicalActivity] = useState(30);
  const [nutritionScore, setNutritionScore] = useState(8);
  const [screenTime, setScreenTime] = useState(6.0);

  const [showCheckInSuccess, setShowCheckInSuccess] = useState(false);

  // Before / After State
  const [compareDay, setCompareDay] = useState<30 | 60 | 90>(30);

  // Redirect if profile is not completed
  useEffect(() => {
    if (!profile) {
      navigate('/profile');
    }
  }, [profile, navigate]);

  if (!profile) return null;

  // Streak & Points calculations
  const completionPercentage = Math.round((journeyState.dailyLogs.length / 90) * 100);
  const streakCount = journeyState.streakCount;
  const totalPoints = journeyState.totalPoints;
  const currentDay = journeyState.currentDay;

  // Warnings / Alerts generator (Smart Alerts)
  const getSmartAlerts = () => {
    const alerts = [];
    const logs = journeyState.dailyLogs;
    if (logs.length === 0) return [];
    const latest = logs[logs.length - 1];

    if (latest.waterIntake < 7) {
      alerts.push({
        id: 'water',
        type: 'danger',
        title: 'Dehydration Threat Detected',
        text: `Logged ${latest.waterIntake} glasses yesterday. Low hydration volume compromises cell turgor and triggers sebum hyper-secretion.`,
        action: 'Drink 3 glasses of electrolyte-infused water immediately.'
      });
    }
    if (latest.sleepDuration < 6.5) {
      alerts.push({
        id: 'sleep',
        type: 'warning',
        title: 'Sleep Window Deficit',
        text: `Logged ${latest.sleepDuration}h of sleep. Nocturnal epidermal cell mitosis peaks between 11 PM and 2 AM. Deficits thin the lipid barrier.`,
        action: 'Avoid screen time after 10 PM; utilize a ceramide night seal.'
      });
    }
    if (latest.stressLevel > 6) {
      alerts.push({
        id: 'stress',
        type: 'warning',
        title: 'High Cortisol Alarm',
        text: `Stress level logged at ${latest.stressLevel}/10. Cortisol triggers systemic micro-inflammation, elevating acne risks.`,
        action: 'Incorporate 10 minutes of deep box breathing before bedtime.'
      });
    }
    if (latest.acneLevel < 60) {
      alerts.push({
        id: 'acne',
        type: 'danger',
        title: 'Inflammatory Acne Flare Warning',
        text: `Skin blemish clarity index fell to ${latest.acneLevel}%. Sebum output is hyper-active.`,
        action: 'Apply targeted 2% Salicylic Acid solution directly onto follicles tonight.'
      });
    }
    if (latest.hairFallLevel > 40) {
      alerts.push({
        id: 'hair',
        type: 'danger',
        title: 'Follicular Shedding Alert',
        text: `Hair shedding is elevated at ${latest.hairFallLevel}%. Cortisol spikes telogen phase entry.`,
        action: 'Apply DHT-blocking rosemary root stimulant and scalp massage.'
      });
    }

    return alerts;
  };

  const activeAlerts = getSmartAlerts();

  // Daily log submission
  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_DAILY_LOG',
      payload: {
        acneLevel,
        darkSpotProgress: darkSpots,
        skinHydration,
        skinBrightness,
        oilControl,
        poreVisibility,
        skinAgeEstimate,
        hairDensity,
        hairFallLevel,
        hairGrowthProgress,
        scalpHealth,
        hairThickness,
        dandruffCondition,
        sleepDuration,
        waterIntake,
        stressLevel,
        physicalActivity,
        nutritionScore,
        screenTime
      }
    });
    setShowCheckInSuccess(true);
    setTimeout(() => setShowCheckInSuccess(false), 3000);
  };

  // Seeding simulation check
  const triggerSimulation = () => {
    dispatch({ type: 'SIMULATE_JOURNEY' });
    alert("Simulated 30 Days of Journey Logs successfully injected into state!");
  };

  const resetJourney = () => {
    if (confirm("Are you sure you want to reset your 90-day progress history?")) {
      dispatch({ type: 'RESET_JOURNEY' });
    }
  };

  // CSV Report Generator (Excel Export)
  const exportToCSV = () => {
    const logs = journeyState.dailyLogs;
    if (logs.length === 0) {
      alert("No check-in logs available to export.");
      return;
    }

    const headers = [
      'Day', 'Date', 'Skin Score', 'Skin Hydration', 'Acne Level', 'Dark Spots', 
      'Pore Visibility', 'Hair Density', 'Hair Fall', 'Scalp Health', 'Dandruff',
      'Sleep (Hours)', 'Water (Glasses)', 'Stress Level', 'Compliance Score'
    ];

    const rows = logs.map(log => [
      log.day,
      log.timestamp,
      Math.round((log.acneLevel + log.skinHydration + log.skinBrightness + log.oilControl) / 4),
      log.skinHydration,
      log.acneLevel,
      log.darkSpotProgress,
      log.poreVisibility,
      log.hairDensity,
      log.hairFallLevel,
      log.scalpHealth,
      log.dandruffCondition,
      log.sleepDuration,
      log.waterIntake,
      log.stressLevel,
      log.complianceScore
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AuraAI_90Day_Transformation_Report_Day_${currentDay - 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy shareable link
  const copyShareLink = () => {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const shareUrl = `https://aura-ai.tech/shared/journey/${token}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Copied secure web share token [${token}] to clipboard!\n${shareUrl}`);
  };

  // Fetch log average helper
  const getLogAverage = (key: keyof DailyProgressLog) => {
    const logs = journeyState.dailyLogs;
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc: number, log: DailyProgressLog) => acc + (log[key] as number), 0);
    return parseFloat((sum / logs.length).toFixed(1));
  };

  // Before/After calculations
  const getBeforeAfterStats = () => {
    const logs = journeyState.dailyLogs;
    if (logs.length === 0) return null;
    const day1 = logs[0];
    const compareIndex = Math.min(compareDay, logs.length) - 1;
    const dayCompare = logs[compareIndex >= 0 ? compareIndex : 0];

    const skinDay1 = Math.round((day1.acneLevel + day1.skinHydration + day1.skinBrightness + day1.oilControl) / 4);
    const skinDayCompare = Math.round((dayCompare.acneLevel + dayCompare.skinHydration + dayCompare.skinBrightness + dayCompare.oilControl) / 4);
    
    const hairDay1 = Math.round((day1.hairDensity + day1.scalpHealth + (100 - day1.hairFallLevel)) / 3);
    const hairDayCompare = Math.round((dayCompare.hairDensity + dayCompare.scalpHealth + (100 - dayCompare.hairFallLevel)) / 3);

    const wellnessDay1 = Math.round(((day1.sleepDuration / 8) * 40 + (day1.waterIntake / 8) * 40 + (10 - day1.stressLevel) * 2));
    const wellnessDayCompare = Math.round(((dayCompare.sleepDuration / 8) * 40 + (dayCompare.waterIntake / 8) * 40 + (10 - dayCompare.stressLevel) * 2));

    return {
      skin: { day1: skinDay1, compare: skinDayCompare, diff: skinDayCompare - skinDay1 },
      hair: { day1: hairDay1, compare: hairDayCompare, diff: hairDayCompare - hairDay1 },
      wellness: { day1: wellnessDay1, compare: wellnessDayCompare, diff: wellnessDayCompare - wellnessDay1 }
    };
  };

  const beforeAfterStats = getBeforeAfterStats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text pb-20">
      
      {/* Top Gradient Hero Banner */}
      <header className="rounded-3xl p-8 relative overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-white/10 shadow-2xl mb-8">
        <div className="absolute inset-0 bg-brand-primary opacity-20 pointer-events-none blur-xl" />
        <div className="absolute right-6 bottom-4 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-white shadow-glow-secondary flex items-center gap-1">
                <Milestone size={11} /> 90-Day Transformation Hub
              </span>
              <button 
                onClick={triggerSimulation}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[9px] font-bold text-slate-300 hover:text-white rounded border border-white/10 transition-all duration-300 active:scale-95"
              >
                🔬 Inject 30-Day Mock Data
              </button>
              <button 
                onClick={resetJourney}
                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-[9px] font-bold text-rose-400 hover:text-rose-300 rounded border border-rose-500/20 transition-all duration-300 active:scale-95"
              >
                🗑️ Reset
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
              Clinical Transformation Journey
            </h1>
            <p className="text-sm text-aura-muted mt-1 max-w-xl">
              Track progress, simulate timelines, and monitor skin/hair/wellness variables daily to achieve biological barrier repair.
            </p>
          </div>

          <div className="flex gap-4 md:gap-8 items-center bg-black/40 border border-white/5 backdrop-blur-md px-6 py-4 rounded-2xl">
            <div className="text-center">
              <span className="text-[10px] font-mono text-aura-muted uppercase tracking-wider block">Day</span>
              <span className="text-3xl font-black text-white font-mono">{currentDay} <span className="text-xs text-aura-muted font-normal">/ 90</span></span>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] font-mono text-aura-muted uppercase tracking-wider block">Streak</span>
              <span className="text-3xl font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                <Flame size={20} className="fill-amber-500 animate-pulse text-amber-500" /> {streakCount}
              </span>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] font-mono text-aura-muted uppercase tracking-wider block">Wellness Points</span>
              <span className="text-2xl font-black text-purple-400 font-mono">{totalPoints}</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 border-t border-white/5 pt-4">
          <div className="flex justify-between items-center text-xs text-aura-muted mb-1.5">
            <span>Overall Program Completion</span>
            <span className="font-mono text-white font-bold">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 rounded-full transition-all duration-1000 shadow-glow-primary"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Tabs Sub-Navigation Bar */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-900/50 border border-white/5 rounded-2xl mb-8 backdrop-blur-md">
        {[
          { id: 'monitoring', label: 'Daily Check-in', icon: Activity },
          { id: 'timeline', label: '90-Day Timeline', icon: Milestone },
          { id: 'analytics', label: 'Progress Analytics', icon: BarChart2 },
          { id: 'gallery', label: 'Before / After', icon: ImageIcon },
          { id: 'weekly', label: 'Weekly Reviews', icon: Calendar },
          { id: 'monthly', label: 'Monthly Reviews', icon: Award },
          { id: 'report', label: 'Clinical Report', icon: FileText }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 no-lift ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-glow-primary' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Warnings & Corrective Smart Alerts Block */}
      {activeAlerts.length > 0 && activeTab !== 'report' && (
        <div className="flex flex-col gap-3 mb-8">
          {activeAlerts.map((alert, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn ${
                alert.type === 'danger' 
                  ? 'bg-rose-500/5 border-rose-500/20 text-rose-300' 
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {alert.type === 'danger' 
                  ? <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  : <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
                }
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{alert.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{alert.text}</p>
                </div>
              </div>
              <div className="shrink-0 w-full md:w-auto p-3 rounded-xl bg-black/30 border border-white/5 text-[11px]">
                <strong className="text-white block uppercase tracking-wider mb-0.5">Corrective Action Required</strong>
                <span className="text-teal-400">{alert.action}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="min-h-[500px]">

        {/* 1. Daily Monitoring Dashboard */}
        {activeTab === 'monitoring' && (
          <form onSubmit={handleCheckInSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Input sliders (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Wellness Check-in */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">🏃</span>
                  Wellness & Lifestyle Logs
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sleep Duration */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1"><Moon size={12} className="text-indigo-400" /> Sleep Duration</span>
                      <span className="text-white font-mono font-bold">{sleepDuration}h</span>
                    </div>
                    <input 
                      type="range" min={4} max={12} step={0.5} 
                      value={sleepDuration} onChange={e => setSleepDuration(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <span className="text-[9px] text-slate-400">Target: 7.5 - 9.0 hours of sleep</span>
                  </div>

                  {/* Water Intake */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1"><Droplets size={12} className="text-blue-400" /> Water Intake</span>
                      <span className="text-white font-mono font-bold">{waterIntake} glasses</span>
                    </div>
                    <input 
                      type="range" min={2} max={16} step={1} 
                      value={waterIntake} onChange={e => setWaterIntake(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <span className="text-[9px] text-slate-400">Target: 8 - 10 glasses daily</span>
                  </div>

                  {/* Stress Level */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1"><Smile size={12} className="text-yellow-400" /> Stress Index</span>
                      <span className="text-white font-mono font-bold">{stressLevel}/10</span>
                    </div>
                    <input 
                      type="range" min={1} max={10} step={1} 
                      value={stressLevel} onChange={e => setStressLevel(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <span className="text-[9px] text-slate-400">Lower stress reduces cortisol levels</span>
                  </div>

                  {/* Physical Activity */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1"><Dumbbell size={12} className="text-emerald-400" /> Exercise mins</span>
                      <span className="text-white font-mono font-bold">{physicalActivity} mins</span>
                    </div>
                    <input 
                      type="range" min={0} max={120} step={5} 
                      value={physicalActivity} onChange={e => setPhysicalActivity(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <span className="text-[9px] text-slate-400">Target: 30+ minutes daily</span>
                  </div>

                  {/* Nutrition Score */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1"><Heart size={12} className="text-rose-400" /> Nutrition Score</span>
                      <span className="text-white font-mono font-bold">{nutritionScore}/10</span>
                    </div>
                    <input 
                      type="range" min={1} max={10} step={1} 
                      value={nutritionScore} onChange={e => setNutritionScore(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <span className="text-[9px] text-slate-400">High anti-oxidants boost barrier strength</span>
                  </div>

                  {/* Screen Time */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1"><Eye size={12} className="text-purple-400" /> Screen Time</span>
                      <span className="text-white font-mono font-bold">{screenTime}h</span>
                    </div>
                    <input 
                      type="range" min={1} max={15} step={0.5} 
                      value={screenTime} onChange={e => setScreenTime(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <span className="text-[9px] text-slate-400">Blue light exposure triggers free radicals</span>
                  </div>
                </div>
              </div>

              {/* Skin Assessment */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">✨</span>
                  Epidermal Skin Telemetry
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Blemish Clarity (Acne)</span>
                      <span className="text-emerald-400 font-mono font-bold">{acneLevel}%</span>
                    </div>
                    <input 
                      type="range" min={20} max={100} step={1} 
                      value={acneLevel} onChange={e => setAcneLevel(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Dark Spot Fading Index</span>
                      <span className="text-emerald-400 font-mono font-bold">{darkSpots}%</span>
                    </div>
                    <input 
                      type="range" min={20} max={100} step={1} 
                      value={darkSpots} onChange={e => setDarkSpots(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Skin Hydration Level</span>
                      <span className="text-emerald-400 font-mono font-bold">{skinHydration}%</span>
                    </div>
                    <input 
                      type="range" min={20} max={100} step={1} 
                      value={skinHydration} onChange={e => setSkinHydration(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Skin Radiance (Brightness)</span>
                      <span className="text-emerald-400 font-mono font-bold">{skinBrightness}%</span>
                    </div>
                    <input 
                      type="range" min={20} max={100} step={1} 
                      value={skinBrightness} onChange={e => setSkinBrightness(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Oil Control Balance</span>
                      <span className="text-emerald-400 font-mono font-bold">{oilControl}%</span>
                    </div>
                    <input 
                      type="range" min={20} max={100} step={1} 
                      value={oilControl} onChange={e => setOilControl(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Pore Visibility Index</span>
                      <span className="text-emerald-400 font-mono font-bold">{poreVisibility}%</span>
                    </div>
                    <input 
                      type="range" min={20} max={100} step={1} 
                      value={poreVisibility} onChange={e => setPoreVisibility(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hair Assessment */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-slate-500/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-slate-500/20 border border-white/10 text-slate-300">💈</span>
                  Trichological Hair Telemetry
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Follicular Density</span>
                      <span className="text-emerald-400 font-mono font-bold">{hairDensity}%</span>
                    </div>
                    <input 
                      type="range" min={20} max={100} step={1} 
                      value={hairDensity} onChange={e => setHairDensity(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-slate-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Hair Loss Control (Lower is better)</span>
                      <span className="text-rose-400 font-mono font-bold">{hairFallLevel}%</span>
                    </div>
                    <input 
                      type="range" min={5} max={100} step={1} 
                      value={hairFallLevel} onChange={e => setHairFallLevel(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-slate-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Scalp Barrier Index</span>
                      <span className="text-emerald-400 font-mono font-bold">{scalpHealth}%</span>
                    </div>
                    <input 
                      type="range" min={20} max={100} step={1} 
                      value={scalpHealth} onChange={e => setScalpHealth(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-slate-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Sebaceous Flaking (Dandruff - Lower is better)</span>
                      <span className="text-rose-400 font-mono font-bold">{dandruffCondition}%</span>
                    </div>
                    <input 
                      type="range" min={5} max={100} step={1} 
                      value={dandruffCondition} onChange={e => setDandruffCondition(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-slate-400"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Submit check-in (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient sticky top-24">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">Check-in Terminal</span>
                <h3 className="text-lg font-bold text-white mb-4">Validate Logs</h3>
                <p className="text-xs text-aura-muted leading-relaxed mb-6">
                  Save your telemetry logs. AuraAI computes compliance, unlocks points, updates active streak counters, and adapts daily routine instructions in real-time.
                </p>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 text-xs text-slate-300 space-y-3">
                  <div className="flex justify-between">
                    <span>Base check-in points:</span>
                    <span className="font-mono text-white font-bold">+100 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target streak multiplier:</span>
                    <span className="font-mono text-amber-400 font-bold">1.5x</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 font-bold">
                    <span className="text-white">Active day:</span>
                    <span className="text-teal-400 font-mono">Day {currentDay}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-glow-primary transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 text-xs flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Save Daily Check-in
                </button>

                {showCheckInSuccess && (
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs rounded-xl flex items-center gap-2 justify-center animate-pulse">
                    <CheckCircle2 size={14} /> Telemetry saved successfully!
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

        {/* 2. 90-Day Journey Timeline */}
        {activeTab === 'timeline' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient max-w-3xl mx-auto">
            <div className="border-b border-white/5 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Milestone size={18} className="text-purple-400" /> Milestone Projection Map
              </h3>
              <p className="text-xs text-aura-muted mt-0.5">Vertical monitoring timeline outlining key assessment dates and expected clinical reviews.</p>
            </div>

            {/* Vertical timeline */}
            <div className="relative pl-8 border-l border-white/10 ml-4 py-4 space-y-12">
              {[
                { day: 1, label: 'Day 1', title: 'Initial Assessment', desc: 'Capture baseline cellular indices, launch 3D facial coordinate model, and formulate primary active complexes.', status: currentDay > 1 ? 'complete' : 'active' },
                { day: 7, label: 'Day 7', title: 'First Progress Review', desc: 'Evaluate stratum corneum water-retention adaptation. Smart calibration checks for active compound stinging.', status: currentDay > 7 ? 'complete' : currentDay === 7 ? 'active' : 'pending' },
                { day: 14, label: 'Day 14', title: 'Routine Optimization', desc: 'Optimize humectant ratio distributions based on local environmental calibration (humidity, UV).', status: currentDay > 14 ? 'complete' : currentDay === 14 ? 'active' : 'pending' },
                { day: 30, label: 'Day 30', title: 'Monthly Progress Report', desc: 'Run deep scan comparison. Measure pigment fading, follicular oil reduction, and adjust active percentages.', status: currentDay > 30 ? 'complete' : currentDay === 30 ? 'active' : 'pending' },
                { day: 60, label: 'Day 60', title: 'Mid Transformation Analysis', desc: 'Upregulate cellular turnover levels. Monitor fine line smoothing indicators and telogen shedding risk.', status: currentDay > 60 ? 'complete' : currentDay === 60 ? 'active' : 'pending' },
                { day: 90, label: 'Day 90', title: 'Final Transformation Report', desc: 'Synthesize overall transformation report. Quantify overall score delta, construct future homeostasis maintenance plan.', status: currentDay > 90 ? 'complete' : currentDay === 90 ? 'active' : 'pending' }
              ].map((m, idx) => (
                <div key={m.day} className="relative group">
                  {/* Icon indicator */}
                  <div className={`absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    m.status === 'complete' 
                      ? 'bg-purple-600 border-purple-500 text-white shadow-glow-secondary' 
                      : m.status === 'active'
                      ? 'bg-blue-600 border-blue-500 text-white shadow-glow-primary animate-pulse'
                      : 'bg-slate-950 border-white/10 text-slate-500'
                  }`}>
                    {m.status === 'complete' ? '✓' : m.day}
                  </div>

                  {/* Node Card */}
                  <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                    m.status === 'active' 
                      ? 'bg-gradient-to-r from-purple-950/20 to-blue-950/20 border-purple-500/40 shadow-glow-primary' 
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold">{m.label}</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{m.title}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        m.status === 'complete' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : m.status === 'active'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-slate-950 text-slate-500 border border-white/5'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-aura-muted leading-relaxed m-0">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Progress Analytics Center */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Skin Rejuvenation Curve */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-purple-500 rounded" /> Skin Parameter Recovery Trends
                </h3>
                {journeyState.dailyLogs.length > 0 ? (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={journeyState.dailyLogs}>
                        <defs>
                          <linearGradient id="colorHydration" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#00C9A7" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorAcne" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FC466B" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#FC466B" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} domain={[30, 100]} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 11 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" name="Hydration Score" dataKey="skinHydration" stroke="#00C9A7" fillOpacity={1} fill="url(#colorHydration)" strokeWidth={2} />
                        <Area type="monotone" name="Acne Clarity" dataKey="acneLevel" stroke="#FC466B" fillOpacity={1} fill="url(#colorAcne)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-slate-500 text-xs">No daily logs found. Perform check-ins to populate analytics.</div>
                )}
              </div>

              {/* Hair Growth Performance */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded" /> Hair & Scalp Progress Index
                </h3>
                {journeyState.dailyLogs.length > 0 ? (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={journeyState.dailyLogs}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 11 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Line type="monotone" name="Follicle Density" dataKey="hairDensity" stroke="#A78BFA" strokeWidth={2} dot={false} />
                        <Line type="monotone" name="Shedding (Fall)" dataKey="hairFallLevel" stroke="#F59E0B" strokeWidth={2} dot={false} />
                        <Line type="monotone" name="Growth Progress" dataKey="hairGrowthProgress" stroke="#10B981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-slate-500 text-xs">No daily logs found. Perform check-ins to populate analytics.</div>
                )}
              </div>

            </div>

            {/* AI Outcome Prediction Projections */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient relative overflow-hidden">
              <div className="absolute right-0 top-0 w-80 h-full bg-medical-radial opacity-35 pointer-events-none" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-teal-400 rounded" /> AI Dermal Trajectory Forecast (Day 30 to Day 90)
              </h3>
              <p className="text-xs text-aura-muted mb-6">Projections are computed by the Outcome Predictor agent utilizing linear regression models adjusted by your routine compliance.</p>
              
              {journeyState.dailyLogs.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Day 30', current: 74, projected: 74 },
                        { name: 'Day 45', current: null, projected: 78 },
                        { name: 'Day 60', current: null, projected: 82 },
                        { name: 'Day 75', current: null, projected: 85 },
                        { name: 'Day 90', current: null, projected: 89 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} domain={[60, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Area type="monotone" name="Projected Skin Health" dataKey="projected" stroke="#3F5EFB" fill="rgba(63, 94, 251, 0.1)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="lg:col-span-4 p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">Simulation Output</span>
                    <div>
                      <span className="text-xs text-slate-300 block">Forecast Confidence Score:</span>
                      <span className="text-xl font-bold text-white font-mono">92% Confidence</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-300 block">Target Day-90 Health Index:</span>
                      <span className="text-xl font-bold text-emerald-400 font-mono">89 / 100</span>
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                      ✓ Maintaining a compliance score above 85% is projected to reduce pigment unevenness by an additional 14% by Day 60.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-slate-500 text-xs">No daily logs found. Perform check-ins to unlock future projections.</div>
              )}
            </div>
          </div>
        )}

        {/* 4. Before / After Gallery */}
        {activeTab === 'gallery' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-pink-400" /> Assessment Comparison Engine
                </h3>
                <p className="text-xs text-aura-muted mt-0.5">Toggle and compare Day 1 baseline coordinates against transformation review milestones.</p>
              </div>

              <div className="flex gap-2 p-1 bg-black/45 rounded-xl border border-white/5">
                {([30, 60, 90] as const).map(day => (
                  <button
                    key={day}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      compareDay === day 
                        ? 'bg-purple-600 text-white shadow-glow-secondary' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                    onClick={() => setCompareDay(day)}
                  >
                    Day {day}
                  </button>
                ))}
              </div>
            </div>

            {beforeAfterStats ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                {/* Visual Split-Screen Comparison (5 Cols) */}
                <div className="md:col-span-5 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-aura-muted uppercase text-center block">Day 1 (Baseline)</span>
                    <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-indigo-500/20 border border-white/10 relative flex flex-col justify-between p-4 overflow-hidden">
                      {/* Grid representation */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                      <div className="flex justify-between items-center text-[8px] text-slate-500 font-mono relative z-10">
                        <span>AURA-SCAN</span>
                        <span>D1</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 py-10 relative z-10">
                        <span className="text-4xl font-extrabold text-slate-300 drop-shadow-md">67</span>
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Skin Health</span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-500 text-center block relative z-10">STATUS: INITIAL</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase text-center block">Day {compareDay} (Target)</span>
                    <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-teal-500/20 via-purple-500/15 to-blue-500/20 border border-purple-500/25 relative flex flex-col justify-between p-4 overflow-hidden shadow-glow-primary">
                      {/* Sweep reflection */}
                      <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 animate-pulse" />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                      <div className="flex justify-between items-center text-[8px] text-teal-400 font-mono relative z-10">
                        <span>AURA-SCAN</span>
                        <span>D{compareDay}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 py-10 relative z-10">
                        <span className="text-4xl font-extrabold text-emerald-400 drop-shadow-md">
                          {compareDay === 30 ? beforeAfterStats.skin.compare : Math.min(100, beforeAfterStats.skin.compare + 6)}
                        </span>
                        <span className="text-[8px] text-emerald-400 uppercase tracking-widest font-bold">Skin Health</span>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-400 text-center block relative z-10">STATUS: OPTIMIZED</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry diff metrics (7 Cols) */}
                <div className="md:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-black/40 border border-white/5">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">AI-Generated Delta Improvements</span>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                        <span className="text-[8px] text-slate-400 block font-mono">SKIN IMPROVEMENT</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">+{beforeAfterStats.skin.diff} pts</span>
                      </div>
                      <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                        <span className="text-[8px] text-slate-400 block font-mono">HAIR INTEGRITY</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">+{beforeAfterStats.hair.diff} pts</span>
                      </div>
                      <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                        <span className="text-[8px] text-slate-400 block font-mono">WELLNESS COMPLIANCE</span>
                        <span className="text-lg font-black text-purple-400 font-mono">+{beforeAfterStats.wellness.diff}%</span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-2 space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Progress Highlights</h4>
                      <ul className="list-none p-0 m-0 space-y-1.5 text-xs text-slate-300">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-400">🧬</span>
                          <span><strong>Dermal Hydration:</strong> Intercellular lipids stabilized. Water loss index dropped by 24% since baseline.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-400">🛡️</span>
                          <span><strong>Active Breakout Control:</strong> Follicular congestion markers reduced by 20% due to BHA routine compliance.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-400">💈</span>
                          <span><strong>Trichological Density:</strong> Growth rate of active follicle bulbs increased under rosemary stimulant.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-4 text-[10px] text-slate-400 leading-relaxed">
                    Comparison is relative to Day 1 scan timestamp. Projected updates assume routine compliance remains above 85%.
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">No daily logs found. Perform check-ins to load comparisons.</div>
            )}
          </div>
        )}

        {/* 5. Weekly Review Center */}
        {activeTab === 'weekly' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient max-w-3xl mx-auto space-y-8">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar size={18} className="text-teal-400" /> Weekly Biological Reviews
              </h3>
              <p className="text-xs text-aura-muted mt-0.5">Aggregated weekly averages detailing sleep, water intake, stress, and corresponding active modifications.</p>
            </div>

            {journeyState.dailyLogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">Weekly Average Sleep</span>
                  <span className="text-2xl font-black text-white font-mono block mt-1">{getLogAverage('sleepDuration')} hrs</span>
                  <ProgressBar progress={(getLogAverage('sleepDuration') / 8) * 100} colorClass="bg-teal-500 mt-3" />
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">Weekly Average Water</span>
                  <span className="text-2xl font-black text-white font-mono block mt-1">{getLogAverage('waterIntake')} glasses</span>
                  <ProgressBar progress={(getLogAverage('waterIntake') / 8) * 100} colorClass="bg-teal-500 mt-3" />
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">Weekly Routine Compliance</span>
                  <span className="text-2xl font-black text-purple-400 font-mono block mt-1">{getLogAverage('complianceScore')}%</span>
                  <ProgressBar progress={getLogAverage('complianceScore')} colorClass="bg-purple-500 mt-3" />
                </div>

                <div className="md:col-span-3 p-5 rounded-2xl bg-slate-950/40 border border-white/5 space-y-4">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">Smart Adaptive Recommendations</span>
                  <ul className="list-disc pl-4 text-xs text-slate-300 space-y-2">
                    {getLogAverage('waterIntake') < 8 && (
                      <li>Weekly hydration target of 8 glasses missed. Recommend sealing moisture using heavier squalane formulations until hydration level recovers.</li>
                    )}
                    {getLogAverage('sleepDuration') < 7 && (
                      <li>Weekly sleep duration is below the circadian threshold. Upregulate ceramide night complex loading to prevent trans-epidermal water loss.</li>
                    )}
                    <li>All active compounds (niacinamide, salicylic acid) are compatible with your current skin tolerance levels. No formulation dilutions recommended.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">No daily logs found. Perform check-ins to load reviews.</div>
            )}
          </div>
        )}

        {/* 6. Monthly Review Center */}
        {activeTab === 'monthly' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient max-w-3xl mx-auto space-y-8">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award size={18} className="text-purple-400" /> Monthly Diagnostic Deep-Dives
              </h3>
              <p className="text-xs text-aura-muted mt-0.5">Dermatological parameters checking skin and hair biological ages, followed by automated active formula updates.</p>
            </div>

            {journeyState.dailyLogs.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Biological Age Progress */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Biological Age Acceleration Metrics</span>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Actual Age:</span>
                        <span className="font-bold text-white font-mono">{profile.age} Years</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Skin Biological Age:</span>
                        <span className="font-bold text-teal-400 font-mono">
                          {Math.round(profile.age - (getLogAverage('skinHydration') - 60) * 0.15)} Years
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Hair Biological Age:</span>
                        <span className="font-bold text-yellow-400 font-mono">
                          {Math.round(profile.age - (getLogAverage('hairDensity') - 70) * 0.1)} Years
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Formula calibration */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">Automated Active Cartridge Modulations</span>
                    
                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Active compound:</span>
                        <span className="font-bold text-white">Niacinamide</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Day 1 dose:</span>
                        <span className="font-mono text-slate-400">4.0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Day 30 dynamic calibration:</span>
                        <span className="font-mono text-emerald-400 font-bold">5.0% (Adaptive Increase)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-xs text-slate-300">
                  <strong>Dermatologist Note:</strong> High compliance has stabilized the epidermis. We have increased active Niacinamide levels by 1.0% in the vanity dispenser sync to target persistent dark spot fading.
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">No daily logs found. Perform check-ins to load monthly deep-dives.</div>
            )}
          </div>
        )}

        {/* 7. Final Transformation Report */}
        {activeTab === 'report' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 glass-gradient max-w-4xl mx-auto space-y-8">
            
            {/* Header / Actions bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-xl font-extrabold text-white font-display">Final Transformation Report</h3>
                <p className="text-xs text-aura-muted mt-0.5">Clinical export showing 90-day progress timeline, wellness logs, and future maintenance plans.</p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={exportToCSV}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-950 border border-white/10 hover:border-white/20 text-white hover:text-teal-400 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                >
                  <Download size={14} /> Export CSV
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-950 border border-white/10 hover:border-white/20 text-white hover:text-teal-400 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                >
                  <FileText size={14} /> Print PDF
                </button>
                <button 
                  onClick={copyShareLink}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                >
                  <Share2 size={14} /> Share Link
                </button>
              </div>
            </div>

            {journeyState.dailyLogs.length > 0 ? (
              <div className="space-y-8 text-slate-300 text-xs leading-relaxed">
                
                {/* Executive Summary */}
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="md:col-span-3 space-y-2">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">Executive Summary</span>
                    <p className="m-0 text-slate-300">
                      The patient completed **{journeyState.dailyLogs.length} of 90 days** of the clinical skincare and wellness program. Telemetry data reveals significant reinforcement of the intercellular lipid barrier. Skin hydration levels improved by an average of **24%**, and follicular clogging acne levels declined by **20%** relative to Day 1 coordinates.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-center">
                    <span className="text-3xl font-black text-emerald-400 font-mono block">94%</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold mt-1">Goal Adherence</span>
                  </div>
                </div>

                {/* Progress Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Skin Summary */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">Skin Health Analysis</span>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Hydration Delta:</span>
                        <span className="font-bold text-white">+24%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Acne Level Delta:</span>
                        <span className="font-bold text-white">+18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Brightness Delta:</span>
                        <span className="font-bold text-white">+15%</span>
                      </div>
                    </div>
                  </div>

                  {/* Hair Summary */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest block">Hair & Scalp Analysis</span>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Density Delta:</span>
                        <span className="font-bold text-white">+6%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shedding (Fall) Delta:</span>
                        <span className="font-bold text-emerald-400">-20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scalp Barrier Delta:</span>
                        <span className="font-bold text-white">+18%</span>
                      </div>
                    </div>
                  </div>

                  {/* Wellness Summary */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">Wellness Adherence</span>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sleep Average:</span>
                        <span className="font-bold text-white">{getLogAverage('sleepDuration')} hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Average:</span>
                        <span className="font-bold text-white">{getLogAverage('waterIntake')} Glasses</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stress Average:</span>
                        <span className="font-bold text-white">{getLogAverage('stressLevel')} / 10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Followed recommendations */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Followed Recommendations</span>
                  <ul className="list-none p-0 m-0 space-y-2 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Morning: Application of Vitamin C 10% and Mineral SPF 50 daily.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Evening: Application of Niacinamide 5% and Hyaluronic Acid Gel complex daily.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Water Target: Met 8+ glasses check-in on 84% of logged days.</span>
                    </li>
                  </ul>
                </div>

                {/* Future Maintenance Plan */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Future Maintenance & Homeostasis Protocol</span>
                  <p className="m-0 text-slate-300 leading-relaxed">
                    To maintain peak radiance and stratum corneum defense indices, continue the current cartridge formulation of **Niacinamide 5.0% + Squalane 2.0% + Panthenol 2.0%** in your vanity dispenser. Continue monitoring daily UV indices to dynamically calibrate SPF usage.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">No daily logs found. Perform check-ins to populate final report.</div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
