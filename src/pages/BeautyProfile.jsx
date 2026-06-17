import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import { ArrowRight, ArrowLeft, Sparkles, User, Droplets, Moon, Wind, Apple, Dumbbell, Target, Check } from 'lucide-react'

const SKIN_TYPES = ['normal', 'oily', 'dry', 'combination', 'sensitive']
const HAIR_TYPES = ['straight', 'wavy', 'curly', 'coily']
const GOALS = [
  { id: 'acne_reduction', label: 'Clear Acne', icon: '✨' },
  { id: 'even_tone', label: 'Even Skin Tone', icon: '🌟' },
  { id: 'anti_aging', label: 'Anti-Aging', icon: '⏰' },
  { id: 'hydration', label: 'Deep Hydration', icon: '💧' },
  { id: 'hair_growth', label: 'Hair Growth', icon: '🌱' },
  { id: 'scalp_health', label: 'Scalp Health', icon: '🧴' },
  { id: 'hair_strength', label: 'Hair Strength', icon: '💪' },
  { id: 'natural_glow', label: 'Natural Glow', icon: '✨' },
]

export default function BeautyProfile() {
  const navigate = useNavigate()
  const { dispatch } = useAura()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', age: '', gender: '',
    skinType: 'normal', hairType: 'straight',
    sleepHours: 7, waterIntake: 6,
    stressLevel: 5, dietQuality: 6, exerciseFreq: 3,
    goals: [],
  })

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const toggleGoal = (id) => {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(id) ? f.goals.filter(g => g !== id) : [...f.goals, id]
    }))
  }

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1)
    else {
      dispatch({ type: 'SET_PROFILE', payload: { ...form, age: parseInt(form.age) || 25 } })
      navigate('/upload')
    }
  }

  const canProceed = () => {
    if (step === 1) return form.name.trim().length > 0 && form.age
    if (step === 2) return true
    return form.goals.length > 0
  }

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

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
        {[1,2,3].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.82rem', fontWeight: 700, border: '2px solid',
              borderColor: s < step ? 'var(--aura-green)' : s === step ? 'var(--aura-primary)' : 'var(--glass-border)',
              background: s < step ? 'var(--aura-green-glow)' : s === step ? 'var(--aura-primary-glow)' : 'var(--glass-bg)',
              color: s < step ? 'var(--aura-green)' : s === step ? 'var(--aura-primary-light)' : 'var(--text-muted)',
              transition: 'all 0.3s ease',
            }}>
              {s < step ? <Check size={16} /> : s}
            </div>
            {i < 2 && <div style={{ width: 60, height: 2, background: s < step ? 'var(--aura-green)' : 'var(--glass-border)', transition: 'background 0.3s' }} />}
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: -24, marginBottom: 32, letterSpacing: '0.05em' }}>
        Step {step} of 3 — {step === 1 ? 'Personal Info' : step === 2 ? 'Skin & Hair' : 'Lifestyle & Goals'}
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 580, background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', borderRadius: 24, padding: '40px', position: 'relative', zIndex: 1 }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--aura-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aura-primary)' }}>
                <User size={22} />
              </div>
              <div>
                <h3 style={{ marginBottom: 2, fontSize: '1.3rem' }}>Personal Information</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Tell us a bit about yourself</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="e.g. Priya Sharma" value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input className="form-input" type="number" placeholder="25" min="13" max="80" value={form.age} onChange={e => update('age', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender (Optional)</label>
                  <select className="form-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="nonbinary">Non-binary</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--aura-cyan-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aura-cyan)' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h3 style={{ marginBottom: 2, fontSize: '1.3rem' }}>Skin & Hair Profile</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Select what best describes you</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="form-group">
                <label className="form-label">Skin Type</label>
                <div className="pill-group">
                  {SKIN_TYPES.map(t => (
                    <button key={t} className={`pill ${form.skinType === t ? 'selected' : ''}`} onClick={() => update('skinType', t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Hair Type</label>
                <div className="pill-group">
                  {HAIR_TYPES.map(t => (
                    <button key={t} className={`pill ${form.hairType === t ? 'selected' : ''}`} onClick={() => update('hairType', t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--aura-gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aura-gold)' }}>
                <Target size={22} />
              </div>
              <div>
                <h3 style={{ marginBottom: 2, fontSize: '1.3rem' }}>Lifestyle & Goals</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Help the AI understand your habits</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { field: 'sleepHours', label: 'Sleep Hours / Night', icon: <Moon size={14} />, min: 3, max: 10, unit: 'hrs', color: 'var(--aura-primary)' },
                { field: 'waterIntake', label: 'Water Intake / Day', icon: <Droplets size={14} />, min: 1, max: 15, unit: 'glasses', color: 'var(--aura-cyan)' },
                { field: 'stressLevel', label: 'Stress Level', icon: <Wind size={14} />, min: 1, max: 10, unit: '/10', color: 'var(--aura-secondary)' },
                { field: 'dietQuality', label: 'Diet Quality', icon: <Apple size={14} />, min: 1, max: 10, unit: '/10', color: 'var(--aura-green)' },
                { field: 'exerciseFreq', label: 'Exercise Days / Week', icon: <Dumbbell size={14} />, min: 0, max: 7, unit: 'days', color: 'var(--aura-gold)' },
              ].map(({ field, label, icon, min, max, unit, color }) => (
                <div key={field}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <span style={{ color }}>{icon}</span>{label}
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color }}>{form[field]} {unit}</span>
                  </div>
                  <input type="range" className="form-range" min={min} max={max} value={form[field]}
                    onChange={e => update(field, Number(e.target.value))}
                    style={{ '--range-color': color }} />
                </div>
              ))}
              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">Beauty Goals * (Select all that apply)</label>
                <div className="pill-group" style={{ marginTop: 4 }}>
                  {GOALS.map(g => (
                    <button key={g.id} className={`pill ${form.goals.includes(g.id) ? 'selected' : ''}`} onClick={() => toggleGoal(g.id)}>
                      {g.icon} {g.label}
                    </button>
                  ))}
                </div>
                {form.goals.length === 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--aura-secondary)', marginTop: 8 }}>Please select at least one goal</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 36 }}>
          <button
            className="btn btn-secondary"
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
          >
            <ArrowLeft size={16} /> {step === 1 ? 'Home' : 'Back'}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === 3 ? 'Upload Photo' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
