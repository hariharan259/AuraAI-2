import React, { useState, useEffect } from 'react';
import { useAura, AnalysisResultPayload } from '../context/AuraContext';
import { runFullAnalysis } from '../services/aiEngine';
import { exportAnalysisToPDF } from '../services/pdfReport';
import SkinRiskRadar from '../components/charts/SkinRiskRadar';
import TransformationChart from '../components/charts/TransformationChart';
import SkinTwinDashboard from '../components/ui/SkinTwinDashboard';
import { 
  Play, Square, ChevronRight, ChevronLeft, Loader2, Sparkles, 
  Brain, Microscope, Award, FileText, CheckCircle2, Shield, 
  TrendingUp, ShoppingBag, Eye, User
} from 'lucide-react';

const DEMO_STEPS = [
  { id: 1, title: 'Selfie Intake', desc: 'Simulates camera capture and facial landmark alignment.', icon: <Eye size={18} /> },
  { id: 2, title: 'AI Diagnostics', desc: 'Streams agent analysis logs (Dermatologist, Trichologist).', icon: <Microscope size={18} /> },
  { id: 3, title: 'Skin Health Score', desc: 'Computes and displays overall skin score (0-100).', icon: <Shield size={18} /> },
  { id: 4, title: 'Skin Twin Dashboard', desc: 'Synthesizes digital twin strengths and problem areas.', icon: <Brain size={18} /> },
  { id: 5, title: 'Skin Risk Radar', desc: 'Renders Chart.js radar mapping dehydration & aging risk.', icon: <ActivityIcon size={18} /> },
  { id: 6, title: 'Routine Engine', desc: 'Generates Morning, Night, and lifestyle schedules.', icon: <Sparkles size={18} /> },
  { id: 7, title: 'AI Recommendations', desc: 'Prescribes medical-grade cleansers, serums & treatments.', icon: <ShoppingBag size={18} /> },
  { id: 8, title: '30-Day Forecast', desc: 'Simulates score improvements using Line charts.', icon: <TrendingUp size={18} /> },
  { id: 9, title: 'Skin Passport & Badges', desc: 'Logs scanning history and unlocks achievement badges.', icon: <Award size={18} /> },
  { id: 10, title: 'Dermatology PDF', desc: 'Exports a printable clinical PDF report.', icon: <FileText size={18} /> }
];

function ActivityIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export default function DemoConsole() {
  const { state, dispatch } = useAura();
  const [currentStep, setCurrentStep] = useState(0); // 0 means not started, 1 to 10
  const [isPlaying, setIsPlaying] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [demoResult, setDemoResult] = useState<AnalysisResultPayload | null>(null);

  const mockProfile = {
    name: 'Sarah Jenkins',
    age: 24,
    skinType: 'oily' as const,
    hairType: 'wavy' as const,
    sleepHours: 6.5,
    waterIntake: 5,
    stressLevel: 8,
    dietQuality: 4,
    exerciseFreq: 1,
    goals: ['acne reduction', 'hydration', 'pore minimizing']
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying && currentStep > 0 && currentStep < 10) {
      timer = setTimeout(() => {
        handleNextStep();
      }, 3500); // 3.5s per step
    } else if (currentStep === 10 && isPlaying) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]); // eslint-disable-line

  const startDemo = async () => {
    dispatch({ type: 'RESET_SCAN' });
    setDemoResult(null);
    setLogMessages([]);
    setCurrentStep(1);
    setIsPlaying(true);
    
    // Simulate image upload
    setLogMessages(['[SYSTEM] Registering camera stream input...', '[SYSTEM] Aligning facial geometry landmarks...']);
  };

  const stopDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleNextStep = async () => {
    const next = currentStep + 1;
    if (next > 10) return;
    setCurrentStep(next);

    // Step-specific trigger logic
    if (next === 2) {
      setLogMessages(prev => [...prev, '[DERMATOLOGIST] Commencing spectral skin assessment...', '[DERMATOLOGIST] Analyzing sebum, pores, and vascular redness indicators...']);
    } else if (next === 3) {
      // Calculate result
      const res = await runFullAnalysis(mockProfile, dispatch);
      setDemoResult(res);
      setLogMessages(prev => [...prev, `[SYSTEM] Skin Health analysis complete. Score calculated: ${res.beautyScore}`]);
    } else if (next === 9) {
      setLogMessages(prev => [...prev, '[SYSTEM] Unlocking badge achievements...', '[SYSTEM] Writing record to Skin Passport Ledger...']);
    } else if (next === 10 && demoResult) {
      exportAnalysisToPDF(demoResult);
    }
  };

  const handlePrevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="page-content animate-fadeIn p-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-3">
            <Sparkles size={12} /> Presentation Hub
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">AuraAI Hackathon Arena</h1>
          <p className="text-sm text-aura-muted">One-click presentation mode to demonstrate all 10 dermatology intelligence checkpoints.</p>
        </div>

        <div className="flex gap-3">
          {currentStep === 0 ? (
            <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl flex items-center gap-2 transition shadow-glow-primary text-sm" onClick={startDemo}>
              <Play size={16} /> Start Live Arena Show
            </button>
          ) : (
            <>
              <button 
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-teal-600 hover:bg-teal-500'
                }`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <><Square size={12} /> Pause AutoPlay</> : <><Play size={12} /> Resume AutoPlay</>}
              </button>
              <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition" onClick={stopDemo}>
                <Square size={12} /> Exit Demo
              </button>
            </>
          )}
        </div>
      </div>

      {currentStep === 0 ? (
        /* Intro Display */
        <div className="p-8 rounded-2xl bg-aura-panel border border-aura-border text-center glass-gradient max-w-2xl mx-auto py-16">
          <Brain size={48} className="text-teal-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-2 font-display">Dermatology Platform Demonstrator</h2>
          <p className="text-sm text-aura-muted mb-8 leading-relaxed">
            Clicking the start button triggers an automated presentation slideshow. AuraAI will run analysis, generate a skin twin, render the risk radar, product matching, and export the PDF report automatically.
          </p>
          <button className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl flex items-center gap-2 mx-auto transition shadow-glow-primary" onClick={startDemo}>
            <Play size={18} /> Launch 10-Checkpoint Walkthrough
          </button>
        </div>
      ) : (
        /* Active Slideshow Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Timeline Sidebar (Left) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-aura-panel border border-aura-border glass-gradient h-fit space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-aura-muted mb-4 border-b border-aura-border pb-2">Arena Checkpoints</h3>
            {DEMO_STEPS.map((step) => (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all duration-200 ${
                  currentStep === step.id 
                    ? 'bg-teal-950/20 border-teal-500/40 text-white shadow-glow-primary' 
                    : currentStep > step.id 
                      ? 'bg-aura-panel/40 border-emerald-500/20 text-emerald-400 opacity-80'
                      : 'bg-transparent border-transparent text-aura-muted opacity-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg border ${
                  currentStep === step.id 
                    ? 'bg-teal-500/20 border-teal-500/30 text-teal-400' 
                    : currentStep > step.id
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                      : 'bg-white/5 border-white/5'
                }`}>
                  {step.icon}
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold m-0 flex items-center gap-1.5">
                    {step.title}
                    {currentStep > step.id && <span className="text-[9px] bg-emerald-500/10 px-1 py-0.2 rounded">Done</span>}
                  </h4>
                  <span className="text-[10px] text-aura-muted block truncate">{step.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Content Panel (Right) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Controller bar */}
            <div className="p-4 rounded-xl border border-aura-border bg-aura-panel flex items-center justify-between glass-gradient">
              <span className="text-xs text-aura-muted">Checkpoint <strong>{currentStep} / 10</strong>: {DEMO_STEPS[currentStep - 1].title}</span>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg border border-aura-border hover:border-white text-white disabled:opacity-30 disabled:pointer-events-none transition" onClick={handlePrevStep} disabled={currentStep <= 1}>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1.5 rounded-lg border border-aura-border hover:border-white text-white disabled:opacity-30 disabled:pointer-events-none transition" onClick={handleNextStep} disabled={currentStep >= 10}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Slide Screen Area */}
            <div className="p-6 rounded-2xl border border-aura-border bg-aura-panel/40 min-h-[400px] flex flex-col justify-between glass-gradient relative">
              
              {/* Slide 1: Selfie intake */}
              {currentStep === 1 && (
                <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
                  <div className="w-56 h-56 border border-dashed border-teal-500/30 rounded-2xl relative flex flex-col items-center justify-center bg-teal-950/5 overflow-hidden mb-6">
                    <User size={48} className="text-teal-500/40 animate-pulse" />
                    <div className="absolute inset-x-0 h-[1px] bg-teal-400 bottom-1/2 animate-bounce" />
                    <span className="text-[10px] text-teal-400 font-mono mt-3 uppercase tracking-widest font-bold">Face Mesh Lock</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-display">Step 1: Patient Selfie Capture</h3>
                  <p className="text-xs text-aura-muted max-w-md">Simulating multi-spectral lighting capture and alignment of 128 micro-facial clarity coordinates.</p>
                </div>
              )}

              {/* Slide 2: AI diagnostics logs */}
              {currentStep === 2 && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted mb-4">Step 2: Dermatology Agent Terminal Logs</h3>
                    <div className="p-4 rounded-xl bg-black/60 border border-aura-border font-mono text-[11px] text-teal-400 space-y-2 h-64 overflow-y-auto">
                      {logMessages.map((msg, idx) => (
                        <div key={idx} className="leading-relaxed">{msg}</div>
                      ))}
                      <div className="flex items-center gap-1.5 text-aura-muted">
                        <Loader2 size={12} className="animate-spin text-teal-400" /> Waiting for agent computations...
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-aura-muted mt-4">Streams calculation metrics dynamically as the Dermatologist, Skin Twin, and Routine agents execute calculations.</p>
                </div>
              )}

              {/* Slide 3: Skin Health Score */}
              {currentStep === 3 && demoResult && (
                <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
                  <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="64" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                      <circle cx="72" cy="72" r="64" stroke="#0d9488" strokeWidth="8" fill="transparent"
                        strokeDasharray={2 * Math.PI * 64}
                        strokeDashoffset={2 * Math.PI * 64 * (1 - demoResult.beautyScore / 100)}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-4xl font-black text-white">{demoResult.beautyScore}</span>
                      <span className="text-[9px] text-aura-muted uppercase block font-bold mt-0.5">Overall</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-display">Step 3: Skin Health Index</h3>
                  <p className="text-xs text-aura-muted max-w-sm">Computes overall score from a weighted average of clarity, moisture retention, sebum activity, and wrinkle indices.</p>
                </div>
              )}

              {/* Slide 4: Skin Twin Dashboard */}
              {currentStep === 4 && demoResult && (
                <div className="flex-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted mb-4">Step 4: AI Skin Twin Summary</h3>
                  <SkinTwinDashboard twin={demoResult.skinTwin} result={demoResult.skinHealth} />
                </div>
              )}

              {/* Slide 5: Risk Radar */}
              {currentStep === 5 && demoResult && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted mb-4">Step 5: Dermatology Risk Radar</h3>
                    <div className="h-64 flex justify-center">
                      <SkinRiskRadar 
                        acneRisk={demoResult.skinHealth.acneRiskScore}
                        uvDamage={demoResult.skinHealth.uvDamageScore}
                        pigmentation={demoResult.skinHealth.measurements.pigmentation}
                        dehydration={demoResult.skinHealth.measurements.dryness}
                        agingRisk={demoResult.skinHealth.agingRiskScore}
                        sensitivity={demoResult.skinHealth.measurements.redness}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-aura-muted mt-4">Maps 6 risk dimensions on a Chart.js radar chart. Useful for identifying high susceptibility fields.</p>
                </div>
              )}

              {/* Slide 6: Routine Engine */}
              {currentStep === 6 && demoResult && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted mb-4">Step 6: AI-Prescribed Routine Steps</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Morning */}
                      <div className="p-4 rounded-xl bg-white/5 border border-aura-border">
                        <h4 className="text-xs font-bold text-teal-400 mb-3 uppercase tracking-wide">Morning Cleanse & Protection</h4>
                        <div className="space-y-2">
                          {demoResult.routine.morning.slice(0, 3).map(r => (
                            <div key={r.step} className="text-[11px] text-aura-text flex justify-between border-b border-white/5 pb-1">
                              <span className="font-bold">{r.productType}</span>
                              <span className="text-aura-muted">{r.product}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Night */}
                      <div className="p-4 rounded-xl bg-white/5 border border-aura-border">
                        <h4 className="text-xs font-bold text-purple-400 mb-3 uppercase tracking-wide">Night Recovery & Treatment</h4>
                        <div className="space-y-2">
                          {demoResult.routine.night.slice(0, 3).map(r => (
                            <div key={r.step} className="text-[11px] text-aura-text flex justify-between border-b border-white/5 pb-1">
                              <span className="font-bold">{r.productType}</span>
                              <span className="text-aura-muted">{r.product}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-aura-muted mt-4">Calculates viscosity application order, scheduling conflicts, and lifestyle enhancements.</p>
                </div>
              )}

              {/* Slide 7: AI Recommendations */}
              {currentStep === 7 && demoResult && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted mb-4">Step 7: Prescribed Medical Actives</h3>
                    <div className="space-y-3">
                      {demoResult.products.slice(0, 3).map((p, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-aura-border bg-aura-bg/30 flex justify-between items-center text-xs">
                          <div>
                            <strong className="text-white block">{p.name} ({p.brand})</strong>
                            <span className="text-[10px] text-aura-muted block mt-0.5">{p.reason}</span>
                          </div>
                          <span className="px-2 py-1 rounded bg-teal-500/10 text-teal-400 font-bold font-mono">{p.matchScore}% Match</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-aura-muted mt-4">Selects cleansers, treatments, and moisturisers with custom medical reasons mapped to blemish profiles.</p>
                </div>
              )}

              {/* Slide 8: 30-Day Prediction */}
              {currentStep === 8 && demoResult && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted mb-4">Step 8: 30-Day Healing Trajectory</h3>
                    <div className="h-64">
                      <TransformationChart forecastData={demoResult.forecast} />
                    </div>
                  </div>
                  <p className="text-xs text-aura-muted mt-4">Chart.js Line Chart forecasting skin score, acne reduction, and hydration recovery over 30 days of routine consistency.</p>
                </div>
              )}

              {/* Slide 9: Skin Passport & Badges */}
              {currentStep === 9 && demoResult && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted mb-4">Step 9: Skin Passport & Achievements Registry</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/20 to-teal-950/20 border border-aura-border">
                        <span className="text-[9px] text-aura-muted uppercase tracking-wider font-bold block mb-1">Passport ID</span>
                        <h4 className="font-mono text-sm font-bold text-white mb-3">{demoResult.skinPassportId}</h4>
                        <div className="text-[10px] text-aura-text space-y-2">
                          <div className="flex justify-between"><span>Patient:</span> <strong>Sarah Jenkins</strong></div>
                          <div className="flex justify-between"><span>Age:</span> <strong>24 years</strong></div>
                          <div className="flex justify-between"><span>Skin Type:</span> <strong className="text-teal-400 capitalize">Oily</strong></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[9px] text-aura-muted uppercase tracking-wider font-bold block">Unlocked Achievements</span>
                        <div className="grid grid-cols-3 gap-2">
                          {state.achievements.slice(0, 3).map((ach) => (
                            <div key={ach.id} className="p-2 rounded-lg border border-purple-500/30 bg-purple-950/15 text-center text-white">
                              <span className="text-lg block">{ach.icon}</span>
                              <span className="text-[8px] font-bold block leading-none truncate mt-0.5">{ach.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-aura-muted mt-4">Logs scan metrics in the database and automatically unlocks badges like "Hydration Hero" and "Acne Fighter".</p>
                </div>
              )}

              {/* Slide 10: PDF Report Export */}
              {currentStep === 10 && demoResult && (
                <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
                  <FileText size={48} className="text-teal-400 mb-4 animate-bounce" />
                  <h3 className="text-lg font-bold text-white mb-2 font-display">Step 10: Medical PDF Report Generated</h3>
                  <p className="text-xs text-aura-muted max-w-sm mb-6">The PDF exporter has structured the diagnostics, routine schedules, and forecast graphs into a printable medical-grade document.</p>
                  <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition shadow-glow-primary" onClick={() => exportAnalysisToPDF(demoResult)}>
                    Export Document Again
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
