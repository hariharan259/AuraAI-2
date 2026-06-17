import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import { runOutcomePredictor } from '../services/aiEngine'
import ForecastLine from '../components/charts/ForecastLine'
import ScoreRing from '../components/ui/ScoreRing'
import { Sliders, Moon, Droplets, Wind, Activity, ArrowRight, Save, TrendingUp, AlertCircle } from 'lucide-react'

export default function OutcomeSimulator() {
  const navigate = useNavigate()
  const { state, dispatch } = useAura()
  const result = state.analysisResult
  const { simulatorParams } = state

  const [localParams, setLocalParams] = useState(simulatorParams)
  const [forecast, setForecast] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)

  // Before/After comparison slider state
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    let clientX = e.clientX
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX
    }
    if (clientX === undefined) return
    const x = clientX - rect.left
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(position)
  }

  const handleMove = (e) => {
    if (!isDragging) return
    handleMouseMove(e)
  }

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchend', handleMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [])

  // Initialize forecast
  useEffect(() => {
    if (result) {
      setForecast(runOutcomePredictor(result.skin, result.hair, state.profile, localParams))
    }
  }, [result]) // eslint-disable-line

  if (!result || !forecast) {
    return (
      <div className="page-content flex-col items-center justify-center text-center" style={{ minHeight: '80vh' }}>
        <h2>No Analysis Found</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/profile')}>Start Analysis</button>
      </div>
    )
  }

  const updateParam = (field, val) => {
    setLocalParams(prev => ({ ...prev, [field]: val }))
  }

  const handleSimulate = () => {
    setIsSimulating(true)
    // Small delay for visual effect
    setTimeout(() => {
      setForecast(runOutcomePredictor(result.skin, result.hair, state.profile, localParams))
      setIsSimulating(false)
    }, 600)
  }

  const handleSave = () => {
    dispatch({ type: 'SET_SIMULATOR_PARAMS', payload: localParams })
    navigate('/forecast')
  }

  const getImpactLabel = (field) => {
    const base = state.profile[field === 'routineAdherence' ? 'stressLevel' : field] || 0
    const current = localParams[field]
    if (field === 'routineAdherence') {
      return current > 50 ? 'Positive' : 'Negative'
    }
    if (field === 'stressLevel') {
      return current < state.profile.stressLevel ? 'Positive' : 'Neutral'
    }
    return current > base ? 'Positive' : current < base ? 'Negative' : 'Neutral'
  }

  const impactColor = (field) => {
    const label = getImpactLabel(field)
    return label === 'Positive' ? 'var(--aura-green)' : label === 'Negative' ? 'var(--aura-red)' : 'var(--text-muted)'
  }

  const baseScore = forecast.current.overallScore
  const projectedScore = forecast.day90.overallScore
  const delta = projectedScore - baseScore

  return (
    <div className="page-content animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="badge badge-primary mb-3">
            <TrendingUp size={12} /> Signature Feature
          </div>
          <h1 className="text-2xl mb-2">Outcome Simulator</h1>
          <p className="text-muted text-sm m-0">Test scenarios to see how lifestyle changes affect your 90-day forecast.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary" onClick={() => setLocalParams(state.profile)}>Reset to Baseline</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Save & View Forecast
          </button>
        </div>
      </div>

      <div className="grid grid-2 gap-8" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
        
        {/* Sliders Panel */}
        <div className="sim-panel">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
            <Sliders size={20} className="text-primary-color" />
            <h3 className="text-lg m-0">Scenario Parameters</h3>
          </div>

          <div className="sim-row">
            <div className="sim-label">
              <span className="flex items-center gap-2 text-sm text-secondary font-medium"><Moon size={14} className="text-primary-color" /> Sleep Hours / Night</span>
              <span className="sim-value" style={{ color: 'var(--aura-primary-light)' }}>{localParams.sleepHours}h</span>
            </div>
            <input type="range" className="form-range" min="4" max="10" step="0.5" value={localParams.sleepHours} onChange={e => updateParam('sleepHours', Number(e.target.value))} />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted">Less</span>
              <span style={{ color: impactColor('sleepHours'), fontWeight: 600 }}>{getImpactLabel('sleepHours')} Impact</span>
            </div>
          </div>

          <div className="sim-row">
            <div className="sim-label">
              <span className="flex items-center gap-2 text-sm text-secondary font-medium"><Droplets size={14} className="text-cyan" /> Water Intake / Day</span>
              <span className="sim-value" style={{ color: 'var(--aura-cyan-light)' }}>{localParams.waterIntake} glasses</span>
            </div>
            <input type="range" className="form-range" min="2" max="15" value={localParams.waterIntake} onChange={e => updateParam('waterIntake', Number(e.target.value))} style={{ '--range-color': 'var(--aura-cyan)' }} />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted">Less</span>
              <span style={{ color: impactColor('waterIntake'), fontWeight: 600 }}>{getImpactLabel('waterIntake')} Impact</span>
            </div>
          </div>

          <div className="sim-row">
            <div className="sim-label">
              <span className="flex items-center gap-2 text-sm text-secondary font-medium"><Wind size={14} className="text-rose" /> Stress Level</span>
              <span className="sim-value" style={{ color: 'var(--aura-secondary-light)' }}>{localParams.stressLevel}/10</span>
            </div>
            <input type="range" className="form-range" min="1" max="10" value={localParams.stressLevel} onChange={e => updateParam('stressLevel', Number(e.target.value))} style={{ '--range-color': 'var(--aura-secondary)' }} />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted">Low</span>
              <span style={{ color: impactColor('stressLevel'), fontWeight: 600 }}>{getImpactLabel('stressLevel')} Impact</span>
            </div>
          </div>

          <div className="sim-row" style={{ borderBottom: 'none' }}>
            <div className="sim-label">
              <span className="flex items-center gap-2 text-sm text-secondary font-medium"><Activity size={14} className="text-gold" /> Routine Adherence</span>
              <span className="sim-value" style={{ color: 'var(--aura-gold-light)' }}>{localParams.routineAdherence}%</span>
            </div>
            <input type="range" className="form-range" min="10" max="100" step="10" value={localParams.routineAdherence} onChange={e => updateParam('routineAdherence', Number(e.target.value))} style={{ '--range-color': 'var(--aura-gold)' }} />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted">Sporadic</span>
              <span style={{ color: impactColor('routineAdherence'), fontWeight: 600 }}>{getImpactLabel('routineAdherence')} Impact</span>
            </div>
          </div>

          <button className="btn btn-primary w-full mt-6" onClick={handleSimulate} disabled={isSimulating}>
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>

        {/* Projection Panel */}
        <div className="flex-col gap-6">
          
          <div className="grid gap-6" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
            {/* Hackathon Fix: Live Photo Simulation with Interactive Split Slider */}
            <div 
              ref={sliderRef}
              className="photo-outcome-container"
              style={{
                position: 'relative',
                aspectRatio: '1',
                overflow: 'hidden',
                borderRadius: 16,
                border: '1px solid var(--glass-border)',
                cursor: 'ew-resize',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
              onMouseMove={handleMove}
              onTouchMove={handleMove}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            >
              {isSimulating && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,8,0.7)', backdropFilter: 'blur(4px)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--aura-primary)' }}></div>
                </div>
              )}
              
              {/* Raw Baseline Selfie (Left side background) */}
              <img 
                src={state.photoUrl} 
                alt="Baseline Skin" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} 
              />
              <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 5 }} className="badge bg-glass text-xs">Baseline</div>

              {/* Glowing Projected Selfie (Right side overlay clipped) */}
              <img 
                src={state.photoUrl} 
                alt="Day 90 Prediction" 
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  pointerEvents: 'none',
                  clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                  filter: `
                    brightness(${100 + (delta * 1.5)}%) 
                    contrast(${100 + (delta * 0.8)}%) 
                    saturate(${100 + (delta * 2)}%) 
                    sepia(${delta < 0 ? Math.abs(delta) * 2 : 0}%)
                    blur(${delta < -5 ? 1 : 0}px)
                  `
                }} 
              />
              <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 5 }} className="badge badge-primary text-xs">Day 90 Projected</div>

              {/* Drag Handle Divider Line */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  bottom: 0, 
                  left: `${sliderPosition}%`, 
                  width: 2, 
                  background: 'var(--aura-primary)', 
                  boxShadow: '0 0 8px var(--aura-primary-glow)',
                  zIndex: 6,
                  pointerEvents: 'none'
                }} 
              />
              
              {/* Drag Handle Draggable Button knob */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: `${sliderPosition}%`, 
                  transform: 'translate(-50%, -50%)',
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%',
                  background: 'rgba(5, 5, 8, 0.85)',
                  border: '2px solid var(--aura-primary)',
                  boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  zIndex: 7,
                  pointerEvents: 'none'
                }}
              >
                ↔
              </div>
            </div>

            <div className="flex-col gap-6">
              <div className="report-section text-center p-6 flex-col items-center justify-center m-0 flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-muted mb-4">Current Score</div>
                <ScoreRing score={baseScore} size={90} label="" />
              </div>
              
              <div className="report-section text-center p-6 flex-col items-center justify-center m-0 flex-1" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: delta > 0 ? 'var(--aura-green-glow)' : delta < 0 ? 'rgba(239,68,68,0.1)' : 'transparent', opacity: 0.3 }} />
                <div className="text-xs font-bold uppercase tracking-wider text-muted mb-4">Day 90 Projection</div>
                <ScoreRing score={projectedScore} size={90} label="" />
                <div className={`text-sm font-bold mt-4 flex items-center gap-1 ${delta > 0 ? 'text-green' : delta < 0 ? 'text-rose' : 'text-muted'}`}>
                  {delta > 0 ? '+' : ''}{delta} Points
                </div>
              </div>
            </div>
          </div>

          <div className="report-section m-0" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 className="text-lg mb-6">Simulation Trajectory</h4>
            <div style={{ flex: 1, minHeight: 250, opacity: isSimulating ? 0.5 : 1, transition: 'opacity 0.3s' }}>
              <ForecastLine data={forecast.chartData} />
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <div className="flex items-center gap-2 text-xs text-muted font-medium">
                <div className="w-2 h-2 rounded-full bg-primary" style={{ background: 'var(--aura-primary)' }} /> Overall
              </div>
              <div className="flex items-center gap-2 text-xs text-muted font-medium">
                <div className="w-2 h-2 rounded-full bg-green" style={{ background: 'var(--aura-green)' }} /> Skin
              </div>
              <div className="flex items-center gap-2 text-xs text-muted font-medium">
                <div className="w-2 h-2 rounded-full bg-cyan" style={{ background: 'var(--aura-cyan)' }} /> Hair
              </div>
            </div>
          </div>
          
          {delta < 0 && (
            <div className="info-box danger">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm mb-1 text-rose">Warning: Negative Trajectory</div>
                <div className="text-xs text-secondary">Your current simulation settings will result in a decrease in your overall beauty score. Try increasing routine adherence or improving lifestyle factors.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
