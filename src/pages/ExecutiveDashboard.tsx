import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { 
  Gauge, Sparkles, Shield, Activity, TrendingUp, AlertTriangle, 
  Cpu, Brain, ChevronRight, Zap, Droplets, Moon, Heart,
  ArrowUpRight, BarChart2, Microscope, Calendar, Target
} from 'lucide-react';
import ScoreRing from '../components/ui/ScoreRing';
import ProgressBar from '../components/ui/ProgressBar';

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 px-6 min-h-[80vh]">
        {/* Animated background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #6A11CB, transparent)' }} />
        </div>
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
               style={{ background: 'linear-gradient(135deg, rgba(106,17,203,0.2), rgba(37,117,252,0.2))', border: '1px solid rgba(139,92,246,0.3)' }}>
            <Gauge size={36} className="text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            No Diagnostics Found
          </h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Run your skin diagnostics scan first to activate the Executive Intelligence Dashboard.
          </p>
          <button 
            className="group px-8 py-3.5 text-sm font-bold rounded-2xl text-white flex items-center gap-2.5 mx-auto transition-all duration-300 hover:scale-105 active:scale-100"
            style={{ background: 'linear-gradient(135deg, #6A11CB, #2575FC)', boxShadow: '0 8px 24px rgba(106,17,203,0.35)' }}
            onClick={() => navigate('/profile')}
          >
            <Sparkles size={16} />
            Start AI Analysis
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  const profile = result.profile;
  const skin = result.skinHealth;
  const hairScore = 78;
  const lifestyle = result.lifestyleScore;

  const beautyIntelScore = result.beautyScore;
  const skinHealthScore = skin.overallScore;
  const recoveryScore = Math.min(100, Math.max(30, Math.round(
    (profile.sleepHours / 8) * 40 + (profile.waterIntake / 8) * 30 + (10 - profile.stressLevel) * 3
  )));
  const futurePotential = Math.min(100, Math.max(skinHealthScore + 12, 94));
  const aiConfidence = Math.round(Object.values(skin.confidence).reduce((a, b) => a + b, 0) / 5);
  const avgRisk = Math.round((skin.acneRiskScore + skin.uvDamageScore + skin.agingRiskScore) / 3);

  const scoreCards = [
    { 
      label: 'Beauty Intelligence', 
      sub: 'Aggregate diagnostic status',
      score: beautyIntelScore, 
      color: '#8B5CF6',
      glow: 'rgba(139,92,246,0.2)',
      gradient: 'from-purple-500/10 to-purple-900/5',
      route: '/report'
    },
    { 
      label: 'Skin Health', 
      sub: 'Cellular barrier integrity',
      score: skinHealthScore, 
      color: '#06B6D4',
      glow: 'rgba(6,182,212,0.2)',
      gradient: 'from-cyan-500/10 to-cyan-900/5',
      route: '/skin-lab'
    },
    { 
      label: 'Hair Health', 
      sub: 'Follicle & scalp integrity',
      score: hairScore, 
      color: '#F59E0B',
      glow: 'rgba(245,158,11,0.2)',
      gradient: 'from-amber-500/10 to-amber-900/5',
      route: '/hair-lab'
    },
    { 
      label: 'Lifestyle Score', 
      sub: 'Habit compliance index',
      score: lifestyle, 
      color: '#10B981',
      glow: 'rgba(16,185,129,0.2)',
      gradient: 'from-emerald-500/10 to-emerald-900/5',
      route: '/progress'
    }
  ];

  const quickMetrics = [
    { 
      icon: <Activity size={16} />, label: 'Recovery Score', value: recoveryScore, 
      unit: '%', color: '#06B6D4', bar: 'bg-cyan-500', tag: 'Stable', tagColor: 'text-emerald-400' 
    },
    { 
      icon: <Target size={16} />, label: 'Future Potential', value: futurePotential, 
      unit: '%', color: '#10B981', bar: 'bg-teal-500', tag: 'Peak target', tagColor: 'text-slate-400' 
    },
    { 
      icon: <Brain size={16} />, label: 'AI Confidence', value: aiConfidence, 
      unit: '%', color: '#8B5CF6', bar: 'bg-purple-500', tag: 'Model certainty', tagColor: 'text-slate-400' 
    },
    { 
      icon: <AlertTriangle size={16} />, label: 'Overall Risk', value: avgRisk, 
      unit: '%', color: '#F43F5E', bar: 'bg-rose-500', tag: 'Action needed', tagColor: 'text-rose-400' 
    }
  ];

  const quickActions = [
    { 
      icon: <Microscope size={18} />, 
      label: 'Morning Protocol',
      desc: 'Apply Vitamin C 10% + SPF 50 to neutralize photo-oxidation markers',
      route: '/care-planner',
      linkLabel: 'Open Care Planner',
      color: '#06B6D4'
    },
    { 
      icon: <Shield size={18} />, 
      label: 'Risk Minimisation',
      desc: 'Address UV and dehydration threat vectors to recover compromised stratum corneum',
      route: '/risk-intelligence',
      linkLabel: 'Monitor Risk Index',
      color: '#F43F5E'
    },
    { 
      icon: <BarChart2 size={18} />, 
      label: '90-Day Journey',
      desc: 'Log today\'s metrics and track your clinical transformation progress',
      route: '/journey',
      linkLabel: 'Open Journey Hub',
      color: '#8B5CF6'
    },
    { 
      icon: <Calendar size={18} />, 
      label: 'Evening Routine',
      desc: 'Apply Niacinamide 5% + Retinol to boost overnight cellular regeneration',
      route: '/care-planner',
      linkLabel: 'View Planner',
      color: '#F59E0B'
    }
  ];

  const insights = [
    { icon: <Droplets size={14} />, text: `Hydration at ${skin.hydrationScore}% — apply ceramide booster tonight`, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { icon: <Moon size={14} />, text: `${profile.sleepHours}h sleep logged — optimal range is 7.5-9h`, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { icon: <Heart size={14} />, text: `Stress index ${profile.stressLevel}/10 — cortisol elevation risk detected`, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { icon: <Zap size={14} />, text: `AI formula updated: Niacinamide raised to 5.0% based on 30d progress`, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Page Header */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.25)', color: '#A78BFA' }}>
              <Gauge size={11} /> Beauty Intelligence OS
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border"
                  style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)', color: '#6ee7b7' }}>
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Executive Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry for <span className="text-white font-semibold">{profile.name}</span> · {profile.skinType} skin · Age {profile.age}
          </p>
        </div>
        <button 
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-300 hover:scale-105 active:scale-100"
          style={{ background: 'linear-gradient(135deg, #6A11CB, #2575FC)', boxShadow: '0 4px 16px rgba(106,17,203,0.3)' }}
          onClick={() => navigate('/upload')}
        >
          <Sparkles size={13} />
          New AI Analysis
          <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </header>

      {/* Score Rings Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {scoreCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border cursor-pointer group transition-all duration-300 hover:-translate-y-1 relative overflow-hidden bg-gradient-to-br ${card.gradient}`}
            style={{ 
              borderColor: `${card.color}25`,
              boxShadow: hoveredCard === idx ? `0 8px 32px ${card.glow}` : 'none'
            }}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate(card.route)}
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ArrowUpRight size={14} style={{ color: card.color }} />
            </div>
            <div className="flex flex-col items-center text-center">
              <ScoreRing score={card.score} size={100} label="" />
              <h4 className="text-xs font-bold text-white mt-3 uppercase tracking-wider">{card.label}</h4>
              <span className="text-[10px] text-slate-500 mt-0.5">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickMetrics.map((metric, idx) => (
          <div key={idx} className="p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15"
               style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span style={{ color: metric.color }}>{metric.icon}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{metric.label}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-black text-white font-mono">{metric.value}</span>
              <span className="text-xs font-bold" style={{ color: metric.color }}>{metric.unit}</span>
              <span className={`text-[10px] ml-auto ${metric.tagColor}`}>{metric.tag}</span>
            </div>
            <ProgressBar progress={metric.value} colorClass={metric.bar} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions: 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu size={15} className="text-purple-400" /> Active Directives & Protocols
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, idx) => (
              <div key={idx}
                   className="p-5 rounded-2xl border group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/15 relative overflow-hidden"
                   style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
                   onClick={() => navigate(action.route)}>
                <div className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: `linear-gradient(90deg, transparent, ${action.color}, transparent)` }} />
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                       style={{ background: `${action.color}15`, color: action.color }}>
                    {action.icon}
                  </div>
                  <h4 className="text-xs font-bold text-white">{action.label}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{action.desc}</p>
                <button className="text-[11px] font-bold flex items-center gap-1 transition-colors duration-200 hover:underline"
                        style={{ color: action.color }}>
                  {action.linkLabel} <ChevronRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          
          {/* Aura Copilot */}
          <div className="p-5 rounded-2xl border"
               style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(37,117,252,0.05))', borderColor: 'rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Aura Copilot</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Based on your diagnostics, resolving hydration deficit will boost your Potential Score to{' '}
              <strong className="text-teal-400">{futurePotential}%</strong> within 30 days.
            </p>
            <button 
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-100"
              style={{ background: 'linear-gradient(135deg, #6A11CB, #2575FC)', boxShadow: '0 4px 16px rgba(106,17,203,0.25)' }}
              onClick={() => navigate('/coach')}
            >
              Ask AI Beauty Coach
            </button>
          </div>

          {/* Smart Insights Feed */}
          <div className="p-5 rounded-2xl border"
               style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Zap size={14} className="text-amber-400" /> Smart Insights
            </h3>
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border text-[11px] ${insight.bg} ${insight.border}`}>
                  <span className={`${insight.color} mt-0.5 shrink-0`}>{insight.icon}</span>
                  <span className="text-slate-300 leading-relaxed">{insight.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
