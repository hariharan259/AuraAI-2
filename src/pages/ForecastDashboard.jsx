import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import { runOutcomePredictor } from '../services/aiEngine'
import ForecastLine from '../components/charts/ForecastLine'
import ProgressBar from '../components/ui/ProgressBar'
import { Calendar, Target, ShieldCheck, Zap, Activity } from 'lucide-react'

export default function ForecastDashboard() {
  const navigate = useNavigate()
  const { state } = useAura()
  const result = state.analysisResult
  const [tab, setTab] = useState('day30')
  const [forecast, setForecast] = useState(null)

  useEffect(() => {
    if (result) {
      setForecast(runOutcomePredictor(result.skin, result.hair, state.profile, state.simulatorParams))
    }
  }, [result, state.profile, state.simulatorParams])

  if (!result || !forecast) {
    return (
      <div className="page-content flex-col items-center justify-center text-center" style={{ minHeight: '80vh' }}>
        <h2>No Analysis Found</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/profile')}>Start Analysis</button>
      </div>
    )
  }

  const currentData = forecast[tab]
  const baseData = forecast.current

  const MetricCard = ({ label, current, projected, color }) => {
    const delta = projected - current
    return (
      <div className="p-5 rounded-xl border bg-glass">
        <div className="text-xs font-bold uppercase tracking-wider text-muted mb-3">{label}</div>
        <div className="flex items-end gap-3 mb-2">
          <div className="text-3xl font-display font-bold leading-none" style={{ color }}>{projected}</div>
          <div className={`text-sm font-bold pb-1 ${delta > 0 ? 'text-green' : delta < 0 ? 'text-rose' : 'text-muted'}`}>
            {delta > 0 ? '+' : ''}{delta} from {current}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl mb-2">Outcome Forecast</h1>
          <p className="text-muted text-sm m-0">AI-projected beauty trajectory based on current habits and routines.</p>
        </div>
      </div>

      <div className="tab-bar mb-8" style={{ padding: 4 }}>
        <button className={`tab-btn ${tab === 'day30' ? 'active' : ''}`} onClick={() => setTab('day30')}>
          30 Days
        </button>
        <button className={`tab-btn ${tab === 'day60' ? 'active' : ''}`} onClick={() => setTab('day60')}>
          60 Days
        </button>
        <button className={`tab-btn ${tab === 'day90' ? 'active' : ''}`} onClick={() => setTab('day90')}>
          90 Days
        </button>
      </div>

      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <MetricCard label="Overall Beauty" current={baseData.overallScore} projected={currentData.overallScore} color="var(--aura-primary-light)" />
        <MetricCard label="Skin Health" current={baseData.skinScore} projected={currentData.skinScore} color="var(--aura-green)" />
        <MetricCard label="Hair Health" current={baseData.hairScore} projected={currentData.hairScore} color="var(--aura-cyan)" />
        
        <div className="p-5 rounded-xl border bg-glass flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Forecast Confidence</div>
            <div className="text-2xl font-display font-bold leading-none text-gold mb-3">{currentData.confidence}%</div>
          </div>
          <ProgressBar progress={currentData.confidence} colorClass="progress-gold" />
        </div>
      </div>

      <div className="grid grid-2 gap-6" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        
        <div className="report-section m-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg m-0">Trajectory Chart</h3>
            <div className="badge badge-primary" style={{ background: 'var(--glass-bg-strong)' }}>
              Projecting {tab.replace('day', '')} Days
            </div>
          </div>
          <div style={{ height: 300 }}>
            <ForecastLine data={forecast.chartData.slice(0, tab === 'day30' ? 5 : tab === 'day60' ? 9 : 14)} />
          </div>
        </div>

        <div className="flex-col gap-6">
          <div className="report-section m-0 flex-1">
            <h3 className="text-lg mb-6">Projected Milestones</h3>
            <div className="flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-glow border border-primary flex items-center justify-center shrink-0 text-primary-color">
                  <Target size={16} />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">Acne Clearing Phase</div>
                  <div className="text-xs text-secondary">Significant reduction in active breakouts expected by day 14 based on salicylic acid integration.</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-glow border flex items-center justify-center shrink-0 text-green" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'var(--aura-green-glow)', color: 'var(--aura-green)' }}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">Barrier Restoration</div>
                  <div className="text-xs text-secondary">Skin lipid barrier fully repaired around day 28. Redness scores will drastically improve.</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: 'rgba(6,182,212,0.3)', background: 'var(--aura-cyan-glow)', color: 'var(--aura-cyan)' }}>
                  <Activity size={16} />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">Hair Density Shift</div>
                  <div className="text-xs text-secondary">New anagen phase growth becomes visible around day 60.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border bg-glass border-primary" style={{ background: 'var(--aura-primary-glow)', borderColor: 'rgba(139,92,246,0.3)' }}>
            <div className="flex items-center gap-2 font-bold text-sm text-primary-color mb-2">
              <Zap size={16} /> Accelerate Your Results
            </div>
            <div className="text-xs text-secondary mb-3">
              Your adherence is currently at {state.simulatorParams.routineAdherence}%. Increasing this to 90% will shorten the time to reach your beauty goals by 18 days.
            </div>
            <button className="btn btn-primary btn-sm w-full" onClick={() => navigate('/simulator')}>
              Adjust Routine Habits
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}
