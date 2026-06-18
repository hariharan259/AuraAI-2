# AuraAI — AI Beauty Intelligence System

> Multi-agent AI platform that analyzes skin & hair health, formulates personalized active serums, predicts 90-day outcomes, and tracks your beauty journey over time.

---

## 🧠 What is AuraAI?

AuraAI is a hackathon-built AI beauty intelligence platform. It replaces generic skincare advice with a deterministic, multi-agent pipeline that produces clinically-structured diagnostics, bespoke ingredient formulations, personalized routines, and 90-day outcome forecasting — all from a selfie and a short profile.

---

## 🚀 Live Demo Workflow

```
User Profile → Selfie Upload → 5-Agent AI Pipeline → Intelligence Report → Outcome Simulator → Progress Tracking
```

---

## 🤖 Multi-Agent Architecture

AuraAI uses **5 specialized AI agents** running in sequence, each with structured XML system prompts:

| Agent | Role | Output |
|-------|------|--------|
| **Dermatologist AI** | Analyzes acne, pigmentation, redness, oiliness | Skin scores + root causes |
| **Trichologist AI** | Analyzes hair fall, density, scalp health, damage | Hair scores + root causes |
| **Ingredient Scientist** | Maps concerns → active compounds, formulates serum | Bespoke formula code + compound ratios |
| **Beauty Coach AI** | Designs morning / night / weekly routine | Step-by-step protocol |
| **Outcome Predictor** | Projects 30/60/90-day beauty trajectories | Forecast chart + confidence intervals |

---

## ✨ Key Features

### 🔬 Skin Intelligence
- Acne Severity Analysis
- Pigmentation Distribution Mapping
- Redness & Inflammation Detection
- Sebaceous Gland Activity (Oiliness)

### 💇 Hair Intelligence
- Hair Fall Severity Index
- Follicular Density Analysis
- Scalp Microbiome Indicators
- Hair Shaft Damage Assessment

### 🧪 Bespoke Formulation Sandbox
- AI generates a unique serum formula code (e.g., `AURA-28OI-342`)
- Interactive sliders to adjust compound concentrations
- Real-time safety score with conflict detection (Retinol + Vitamin C, etc.)
- Formula saved back to the Intelligence Report

### 📊 Outcome Simulator
- Adjust sleep, hydration, stress, routine adherence
- Live before/after photo split-screen (drag slider to compare baseline vs Day 90 projected)
- Trajectory chart updates on every simulation run

### 📅 Progress Dashboard
- Historical scan comparison with restore functionality
- 28-day routine consistency heatmap
- Achievement system (streak tracking, milestones)

### 🃏 Holographic Aura Card
- Flip-card display showing beauty archetype, formula code, skin/hair nodes
- Shareable on Instagram / TikTok

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + Vite 5 |
| **Routing** | React Router DOM v6 |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **AI Engine** | Custom deterministic multi-agent system (`aiEngine.js`) |
| **Styling** | Vanilla CSS with CSS custom properties (glassmorphism design system) |
| **Fonts** | Inter + Playfair Display (Google Fonts) |

---

## 🧬 Prompt Engineering

Each agent uses structured XML prompts for maximum clarity and parse efficiency:

```xml
<system_context>
You are the Dermatologist Agent in the AuraAI multi-agent skincare platform.
</system_context>

<execution_rules>
- Respond STRICTLY in structured JSON format.
- Do NOT output conversational text or markdown blocks outside the JSON payload.
</execution_rules>

<user_profile>
Skin Type: oily | Age: 24 | Sleep: 6h | Water: 7 glasses | Stress: 7/10 | Diet: 6/10
</user_profile>

<diagnostic_task>
Execute diagnostics for Acne, Pigmentation, Redness, Oiliness. Compute scores and root causes.
</diagnostic_task>
```

The XML delimiter structure reduces LLM parsing ambiguity and enables consistent structured output across all 5 agents.

---

## 📁 Repository Structure

```
AuraAI/
├── src/
│   ├── pages/           # All application screens
│   │   ├── Landing.jsx
│   │   ├── BeautyProfile.jsx
│   │   ├── PhotoUpload.jsx
│   │   ├── Analysis.jsx          # 5-agent live streaming terminal
│   │   ├── IntelligenceReport.jsx # Full report + formulation sandbox
│   │   ├── OutcomeSimulator.jsx   # Before/after slider + forecast
│   │   ├── ForecastDashboard.jsx
│   │   ├── ProgressDashboard.jsx  # History + achievements
│   │   └── SkinJournal.jsx
│   ├── services/
│   │   └── aiEngine.js           # All 5 agent functions + XML prompts
│   ├── components/               # Charts, UI components, layout
│   ├── context/
│   │   └── AuraContext.jsx       # Global state management
│   └── data/                     # Ingredient DB, routines, mock progress
├── prompts/                      # Agent prompt specifications (markdown)
├── docs/                         # Architecture, design docs, pitch story
└── demo/                         # Demo script
```

---

## ⚡ Quick Start

```bash
git clone https://github.com/hariharan259/AuraAI-2.git
cd AuraAI-2
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start your AI beauty analysis.

---

## 🏆 Hackathon Highlights

1. **Structured XML Prompts** — Multi-agent pipeline with delimited prompts for lower latency
2. **Before/After Simulator** — Live photo comparison slider with CSS filter-based Day 90 projection
3. **Formulation Sandbox** — Real-time safety score engine with ingredient conflict detection
4. **Personalized Scanner Logs** — Dynamic terminal output injecting user profile data live
5. **Interactive Scan History** — Browse and restore historical analysis reports

---

## 📜 License

MIT License — see [LICENSE](LICENSE)
