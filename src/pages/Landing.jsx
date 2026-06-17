import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, Brain, Microscope, FlaskConical, Dumbbell,
  TrendingUp, ArrowRight, Star, Shield, Zap, BarChart3,
  Activity, CheckCircle2, ChevronRight, Eye, Layers
} from 'lucide-react'

const AGENTS = [
  {
    icon: <Microscope size={24} />,
    name: 'Dermatologist',
    role: 'Skin Analysis Agent',
    color: 'var(--aura-primary)',
    glow: 'var(--aura-primary-glow)',
    tasks: ['Acne & redness analysis', 'Pigmentation mapping', 'Root cause diagnosis', 'Skin health scoring'],
    output: 'Skin Health Score + Root Cause Report',
  },
  {
    icon: <Brain size={24} />,
    name: 'Trichologist',
    role: 'Hair Analysis Agent',
    color: 'var(--aura-cyan)',
    glow: 'var(--aura-cyan-glow)',
    tasks: ['Hair fall assessment', 'Scalp condition analysis', 'Hair density mapping', 'Damage evaluation'],
    output: 'Hair Health Score + Recovery Plan',
  },
  {
    icon: <FlaskConical size={24} />,
    name: 'Ingredient Scientist',
    role: 'Formulation Intelligence',
    color: 'var(--aura-green)',
    glow: 'var(--aura-green-glow)',
    tasks: ['Active ingredient matching', 'Interaction analysis', 'Risk identification', 'Alternative suggestions'],
    output: 'Ingredient Intelligence Report',
  },
  {
    icon: <Sparkles size={24} />,
    name: 'Beauty Coach',
    role: 'Routine Architect',
    color: 'var(--aura-secondary)',
    glow: 'var(--aura-secondary-glow)',
    tasks: ['Morning routine design', 'Night routine curation', 'Weekly treatments', 'Lifestyle coaching'],
    output: 'Personalized Beauty Routine',
  },
  {
    icon: <TrendingUp size={24} />,
    name: 'Outcome Predictor',
    role: 'Forecast Intelligence',
    color: 'var(--aura-gold)',
    glow: 'var(--aura-gold-glow)',
    tasks: ['30/60/90-day projections', 'Scenario simulation', 'Confidence scoring', 'Timeline estimation'],
    output: '90-Day Beauty Forecast',
  },
]

const FEATURES = [
  { icon: <Eye size={20} />, title: 'AI Photo Analysis', desc: 'Upload or capture a photo for instant multi-dimensional skin and hair analysis', color: 'var(--aura-primary)' },
  { icon: <Activity size={20} />, title: 'Live Health Scoring', desc: 'Real-time scores across 8+ beauty metrics updated with every analysis', color: 'var(--aura-cyan)' },
  { icon: <Layers size={20} />, title: 'Ingredient Intelligence', desc: 'Science-backed ingredient recommendations with interaction warnings', color: 'var(--aura-green)' },
  { icon: <Zap size={20} />, title: 'Outcome Simulator', desc: 'Test "what if" scenarios and visualize your beauty outcomes before they happen', color: 'var(--aura-gold)' },
  { icon: <BarChart3 size={20} />, title: '90-Day Forecasting', desc: 'AI-powered beauty forecasts with confidence intervals and milestone tracking', color: 'var(--aura-secondary)' },
  { icon: <Shield size={20} />, title: 'Progress Intelligence', desc: 'Track your beauty journey with trend analysis and achievement milestones', color: 'var(--aura-primary)' },
]

const STATS = [
  { value: '98.2%', label: 'Analysis Accuracy' },
  { value: '5', label: 'AI Agents' },
  { value: '12+', label: 'Skin Metrics' },
  { value: '90-Day', label: 'Forecasting' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Your Profile', desc: 'Tell us about your skin type, lifestyle habits, and beauty goals in under 3 minutes.' },
  { step: '02', title: 'Upload Your Photo', desc: 'Take or upload a selfie. Our AI analyses it across multiple beauty dimensions instantly.' },
  { step: '03', title: 'Multi-Agent Analysis', desc: '5 specialized AI agents run in parallel — each producing expert-level beauty intelligence.' },
  { step: '04', title: 'Get Your Forecast', desc: 'Receive a full report, personalized routine, and 90-day outcome forecast tailored to you.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [globalScans, setGlobalScans] = useState(1283492)
  const [modelUpdates, setModelUpdates] = useState(28491)
  const [tickingIncrement, setTickingIncrement] = useState(2.3)
  const [networkSignals, setNetworkSignals] = useState([
    { id: 1, text: "Tokyo: Dryness spike detected. Auto-adjusting ceramide profiles.", time: "JUST NOW", color: "var(--aura-cyan-light)" },
    { id: 2, text: "Miami: UV alert (UV 9.2). Antioxidant defense active.", time: "12s ago", color: "var(--aura-secondary-light)" },
    { id: 3, text: "London: Humidity drops. Boosting Hyaluronic concentration.", time: "44s ago", color: "var(--aura-green-light)" },
    { id: 4, text: "Paris: Sebum imbalance detected. Niacinamide optimization complete.", time: "2m ago", color: "var(--aura-gold-light)" },
  ])

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setGlobalScans(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 1200)

    const updateInterval = setInterval(() => {
      setModelUpdates(prev => prev + (Math.random() > 0.7 ? 1 : 0))
    }, 4000)

    const signalList = [
      "New York: Sudden wind chill. Adjusting moisture lock.",
      "Singapore: Extreme humidity. Sebaceous suppression active.",
      "Sydney: Extreme UV (10.1). High-potency UV filters locked.",
      "Berlin: Pollution spike. Shield barrier antioxidants synced.",
      "Seoul: Microdust alert. Double barrier cleansing advised.",
      "San Francisco: Coastal fog. Humidity buffer routine updated."
    ]

    const signalInterval = setInterval(() => {
      setNetworkSignals(prev => {
        const nextSignals = [...prev]
        nextSignals.pop()
        const randomText = signalList[Math.floor(Math.random() * signalList.length)]
        const colors = ["var(--aura-cyan-light)", "var(--aura-secondary-light)", "var(--aura-green-light)", "var(--aura-gold-light)"]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        nextSignals.unshift({
          id: Date.now(),
          text: randomText,
          time: "JUST NOW",
          color: randomColor
        })
        nextSignals[1].time = "12s ago"
        nextSignals[2].time = "44s ago"
        nextSignals[3].time = "2m ago"
        return nextSignals
      })
    }, 6000)

    return () => {
      clearInterval(scanInterval)
      clearInterval(updateInterval)
      clearInterval(signalInterval)
    }
  }, [])

  return (
    <div style={{ background: 'var(--aura-bg)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Ambient Background */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 64,
        background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px var(--aura-primary-glow)',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>
            AuraAI
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: 8 }}>
            5 AI Agents · Real-time Analysis
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/profile')}>
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section" style={{ paddingTop: 100 }}>
        <div className="container">
          <div style={{ maxWidth: 700 }}>
            <div className="hero-badge">
              <Sparkles size={12} />
              AI-Powered Beauty Intelligence Platform
            </div>
            <h1 className="hero-title">
              Your Personal
              <br />
              <span className="gradient-text">AI Beauty</span>
              <br />
              Intelligence System
            </h1>
            <p className="hero-sub">
              Stop guessing. Start knowing. AuraAI combines 5 specialized AI agents to analyze your skin, hair, and lifestyle — then forecasts your beauty outcomes 90 days into the future.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
              <button className="btn btn-primary btn-xl" onClick={() => navigate('/profile')}>
                Begin Your Analysis <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary btn-xl" onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                How It Works
              </button>
            </div>

            {/* Mini trust indicators */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {['Photo Analysis', 'Ingredient Science', '90-Day Forecast', 'Progress Tracking'].map(tag => (
                <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={14} color="var(--aura-green)" />
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual — floating dashboard mockup */}
          <div style={{
            position: 'absolute', right: '5%', top: '50%',
            transform: 'translateY(-50%)',
            width: 340, display: 'none',
          }} className="hero-visual">
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section style={{ padding: '48px 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {STATS.map(stat => (
              <div key={stat.label} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AURA GLOBAL NETWORK DATA MOAT ===== */}
      <section style={{ padding: '64px 0', background: 'rgba(5,5,8,0.3)', borderBottom: '1px solid var(--glass-border)', position: 'relative' }}>
        {/* Glow behind the ticker */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'center' }} className="global-network-grid">
            <div>
              <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: 16 }}>
                <Activity size={12} className="text-green animate-pulse" />
                Aura proprietary data moat
              </div>
              <h2 style={{ marginBottom: 16, fontSize: '2rem' }}>
                The Aura Global Network
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Every analysis feeds back into our global model. Skincare routines dynamically adapt to shifting micro-climates, regional UV indices, and localized humidity trends.
              </p>
              <div style={{ marginTop: 24, padding: '16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 12 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--aura-green-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--aura-green)', display: 'inline-block', boxShadow: '0 0 8px var(--aura-green)' }} />
                  Continuous Model Sync Active
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8, marginBottom: 0 }}>
                  Active node feedback loop integrates skin biome changes, environmental stress indexes, and product ingredient efficacy scores in real time.
                </p>
              </div>
            </div>

            {/* Live Ticking Monitor */}
            <div style={{ 
              background: 'rgba(10, 10, 20, 0.6)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: 20, 
              padding: 28, 
              backdropFilter: 'blur(20px)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Live Network Metrics
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                  5 AI AGENTS SYNCED
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                <div style={{ padding: 16, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Scans Processed
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4, fontFamily: 'monospace' }}>
                    {globalScans.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--aura-green-light)', marginTop: 4 }}>
                    +{(tickingIncrement / 1.5).toFixed(1)}/sec
                  </div>
                </div>
                <div style={{ padding: 16, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Model Syncs / Hour
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--aura-cyan-light)', marginTop: 4, fontFamily: 'monospace' }}>
                    {modelUpdates.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Auto-calibrating nodes
                  </div>
                </div>
              </div>

              {/* Live Signal Feed */}
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 16 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  Real-time Neural Diagnostics
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: 110, overflow: 'hidden', position: 'relative' }}>
                  {networkSignals.map((sig, idx) => (
                    <div key={sig.id} className="network-signal-row" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '0.75rem',
                      opacity: idx === 0 ? 1 : idx === 1 ? 0.7 : 0.4,
                      transition: 'all 0.5s ease',
                      paddingBottom: 4,
                      borderBottom: '1px solid rgba(255,255,255,0.02)'
                    }}>
                      <span className="text-secondary">{sig.text}</span>
                      <span style={{ color: sig.color, fontWeight: 600, fontSize: '0.7rem' }}>{sig.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AI AGENTS SECTION ===== */}
      <section className="section" id="agents">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: 16 }}>
              <Brain size={12} />
              Multi-Agent Intelligence Architecture
            </div>
            <h2>5 Specialized AI Agents<br /><span className="gradient-text">Working For You</span></h2>
            <p style={{ maxWidth: 540, margin: '16px auto 0', color: 'var(--text-secondary)' }}>
              Each agent is a specialist. Together they form a complete AI beauty intelligence system that no single model can match.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {AGENTS.map((agent, i) => (
              <div key={agent.name} className="glass-card" style={{
                padding: 24,
                animationDelay: `${i * 0.1}s`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(to right, transparent, ${agent.color}, transparent)`,
                  opacity: 0.8,
                }} />
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: agent.glow,
                  border: `1px solid ${agent.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16, color: agent.color,
                }}>
                  {agent.icon}
                </div>
                <div className="badge badge-primary" style={{ marginBottom: 10, fontSize: '0.65rem' }}>
                  Agent {i + 1}
                </div>
                <h4 style={{ marginBottom: 4 }}>{agent.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>{agent.role}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {agent.tasks.map(task => (
                    <li key={task} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: agent.color, flexShrink: 0 }} />
                      {task}
                    </li>
                  ))}
                </ul>
                <div style={{
                  padding: '8px 12px',
                  background: agent.glow,
                  borderRadius: 8,
                  fontSize: '0.75rem', fontWeight: 600,
                  color: agent.color,
                  border: `1px solid ${agent.color}30`,
                }}>
                  Output: {agent.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <h2>Everything You Need For<br /><span className="gradient-text-gold">Intelligent Beauty Care</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="feature-icon" style={{ background: `${f.color}20`, color: f.color }}>
                  {f.icon}
                </div>
                <h5 style={{ marginBottom: 8 }}>{f.title}</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <h2>From Photo to Forecast<br /><span className="gradient-text-cyan">In Minutes</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, position: 'relative' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700,
                    background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1,
                  }}>
                    {step.step}
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <ChevronRight size={20} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                  )}
                </div>
                <div>
                  <h4 style={{ marginBottom: 8, fontSize: '1.05rem' }}>{step.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUTCOME SIMULATOR SPOTLIGHT ===== */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.06) 100%)',
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: 16, display: 'inline-flex' }}>
                <Star size={10} /> Signature Feature
              </div>
              <h2 style={{ marginBottom: 16 }}>
                Beauty Outcome<br /><span className="gradient-text">Simulator</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
                Test "what if" scenarios before committing. Adjust your sleep, water intake, stress levels, and routine adherence — and watch your 90-day beauty forecast update in real time.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {[
                  '"What if I improve my sleep from 5h to 8h?"',
                  '"What if I drink 10 glasses of water daily?"',
                  '"What if I follow my routine for 60 days?"',
                ].map(q => (
                  <div key={q} style={{
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 10,
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                  }}>
                    {q}
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/profile')}>
                Try the Simulator <ArrowRight size={16} />
              </button>
            </div>
            <div style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
              padding: 32,
              backdropFilter: 'blur(20px)',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20 }}>
                Outcome Simulator Preview
              </div>
              {[
                { label: 'Sleep Hours', from: 5, to: 8, impact: '+12% skin', color: 'var(--aura-primary)' },
                { label: 'Water Intake', from: 4, to: 10, impact: '+8% glow', color: 'var(--aura-cyan)' },
                { label: 'Stress Level', from: 8, to: 3, impact: '+15% hair', color: 'var(--aura-green)' },
                { label: 'Routine Adherence', from: 30, to: 90, impact: '+22% overall', color: 'var(--aura-gold)' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--aura-green)', background: 'var(--aura-green-glow)', padding: '2px 8px', borderRadius: 99 }}>
                      {item.impact}
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--glass-bg-strong)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '75%', background: `linear-gradient(to right, ${item.color}60, ${item.color})`, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: 24, padding: '16px', background: 'var(--aura-primary-glow)',
                border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--aura-primary-light)', fontWeight: 600, marginBottom: 4 }}>
                  PROJECTED 90-DAY OUTCOME
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--aura-primary-light)', lineHeight: 1 }}>
                  +34%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Overall Beauty Score Improvement
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section">
        <div className="container text-center">
          <div style={{
            maxWidth: 640, margin: '0 auto',
            padding: 56,
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 28,
            backdropFilter: 'blur(20px)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 28,
              background: 'var(--gradient-primary)', opacity: 0.04, pointerEvents: 'none',
            }} />
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 40px var(--aura-primary-glow)',
            }}>
              <Sparkles size={28} color="white" />
            </div>
            <h2 style={{ marginBottom: 12 }}>
              Ready to Transform<br />
              <span className="gradient-text">Your Beauty Journey?</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.8 }}>
              Join the platform that turns beauty care into measurable, predictable science. Your personalized AI analysis takes less than 5 minutes.
            </p>
            <button
              className="btn btn-primary btn-xl"
              onClick={() => navigate('/profile')}
              style={{ fontSize: '1.05rem', padding: '16px 40px' }}
            >
              Start Your Free Analysis <ArrowRight size={18} />
            </button>
            <p style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              No account required · Instant results · 5 AI agents working for you
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 32px',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={13} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>AuraAI</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
          © 2026 AuraAI · Your Personal AI Beauty Intelligence System
        </p>
      </footer>
    </div>
  )
}
