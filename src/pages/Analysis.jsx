import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import { runFullAnalysis } from '../services/aiEngine'
import { Sparkles, Brain, Microscope, FlaskConical, TrendingUp, CheckCircle2, Loader2, ArrowRight, Terminal } from 'lucide-react'

const AGENTS = [
  {
    id: 'dermatologist',
    icon: <Microscope size={24} />,
    name: 'Dermatologist AI',
    role: 'Skin Analysis',
    color: 'var(--aura-primary)',
    glow: 'var(--aura-primary-glow)',
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
    id: 'trichologist',
    icon: <Brain size={24} />,
    name: 'Trichologist AI',
    role: 'Hair & Scalp Analysis',
    color: 'var(--aura-cyan)',
    glow: 'var(--aura-cyan-glow)',
    logs: [
      'Initializing trichology model...',
      'Assessing hair shaft diameter variance...',
      'Mapping scalp microbiome indicators...',
      'Calculating anagen/telogen ratio...',
      'Hair density analysis complete.',
    ]
  },
  {
    id: 'ingredientScientist',
    icon: <FlaskConical size={24} />,
    name: 'Ingredient Scientist',
    role: 'Formula Intelligence',
    color: 'var(--aura-green)',
    glow: 'var(--aura-green-glow)',
    logs: [
      'Loading ingredient database (14,000+ compounds)...',
      'Matching actives to skin concerns...',
      'Running interaction safety check...',
      'Generating bespoke AURA formula code...',
      'Compound ratios optimized.',
    ]
  },
  {
    id: 'beautyCoach',
    icon: <Sparkles size={24} />,
    name: 'Beauty Coach AI',
    role: 'Routine Generation',
    color: 'var(--aura-secondary)',
    glow: 'var(--aura-secondary-glow)',
    logs: [
      'Pulling routine templates from library...',
      'Personalizing AM sequence...',
      'Personalizing PM sequence...',
      'Adding lifestyle micro-adjustments...',
      'Full routine architecture ready.',
    ]
  },
  {
    id: 'outcomePredictor',
    icon: <TrendingUp size={24} />,
    name: 'Outcome Predictor',
    role: 'Forecasting',
    color: 'var(--aura-gold)',
    glow: 'var(--aura-gold-glow)',
    logs: [
      'Loading predictive trajectory model...',
      'Simulating 30-day recovery curve...',
      'Simulating 60-day barrier restoration...',
      'Simulating 90-day peak outcomes...',
      '90-day forecast with confidence intervals ready.',
    ]
  },
]

export default function Analysis() {
  const navigate = useNavigate()
  const { state, dispatch } = useAura()
  const { profile, photoUrl, analysisStatus, agentStatuses } = state
  const [streamLogs, setStreamLogs] = useState([]) // { agentId, text, color }
  const [logTimers, setLogTimers] = useState({})
  const logEndRef = useRef(null)

  useEffect(() => {
    if (!profile || !photoUrl) {
      navigate('/profile')
      return
    }
    if (analysisStatus === 'idle') {
      runFullAnalysis(profile, dispatch)
    }
  }, [profile, photoUrl, analysisStatus, dispatch, navigate])

  // Reset logs when starting a fresh run
  useEffect(() => {
    if (analysisStatus === 'idle') {
      setStreamLogs([])
      setLogTimers({})
    }
  }, [analysisStatus])

  // Dynamic, data-driven log generation based on the user's active profile and objectives
  const getPersonalizedLog = (agentId, logIndex, rawLog) => {
    if (!profile) return rawLog
    const firstName = profile.name ? profile.name.split(' ')[0] : 'User'
    const mainGoalLabel = profile.goals && profile.goals[0]
      ? profile.goals[0].replace(/_/g, ' ')
      : 'skin repair'

    if (agentId === 'dermatologist') {
      if (logIndex === 0) return `Initializing skin type classifier for [${profile.skinType.toUpperCase()}] skin...`
      if (logIndex === 2) return `Analyzing pigmentation distribution & target goals [${mainGoalLabel}]...`
      if (logIndex === 4) {
        if (profile.goals.includes('acne_reduction')) return `Cross-referencing active breakouts and follicular sebum index...`
        return `Cross-referencing epidermal barrier integrity metrics...`
      }
      if (logIndex === 6) return `Skin diagnostic finished. Overall health computed for ${firstName} (${profile.age}y).`
    }

    if (agentId === 'trichologist') {
      if (logIndex === 0) return `Initializing scalp metrics model for [${profile.hairType.toUpperCase()}] structure...`
      if (logIndex === 2) return `Mapping scalp microbiome indicators for target: [${profile.goals.includes('scalp_health') ? 'Scalp Recovery' : 'Follicle Health'}]...`
      if (logIndex === 4) return `Scalp & hair analysis completed for ${firstName}'s ${profile.hairType} profile.`
    }

    if (agentId === 'ingredientScientist') {
      if (logIndex === 1) return `Matching custom actives to address target: [${mainGoalLabel}]...`
      if (logIndex === 3) {
        const formulaCode = `AURA-${profile.age}${profile.skinType.toUpperCase().substring(0,2)}`
        return `Optimizing customized compounds for code ${formulaCode}-XXX...`
      }
    }

    if (agentId === 'beautyCoach') {
      if (logIndex === 0) return `Extracting routine templates optimized for ${profile.skinType} skin...`
      if (logIndex === 3) {
        const hydrationNeeds = profile.waterIntake < 8 ? 'hydration protocol, ' : ''
        const sleepNeeds = profile.sleepHours < 7 ? 'sleep regulation, ' : ''
        return `Structuring lifestyle recommendation: ${hydrationNeeds}${sleepNeeds}exercise optimization...`
      }
    }

    if (agentId === 'outcomePredictor') {
      if (logIndex === 0) return `Loading outcome predictor model for ${firstName}...`
      if (logIndex === 2) return `Simulating day 60 peak barrier restoration curve (Adherence: ${state.simulatorParams?.routineAdherence ?? 70}%)...`
    }

    return rawLog
  }

  // Stream logs when an agent becomes active
  useEffect(() => {
    AGENTS.forEach(agent => {
      const status = agentStatuses[agent.id]
      if (status === 'running' && !logTimers[agent.id]) {
        // Start streaming logs for this agent
        let logIndex = 0
        const addLog = () => {
          if (logIndex < agent.logs.length) {
            setStreamLogs(prev => [...prev, {
              agentId: agent.id,
              text: getPersonalizedLog(agent.id, logIndex, agent.logs[logIndex]),
              color: agent.color,
              ts: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
            }])
            logIndex++
            setTimeout(addLog, 380 + Math.random() * 300)
          }
        }
        addLog()
        setLogTimers(prev => ({ ...prev, [agent.id]: true }))
      }
    })
  }, [agentStatuses]) // eslint-disable-line

  // Auto-scroll log terminal
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [streamLogs])

  const isComplete = analysisStatus === 'complete'
  const completedCount = Object.values(agentStatuses).filter(s => s === 'complete').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--aura-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-1" /><div className="orb orb-2" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={16} color="white" />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>AuraAI</span>
      </div>

      <div style={{ width: '100%', maxWidth: 900, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: 16 }}>
            {isComplete ? <CheckCircle2 size={12} /> : <Loader2 size={12} className="animate-spin" />}
            {isComplete ? 'Analysis Complete' : `Agent ${completedCount + 1} of 5 Active`}
          </div>
          <h2 style={{ marginBottom: 8 }}>
            {isComplete
              ? <span>Your <span className="gradient-text">Beauty Intelligence</span></span>
              : <span>Processing <span className="gradient-text">Beauty Data</span></span>
            }
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isComplete
              ? 'All 5 AI agents have completed their assessment.'
              : 'Our 5 specialized agents are analyzing your profile and photo in parallel.'
            }
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left: Scanner + Agent list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Scanner */}
            <div className="scanner-container" style={{ marginBottom: 0 }}>
              <img src={photoUrl} alt="Analysis Scan" className="scanner-image" style={{ aspectRatio: '3/4', objectFit: 'cover' }} />
              {!isComplete && (
                <div className="scanner-overlay">
                  <div className="scanner-grid" />
                  <div className="scanner-laser" />
                  {agentStatuses.dermatologist === 'running' && (
                    <div className="face-box" data-label="Acne Detect" style={{ top: '30%', left: '20%', width: '15%', height: '15%' }} />
                  )}
                  {agentStatuses.dermatologist === 'running' && (
                    <div className="face-box" data-label="Redness" style={{ top: '50%', left: '60%', width: '20%', height: '20%', borderColor: 'var(--aura-red)' }} />
                  )}
                  {agentStatuses.trichologist === 'running' && (
                    <div className="face-box" data-label="Hair Density" style={{ top: '5%', left: '30%', width: '40%', height: '15%', borderColor: 'var(--aura-secondary)' }} />
                  )}
                  {agentStatuses.ingredientScientist === 'running' && (
                    <div className="face-box" data-label="Pore Analysis" style={{ top: '42%', left: '35%', width: '28%', height: '22%', borderColor: 'var(--aura-green)' }} />
                  )}
                </div>
              )}
              {isComplete && (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--aura-green-glow)', opacity: 0.25 }} />
                  <div style={{
                    position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--aura-green)', color: 'white', padding: '6px 16px',
                    borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <CheckCircle2 size={12} /> SCAN COMPLETE
                  </div>
                </>
              )}
            </div>

            {/* Progress meter */}
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.78rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Progress</span>
                <span style={{ color: 'var(--aura-primary-light)' }}>{completedCount * 20}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: 'var(--glass-bg-strong)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${completedCount * 20}%`,
                  background: 'var(--gradient-primary)', borderRadius: 99,
                  transition: 'width 0.8s ease', boxShadow: '0 0 12px var(--aura-primary-glow)'
                }} />
              </div>
            </div>
          </div>

          {/* Right: Agent cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AGENTS.map((agent) => {
              const status = agentStatuses[agent.id]
              const isActive = status === 'running'
              const isDone = status === 'complete'
              const isPending = status === 'idle'

              return (
                <div key={agent.id} className={`agent-card ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
                  opacity: isPending ? 0.55 : 1,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: isDone ? agent.glow : isActive ? agent.glow : 'var(--glass-bg-strong)',
                    border: `1px solid ${isDone || isActive ? agent.color : 'var(--glass-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isDone || isActive ? agent.color : 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? `0 0 16px ${agent.color}40` : 'none',
                  }}>
                    {agent.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                      <h4 style={{ fontSize: '0.95rem', margin: 0, color: isDone ? 'var(--text-primary)' : isActive ? agent.color : 'var(--text-muted)' }}>
                        {agent.name}
                      </h4>
                      {isDone ? (
                        <span className="badge" style={{ background: 'var(--aura-green-glow)', color: 'var(--aura-green-light)', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.7rem' }}>
                          <CheckCircle2 size={10} /> Done
                        </span>
                      ) : isActive ? (
                        <span className="badge" style={{ background: agent.glow, color: agent.color, border: `1px solid ${agent.color}40`, fontSize: '0.7rem' }}>
                          <Loader2 size={10} className="animate-spin" /> Running
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'var(--glass-bg-strong)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontSize: '0.7rem' }}>
                          Queue
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>{agent.role}</p>
                    {isActive && (
                      <div style={{ marginTop: 8, height: 3, background: 'var(--glass-bg-strong)', borderRadius: 4, overflow: 'hidden' }}>
                        <div className="progress-fill progress-primary" style={{ animation: 'shimmer 2s infinite linear' }} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Terminal Log Feed */}
        <div style={{
          marginTop: 28,
          background: 'rgba(0,0,0,0.7)', borderRadius: 16,
          border: '1px solid rgba(139,92,246,0.25)',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <Terminal size={14} style={{ color: 'var(--aura-primary-light)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Agent Console
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
            </div>
          </div>
          <div style={{ padding: '14px 16px', height: 180, overflowY: 'auto', fontFamily: '"SF Mono", "Fira Code", "Fira Mono", monospace', fontSize: '0.75rem', lineHeight: 1.8 }}>
            {streamLogs.length === 0 ? (
              <span style={{ color: 'var(--text-muted)' }}>{'>'} Initializing AuraAI multi-agent orchestrator...</span>
            ) : (
              streamLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <span style={{ color: '#4B5563', flexShrink: 0 }}>[{log.ts}]</span>
                  <span style={{ color: log.color, flexShrink: 0, fontWeight: 700 }}>
                    [{AGENTS.find(a => a.id === log.agentId)?.name.split(' ')[0].toUpperCase()}]
                  </span>
                  <span style={{ color: '#9CA3AF' }}>{log.text}</span>
                </div>
              ))
            )}
            {!isComplete && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ color: 'var(--aura-primary)' }}>{'>'}</span>
                <span className="animate-pulse" style={{ color: 'var(--aura-primary)', fontWeight: 700 }}>█</span>
              </div>
            )}
            {isComplete && (
              <div style={{ color: 'var(--aura-green)', fontWeight: 700, marginTop: 4 }}>
                {'>'} [ORCHESTRATOR] All 5 agents complete. Intelligence Report ready. ✓
              </div>
            )}
            <div ref={logEndRef} />
          </div>
        </div>

        {isComplete && (
          <div style={{ marginTop: 40, textAlign: 'center', animation: 'fadeIn 0.5s ease 0.5s both' }}>
            <button className="btn btn-primary btn-xl" onClick={() => navigate('/report')} style={{ boxShadow: '0 0 40px var(--aura-primary-glow)', padding: '16px 48px', fontSize: '1.05rem' }}>
              View Intelligence Report <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
