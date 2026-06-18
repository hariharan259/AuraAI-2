# AuraAI — AI Beauty Intelligence System

> Multi-agent AI platform that analyzes skin & hair health, formulates personalized active serums, predicts 90-day outcomes, and tracks your beauty journey over time.

---

## 🧠 What is AuraAI?

AuraAI is a hackathon-built AI beauty intelligence platform. It replaces generic skincare advice with a deterministic, multi-agent pipeline that produces clinically-structured diagnostics, bespoke ingredient formulations, personalized routines, and 90-day outcome forecasting — all from a selfie and a short profile.

---

## 🌐 Live URL & Demo Video
- **Live Production URL**: [https://aura-ai-2.vercel.app](https://aura-ai-2.vercel.app) (Connect your GitHub repo to [Vercel](https://vercel.com) for instant auto-deployment)
- **Demo Video Walkthrough**: [Watch the AuraAI 2-Minute Demo & Pitch Video](https://youtube.com/watch?v=AuraAIDemoVideoPlaceholder)
- **Mobile Secure Access**: Accessible on your phone via local Wi-Fi HTTPS at `https://<your-local-ip>:3000/`

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

## ⚡ Quick Start & Remote Access

### 1. Run Locally (with HTTPS)
To support camera access and secure APIs on mobile devices, Vite is configured with a self-signed HTTPS certificate using `@vitejs/plugin-basic-ssl`.

```bash
git clone https://github.com/hariharan259/AuraAI-2.git
cd AuraAI-2
npm install
npm run dev
```

Open [https://localhost:3000](https://localhost:3000) in your browser.

> ⚠️ **Note on SSL Certificate Warning:** Since the SSL certificate is self-signed for local development, your browser will display a warning (e.g., *"Your connection is not private"* or *"Warning: Potential Security Risk Ahead"*). Simply click **Advanced** and choose **Proceed** / **Accept the Risk and Continue**.

---

### 2. Accessing from Another PC or Phone (Same Wi-Fi Network)
Both devices must be connected to the **same Wi-Fi / local network**.

When you run `npm run dev`, Vite prints the secure network addresses:
```text
➜  Local:   https://localhost:3000/
➜  Network: https://192.168.x.x:3000/
```

1. **On your phone or other PC**: Type the exact **Network URL** (e.g., `https://192.168.x.x:3000`) shown in your terminal into the browser.
2. **Accept the SSL Warning**: Just like on your local PC, accept the SSL certificate warning in your phone's browser to proceed.
3. **Why HTTPS is Required**: Mobile browsers (iOS Safari, Android Chrome) block camera access (`getUserMedia`) on unencrypted HTTP connections. Serving the dev environment over **HTTPS** ensures the webcam scan functionality works perfectly on your phone.

#### 🛠️ Troubleshooting Connection Issues on Other PCs/Phones:
If the site does not load on the other PC or phone:
- **Check the URL Scheme**: Ensure you typed `https://` and not `http://`.
- **Firewall Restrictions**: The host PC's firewall might be blocking incoming traffic on port `3000`.
  - **On macOS**: Go to *System Settings > Network > Firewall* and ensure incoming connections are allowed, or temporarily turn it off to test.
  - **On Windows**: Ensure the Node.js/Vite process has public/private network permissions in the Windows Defender Firewall.
- **Router Security**: Some Wi-Fi routers have "AP Isolation" or "Client Isolation" enabled, which blocks devices on the same Wi-Fi from talking to each other. If this is the case, use a public tunnel (below).

---

### 3. Accessing from Any PC Anywhere (Public Tunnels & Hosting)
If you want to share the app with judges or users who are **not on your local network**, use one of these methods:

#### Option A: Quick Public Tunnel (Localtunnel)
Expose your local development server to the internet without installing anything permanently:
```bash
npx localtunnel --port 3000
```
This generates a public URL like `https://xxxx.loca.lt` which can be opened on any device globally.

#### Option B: Deploy to Vercel (Free & Instant)
To get a permanent, production-ready public URL:
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root folder.
3. Follow the quick prompts to deploy. You will get a live `https://aura-ai.vercel.app` URL.


---

## 🧪 Automated Test Suite & Proof of Execution

AuraAI features an automated unit test suite powered by **Vitest** that validates the score calculations, ingredient formulations, conflict checks, and asynchronous agent state transitions of the multi-agent system.

### Running the Tests:
To execute the automated unit test suite:
```bash
npm run test
```

### Test Coverage Proof:
```text
 ✓ src/services/aiEngine.test.js (8 tests) 8330ms
   ✓ Agent 1: Dermatologist
     ✓ should calculate valid scores and concerns for oily skin profile
     ✓ should handle sensitive skin type and adjust scores accordingly
   ✓ Agent 2: Trichologist
     ✓ should calculate valid hair scores and root causes
   ✓ Agent 3: Ingredient Scientist
     ✓ should recommend active ingredients and flag conflicts like Retinol + Vitamin C
     ✓ should flag risks for sensitive skin types
   ✓ Agent 4: Beauty Coach
     ✓ should generate morning, evening, weekly routines and lifestyle suggestions
   ✓ Agent 5: Outcome Predictor
     ✓ should project a positive trajectory when habits are good
   ✓ Master Multi-Agent Router
     ✓ should orchestrate all agents in sequence and call dispatch

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Duration  8.56s
```

---

## 📸 Application Screenshots & UI Flows

*AuraAI uses a premium, dark-mode glassmorphism interface built for maximum demo impact during hackathon evaluation:*

1. **✨ Landing / Hero Portal**: High-fidelity dark aesthetic, dynamic system-status ticker displaying simulated active diagnostics, and agent role explainer panels.
2. **👤 Personal Intake Form**: Interactive slider inputs for sleep, water intake, stress levels, and visual bio-skintype selection cards (Dry, Oily, Normal, Sensitive, Combination).
3. **📷 Live Spectral Camera Scanner**: Secure direct video feed access over local network HTTPS with an active overlay grid tracking facial analysis nodes.
4. **🧠 Diagnostic Terminal Logs**: 5-Agent parallel stream rendering personalized logging statements live as calculations are performed.
5. **🧪 Bespoke Formulation Sandbox**: Drag-and-drop percentage dial updating reactively as active ingredient sliders are modified, with live compatibility conflicts warning users.
6. **📈 Day 90 Outcome Comparison**: Interactive Before/After split-screen scrub slider to contrast baseline selfies with Day 90 projections side-by-side.

---

## 🏆 Hackathon Highlights

1. **Structured XML Prompts** — Multi-agent pipeline with delimited prompts for lower latency
2. **Before/After Simulator** — Live photo comparison slider with CSS filter-based Day 90 projection
3. **Formulation Sandbox** — Real-time safety score engine with ingredient conflict detection
4. **Personalized Scanner Logs** — Dynamic terminal output injecting user profile data live
5. **Interactive Scan History** — Browse and restore historical analysis reports

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Master AI Prompt](docs/antigravity_master_prompt.md) | **Overall Master Prompt** detailing system roles, vision, target metrics, and rules |
| [Prompt Log / Evolution](docs/prompt_versions.md) | Evolution logging from V1 (natural language) to V5 (composed XML tags) |
| [Agent Workflow Flowchart](docs/agent_workflow.md) | High-level data flowchart showing cascading agent structure |
| [Implementation Plan](docs/implementation_plan.md) | Full build strategy, phase breakdown, and test checklist |
| [Architecture](docs/architecture.md) | Multi-agent system flowchart and component overview |
| [Prompt Strategy](docs/prompt_strategy.md) | XML prompt engineering rationale and all 5 agent prompts |
| [Prompt Examples](docs/prompt_examples.md) | Concrete input/output examples per agent |
| [Workflow](docs/workflow.md) | Stage-by-stage execution pipeline breakdown |
| [System Design](docs/system_design.md) | Data schemas, CSS design tokens, state management |
| [Why AI?](docs/why_ai.md) | Rationale for multi-agent AI over rule-based systems |
| [Pitch Story](docs/pitch_story.md) | 2-minute demo pitch narrative |
| [Judge Q&A](docs/judge_Questions.md) | Pre-prepared answers to hackathon judge questions |

---

## 📜 License

MIT License — see [LICENSE](LICENSE)

