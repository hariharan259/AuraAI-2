import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { runFullAnalysis } from '../services/aiEngine';
import { Sparkles, Brain, Microscope, FlaskConical, TrendingUp, CheckCircle2, Loader2, ArrowRight, Terminal } from 'lucide-react';

const AGENTS = [
  {
    id: 'dermatologist',
    icon: <Microscope size={24} />,
    name: 'Dermatologist AI',
    role: 'Skin Health Analyzer',
    color: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    glow: 'bg-teal-950/20 shadow-glow-primary',
    rawColor: 'var(--aura-primary)',
    logs: [
      'Initializing skin type classifier...',
      'Loading dermatological model v3.2...',
      'Analyzing pigmentation distribution...',
      'Mapping sebaceous gland activity...',
      'Cross-referencing acne severity index...',
      'Computing transepidermal water loss (TEWL)...',
      'Skin health score computed. Root causes identified.',
    ]
  },
  {
    id: 'skinTwinAgent',
    icon: <Brain size={24} />,
    name: 'Skin Twin Architect',
    role: 'Digital Twin Diagnostics',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    glow: 'bg-cyan-950/20 shadow-glow-cyan',
    rawColor: 'var(--aura-cyan)',
    logs: [
      'Initializing digital twin generator...',
      'Synthesizing 3D facial coordinate mapping...',
      'Determining barrier strength structures...',
      'Identifying localized vulnerability zones...',
      'Skin Twin generation completed successfully.',
    ]
  },
  {
    id: 'routineAgent',
    icon: <FlaskConical size={24} />,
    name: 'Ingredient Scientist',
    role: 'Formulation Intelligence',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    glow: 'bg-emerald-950/20 shadow-glow-green',
    rawColor: 'var(--aura-green)',
    logs: [
      'Loading ingredient database (14,000+ compounds)...',
      'Matching active ingredients to concerns...',
      'Executing interaction & conflict safety check...',
      'Optimizing ingredient concentration profiles...',
      'Bespoke skincare formula designed and verified.',
    ]
  },
  {
    id: 'coachAgent',
    icon: <Sparkles size={24} />,
    name: 'Routine Coach',
    role: 'Routine Architect',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    glow: 'bg-purple-950/20 shadow-glow-secondary',
    rawColor: 'var(--aura-primary)',
    logs: [
      'Extracting templates from skincare archives...',
      'Compiling morning skincare sequence steps...',
      'Compiling night recovery routine steps...',
      'Integrating lifestyle & dietary adjustments...',
      'Routine schedule architecture successfully built.',
    ]
  },
  {
    id: 'predictorAgent',
    icon: <TrendingUp size={24} />,
    name: 'Outcome Predictor',
    role: 'Outcome Forecasting',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    glow: 'bg-amber-950/20 shadow-glow-cyan',
    rawColor: 'var(--aura-gold)',
    logs: [
      'Loading outcome predictor forecasting model...',
      'Running 30-day transformation simulations...',
      'Projecting hydration and barrier recovery curves...',
      'Projecting sebum reduction trajectories...',
      '30-day forecast with confidence intervals ready.',
    ]
  },
];

interface LogEntry {
  agentId: string;
  text: string;
  color: string;
  ts: string;
}

export default function Analysis() {
  const navigate = useNavigate();
  const { state, dispatch } = useAura();
  const { profile, photoUrl, analysisStatus, agentStatuses } = state;
  const [streamLogs, setStreamLogs] = useState<LogEntry[]>([]);
  const [logTimers, setLogTimers] = useState<Record<string, boolean>>({});
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile || !photoUrl) {
      navigate('/profile');
      return;
    }
    if (analysisStatus === 'idle') {
      runFullAnalysis(profile, dispatch);
    }
  }, [profile, photoUrl, analysisStatus, dispatch, navigate]);

  // Reset logs when starting a fresh run
  useEffect(() => {
    if (analysisStatus === 'idle') {
      setStreamLogs([]);
      setLogTimers({});
    }
  }, [analysisStatus]);

  // Dynamic, data-driven log generation based on the user's active profile and objectives
  const getPersonalizedLog = (agentId: string, logIndex: number, rawLog: string) => {
    if (!profile) return rawLog;
    const firstName = profile.name ? profile.name.split(' ')[0] : 'User';
    const mainGoalLabel = profile.goals && profile.goals[0]
      ? profile.goals[0].replace(/_/g, ' ')
      : 'skin repair';

    if (agentId === 'dermatologist') {
      if (logIndex === 0) return `Initializing skin type classifier for [${profile.skinType.toUpperCase()}] skin...`;
      if (logIndex === 2) return `Analyzing pigmentation distribution & target goals [${mainGoalLabel}]...`;
      if (logIndex === 4) {
        if (profile.goals.includes('acne_reduction')) return `Cross-referencing active breakouts and follicular sebum index...`;
        return `Cross-referencing epidermal barrier integrity metrics...`;
      }
      if (logIndex === 6) return `Skin diagnostic finished. Overall health computed for ${firstName} (${profile.age}y).`;
    }

    if (agentId === 'skinTwinAgent') {
      if (logIndex === 0) return `Initializing digital twin generator for [${profile.skinType.toUpperCase()}] skin structure...`;
      if (logIndex === 2) return `Determining barrier strength structures for [${profile.skinType}] characteristics...`;
      if (logIndex === 4) return `Digital Twin facial coordinate mapping completed for ${firstName}.`;
    }

    if (agentId === 'routineAgent') {
      if (logIndex === 1) return `Matching custom active compounds to address target concern: [${mainGoalLabel}]...`;
      if (logIndex === 3) {
        const formulaCode = `AURA-${profile.age}${profile.skinType.toUpperCase().substring(0, 2)}`;
        return `Optimizing ingredient concentration profiles for Formula: ${formulaCode}...`;
      }
    }

    if (agentId === 'coachAgent') {
      if (logIndex === 0) return `Extracting routine templates optimized for ${profile.skinType} skin...`;
      if (logIndex === 3) {
        const hydrationNeeds = profile.waterIntake < 8 ? 'hydration protocol, ' : '';
        const sleepNeeds = profile.sleepHours < 7 ? 'sleep regulation, ' : '';
        return `Structuring lifestyle recommendation: ${hydrationNeeds}${sleepNeeds}exercise optimization...`;
      }
    }

    if (agentId === 'predictorAgent') {
      if (logIndex === 0) return `Loading outcome predictor forecasting model for ${firstName}...`;
      if (logIndex === 2) return `Simulating day 30 peak barrier restoration curve (Adherence: ${state.simulatorParams?.routineAdherence ?? 70}%)...`;
    }

    return rawLog;
  };

  // Stream logs when an agent becomes active
  useEffect(() => {
    AGENTS.forEach(agent => {
      const status = agentStatuses[agent.id as keyof typeof agentStatuses];
      if (status === 'running' && !logTimers[agent.id]) {
        let logIndex = 0;
        const addLog = () => {
          if (logIndex < agent.logs.length) {
            setStreamLogs(prev => [...prev, {
              agentId: agent.id,
              text: getPersonalizedLog(agent.id, logIndex, agent.logs[logIndex]),
              color: agent.rawColor,
              ts: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
            }]);
            logIndex++;
            setTimeout(addLog, 300 + Math.random() * 250);
          }
        };
        addLog();
        setLogTimers(prev => ({ ...prev, [agent.id]: true }));
      }
    });
  }, [agentStatuses]); // eslint-disable-line

  // Auto-scroll log terminal
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamLogs]);

  const isComplete = analysisStatus === 'complete';
  const completedCount = Object.values(agentStatuses).filter(s => s === 'complete').length;

  return (
    <div className="min-h-screen bg-aura-bg text-aura-text font-body relative overflow-hidden flex flex-col justify-between p-6">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Header */}
      <nav className="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between border-b border-aura-border relative z-10">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 flex items-center justify-center shadow-glow-primary">
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">AuraAI</h1>
            <span className="text-[9px] text-aura-muted uppercase tracking-widest font-semibold">Dermatology Intelligence</span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-aura-muted bg-black/45 border border-aura-border px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
          System Status: {isComplete ? 'Analysis Finished' : 'Processing Core Telemetry'}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto py-8 relative z-10 flex-grow flex flex-col justify-center">
        
        {/* Info Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-4 animate-bounce">
            {isComplete ? <CheckCircle2 size={12} /> : <Loader2 size={12} className="animate-spin" />}
            {isComplete ? 'Dermatology Diagnostics Complete' : `Processing Pipeline (Agent ${completedCount + 1}/5 active)`}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display mb-3">
            {isComplete ? (
              <span>Your <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Clinical Assessment</span> Ready</span>
            ) : (
              <span>Executing <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Multi-Agent Diagnostics</span></span>
            )}
          </h2>
          <p className="text-sm text-aura-muted max-w-xl mx-auto">
            {isComplete 
              ? 'All 5 specialized agents have synthesized skin barrier indices and custom recommendations.' 
              : 'Our parallel AI cluster is running classification and forecasting models based on your selfie.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Scanner (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            
            {/* Visual Scan Mesh Glass Container */}
            <div className="relative rounded-2xl border border-aura-border overflow-hidden bg-black/40 shadow-xl flex items-center justify-center p-1 group">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Clinical Selfie Scanner" 
                  className="w-full rounded-xl aspect-[3/4] object-cover filter brightness-90 saturate-[0.85] transition-all duration-700"
                />
              ) : (
                <div className="w-full rounded-xl aspect-[3/4] bg-aura-panel flex items-center justify-center text-aura-muted text-xs">
                  No scan image available
                </div>
              )}
              
              {/* Scan overlays */}
              {!isComplete && photoUrl && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Glowing scan line */}
                  <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-teal-500 via-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(20,184,166,0.8)] animate-[scan_3.5s_ease-in-out_infinite]" />
                  
                  {/* Subtle matrix overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_90%)]" />
                  
                  {/* Scanning zones based on active agent */}
                  {agentStatuses.dermatologist === 'running' && (
                    <>
                      <div className="absolute border border-red-500/60 bg-red-500/5 rounded shadow-glow-red top-[20%] left-[25%] w-[20%] h-[15%] flex items-center justify-center">
                        <span className="text-[8px] font-mono text-red-400 bg-black/75 px-1 py-0.5 rounded leading-none">ACNE ZONE</span>
                      </div>
                      <div className="absolute border border-amber-500/60 bg-amber-500/5 rounded shadow-glow-cyan top-[38%] right-[22%] w-[25%] h-[18%] flex items-center justify-center">
                        <span className="text-[8px] font-mono text-amber-400 bg-black/75 px-1 py-0.5 rounded leading-none">UV PIGMENT</span>
                      </div>
                    </>
                  )}
                  
                  {agentStatuses.skinTwinAgent === 'running' && (
                    <div className="absolute border border-cyan-500/60 bg-cyan-500/5 rounded shadow-glow-cyan top-[12%] left-[15%] w-[70%] h-[65%] flex items-center justify-center">
                      <span className="text-[8px] font-mono text-cyan-400 bg-black/75 px-1.5 py-0.5 rounded leading-none">MESH COORDINATION</span>
                    </div>
                  )}

                  {agentStatuses.routineAgent === 'running' && (
                    <div className="absolute border border-emerald-500/60 bg-emerald-500/5 rounded shadow-glow-green bottom-[15%] left-[30%] w-[40%] h-[15%] flex items-center justify-center">
                      <span className="text-[8px] font-mono text-emerald-400 bg-black/75 px-1 py-0.5 rounded leading-none">BARRIER TEST</span>
                    </div>
                  )}
                </div>
              )}

              {/* Complete state shield */}
              {isComplete && (
                <div className="absolute inset-0 bg-teal-500/10 flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-glow-green animate-pulse">
                    <CheckCircle2 size={24} />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-black/85 border border-emerald-500/30 px-3 py-1 rounded-full tracking-wider">
                    SCAN METRICS GENERATED
                  </span>
                </div>
              )}
            </div>

            {/* Overall Progress Meter */}
            <div className="p-4 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <div className="flex justify-between items-center mb-2 text-xs font-bold">
                <span className="text-aura-muted uppercase tracking-wider">Pipeline Synthesis</span>
                <span className="text-teal-400 font-mono">{completedCount * 20}%</span>
              </div>
              <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-purple-500 transition-all duration-700 shadow-glow-primary"
                  style={{ width: `${completedCount * 20}%` }}
                />
              </div>
            </div>

          </div>

          {/* Right Column: Agents & Terminal (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-5">
            
            {/* Agent stack */}
            <div className="flex flex-col gap-3">
              {AGENTS.map((agent) => {
                const status = agentStatuses[agent.id as keyof typeof agentStatuses];
                const isActive = status === 'running';
                const isDone = status === 'complete';
                const isPending = status === 'idle';

                return (
                  <div 
                    key={agent.id} 
                    className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${
                      isActive 
                        ? 'bg-aura-panel border-purple-500/30 shadow-glow-secondary translate-x-1' 
                        : isDone 
                          ? 'bg-aura-panel border-emerald-500/20 opacity-100' 
                          : 'bg-black/20 border-aura-border opacity-50'
                    }`}
                  >
                    {/* Visual glowing feedback sidebar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 animate-pulse" />
                    )}
                    {isDone && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                    )}

                    <div className={`w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                      isDone 
                        ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20' 
                        : isActive 
                          ? `${agent.color} ${agent.borderColor} ${agent.glow}` 
                          : 'text-aura-muted border-aura-border bg-black/20'
                    }`}>
                      {agent.icon}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className={`text-sm font-bold truncate ${
                          isDone 
                            ? 'text-white' 
                            : isActive 
                              ? 'text-white' 
                              : 'text-aura-muted'
                        }`}>
                          {agent.name}
                        </h4>
                        
                        {isDone ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 size={10} /> Completed
                          </span>
                        ) : isActive ? (
                          <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                            <Loader2 size={10} className="animate-spin" /> Processing
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-aura-muted bg-black/30 border border-aura-border px-2 py-0.5 rounded-full">
                            Waiting
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-aura-muted">{agent.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Terminal Monitor */}
            <div className="rounded-xl border border-aura-border bg-black/75 shadow-2xl overflow-hidden font-mono text-[11px] text-aura-muted relative">
              
              {/* Terminal Window Header */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border-b border-aura-border">
                <Terminal size={14} className="text-teal-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-aura-muted">
                  Pipeline Telemetry Feed
                </span>
                <div className="ml-auto flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                </div>
              </div>

              {/* Terminal Output */}
              <div className="p-4 h-[160px] overflow-y-auto flex flex-col gap-1.5 leading-normal select-none">
                {streamLogs.length === 0 ? (
                  <div className="text-aura-muted animate-pulse">
                    &gt; Awaiting multi-agent system initialization...
                  </div>
                ) : (
                  streamLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-gray-600 flex-shrink-0">[{log.ts}]</span>
                      <span className="text-teal-400 font-bold flex-shrink-0">
                        [{AGENTS.find(a => a.id === log.agentId)?.name.split(' ')[0].toUpperCase()}]
                      </span>
                      <span className="text-gray-300 break-all">{log.text}</span>
                    </div>
                  ))
                )}
                {!isComplete && streamLogs.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 text-teal-400 animate-pulse">
                    <span>&gt;</span>
                    <span className="w-1.5 h-3.5 bg-teal-400" />
                  </div>
                )}
                {isComplete && (
                  <div className="text-emerald-400 font-bold mt-2 border-t border-emerald-500/20 pt-2 flex items-center gap-1.5 animate-pulse">
                    ✓ PIPELINE ORCHESTRATION COMPLETE: All telemetry mapped. Redirection node primed.
                  </div>
                )}
                <div ref={logEndRef} />
              </div>
            </div>

          </div>

        </div>

        {/* Navigation Button */}
        {isComplete && (
          <div className="mt-10 text-center animate-[fadeIn_0.5s_ease-out_both]">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-glow-primary transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
              onClick={() => navigate('/report')}
            >
              Access Intelligence Report <ArrowRight size={18} />
            </button>
          </div>
        )}

      </main>

      {/* CSS custom keyframe style injection */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
        }
      `}</style>
      
    </div>
  );
}
