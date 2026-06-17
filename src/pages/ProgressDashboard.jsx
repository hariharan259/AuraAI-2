import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import { generateMockProgress, generateHeatmapData, ACHIEVEMENTS } from '../data/mockProgress'
import TrendSparkline from '../components/charts/TrendSparkline'
import { Award, Flame, Calendar as CalendarIcon, TrendingUp, History, Lock, X } from 'lucide-react'

export default function ProgressDashboard() {
  const navigate = useNavigate()
  const { state, dispatch } = useAura()
  const result = state.analysisResult
  const [history, setHistory] = useState([])
  const [heatmap, setHeatmap] = useState([])

  // Modal states for browsing past scans
  const [showPastModal, setShowPastModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleRowClick = (record) => {
    setSelectedRecord(record)
    setShowPastModal(true)
  }

  const restorePastReport = (record) => {
    if (!result) return
    const newResult = {
      ...result,
      beautyScore: record.beauty,
      skin: {
        ...result.skin,
        overallScore: record.skin,
        acneScore: Math.min(100, Math.round(record.skin * 0.95)),
        pigmentationScore: Math.min(100, Math.round(record.skin * 1.05)),
        rednessScore: Math.min(100, Math.round(record.skin * 0.98)),
        oilinessScore: Math.min(100, Math.round(record.skin * 1.02)),
      },
      hair: {
        ...result.hair,
        overallScore: record.hair,
        hairFallScore: Math.min(100, Math.round(record.hair * 1.02)),
        densityScore: Math.min(100, Math.round(record.hair * 0.96)),
        damageScore: Math.min(100, Math.round(record.hair * 1.04)),
        scalpHealthScore: Math.min(100, Math.round(record.hair * 0.98)),
      },
      timestamp: new Date(record.date + ", " + new Date().getFullYear()).toISOString()
    }
    dispatch({ type: 'SET_ANALYSIS_RESULT', payload: newResult })
    setShowPastModal(false)
  }

  useEffect(() => {
    if (result) {
      setHistory(generateMockProgress(result))
      setHeatmap(generateHeatmapData())
    }
  }, [result])

  if (!result || history.length === 0) {
    return (
      <div className="page-content flex-col items-center justify-center text-center" style={{ minHeight: '80vh' }}>
        <h2>No History Found</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/profile')}>Start Analysis</button>
      </div>
    )
  }

  const currentBeauty = history[0].beauty
  const prevBeauty = history[1]?.beauty || currentBeauty
  const beautyDelta = currentBeauty - prevBeauty

  const TrendCard = ({ title, dataKey, color, data }) => {
    const current = data[0][dataKey]
    const prev = data[1]?.[dataKey] || current
    const delta = current - prev
    
    return (
      <div className="p-5 rounded-xl border bg-glass">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted mb-1">{title}</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold leading-none">{current}</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${delta >= 0 ? 'bg-green-glow text-green' : 'bg-red-glow text-red'}`} style={{ 
                background: delta >= 0 ? 'var(--aura-green-glow)' : 'rgba(239,68,68,0.1)',
                color: delta >= 0 ? 'var(--aura-green)' : '#FCA5A5'
              }}>
                {delta > 0 ? '+' : ''}{delta}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2">
          {/* Reverse array so chart goes past -> present (left to right) */}
          <TrendSparkline data={[...data].reverse()} dataKey={dataKey} color={color} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-content animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl mb-2">Your Progress</h1>
          <p className="text-muted text-sm m-0">Tracking your beauty journey and routine consistency over time.</p>
        </div>
        <div className="flex items-center gap-4 bg-glass border px-4 py-2 rounded-lg" style={{ borderColor: 'var(--aura-gold)' }}>
          <Flame size={20} className="text-gold" />
          <div>
            <div className="text-xs font-bold text-muted uppercase">Current Streak</div>
            <div className="text-lg font-bold text-gold leading-none">12 Days</div>
          </div>
        </div>
      </div>

      {/* Trend Cards */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <TrendCard title="Overall Beauty Score" dataKey="beauty" color="var(--aura-primary-light)" data={history} />
        <TrendCard title="Skin Health" dataKey="skin" color="var(--aura-green)" data={history} />
        <TrendCard title="Hair Health" dataKey="hair" color="var(--aura-cyan)" data={history} />
      </div>

      <div className="grid grid-2 gap-6" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        
        {/* Left Column */}
        <div className="flex-col gap-6">
          
          {/* Routine Heatmap */}
          <div className="report-section m-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg m-0 flex items-center gap-2">
                <CalendarIcon size={18} className="text-primary-color" />
                Routine Consistency
              </h3>
              <div className="text-xs text-muted font-bold">LAST 28 DAYS</div>
            </div>
            
            <div className="heatmap-grid mb-4">
              {heatmap.map((val, i) => (
                <div key={i} className={`heatmap-cell heatmap-${val}`} title={`Adherence: ${val * 25}%`} />
              ))}
            </div>
            
            <div className="flex justify-between items-center text-xs text-muted font-medium">
              <span>Less Consistent</span>
              <div className="flex gap-1">
                {[0,1,2,3,4].map(v => <div key={v} className={`w-3 h-3 rounded-sm heatmap-${v}`} />)}
              </div>
              <span>More Consistent</span>
            </div>
          </div>

          {/* History Log */}
          <div className="report-section m-0 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg m-0 flex items-center gap-2">
                <History size={18} className="text-cyan" />
                Historical Reports
              </h3>
            </div>
            
            <div className="flex-col gap-3">
              {history.slice(0, 4).map((record, i) => (
                <div key={i} onClick={() => handleRowClick(record)} className="flex justify-between items-center p-4 rounded-lg border bg-glass hover:border-primary transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-glass-strong flex items-center justify-center font-bold text-sm">
                      {record.beauty}
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-1">{i === 0 ? 'Latest Scan' : `Analysis Report`}</div>
                      <div className="text-xs text-secondary">{record.date}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-primary-color">View</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Achievements */}
        <div className="report-section m-0" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg m-0 flex items-center gap-2">
              <Award size={18} className="text-gold" />
              Achievements
            </h3>
            <div className="text-xs font-bold text-gold bg-gold-glow px-2 py-1 rounded-full" style={{ background: 'var(--aura-gold-glow)' }}>
              {ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length}
            </div>
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr', alignContent: 'start' }}>
            {ACHIEVEMENTS.map(ach => (
              <div key={ach.id} className={`achievement ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="relative">
                  <div className="achievement-icon">{ach.icon}</div>
                  {!ach.unlocked && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-glass border flex items-center justify-center" style={{ borderColor: 'var(--glass-border)' }}>
                      <Lock size={8} color="var(--text-muted)" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">{ach.title}</div>
                  <div className="text-xs text-secondary">{ach.desc}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-auto pt-6 text-center">
            <div className="text-xs text-muted mb-2">Next Milestone</div>
            <div className="h-2 bg-glass-strong rounded-full overflow-hidden w-full max-w-[200px] mx-auto">
              <div className="h-full bg-gold" style={{ width: '60%', background: 'var(--aura-gold)' }} />
            </div>
            <div className="text-xs text-gold font-bold mt-2">60% to Beauty Star</div>
          </div>
        </div>
      </div>

      {/* Historical Report Modal */}
      {showPastModal && selectedRecord && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Close button */}
          <button 
            onClick={() => setShowPastModal(false)}
            style={{ position: 'absolute', top: 24, right: 24, background: 'var(--glass-bg)', padding: 12, borderRadius: '50%', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            className="btn-secondary"
          >
            <X size={20} color="white" />
          </button>

          <div style={{
            width: '100%', maxWidth: 500, background: 'var(--glass-bg)', backdropFilter: 'blur(24px)',
            border: '1px solid var(--glass-border)', borderRadius: 24, padding: 32, position: 'relative', zIndex: 1,
            animation: 'scaleIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--aura-cyan-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aura-cyan)' }}>
                <History size={22} />
              </div>
              <div>
                <h3 style={{ marginBottom: 2, fontSize: '1.3rem' }}>Historical Analysis Report</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Recorded on {selectedRecord.date}</p>
              </div>
            </div>

            {/* Score Ring Display Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28, justifyItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--aura-primary-light)' }}>{selectedRecord.beauty}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>Beauty Score</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--aura-green)' }}>{selectedRecord.skin}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>Skin Health</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--aura-cyan)' }}>{selectedRecord.hair}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>Hair Health</span>
              </div>
            </div>

            {/* Detail Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span className="text-muted">Routine Adherence:</span>
                <span style={{ color: 'var(--aura-gold-light)', fontWeight: 700 }}>{selectedRecord.routineAdherence}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span className="text-muted">Calibrated Formula:</span>
                <span style={{ color: 'var(--aura-green-light)', fontWeight: 700 }}>AURA-RESTORED-CODE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span className="text-muted">Device Status during scan:</span>
                <span style={{ color: 'var(--aura-cyan-light)', fontWeight: 700 }}>Bluetooth Connected</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, justifySelf: 'flex-end', width: '100%', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowPastModal(false)}>Close</button>
              <button 
                className="btn btn-primary" 
                onClick={() => restorePastReport(selectedRecord)}
              >
                Restore as Active Scan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
