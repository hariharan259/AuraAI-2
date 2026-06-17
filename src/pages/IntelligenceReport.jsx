import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import SkinRadar from '../components/charts/SkinRadar'
import HairBar from '../components/charts/HairBar'
import ScoreRing from '../components/ui/ScoreRing'
import { Sliders, Download, AlertTriangle, Lightbulb, Sun, Moon, Calendar, Info, Microscope, Brain, FlaskConical, ArrowRight, X, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react'

export default function IntelligenceReport() {
  const navigate = useNavigate()
  const { state, dispatch } = useAura()
  const result = state.analysisResult
  const [routineTab, setRoutineTab] = useState('morning')
  const [showAuraCard, setShowAuraCard] = useState(false)
  const [cardFlipped, setCardFlipped] = useState(false)

  // Formulation Sandbox state
  const [showSandbox, setShowSandbox] = useState(false)
  const [sandboxCompounds, setSandboxCompounds] = useState([])
  const [safetyScore, setSafetyScore] = useState(100)
  const [safetyAlerts, setSafetyAlerts] = useState([])
  const [customFormulaCode, setCustomFormulaCode] = useState('')

  const openSandbox = () => {
    if (result && result.ingredients && result.ingredients.customFormula) {
      const initial = result.ingredients.customFormula.compounds.map(c => ({
        name: c.name,
        percentage: parseFloat(c.percentage) || 1.0
      }))
      setSandboxCompounds(initial)
      
      const name = result.ingredients.customFormula.name
      const match = name.match(/AURA-[A-Z0-9]+/)
      setCustomFormulaCode(match ? match[0] : `AURA-${result.profile.age}${result.profile.skinType.toUpperCase().substring(0,2)}`)
      
      const check = runSafetyChecks(initial)
      setSafetyScore(check.score)
      setSafetyAlerts(check.alerts)
      setShowSandbox(true)
    }
  }

  const runSafetyChecks = (compounds) => {
    let score = 100
    let alerts = []

    compounds.forEach(c => {
      const pct = c.percentage
      if (c.name === 'Retinol' && pct > 1.5) {
        score -= 20
        alerts.push(`High Retinol warning (${pct}%): Potential skin flaking or dryness. Recommended concentration <= 1.0%.`)
      }
      if (c.name === 'Salicylic Acid' && pct > 2.0) {
        score -= 15
        alerts.push(`High Salicylic Acid warning (${pct}%): Risk of stinging or irritation. Recommended standard: <= 2.0%.`)
      }
      if (c.name === 'Vitamin C' && pct > 15.0) {
        score -= 10
        alerts.push(`High Vitamin C warning (${pct}%): Acidic formulas may irritate sensitive tissue. Recommended <= 10.0%.`)
      }
      if (pct > 5.0) {
        score -= 5
        alerts.push(`Concentration limit exceeded: ${c.name} at ${pct}% is higher than usual over-the-counter limits.`)
      }
    })

    const names = compounds.map(c => c.name.toLowerCase())
    if (names.includes('retinol') && names.includes('vitamin c')) {
      score -= 25
      alerts.push('Retinol + Vitamin C conflict: Concurrent application compromises formula pH and skin barriers. Alternate: C in AM, Retinol in PM.')
    }
    if (names.includes('salicylic acid') && names.includes('retinol')) {
      score -= 25
      alerts.push('Salicylic Acid + Retinol conflict: High risk of over-exfoliation. Alternate nights.')
    }

    if (result.profile && result.profile.skinType === 'sensitive') {
      const highActives = compounds.filter(c => ['Retinol', 'Salicylic Acid', 'Alpha Arbutin', 'Vitamin C'].includes(c.name) && c.percentage > 1.0)
      if (highActives.length > 0) {
        score -= 10
        alerts.push(`Sensitive skin safety protocol: High active dosages (${highActives.map(a => a.name).join(', ')}) can cause irritation.`)
      }
    }

    return { score: Math.max(0, score), alerts }
  }

  useEffect(() => {
    if (sandboxCompounds.length > 0) {
      const check = runSafetyChecks(sandboxCompounds)
      setSafetyScore(check.score)
      setSafetyAlerts(check.alerts)
    }
  }, [sandboxCompounds])

  const updateSandboxCompound = (idx, value) => {
    setSandboxCompounds(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], percentage: value }
      return next
    })
  }

  const saveSandboxFormula = () => {
    const updatedResult = {
      ...result,
      ingredients: {
        ...result.ingredients,
        customFormula: {
          ...result.ingredients.customFormula,
          name: `AuraAI Custom Serum ${customFormulaCode}`,
          compounds: sandboxCompounds.map(c => ({
            name: c.name,
            percentage: c.percentage.toFixed(1) + '%'
          }))
        }
      }
    }
    dispatch({ type: 'SET_ANALYSIS_RESULT', payload: updatedResult })
    setShowSandbox(false)
  }

  if (!result) {
    return (
      <div className="page-content flex-col items-center justify-center text-center" style={{ minHeight: '80vh' }}>
        <h2>No Analysis Found</h2>
        <p className="text-muted mt-4 mb-8">Please complete your beauty profile and photo upload first.</p>
        <button className="btn btn-primary" onClick={() => navigate('/profile')}>Start Analysis</button>
      </div>
    )
  }

  const { skin, hair, ingredients, routine } = result

  return (
    <div className="page-content animate-fadeIn">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl mb-2">Beauty Intelligence Report</h1>
          <p className="text-muted text-sm">Generated on {new Date(result.timestamp).toLocaleDateString()}</p>
        </div>
        <button className="btn btn-secondary btn-sm">
          <Download size={14} /> Download PDF
        </button>
      </div>

      {/* Executive Summary */}
      <div className="report-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'var(--gradient-mesh)', opacity: 0.5, pointerEvents: 'none' }} />
        <h3 className="mb-6">Executive Summary</h3>
        <div className="grid grid-3 gap-8">
          <div className="flex-col items-center text-center">
            <ScoreRing score={result.beautyScore} size={140} label="Overall Beauty" />
          </div>
          <div className="flex-col items-center text-center">
            <ScoreRing score={skin.overallScore} size={140} label="Skin Health" />
          </div>
          <div className="flex-col items-center text-center">
            <ScoreRing score={hair.overallScore} size={140} label="Hair Health" />
          </div>
        </div>
      </div>

      {/* Holographic Beauty Aura Card Teaser */}
      <div className="report-section flex justify-between items-center gap-8" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(6,182,212,0.06) 100%)', position: 'relative', overflow: 'hidden', flexWrap: 'wrap' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(139,92,246,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        
        <div style={{ flex: '1.2', minWidth: 280, zIndex: 1 }}>
          <div className="badge badge-primary mb-3">Viral Growth Archetype</div>
          <h3 style={{ marginBottom: 12 }}>Your Bespoke Beauty Aura</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
            Generate your holographic <strong>Aura Trading Card</strong> to share your skincare profile and active ingredient composition on Instagram or TikTok.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ padding: '4px 12px', background: 'var(--glass-bg)', borderRadius: 20, border: '1px solid var(--glass-border)' }}>✨ Holographic Card Effect</span>
            <span style={{ padding: '4px 12px', background: 'var(--glass-bg)', borderRadius: 20, border: '1px solid var(--glass-border)' }}>🔮 Archetype: {skin.overallScore > 75 ? 'Glow Core' : 'Barrier Shield'}</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => setShowAuraCard(true)}>
              View Holographic Card
            </button>
            <button className="btn btn-secondary" onClick={() => alert("Social share archetype code generated!")}>
              Share Archetype
            </button>
          </div>
        </div>

        <div style={{ flex: '0.8', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1, minWidth: 200 }}>
          <div className="aura-card-teaser-glow" onClick={() => setShowAuraCard(true)} style={{ cursor: 'pointer' }}>
            <div className="card-mock-skew">
              <div className="card-inner-glow" />
              <div className="card-title">AURA CARD</div>
              <div className="card-score">{result.beautyScore}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2 gap-6 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Skin Analysis */}
        <div className="report-section" style={{ marginBottom: 0 }}>
          <div className="report-section-header">
            <div className="report-icon" style={{ background: 'var(--aura-primary-glow)', color: 'var(--aura-primary)' }}>
              <Microscope size={20} />
            </div>
            <h3 className="text-xl m-0">Skin Diagnostics</h3>
          </div>
          
          <div className="mb-6">
            <SkinRadar data={skin} />
          </div>

          <div className="mb-6">
            <h5 className="mb-3 text-sm text-muted uppercase tracking-wider">Identified Concerns</h5>
            <div className="flex-col gap-2">
              {skin.concerns.length > 0 ? skin.concerns.map(c => (
                <div key={c.id} className="flex justify-between items-center p-3 rounded-md border bg-glass">
                  <span className="font-medium text-sm">{c.label}</span>
                  <span className={`badge ${c.severity === 'Severe' ? 'badge-danger' : 'badge-warning'}`}>{c.severity}</span>
                </div>
              )) : (
                <div className="p-3 rounded-md border bg-glass text-sm text-green flex items-center gap-2">
                  <CheckCircle2 size={16} /> No major skin concerns identified.
                </div>
              )}
            </div>
          </div>

          <div>
            <h5 className="mb-3 text-sm text-muted uppercase tracking-wider">Root Causes</h5>
            <ul className="flex-col gap-2 m-0 pl-0" style={{ listStyle: 'none' }}>
              {skin.rootCauses.map((cause, i) => (
                <li key={i} className="flex gap-3 text-sm text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" style={{ background: 'var(--aura-primary)' }} />
                  {cause}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hair Analysis */}
        <div className="report-section" style={{ marginBottom: 0 }}>
          <div className="report-section-header">
            <div className="report-icon" style={{ background: 'var(--aura-cyan-glow)', color: 'var(--aura-cyan)' }}>
              <Brain size={20} />
            </div>
            <h3 className="text-xl m-0">Hair Diagnostics</h3>
          </div>
          
          <div className="mb-6">
            <HairBar data={hair} />
          </div>

          <div className="mb-6">
            <h5 className="mb-3 text-sm text-muted uppercase tracking-wider">Identified Concerns</h5>
            <div className="flex-col gap-2">
              {hair.concerns.length > 0 ? hair.concerns.map(c => (
                <div key={c.id} className="flex justify-between items-center p-3 rounded-md border bg-glass">
                  <span className="font-medium text-sm">{c.label}</span>
                  <span className={`badge ${c.severity === 'Severe' ? 'badge-danger' : 'badge-warning'}`}>{c.severity}</span>
                </div>
              )) : (
                <div className="p-3 rounded-md border bg-glass text-sm text-green flex items-center gap-2">
                  <CheckCircle2 size={16} /> No major hair concerns identified.
                </div>
              )}
            </div>
          </div>

          <div>
            <h5 className="mb-3 text-sm text-muted uppercase tracking-wider">Root Causes</h5>
            <ul className="flex-col gap-2 m-0 pl-0" style={{ listStyle: 'none' }}>
              {hair.rootCauses.map((cause, i) => (
                <li key={i} className="flex gap-3 text-sm text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0 mt-1.5" style={{ background: 'var(--aura-cyan)' }} />
                  {cause}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ingredient Intelligence */}
      <div className="report-section">
        <div className="report-section-header">
          <div className="report-icon" style={{ background: 'var(--aura-green-glow)', color: 'var(--aura-green)' }}>
            <FlaskConical size={20} />
          </div>
          <h3 className="text-xl m-0">Ingredient Intelligence</h3>
        </div>

        {/* Hackathon Addition: Custom Formulation */}
        {ingredients.customFormula && (
          <div className="mb-8 p-6 rounded-xl border" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))', borderColor: 'var(--aura-green)' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                  <span className="badge badge-success">Bespoke AI Formulation</span>
                  <button className="btn btn-secondary btn-xs" onClick={openSandbox} style={{ display: 'inline-flex', padding: '2px 8px', fontSize: '0.65rem', alignItems: 'center', gap: 4, height: 22 }}>
                    <Sliders size={10} /> Refine in Sandbox
                  </button>
                </div>
                <h4 className="text-2xl font-display font-bold m-0">{ingredients.customFormula.name}</h4>
                <div className="text-sm text-secondary mt-1">Base: {ingredients.customFormula.base}</div>
              </div>
              <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-glass-strong" style={{ borderColor: 'var(--aura-green)' }}>
                <FlaskConical size={24} className="text-green" />
              </div>
            </div>
            
            <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              {ingredients.customFormula.compounds.map((comp, idx) => (
                <div key={idx} className="p-3 bg-glass border rounded-lg">
                  <div className="text-xl font-bold text-green mb-1">{comp.percentage}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">{comp.name}</div>
                </div>
              ))}
            </div>

            {/* Smart Dispenser Integration */}
            <div style={{ marginBottom: 20, padding: 12, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--aura-cyan-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Pre-order Aura Smart Dispenser Bundle
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <li>🧬 Bluetooth 5.2 vanity dispenser automatically syncs daily formula changes</li>
                <li>🧪 Precise triple-chamber cartridge micro-dosing mixing technology</li>
                <li>☀️ Environmental adjustments (UV/Humidity) active on every dispense</li>
              </ul>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: 'rgba(16,185,129,0.2)', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRE-ORDER PROMOTION</div>
                <div className="text-2xl font-bold font-display text-green">$149 <span className="text-xs text-muted" style={{ fontWeight: 'normal' }}>+ $49/mo</span></div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Includes Smart Dispenser + monthly bespoke cartridges</div>
              </div>
              <button className="btn" style={{ background: 'var(--gradient-primary)', color: 'white', fontWeight: 'bold' }}>
                Pre-order Dispenser Bundle
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h5 className="mb-4 text-sm text-muted uppercase tracking-wider">Recommended Actives</h5>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {ingredients.recommendations.map(ing => (
              <div key={ing.id} className="p-4 rounded-lg border bg-glass hover:border-primary transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{ing.icon}</span>
                    <span className="font-bold text-sm">{ing.name}</span>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{ing.concentration}</span>
                </div>
                <div className="text-xs text-secondary mb-3">{ing.mechanism}</div>
                <div className="flex flex-wrap gap-1">
                  {ing.benefits.slice(0, 2).map(b => (
                    <span key={b} className="ingredient-chip benefit" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                      <CheckCircle2 size={10} /> {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {(ingredients.interactions.length > 0 || ingredients.risks.length > 0) && (
          <div className="grid grid-2 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {ingredients.interactions.length > 0 && (
              <div className="info-box warning">
                <Info size={18} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm mb-2 text-gold">Ingredient Interactions</div>
                  <ul className="text-sm m-0 pl-4 text-secondary flex-col gap-2">
                    {ingredients.interactions.map((inter, i) => <li key={i}>{inter}</li>)}
                  </ul>
                </div>
              </div>
            )}
            {ingredients.risks.length > 0 && (
              <div className="info-box danger">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm mb-2" style={{ color: '#FCA5A5' }}>Usage Risks & Precautions</div>
                  <ul className="text-sm m-0 pl-4 text-secondary flex-col gap-2">
                    {ingredients.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Routine Generation */}
      <div className="report-section">
        <div className="report-section-header">
          <div className="report-icon" style={{ background: 'var(--aura-secondary-glow)', color: 'var(--aura-secondary)' }}>
            <Sparkles size={20} />
          </div>
          <h3 className="text-xl m-0">Personalized Routine</h3>
        </div>

        <div className="tab-bar mb-6">
          <button className={`tab-btn ${routineTab === 'morning' ? 'active' : ''}`} onClick={() => setRoutineTab('morning')}>
            <div className="flex items-center gap-2"><Sun size={14} /> Morning</div>
          </button>
          <button className={`tab-btn ${routineTab === 'night' ? 'active' : ''}`} onClick={() => setRoutineTab('night')}>
            <div className="flex items-center gap-2"><Moon size={14} /> Night</div>
          </button>
          <button className={`tab-btn ${routineTab === 'weekly' ? 'active' : ''}`} onClick={() => setRoutineTab('weekly')}>
            <div className="flex items-center gap-2"><Calendar size={14} /> Weekly</div>
          </button>
        </div>

        <div className="flex-col gap-3">
          {routine[`${routineTab}Routine`].map((step, i) => (
            <div key={i} className="routine-step">
              <div className="routine-step-num">{routineTab === 'weekly' ? step.day.substring(0, 3) : step.step}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-sm text-primary-color">{routineTab === 'weekly' ? step.treatment : step.product}</div>
                  <div className="badge" style={{ background: 'var(--glass-bg-strong)', fontSize: '0.65rem' }}>{step.duration}</div>
                </div>
                {routineTab === 'weekly' && <div className="text-xs text-muted mb-2 font-medium">{step.product}</div>}
                <div className="text-sm text-secondary mb-2">{step.why}</div>
                {step.tip && (
                  <div className="text-xs flex items-start gap-1.5 p-2 rounded bg-glass border" style={{ borderColor: 'var(--glass-border-hover)' }}>
                    <Lightbulb size={12} className="text-gold shrink-0 mt-0.5" />
                    <span className="text-muted">Tip: {step.tip}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Teaser */}
      <div className="flex justify-between items-center p-6 rounded-xl border mt-8 mb-8" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))', borderColor: 'rgba(139,92,246,0.3)' }}>
        <div>
          <h4 className="mb-2 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-color" />
            Want to see how this routine affects your future?
          </h4>
          <p className="text-sm text-secondary m-0">Test scenarios and view your 90-day forecast in the Outcome Simulator.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/simulator')}>
          Launch Simulator <ArrowRight size={16} />
        </button>
      </div>

      {/* Holographic Card Modal */}
      {showAuraCard && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Close button */}
          <button 
            onClick={() => { setShowAuraCard(false); setCardFlipped(false); }}
            style={{ position: 'absolute', top: 24, right: 24, background: 'var(--glass-bg)', padding: 12, borderRadius: '50%', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            className="btn-secondary"
          >
            <X size={20} color="white" />
          </button>

          {/* Interactive Card Container */}
          <div className="holo-card-wrapper animate-scaleIn">
            <div 
              className={`holo-card ${cardFlipped ? 'flipped' : ''}`}
              onClick={() => setCardFlipped(!cardFlipped)}
              style={{ cursor: 'pointer' }}
            >
              <div className="holo-card-shine" />
              
              {/* Card Front */}
              <div className="holo-card-front">
                <div className="holo-card-inner">
                  {/* Header */}
                  <div className="holo-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={12} className="text-primary-color" />
                      <span className="holo-brand">AURA OPERATING SYSTEM</span>
                    </div>
                    <span className="holo-serial">#{(result.timestamp % 10000 || 8491).toString().padStart(4, '0')}</span>
                  </div>

                  {/* Body Core - Aura Glow */}
                  <div className="holo-card-body">
                    <div className="holo-aura-orb" style={{
                      background: `radial-gradient(circle, ${skin.overallScore > 75 ? 'var(--aura-cyan)' : 'var(--aura-primary)'} 0%, var(--aura-secondary) 50%, transparent 100%)`
                    }} />
                    <div className="holo-score-display">
                      <span className="holo-score-val">{result.beautyScore}</span>
                      <span className="holo-score-lbl">Aura Score</span>
                    </div>
                    <div className="holo-tap-hint">Tap Card to Flip 🔄</div>
                  </div>

                  {/* Footer details */}
                  <div className="holo-card-footer">
                    <div className="holo-archetype-section">
                      <div className="holo-arch-label">ARCHETYPE</div>
                      <div className="holo-arch-val">{skin.overallScore > 75 ? 'GLOW HYBRID' : 'BARRIER SHIELD'}</div>
                    </div>
                    
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div>
                        <div className="holo-stat-label">SKIN NODE</div>
                        <div className="holo-stat-value text-green">{skin.overallScore}</div>
                      </div>
                      <div>
                        <div className="holo-stat-label">HAIR NODE</div>
                        <div className="holo-stat-value text-cyan">{hair.overallScore}</div>
                      </div>
                      <div>
                        <div className="holo-stat-label">FORMULA</div>
                        <div className="holo-stat-value" style={{ fontSize: '0.65rem', color: 'var(--aura-gold-light)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 80 }}>
                          {ingredients.customFormula?.name || 'AURA BASE'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Back */}
              <div className="holo-card-back">
                <div className="holo-card-inner">
                  {/* Header */}
                  <div className="holo-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FlaskConical size={12} className="text-green" />
                      <span className="holo-brand">BESPOKE COMPOUND MATRIX</span>
                    </div>
                    <span className="holo-serial">REV: 2.1</span>
                  </div>

                  {/* Back Content */}
                  <div className="holo-card-back-body" style={{ margin: '18px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8 }}>
                        ACTIVE CARTRIDGE FORMULATION
                      </div>
                      {ingredients.customFormula?.compounds.map((comp, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                          <span className="text-secondary">{comp.name}</span>
                          <span style={{ color: 'var(--aura-green-light)', fontWeight: 700 }}>{comp.percentage}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8 }}>
                        VANITY CALIBRATION DATA
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4 }}>
                        <span className="text-muted">UV Calibration:</span>
                        <span style={{ color: 'var(--aura-secondary-light)', fontWeight: 600 }}>8.4 Index (Shield Active)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4 }}>
                        <span className="text-muted">Humidity Sync:</span>
                        <span style={{ color: 'var(--aura-cyan-light)', fontWeight: 600 }}>72% (Hydration Calibrated)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span className="text-muted">Dispenser Link:</span>
                        <span style={{ color: 'var(--aura-green-light)', fontWeight: 600 }}>Bluetooth Connected</span>
                      </div>
                    </div>

                    <div className="holo-tap-hint">Tap Card to Flip 🔄</div>
                  </div>

                  {/* Back Footer */}
                  <div className="holo-card-footer" style={{ textAlign: 'center', background: 'var(--aura-primary-glow)', borderColor: 'rgba(139,92,246,0.3)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'white', fontWeight: 700, letterSpacing: '0.05em' }}>
                      AURA DIGITAL VANITY HARDWARE SYSTEM
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 16, width: '100%', maxWidth: 360, justifySelf: 'center' }}>
            <button className="btn btn-primary w-full" onClick={(e) => { e.stopPropagation(); alert("Card saved to device photos! Ready for Instagram / TikTok share."); }}>
              Download Card
            </button>
            <button className="btn btn-secondary w-full" onClick={(e) => { e.stopPropagation(); alert("Social share link copied to clipboard!"); }}>
              Copy Share Link
            </button>
          </div>
        </div>
      )}

      {/* Formulation Sandbox Modal */}
      {showSandbox && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Close button */}
          <button 
            onClick={() => setShowSandbox(false)}
            style={{ position: 'absolute', top: 24, right: 24, background: 'var(--glass-bg)', padding: 12, borderRadius: '50%', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            className="btn-secondary"
          >
            <X size={20} color="white" />
          </button>

          <div style={{
            width: '100%', maxWidth: 580, background: 'var(--glass-bg)', backdropFilter: 'blur(24px)',
            border: '1px solid var(--glass-border)', borderRadius: 24, padding: 32, position: 'relative', zIndex: 1,
            animation: 'scaleIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--aura-green-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aura-green)' }}>
                <FlaskConical size={22} />
              </div>
              <div>
                <h3 style={{ marginBottom: 2, fontSize: '1.3rem' }}>Bespoke Formulation Sandbox</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Tweak active percentages and run live safety calibrations.</p>
              </div>
            </div>

            {/* Safety Score Section */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20, padding: 16,
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
              borderRadius: 16, marginBottom: 24
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: safetyScore >= 80 ? 'var(--aura-green)' : safetyScore >= 60 ? 'var(--aura-gold)' : 'var(--aura-secondary)' }}>
                  {safetyScore}%
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Safety Score</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 6, borderRadius: 99, background: 'var(--glass-bg-strong)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${safetyScore}%`,
                    background: safetyScore >= 80 ? 'var(--aura-green)' : safetyScore >= 60 ? 'var(--aura-gold)' : 'var(--aura-secondary)',
                    borderRadius: 99, transition: 'width 0.4s ease'
                  }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                  {safetyScore >= 80 ? '✓ Formulation is highly safe for daily application.' : safetyScore >= 60 ? '⚠ Moderate caution: Check warnings below.' : '☠ High irritation risk: Lower compound percentages.'}
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
              {sandboxCompounds.map((comp, idx) => {
                const maxVal = comp.name === 'Vitamin C' ? 20 : comp.name === 'Retinol' ? 3 : 5
                const stepVal = comp.name === 'Retinol' ? 0.1 : 0.2
                const unitVal = '%'

                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{comp.name}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--aura-green-light)' }}>{comp.percentage.toFixed(1)}{unitVal}</span>
                    </div>
                    <input 
                      type="range" 
                      className="form-range" 
                      min={0.1} 
                      max={maxVal} 
                      step={stepVal} 
                      value={comp.percentage} 
                      onChange={e => updateSandboxCompound(idx, parseFloat(e.target.value))}
                      style={{ '--range-color': 'var(--aura-green)' }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Live Alerts */}
            {safetyAlerts.length > 0 && (
              <div style={{
                maxHeight: 120, overflowY: 'auto', padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 12, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8
              }}>
                {safetyAlerts.map((alt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.75rem', color: '#FCA5A5' }}>
                    <span style={{ color: 'var(--aura-secondary)', fontWeight: 'bold' }}>⚠</span>
                    <span>{alt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowSandbox(false)}>Cancel</button>
              <button 
                className="btn btn-primary" 
                onClick={saveSandboxFormula}
                disabled={safetyScore < 40}
              >
                Synthesize Custom Formula
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
