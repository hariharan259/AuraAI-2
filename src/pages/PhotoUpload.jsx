import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import { Upload, Camera, ArrowRight, ArrowLeft, Sparkles, X, Image, CheckCircle2, Lightbulb } from 'lucide-react'

const TIPS = [
  'Use natural daylight for best results — avoid harsh flash',
  'Face the camera directly with a neutral expression',
  'Remove glasses, hats, or accessories before scanning',
  'Ensure your hair is visible and pulled back slightly',
  'Clean face preferred for most accurate skin analysis',
]

export default function PhotoUpload() {
  const navigate = useNavigate()
  const { state, dispatch } = useAura()
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()
  const videoRef = useRef()
  const streamRef = useRef()

  if (!state.profile) {
    navigate('/profile')
    return null
  }

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please upload an image file (JPG, PNG, WEBP)'); return }
    if (file.size > 10 * 1024 * 1024) { setError('File too large. Please use an image under 10MB.'); return }
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragActive(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
      streamRef.current = stream
      setCameraActive(true)
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream }, 100)
    } catch { setError('Camera access denied. Please allow camera permissions or upload a photo instead.') }
  }

  const capturePhoto = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    setPreview(canvas.toDataURL('image/jpeg', 0.9))
    stopCamera()
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    setCameraActive(false)
  }

  const handleAnalyse = () => {
    dispatch({ type: 'RESET_SCAN' })
    dispatch({ type: 'SET_PHOTO', payload: preview })
    navigate('/analysis')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--aura-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-1" /><div className="orb orb-2" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={16} color="white" />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>AuraAI</span>
      </div>

      <div style={{ width: '100%', maxWidth: 800, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ marginBottom: 8 }}>Upload Your <span className="gradient-text">Beauty Photo</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Our AI will analyse your skin and hair across 8+ dimensions
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: preview || cameraActive ? '1fr 1fr' : '1.4fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* Upload / Camera Panel */}
          <div style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 28 }}>
            {cameraActive ? (
              <div>
                <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16, background: '#000', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: 12, display: 'block' }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={capturePhoto}>
                    <Camera size={16} /> Capture Photo
                  </button>
                  <button className="btn btn-secondary" onClick={stopCamera}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : preview ? (
              <div>
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 16, background: '#000', aspectRatio: '4/3' }}>
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setPreview(null)} style={{ backdropFilter: 'blur(10px)' }}>
                      <X size={14} /> Change
                    </button>
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 99, padding: '4px 12px', fontSize: '0.75rem', color: 'var(--aura-green)', fontWeight: 600 }}>
                    <CheckCircle2 size={13} /> Photo Ready
                  </div>
                </div>
                <button className="btn btn-primary w-full" onClick={handleAnalyse} style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                  Begin AI Analysis <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div>
                {/* Upload Zone */}
                <div
                  className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                  style={{ padding: '48px 24px', marginBottom: 16 }}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--aura-primary-glow)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--aura-primary)' }}>
                    <Upload size={24} />
                  </div>
                  <h4 style={{ marginBottom: 8, fontSize: '1rem' }}>Drop your photo here</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 12px' }}>JPG, PNG, WEBP — Max 10MB</p>
                  <span className="badge badge-primary">Click to browse</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
                </div>

                <button className="btn btn-secondary w-full" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={startCamera}>
                  <Camera size={16} /> Use Camera
                </button>

                {error && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: '0.8rem', color: '#FCA5A5' }}>
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tips Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--aura-gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aura-gold)' }}>
                  <Lightbulb size={18} />
                </div>
                <h5 style={{ margin: 0, fontSize: '0.95rem' }}>Photo Tips</h5>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {TIPS.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--aura-primary-glow)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--aura-primary-light)', flexShrink: 0, marginTop: 1 }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What AI analyses */}
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--aura-cyan-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aura-cyan)' }}>
                  <Image size={18} />
                </div>
                <h5 style={{ margin: 0, fontSize: '0.95rem' }}>What AI Detects</h5>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['Acne', 'Redness', 'Pigmentation', 'Oiliness', 'Hair Fall', 'Scalp Health', 'Hair Density', 'Damage'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--aura-primary)', flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-ghost" style={{ padding: '10px', fontSize: '0.82rem' }} onClick={() => navigate('/profile')}>
              <ArrowLeft size={14} /> Back to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
