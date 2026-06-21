import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import { UserProfile } from '../types'
import { ArrowRight, ArrowLeft, Sparkles, User, Droplets, Moon, Wind, Apple, Dumbbell, Target, Check } from 'lucide-react'

const SKIN_TYPES = ['normal', 'oily', 'dry', 'combination', 'sensitive'] as const;
const HAIR_TYPES = ['straight', 'wavy', 'curly', 'coily'] as const;
const GOALS = [
  { id: 'acne_reduction', label: 'Clear Acne', icon: '✨' },
  { id: 'even_tone', label: 'Even Skin Tone', icon: '🌟' },
  { id: 'anti_aging', label: 'Anti-Aging', icon: '⏰' },
  { id: 'hydration', label: 'Deep Hydration', icon: '💧' },
  { id: 'hair_growth', label: 'Hair Growth', icon: '🌱' },
  { id: 'scalp_health', label: 'Scalp Health', icon: '🧴' },
  { id: 'hair_strength', label: 'Hair Strength', icon: '💪' },
  { id: 'natural_glow', label: 'Natural Glow', icon: '✨' },
];

export default function BeautyProfile() {
  const navigate = useNavigate()
  const { dispatch } = useAura()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<Omit<UserProfile, 'age'> & { age: string }>({
    name: '',
    age: '',
    gender: '',
    skinType: 'normal',
    hairType: 'straight',
    sleepHours: 7,
    waterIntake: 6,
    stressLevel: 5,
    dietQuality: 6,
    exerciseFreq: 3,
    goals: [],
  })

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }))
  
  const toggleGoal = (id: string) => {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(id) ? f.goals.filter(g => g !== id) : [...f.goals, id]
    }))
  }

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1)
    else {
      dispatch({ 
        type: 'SET_PROFILE', 
        payload: { 
          ...form, 
          age: parseInt(form.age) || 25,
          skinType: form.skinType as UserProfile['skinType'],
          hairType: form.hairType as UserProfile['hairType']
        } 
      })
      navigate('/upload')
    }
  }

  const canProceed = () => {
    if (step === 1) return form.name.trim().length > 0 && form.age;
    if (step === 2) return true;
    return form.goals.length > 0;
  }

  return (
    <div className="min-h-screen bg-aura-bg flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-10 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-purple-600 flex items-center justify-center">
          <Sparkles size={16} color="white" />
        </div>
        <span className="font-display font-bold text-lg text-white">AuraAI</span>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-9">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
              s < step 
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                : s === step 
                  ? 'border-teal-500 bg-teal-500/10 text-teal-400' 
                  : 'border-aura-border bg-aura-panel text-aura-muted'
            }`}>
              {s < step ? <Check size={14} /> : s}
            </div>
            {i < 2 && (
              <div className={`w-14 h-[2px] transition-all duration-300 ${
                s < step ? 'bg-emerald-500' : 'bg-aura-border'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      <div className="text-xs text-aura-muted -mt-6 mb-8 uppercase tracking-wider font-semibold">
        Step {step} of 3 — {step === 1 ? 'Personal Info' : step === 2 ? 'Skin & Hair' : 'Lifestyle & Goals'}
      </div>

      {/* Form Container */}
      <div className="w-full max-w-lg bg-aura-panel border border-aura-border rounded-3xl p-8 glass-gradient relative z-10">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-fadeIn space-y-6">
            <div className="flex gap-3 items-center mb-6">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-0.5 font-display">Personal Details</h3>
                <p className="text-xs text-aura-muted">Let us align your diagnostics profile.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="form-group flex flex-col gap-2">
                <label className="text-xs font-bold text-aura-muted uppercase tracking-wider">Patient Name *</label>
                <input 
                  type="text" 
                  className="px-4 py-2 bg-aura-bg border border-aura-border rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. Priya Sharma" 
                  value={form.name} 
                  onChange={e => update('name', e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-2">
                  <label className="text-xs font-bold text-aura-muted uppercase tracking-wider">Age *</label>
                  <input 
                    type="number" 
                    className="px-4 py-2 bg-aura-bg border border-aura-border rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    placeholder="25" 
                    min="13" 
                    max="80" 
                    value={form.age} 
                    onChange={e => update('age', e.target.value)} 
                  />
                </div>
                
                <div className="form-group flex flex-col gap-2">
                  <label className="text-xs font-bold text-aura-muted uppercase tracking-wider">Gender</label>
                  <select 
                    className="px-4 py-2 bg-aura-bg border border-aura-border rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 transition cursor-pointer"
                    value={form.gender} 
                    onChange={e => update('gender', e.target.value)}
                  >
                    <option value="">Select Option</option>
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
          <div className="animate-fadeIn space-y-6">
            <div className="flex gap-3 items-center mb-6">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-0.5 font-display">Skin & Hair Profile</h3>
                <p className="text-xs text-aura-muted">Describe your biological classifications.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="form-group flex flex-col gap-2">
                <label className="text-xs font-bold text-aura-muted uppercase tracking-wider">Skin Classification</label>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map(t => (
                    <button 
                      key={t} 
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 ${
                        form.skinType === t 
                          ? 'bg-teal-600 border-teal-500 text-white shadow-glow-primary' 
                          : 'bg-aura-bg border-aura-border text-aura-muted hover:text-white'
                      }`}
                      onClick={() => update('skinType', t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group flex flex-col gap-2">
                <label className="text-xs font-bold text-aura-muted uppercase tracking-wider">Hair Classification</label>
                <div className="flex flex-wrap gap-2">
                  {HAIR_TYPES.map(t => (
                    <button 
                      key={t} 
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 ${
                        form.hairType === t 
                          ? 'bg-teal-600 border-teal-500 text-white shadow-glow-primary' 
                          : 'bg-aura-bg border-aura-border text-aura-muted hover:text-white'
                      }`}
                      onClick={() => update('hairType', t)}
                    >
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
          <div className="animate-fadeIn space-y-6">
            <div className="flex gap-3 items-center mb-6">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-0.5 font-display">Lifestyle & Goals</h3>
                <p className="text-xs text-aura-muted">Help the AI understand your daily bio-markers.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { field: 'sleepHours', label: 'Sleep Hours / Night', icon: <Moon size={12} />, min: 4, max: 10, unit: 'hrs', color: 'rgba(13, 148, 136, 1)' },
                { field: 'waterIntake', label: 'Water Intake / Day', icon: <Droplets size={12} />, min: 2, max: 12, unit: 'glasses', color: 'rgba(6, 182, 212, 1)' },
                { field: 'stressLevel', label: 'Stress Level', icon: <Wind size={12} />, min: 1, max: 10, unit: '/10', color: 'rgba(139, 92, 246, 1)' },
              ].map(({ field, label, icon, min, max, unit, color }) => (
                <div key={field} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-aura-muted font-bold uppercase tracking-wide">
                      {icon} {label}
                    </span>
                    <strong style={{ color }} className="text-sm">{(form as any)[field]} {unit}</strong>
                  </div>
                  <input 
                    type="range" 
                    className="w-full h-1 bg-aura-bg rounded-lg appearance-none cursor-pointer accent-teal-500" 
                    min={min} 
                    max={max} 
                    value={(form as any)[field]}
                    onChange={e => update(field, Number(e.target.value))} 
                  />
                </div>
              ))}
              
              <div className="form-group flex flex-col gap-2 pt-2">
                <label className="text-xs font-bold text-aura-muted uppercase tracking-wider">Beauty & Dermatology Goals *</label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map(g => {
                    const isSelected = form.goals.includes(g.id);
                    return (
                      <button 
                        key={g.id} 
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 ${
                          isSelected 
                            ? 'bg-teal-600 border-teal-500 text-white shadow-glow-primary' 
                            : 'bg-aura-bg border-aura-border text-aura-muted hover:text-white'
                        }`}
                        onClick={() => toggleGoal(g.id)}
                      >
                        {g.icon} {g.label}
                      </button>
                    )
                  })}
                </div>
                {form.goals.length === 0 && (
                  <span className="text-[10px] text-rose-400 font-semibold mt-1">Please select at least one goal to proceed.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Buttons Panel */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-aura-border">
          <button 
            className="px-4 py-2 border border-aura-border hover:border-teal-500 text-xs font-bold text-white hover:text-teal-400 rounded-xl transition flex items-center gap-1.5"
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
          >
            <ArrowLeft size={14} /> {step === 1 ? 'Home' : 'Back'}
          </button>
          
          <button 
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition shadow-glow-primary flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === 3 ? 'Proceed to Upload' : 'Continue'} <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  )
}
