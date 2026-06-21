import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAura } from '../context/AuraContext'
import { Upload, Camera, ArrowRight, ArrowLeft, Sparkles, X, Image as ImageIcon, CheckCircle2, Lightbulb } from 'lucide-react'

const TIPS = [
  'Use natural daylight for best results — avoid harsh flash',
  'Face the camera directly with a neutral expression',
  'Remove glasses, hats, or accessories before scanning',
  'Ensure your face is clearly visible in the camera frame',
  'Clean face preferred for most accurate skin analysis',
]

export default function PhotoUpload() {
  const navigate = useNavigate()
  const { state, dispatch } = useAura()
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Redirect if profile is not built
  React.useEffect(() => {
    if (!state.profile) {
      navigate('/profile')
    }
  }, [state.profile, navigate])

  const handleFile = (file: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please upload an image file (JPG, PNG, WEBP)'); return }
    if (file.size > 10 * 1024 * 1024) { setError('File too large. Please use an image under 10MB.'); return }
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); 
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
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
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0)
      setPreview(canvas.toDataURL('image/jpeg', 0.9))
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null;
    }
    setCameraActive(false)
  }

  const handleAnalyse = () => {
    dispatch({ type: 'RESET_SCAN' })
    dispatch({ type: 'SET_PHOTO', payload: preview })
    navigate('/analysis')
  }

  if (!state.profile) return null;

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

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 font-display">Upload Your <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Assessment Selfie</span></h2>
          <p className="text-sm text-aura-muted">Our AI dermatology engines will scan your skin across 12 condition metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* Upload / Camera Panel */}
          <div className="bg-aura-panel border border-aura-border rounded-3xl p-6 glass-gradient">
            {cameraActive ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center border border-aura-border relative">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border border-dashed border-teal-500/30 rounded-2xl pointer-events-none" />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition text-xs" onClick={capturePhoto}>
                    <Camera size={14} /> Capture Photo
                  </button>
                  <button className="px-4 py-2 border border-aura-border hover:border-rose-500 text-xs font-bold text-white hover:text-rose-400 rounded-xl transition" onClick={stopCamera}>
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : preview ? (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 right-2.5">
                    <button className="px-3 py-1.5 bg-black/60 hover:bg-black/80 border border-white/10 text-[10px] font-bold text-white rounded-lg transition" onClick={() => setPreview(null)}>
                      <X size={12} className="inline mr-1" /> Change
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-3 py-1 text-[10px] text-emerald-400 font-bold">
                    <CheckCircle2 size={12} /> Image Loaded
                  </div>
                </div>
                <button className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition shadow-glow-primary flex items-center justify-center gap-2 text-sm" onClick={handleAnalyse}>
                  Begin AI Analysis <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Upload Zone */}
                <div
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition duration-300 ${
                    dragActive ? 'border-teal-500 bg-teal-950/10' : 'border-aura-border hover:border-aura-border/80'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center mx-auto mb-4 text-teal-400">
                    <Upload size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Drag & drop your selfie here</h4>
                  <p className="text-[10px] text-aura-muted mb-4">JPG, PNG, WEBP — Max 10MB</p>
                  <span className="px-3 py-1 rounded bg-teal-500/10 border border-teal-500/25 text-[10px] font-bold text-teal-400">Browse Files</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[1px] bg-aura-border" />
                  <span className="text-[10px] text-aura-muted font-bold uppercase tracking-wider">OR</span>
                  <div className="flex-1 h-[1px] bg-aura-border" />
                </div>

                <button className="w-full py-2.5 border border-aura-border hover:border-teal-500 text-xs font-bold text-white hover:text-teal-400 rounded-xl flex items-center justify-center gap-1.5 transition" onClick={startCamera}>
                  <Camera size={14} /> Use Device Camera
                </button>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-400 mt-2">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tips Panel */}
          <div className="space-y-4">
            <div className="bg-aura-panel border border-aura-border rounded-3xl p-5 glass-gradient">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                  <Lightbulb size={16} />
                </div>
                <h5 className="text-sm font-bold text-white m-0">Scanning Rules</h5>
              </div>
              <div className="space-y-3">
                {TIPS.map((tip, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-[10px] font-bold text-teal-400 flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-xs text-aura-muted m-0 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What AI analyses */}
            <div className="bg-aura-panel border border-aura-border rounded-3xl p-5 glass-gradient">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                  <ImageIcon size={16} />
                </div>
                <h5 className="text-sm font-bold text-white m-0">What AI Detects</h5>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-aura-muted">
                {['Acne Severity', 'Melanin Distribution', 'Inflamed Redness', 'Pore Clogging', 'Dryness Level', 'Fine Lines', 'Eye Bags', 'Stratum Hydration'].map(item => (
                  <div key={item} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <button className="px-4 py-2 border border-aura-border hover:border-teal-500 text-xs font-bold text-white hover:text-teal-400 rounded-xl transition flex items-center gap-1.5 mx-auto" onClick={() => navigate('/profile')}>
              <ArrowLeft size={14} /> Back to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
