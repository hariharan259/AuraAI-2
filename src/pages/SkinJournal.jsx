import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import {
  Sun, Moon, Droplets, Wind, Apple, Camera, Send,
  CheckCircle2, Flame, Smile, Frown, Meh, Star,
  TrendingUp, TrendingDown, Minus, BookOpen, Plus, X
} from 'lucide-react'

const MOODS = [
  { id: 'great', icon: <Smile size={22} />, label: 'Great', color: 'var(--aura-green)' },
  { id: 'okay', icon: <Meh size={22} />, label: 'Okay', color: 'var(--aura-gold)' },
  { id: 'bad', icon: <Frown size={22} />, label: 'Rough', color: 'var(--aura-secondary)' },
]

const SKIN_FEELINGS = [
  'Hydrated', 'Oily', 'Dry', 'Itchy', 'Sensitive', 'Balanced', 'Glowing', 'Dull', 'Tight', 'Irritated'
]

const QUICK_TAGS = [
  { label: '☀️ Wore SPF', id: 'spf' },
  { label: '💧 Drank 8 glasses', id: 'water' },
  { label: '😴 8h sleep', id: 'sleep' },
  { label: '🥗 Ate clean', id: 'clean_eat' },
  { label: '🏃 Exercised', id: 'exercise' },
  { label: '🧴 AM Routine', id: 'am_routine' },
  { label: '🌙 PM Routine', id: 'pm_routine' },
  { label: '🧘 Low stress', id: 'low_stress' },
]

function generateJournalInsight(entry) {
  const insights = []
  if (entry.tags.includes('spf') && entry.tags.includes('am_routine')) {
    insights.push({ type: 'positive', text: 'Perfect AM combo! SPF + routine = maximum photoprotection today. 🌟' })
  }
  if (entry.tags.includes('sleep') && entry.tags.includes('pm_routine')) {
    insights.push({ type: 'positive', text: 'Full recovery cycle tonight. Night routine + 8h sleep triggers peak skin repair.' })
  }
  if (entry.mood === 'bad' && entry.tags.includes('low_stress')) {
    insights.push({ type: 'info', text: 'Skin can feel rough even on low-stress days. Check hydration levels.' })
  }
  if (entry.skinFeelings.includes('Oily') && !entry.tags.includes('clean_eat')) {
    insights.push({ type: 'warning', text: 'High sebum often correlates with diet. Try logging meals for 3 days.' })
  }
  if (entry.skinFeelings.includes('Hydrated')) {
    insights.push({ type: 'positive', text: 'Hydration signals are strong! Your barrier is functioning well today.' })
  }
  if (insights.length === 0) {
    insights.push({ type: 'info', text: 'Keep logging daily. Patterns emerge after 7 entries and drive smarter AI analysis.' })
  }
  return insights
}

function getMockHistory() {
  const now = Date.now()
  const day = 86400000
  return [
    { date: new Date(now - day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'great', score: 82, skinFeelings: ['Hydrated', 'Glowing'], tags: ['spf', 'water', 'am_routine', 'pm_routine'] },
    { date: new Date(now - 2 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'okay', score: 76, skinFeelings: ['Balanced'], tags: ['am_routine', 'exercise'] },
    { date: new Date(now - 3 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'bad', score: 68, skinFeelings: ['Dry', 'Tight'], tags: ['pm_routine'] },
    { date: new Date(now - 4 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'great', score: 80, skinFeelings: ['Hydrated'], tags: ['spf', 'water', 'sleep', 'am_routine', 'pm_routine', 'low_stress'] },
    { date: new Date(now - 5 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'okay', score: 74, skinFeelings: ['Oily', 'Balanced'], tags: ['am_routine', 'clean_eat'] },
    { date: new Date(now - 6 * day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), mood: 'great', score: 79, skinFeelings: ['Glowing'], tags: ['spf', 'exercise', 'sleep'] },
  ]
}

export default function SkinJournal() {
  const navigate = useNavigate()
  const { state } = useAura()
  const result = state.analysisResult

  const [step, setStep] = useState('check') // check | insights | history
  const [entry, setEntry] = useState({
    mood: null,
    skinFeelings: [],
    tags: [],
    note: '',
    submitted: false,
  })
  const [insights, setInsights] = useState([])
  const [history] = useState(getMockHistory())
  const [streak] = useState(7)
  const [showNoteInput, setShowNoteInput] = useState(false)

  const toggleFeeling = (f) => {
    setEntry(e => ({
      ...e,
      skinFeelings: e.skinFeelings.includes(f) ? e.skinFeelings.filter(x => x !== f) : [...e.skinFeelings, f]
    }))
  }

  const toggleTag = (id) => {
    setEntry(e => ({
      ...e,
      tags: e.tags.includes(id) ? e.tags.filter(x => x !== id) : [...e.tags, id]
    }))
  }

  const handleSubmit = () => {
    const generatedInsights = generateJournalInsight(entry)
    setInsights(generatedInsights)
    setEntry(e => ({ ...e, submitted: true }))
    setStep('insights')
  }

  const canSubmit = entry.mood && entry.skinFeelings.length > 0

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  if (!result) {
    return (
      <div className="page-content flex-col items-center justify-center text-center" style={{ minHeight: '80vh' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📓</div>
        <h2>Skin Journal Awaits</h2>
        <p className="text-muted mt-4 mb-8">Complete your first AI analysis to unlock daily skin tracking.</p>
        <button className="btn btn-primary" onClick={() => navigate('/profile')}>Start Analysis →</button>
      </div>
    )
  }

  return (
    <div className="page-content animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-start mb-8" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="badge badge-primary mb-3" style={{ background: 'var(--aura-gold-glow)', color: 'var(--aura-gold-light)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <Flame size={12} /> {streak}-Day Streak
          </div>
          <h1 className="text-2xl mb-2">Daily Skin Journal</h1>
          <p className="text-muted text-sm m-0">{today}</p>
        </div>
        <div className="flex gap-3">
          <button
            className={`btn btn-sm ${step === 'check' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStep('check')}
          >
            Today's Check-in
          </button>
          <button
            className={`btn btn-sm ${step === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStep('history')}
          >
            <BookOpen size={14} /> History
          </button>
        </div>
      </div>

      {/* Today Check-in */}
      {step === 'check' && !entry.submitted && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {/* Left: Main Entry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Mood */}
            <div className="report-section" style={{ marginBottom: 0 }}>
              <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>How's your skin feeling today? ✨</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                {MOODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setEntry(e => ({ ...e, mood: m.id }))}
                    style={{
                      flex: 1, padding: '16px 12px', borderRadius: 14,
                      border: `2px solid ${entry.mood === m.id ? m.color : 'var(--glass-border)'}`,
                      background: entry.mood === m.id ? `${m.color}20` : 'var(--glass-bg)',
                      color: entry.mood === m.id ? m.color : 'var(--text-secondary)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    {m.icon}
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Feelings */}
            <div className="report-section" style={{ marginBottom: 0 }}>
              <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>Skin characteristics right now</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SKIN_FEELINGS.map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFeeling(f)}
                    className={`pill ${entry.skinFeelings.includes(f) ? 'selected' : ''}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="report-section" style={{ marginBottom: 0 }}>
              {!showNoteInput ? (
                <button
                  onClick={() => setShowNoteInput(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                    padding: '12px 16px', borderRadius: 12, border: '1px dashed var(--glass-border)',
                    background: 'transparent', color: 'var(--text-muted)', fontSize: '0.85rem',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <Plus size={16} /> Add a personal note...
                </button>
              ) : (
                <div>
                  <label className="form-label" style={{ marginBottom: 8 }}>Personal Note</label>
                  <textarea
                    className="form-input"
                    placeholder="e.g. Tried new moisturizer last night, skin feels different..."
                    value={entry.note}
                    onChange={e => setEntry(prev => ({ ...prev, note: e.target.value }))}
                    rows={3}
                    style={{ resize: 'vertical', minHeight: 80 }}
                  />
                </div>
              )}
            </div>

            <button
              className="btn btn-primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
              style={{ padding: '14px 32px', fontSize: '1rem' }}
            >
              <Send size={16} /> Submit Today's Entry
            </button>
          </div>

          {/* Right: Quick Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="report-section" style={{ marginBottom: 0 }}>
              <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>Today's Activities</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                Tag habits that affect your skin. These power your AI recommendations.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {QUICK_TAGS.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderRadius: 12,
                      border: `1px solid ${entry.tags.includes(tag.id) ? 'var(--aura-green)' : 'var(--glass-border)'}`,
                      background: entry.tags.includes(tag.id) ? 'var(--aura-green-glow)' : 'var(--glass-bg)',
                      color: entry.tags.includes(tag.id) ? 'var(--aura-green-light)' : 'var(--text-secondary)',
                      fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{tag.label}</span>
                    {entry.tags.includes(tag.id) && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Streak widget */}
            <div style={{
              padding: 20, borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(236,72,153,0.15) 100%)',
              border: '1px solid rgba(245,158,11,0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Flame size={20} style={{ color: 'var(--aura-gold)' }} />
                <span style={{ fontWeight: 700, color: 'var(--aura-gold-light)' }}>{streak}-Day Streak!</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                You're on fire! 🔥 Consistent check-ins improve AI prediction accuracy by <strong style={{ color: 'var(--aura-gold)' }}>34%</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights after submission */}
      {step === 'insights' && (
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* Success banner */}
          <div style={{
            textAlign: 'center', padding: '32px 24px', marginBottom: 32,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.12) 100%)',
            border: '1px solid var(--aura-green)',
            borderRadius: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h3 style={{ marginBottom: 8 }}>Today's entry logged!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Day {streak} of your streak. Your AI models are updating in real-time.
            </p>
          </div>

          {/* AI Insights */}
          <div className="report-section" style={{ marginBottom: 24 }}>
            <div className="report-section-header" style={{ marginBottom: 20 }}>
              <div className="report-icon" style={{ background: 'var(--aura-primary-glow)', color: 'var(--aura-primary)' }}>
                ✨
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Today's AI Insights</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{
                  padding: '14px 18px', borderRadius: 12,
                  border: `1px solid ${ins.type === 'positive' ? 'rgba(16,185,129,0.3)' : ins.type === 'warning' ? 'rgba(245,158,11,0.3)' : 'var(--glass-border)'}`,
                  background: ins.type === 'positive' ? 'var(--aura-green-glow)' : ins.type === 'warning' ? 'var(--aura-gold-glow)' : 'var(--glass-bg)',
                }}>
                  <p style={{
                    margin: 0, fontSize: '0.9rem', lineHeight: 1.6,
                    color: ins.type === 'positive' ? 'var(--aura-green-light)' : ins.type === 'warning' ? 'var(--aura-gold-light)' : 'var(--text-secondary)'
                  }}>
                    {ins.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Entry summary */}
          <div className="report-section" style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16, fontSize: '0.95rem' }}>Entry Summary</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span className="badge badge-primary">
                {MOODS.find(m => m.id === entry.mood)?.label} day
              </span>
              {entry.skinFeelings.map(f => (
                <span key={f} className="badge" style={{ background: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>{f}</span>
              ))}
              {entry.tags.map(t => (
                <span key={t} className="badge" style={{ background: 'var(--aura-green-glow)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--aura-green-light)' }}>
                  {QUICK_TAGS.find(q => q.id === t)?.label}
                </span>
              ))}
            </div>
            {entry.note && (
              <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{entry.note}"
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setStep('history')}>
              <BookOpen size={14} /> View History
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/report')}>
              View Beauty Report →
            </button>
          </div>
        </div>
      )}

      {/* History view */}
      {step === 'history' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
            {/* Streak stats */}
            <div style={{
              padding: 24, borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(236,72,153,0.12))',
              border: '1px solid rgba(245,158,11,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Flame size={22} style={{ color: 'var(--aura-gold)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--aura-gold-light)' }}>
                  {streak}-Day Journal Streak
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Your consistency unlocks better AI predictions every day.
              </p>
            </div>

            {/* Average score */}
            <div style={{
              padding: 24, borderRadius: 20,
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                7-Day Avg Skin Score
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--aura-primary-light)', lineHeight: 1 }}>
                {Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--aura-green)', marginTop: 6 }}>
                +4 vs prior week
              </div>
            </div>
          </div>

          {/* Journal entries */}
          <div className="report-section">
            <h3 style={{ marginBottom: 20 }}>Past Entries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.map((h, i) => {
                const mood = MOODS.find(m => m.id === h.mood)
                const trend = i < history.length - 1 
                  ? h.score > history[i + 1].score ? 'up' 
                    : h.score < history[i + 1].score ? 'down' 
                    : 'flat'
                  : 'flat'
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', borderRadius: 14,
                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                    transition: 'all 0.2s', cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--glass-border-hover)'; e.currentTarget.style.background = 'var(--glass-bg-hover)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'var(--glass-bg)' }}
                  >
                    <div style={{ 
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: mood ? `${mood.color}20` : 'var(--glass-bg-strong)',
                      color: mood?.color,
                    }}>
                      {mood?.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{h.date}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {h.skinFeelings.map(f => (
                          <span key={f} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20, background: 'var(--glass-bg-strong)', color: 'var(--text-muted)' }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--aura-primary-light)' }}>
                          {h.score}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>score</div>
                      </div>
                      <div style={{ color: trend === 'up' ? 'var(--aura-green)' : trend === 'down' ? '#FCA5A5' : 'var(--text-muted)' }}>
                        {trend === 'up' ? <TrendingUp size={16} /> : trend === 'down' ? <TrendingDown size={16} /> : <Minus size={16} />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
