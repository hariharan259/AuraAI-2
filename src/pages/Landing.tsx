import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Brain, Microscope, FlaskConical, TrendingUp, 
  ArrowRight, Shield, Play, Activity, Star, Zap,
  CheckCircle, Globe, Lock, ChevronRight, Cpu
} from 'lucide-react';

const AGENTS = [
  {
    icon: <Microscope size={22} />,
    name: 'Dermatologist AI',
    role: 'Skin Health Analyzer',
    gradient: 'from-teal-500/20 to-cyan-500/10',
    border: 'border-teal-500/30',
    glow: 'shadow-[0_0_20px_rgba(20,184,166,0.15)]',
    iconColor: 'text-teal-400',
    desc: 'Maps 12 epidermal conditions including sebum, UV pigmentation, and follicular clogging with medical-grade precision.',
    badge: 'Layer 1'
  },
  {
    icon: <Brain size={22} />,
    name: 'Skin Twin Architect',
    role: 'Digital Twin Engine',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/30',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    iconColor: 'text-cyan-400',
    desc: 'Synthesizes a real-time 3D digital twin of your skin, mapping strengths, problem zones, and risk vectors.',
    badge: 'Layer 2'
  },
  {
    icon: <FlaskConical size={22} />,
    name: 'Ingredient Scientist',
    role: 'Formula Intelligence',
    gradient: 'from-emerald-500/20 to-green-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    iconColor: 'text-emerald-400',
    desc: 'Prescribes precise active compounds, runs interaction safety scores, and formulates bespoke serum cartridges.',
    badge: 'Layer 3'
  },
  {
    icon: <Sparkles size={22} />,
    name: 'Routine Coach',
    role: 'Clinical Routine Planner',
    gradient: 'from-purple-500/20 to-violet-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
    iconColor: 'text-purple-400',
    desc: 'Structures AM, PM, Weekly and Monthly care schedules aligned to skin barrier repair science.',
    badge: 'Layer 4'
  },
  {
    icon: <TrendingUp size={22} />,
    name: 'Outcome Predictor',
    role: '90-Day Forecast Engine',
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    iconColor: 'text-amber-400',
    desc: 'Projects Day-1 to Day-90 clinical improvement trajectories using ML regression models calibrated daily.',
    badge: 'Layer 5'
  }
];

const FEATURES = [
  { icon: '🧬', title: 'Biological Age Analysis', desc: 'Computes your Skin Bio Age vs. actual age with reversal plans.' },
  { icon: '🪞', title: 'AI Beauty Twin', desc: 'Digital mirror simulating better sleep, hydration, and routine outcomes.' },
  { icon: '📊', title: '90-Day Transformation', desc: 'Tracks 20+ daily skin & hair metrics with progress analytics.' },
  { icon: '🧪', title: 'Ingredient Intelligence', desc: 'AI conflict checker and formula optimizer for 500+ actives.' },
  { icon: '⚡', title: 'Real-time Risk Alerts', desc: 'Automated cortisol, UV, and dehydration threat detection.' },
  { icon: '📱', title: 'Smart Vanity Dispenser', desc: 'IoT-connected serum dispenser synced to your daily analysis.' }
];

const TELEMETRY = [
  { city: 'TOKYO', text: 'Dryness alert: auto-adjusting ceramide loading ratios.', color: 'text-cyan-400' },
  { city: 'MIAMI', text: 'UV index 9.4: reinforcing SPF defenses in prescriptions.', color: 'text-amber-400' },
  { city: 'LONDON', text: 'Humidity drops: boosting hyaluronic acid delivery.', color: 'text-emerald-400' },
  { city: 'PARIS', text: 'Sebum spike: upregulating niacinamide percentage.', color: 'text-purple-400' },
  { city: 'DUBAI', text: 'Heat stress detected: activating antioxidant protocol.', color: 'text-rose-400' },
  { city: 'NYC', text: 'Air quality index low: pollution barrier shield activated.', color: 'text-blue-400' }
];

const STATS = [
  { value: '2.4M+', label: 'Scans Analyzed' },
  { value: '94%', label: 'Accuracy Rate' },
  { value: '90', label: 'Days Tracked' },
  { value: '5', label: 'AI Agents Active' }
];

export default function Landing() {
  const navigate = useNavigate();
  const [globalScans, setGlobalScans] = useState(2437821);
  const [currentTelemetry, setCurrentTelemetry] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setGlobalScans(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 1200);
    const telemetryInterval = setInterval(() => {
      setCurrentTelemetry(prev => (prev + 1) % TELEMETRY.length);
    }, 3000);
    return () => {
      clearInterval(scanInterval);
      clearInterval(telemetryInterval);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
    });
  };

  return (
    <div className="min-h-screen text-white font-body relative overflow-hidden" style={{ background: 'var(--aura-bg)' }}>
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.07]" 
             style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full opacity-[0.06]" 
             style={{ background: 'radial-gradient(circle, #EC4899, transparent)' }} />
        <div className="absolute top-[40%] right-[15%] w-[35vw] h-[35vw] rounded-full opacity-[0.05]" 
             style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative" 
               style={{ background: 'linear-gradient(135deg, #6A11CB, #2575FC)', boxShadow: '0 0 20px rgba(106,17,203,0.4)' }}>
            <Sparkles size={18} color="white" />
            <div className="absolute inset-0 rounded-2xl animate-pulse opacity-30" 
                 style={{ background: 'linear-gradient(135deg, #6A11CB, #2575FC)' }} />
          </div>
          <div>
            <div className="text-base font-black text-white tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>AuraAI</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-[0.15em] font-semibold">Beauty Intelligence OS</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors duration-200">Dashboard</button>
          <button onClick={() => navigate('/skin-lab')} className="hover:text-white transition-colors duration-200">Skin Lab</button>
          <button onClick={() => navigate('/journey')} className="hover:text-white transition-colors duration-200">90-Day Journey</button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="hidden sm:flex px-4 py-2 border text-xs font-bold rounded-xl transition-all duration-300 hover:border-purple-500/60 hover:text-purple-300 hover:bg-purple-500/10"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#94a3b8' }}
            onClick={() => navigate('/demo')}
          >
            Live Demo
          </button>
          <button 
            className="px-5 py-2.5 text-xs font-bold rounded-xl text-white flex items-center gap-1.5 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-100"
            style={{ background: 'linear-gradient(135deg, #6A11CB, #2575FC)', boxShadow: '0 0 20px rgba(106,17,203,0.3)' }}
            onClick={() => navigate('/profile')}
          >
            Start Free Scan <ArrowRight size={12} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-16 pb-20 text-center"
      >
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border"
             style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)', color: '#6ee7b7' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono">{globalScans.toLocaleString()} scans processed · AI systems live</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.08] tracking-tight"
            style={{ 
              fontFamily: 'var(--font-display)',
              transform: `perspective(1000px) rotateX(${mousePos.y * 0.03}deg) rotateY(${mousePos.x * 0.03}deg)`,
              transition: 'transform 0.1s ease-out'
            }}>
          <span className="text-white block">Your Personal</span>
          <span className="block" style={{ background: 'linear-gradient(135deg, #A78BFA, #38BDF8, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Beauty Intelligence OS
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          5 specialized AI agents run a parallel clinical pipeline — analyzing 12 skin conditions, 
          building your digital twin, and prescribing personalized formulas in under 60 seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <button 
            className="w-full sm:w-auto group px-8 py-4 text-sm font-bold rounded-2xl text-white flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-100"
            style={{ background: 'linear-gradient(135deg, #6A11CB, #2575FC)', boxShadow: '0 8px 32px rgba(106,17,203,0.4)' }}
            onClick={() => navigate('/profile')}
          >
            <Play size={16} fill="white" /> 
            <span>Launch AI Skin Analyzer</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button 
            className="w-full sm:w-auto px-8 py-4 text-sm font-bold rounded-2xl text-white flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-100 border"
            style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.3)', backdropFilter: 'blur(12px)' }}
            onClick={() => navigate('/demo')}
          >
            <Sparkles size={16} className="text-purple-400" />
            <span>Open Demo Mode</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl border"
             style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          {STATS.map((stat, i) => (
            <React.Fragment key={i}>
              <div className="text-center">
                <div className="text-xl font-black text-white font-mono">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">{stat.label}</div>
              </div>
              {i < STATS.length - 1 && <div className="w-px h-8 bg-white/10" />}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* 5-Agent Pipeline Visualization */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border"
               style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.2)', color: '#A78BFA' }}>
            <Cpu size={10} /> Multi-Agent Diagnostics Pipeline
          </div>
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            5 Agents. 1 Clinical Pipeline.
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            AuraAI runs a parallel medical-grade pipeline where each agent specializes in a distinct domain of beauty science.
          </p>
        </div>

        {/* Pipeline Flow */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          {AGENTS.map((agent, idx) => (
            <React.Fragment key={idx}>
              <div className={`flex-1 p-5 rounded-2xl border bg-gradient-to-br ${agent.gradient} ${agent.border} ${agent.glow} transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] group relative overflow-hidden`}>
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" 
                     style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)' }} />
                
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${agent.iconColor} ${agent.border} bg-black/20`}>
                    {agent.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border" 
                        style={{ color: '#64748b', borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
                    {agent.badge}
                  </span>
                </div>
                <h3 className={`text-sm font-bold text-white mb-0.5 relative z-10`}>{agent.name}</h3>
                <span className={`text-[9px] uppercase tracking-wider font-bold block mb-3 relative z-10 ${agent.iconColor}`}>{agent.role}</span>
                <p className="text-[11px] text-slate-400 leading-relaxed relative z-10">{agent.desc}</p>
              </div>
              {idx < AGENTS.length - 1 && (
                <div className="hidden lg:flex items-center text-slate-700">
                  <ChevronRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Enterprise-Grade Feature Suite
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Everything you need to optimize, track, and transform your skin and hair health.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, idx) => (
            <div key={idx} 
                 className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 group cursor-default"
                 style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}>
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-200">{feature.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-3xl p-8 md:p-12 border relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, rgba(106,17,203,0.12), rgba(37,117,252,0.08))', borderColor: 'rgba(139,92,246,0.2)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
               style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', transform: 'translate(30%, -30%)' }} />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                <span className="text-xs text-slate-400 ml-1">Rated #1 AI Skin Platform</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Ready to Transform Your Skin Health?
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Join 2.4M+ users leveraging AuraAI's medical-grade intelligence to achieve clinically verified skin improvements in 90 days or less.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="px-6 py-3 text-sm font-bold rounded-xl text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #6A11CB, #2575FC)', boxShadow: '0 8px 24px rgba(106,17,203,0.35)' }}
                  onClick={() => navigate('/profile')}
                >
                  <Play size={14} fill="white" /> Start My Analysis
                </button>
                <button 
                  className="px-6 py-3 text-sm font-bold rounded-xl text-slate-300 border hover:text-white hover:border-white/20 transition-all duration-300"
                  style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                  onClick={() => navigate('/demo')}
                >
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-auto lg:min-w-[260px]">
              {[
                { icon: <Shield size={16} />, color: 'text-emerald-400', text: 'Medical-grade precision' },
                { icon: <Lock size={16} />, color: 'text-blue-400', text: 'HIPAA-grade data security' },
                { icon: <Globe size={16} />, color: 'text-purple-400', text: 'Live global telemetry' },
                { icon: <Zap size={16} />, color: 'text-amber-400', text: 'Real-time AI adaptation' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                     style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.07)' }}>
                  <span className={item.color}>{item.icon}</span>
                  <span className="text-xs text-slate-300 font-medium">{item.text}</span>
                  <CheckCircle size={14} className="text-emerald-400 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Telemetry Footer */}
      <footer className="relative z-10 w-full border-t py-4"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Live Network: <strong className="text-emerald-400 font-mono">{globalScans.toLocaleString()}</strong> total scans
            </span>
          </div>
          
          {/* Live Telemetry Ticker */}
          <div className="overflow-hidden w-full md:max-w-xl">
            <div className="transition-all duration-500">
              <div className="flex items-center gap-2 text-[9px] font-mono">
                <span className={`font-bold ${TELEMETRY[currentTelemetry].color} shrink-0`}>
                  [{TELEMETRY[currentTelemetry].city}]
                </span>
                <span className="text-slate-400 truncate">{TELEMETRY[currentTelemetry].text}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span>© 2025 AuraAI</span>
            <span>·</span>
            <span>Beauty Intelligence OS v4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
