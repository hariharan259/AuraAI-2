import React, { useState } from 'react';
import { Cpu, User, ShieldAlert, Sparkles, TrendingUp, FileText, ArrowDown, HelpCircle, Code } from 'lucide-react';

interface AgentNodeProps {
  step: number;
  title: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  shortDesc: string;
  model: string;
  latency: string;
  prompt: string;
  outputExample: string;
  isActive: boolean;
  onClick: () => void;
}

const AgentNode = ({
  step, title, icon: Icon, iconColor, shortDesc, model, latency, prompt, outputExample, isActive, onClick
}: AgentNodeProps) => {
  return (
    <div 
      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
        isActive 
          ? 'bg-purple-950/20 border-purple-500/50 shadow-glow-secondary' 
          : 'bg-aura-panel border-aura-border hover:border-white/20'
      }`}
      onClick={onClick}
    >
      <div className="flex gap-4 items-start">
        <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
          <Icon size={16} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 font-mono">Agent {step}</span>
            <span className="text-[8px] text-aura-muted font-mono">{latency}</span>
          </div>
          <h4 className="text-xs font-bold text-white mb-0.5">{title}</h4>
          <p className="text-[10px] text-aura-muted leading-relaxed mb-1.5">{shortDesc}</p>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/45 text-purple-300 border border-purple-500/20">
            {model}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function AIWorkflowVisualizer() {
  const [selectedAgent, setSelectedAgent] = useState<number>(1);

  const workflow = [
    {
      step: 1,
      title: 'User Input & Intake Diagnostics',
      icon: User,
      iconColor: 'text-cyan-400',
      shortDesc: 'Collects high-resolution selfie upload and 6-parameter lifestyle profile details.',
      model: 'Stratum Reader v2',
      latency: '200ms',
      prompt: `ROLE: Profile Data Intake Orchestrator.
INSTRUCTIONS: Parse chronological age, gender, skin type, hair type, sleep, hydration, stress, and diet. Ensure validation checks.`,
      outputExample: `{
  "age": 24,
  "skinType": "sensitive",
  "sleepHours": 6.5,
  "waterIntake": 6,
  "stressLevel": 7
}`
    },
    {
      step: 2,
      title: 'Skin Analysis Agent',
      icon: ShieldAlert,
      iconColor: 'text-amber-400',
      shortDesc: 'Visual scanner evaluating acne, dark spots, redness, lines, and pores.',
      model: 'DermVision-1.5-Pro',
      latency: '1200ms',
      prompt: `ROLE: Skin Health Evaluator.
INSTRUCTIONS: Scan selfie matrices for localized blemish congestion and redness, calculating specific condition indexes.`,
      outputExample: `{
  "acne": 72,
  "pigmentation": 65,
  "hydration": 62,
  "overall": 71
}`
    },
    {
      step: 3,
      title: 'Hair Analysis Agent',
      icon: Sparkles,
      iconColor: 'text-yellow-400',
      shortDesc: 'Trichologist agent assessing scalp lipid density and hair root strength.',
      model: 'TrichoSense-Lite',
      latency: '900ms',
      prompt: `ROLE: Hair Science Analyzer.
INSTRUCTIONS: Evaluate hair density, shaft thickness, and shedding markers against baseline parameters.`,
      outputExample: `{
  "density": 80,
  "thickness": 75,
  "hairScore": 78
}`
    },
    {
      step: 4,
      title: 'Lifestyle Calibration Agent',
      icon: HelpCircle,
      iconColor: 'text-purple-400',
      shortDesc: 'Correlates biological metrics with sleep, cortisol stress, and hydration factors.',
      model: 'Circadian-Linker v1',
      latency: '800ms',
      prompt: `ROLE: Lifestyle Profiler.
INSTRUCTIONS: Calculate correlations between sleep deficit and cell repair rates, stress hormones, and sebaceous output.`,
      outputExample: `{
  "mitosisFactor": "Slow",
  "cortisolImpact": "High"
}`
    },
    {
      step: 5,
      title: 'Beauty Risk Agent',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      shortDesc: 'Monitors skin and hair threats to construct a comprehensive danger profile.',
      model: 'RiskEngine-Core',
      latency: '500ms',
      prompt: `ROLE: Clinical Risk Monitor.
INSTRUCTIONS: Compare lifestyle stress, UV damage index, and hydration ratios to compute probability scales for active acne, photoaging, and shedding.`,
      outputExample: `{
  "uvRisk": 34,
  "acneRisk": 72,
  "hairFallRisk": 42
}`
    },
    {
      step: 6,
      title: 'Forecast Agent',
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      shortDesc: 'Simulates 90-day biological recovery curves and timeline projections.',
      model: 'AuraPredict-TimeSeries',
      latency: '1000ms',
      prompt: `ROLE: Time-Series Forecaster.
INSTRUCTIONS: Forecast daily index improvements assuming routine compliance. Calibrate for cell migration cycles (28 days).`,
      outputExample: `[
  { "day": 0, "skin": 71 },
  { "day": 90, "skin": 81 },
  { "day": 365, "skin": 87 }
]`
    },
    {
      step: 7,
      title: 'Beauty Twin Agent',
      icon: Sparkles,
      iconColor: 'text-pink-400',
      shortDesc: 'Synthesizes visual cloning matrices to run lifestyle simulators.',
      model: 'BioTwin-Synthesizer',
      latency: '600ms',
      prompt: `ROLE: Digital Clone Architect.
INSTRUCTIONS: Build interactive face scanning hot-spots. Calculate simulated outputs dynamically under variable slider inputs.`,
      outputExample: `{
  "simulatedSkin": 82,
  "simulatedHair": 84,
  "estimatedAge": 22
}`
    },
    {
      step: 8,
      title: 'Recommendation Agent',
      icon: Code,
      iconColor: 'text-teal-400',
      shortDesc: 'Matches clinical actives to user type to select cleansers and shampoo.',
      model: 'MatchEngine v4',
      latency: '700ms',
      prompt: `ROLE: active compound selector.
INSTRUCTIONS: Filter catalog database for cleansers, moisturizers, and hair serums with key ingredients matching diagnostic scores.`,
      outputExample: `[
  { "name": "Salicylic Gel Cleanser", "score": 96 }
]`
    },
    {
      step: 9,
      title: 'Final Beauty Intelligence Report',
      icon: FileText,
      iconColor: 'text-cyan-400',
      shortDesc: 'Generates report summary, bespoke morning/evening formulas, and PDF reports.',
      model: 'Report-Synthesizer',
      latency: '400ms',
      prompt: `ROLE: Final Synthesizer.
INSTRUCTIONS: Format agent telemetry into clinical report dashboards, custom active formulations, and structured PDF logs.`,
      outputExample: `{
  "customFormula": "AURA-SERUM-24SE",
  "pdfStatus": "Ready"
}`
    }
  ];

  const currentAgent = workflow.find(w => w.step === selectedAgent) || workflow[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
          <Cpu size={12} className="animate-spin" style={{ animationDuration: '8s' }} /> Neural Network Graph
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">How AuraAI Thinks</h1>
        <p className="text-sm text-aura-muted mt-1">Interactive multi-agent pipeline rendering system inputs, agent instructions, and output payloads.</p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: List (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1">
          {workflow.map((agent, idx) => (
            <React.Fragment key={agent.step}>
              <AgentNode 
                step={agent.step}
                title={agent.title}
                icon={agent.icon}
                iconColor={agent.iconColor}
                shortDesc={agent.shortDesc}
                model={agent.model}
                latency={agent.latency}
                prompt={agent.prompt}
                outputExample={agent.outputExample}
                isActive={selectedAgent === agent.step}
                onClick={() => setSelectedAgent(agent.step)}
              />
              {idx < workflow.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown size={12} className="text-aura-muted animate-bounce" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right Column: Code Inspector (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-aura-border pb-3">
                <Code size={18} className="text-purple-400" /> Pipeline Telemetry Inspector
              </h3>

              {/* Prompt */}
              <div className="mb-4">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 font-mono">
                  Agent System Prompts / Instructions
                </div>
                <pre className="p-4 rounded-xl bg-black/45 border border-white/5 text-[10px] text-aura-muted leading-relaxed font-mono whitespace-pre-wrap max-h-[140px] overflow-y-auto">
                  {currentAgent.prompt}
                </pre>
              </div>

              {/* JSON Example */}
              <div>
                <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-2 font-mono">
                  Agent Output Payload (JSON)
                </div>
                <pre className="p-4 rounded-xl bg-black/45 border border-white/5 text-[10px] text-emerald-400 leading-relaxed font-mono whitespace-pre overflow-x-auto max-h-[160px] overflow-y-auto">
                  {currentAgent.outputExample}
                </pre>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
