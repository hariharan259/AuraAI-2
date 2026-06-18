# AuraAI — Multi-Agent Collaboration Workflow

This document details the analytical workflow and multi-agent execution pipeline within AuraAI, outlining how user intake data undergoes structured clinical simulation to generate personalized diagnostics, bespoke compound formulations, and outcome forecasting.

---

## High-Level Execution Workflow

```
[ User Onboarding ]
        │
        ▼
[ Intake & Profile Builder ] (Skin & Hair Types, Sleep, Water, Stress, Goals)
        │
        ▼
[ Selfie Intake & Vision Simulator ] (Generates raw Acne, Redness, Hair Fall, Density metrics)
        │
        ▼
[ runFullAnalysis() Orchestrator ]
        │
        ├──► [ Dermatologist Agent ] (Computes Skin Health & Root Causes)
        ├──► [ Trichologist Agent ]  (Computes Hair/Scalp Health & Root Causes)
        │
        ▼ (Consolidated Diagnostic Payloads)
[ Ingredient Scientist Agent ] (Formulates custom active compounds, alerts contraindications)
        │
        ├──► [ Beauty Coach Agent ] (Morning/Night routines & lifestyle protocols)
        └──► [ Outcome Predictor Agent ] (Simulates 90-day trajectory progress)
        │
        ▼
[ Sync to State Hub (AuraContext) ]
        │
        ├──► Save to History Ledger (Enabling comparisons & restoring reports)
        └──► Render AuraAI Executive Dashboard
```

---

## Stage-by-Stage Breakdown

### Phase 1: User Onboarding & intake Profile
* **Intake Form**: The user enters their name, age, biological skin type (Normal, Dry, Oily, Combination, Sensitive), hair type (Straight, Wavy, Curly, Coily), and baseline lifestyle variables (average sleep, daily water intake, perceived stress level).
* **Selfie Intake**: User uploads a selfie or uses the device camera. The intake system simulates a multi-spectral scan, analyzing the image to generate concrete scores for skin indices (Acne, Redness, Pigmentation, Oiliness) and hair indices (Hair Fall, Density, Damage, Scalp Health).

### Phase 2: Parallel Diagnostic Pipeline
The orchestrator in `aiEngine.js` triggers two specialized primary diagnostic agents in parallel:
1. **Dermatologist Agent**:
   * **Input**: Bio-profile metrics and simulated scan scores.
   * **Reasoning**: Evaluates the metrics against lifestyle parameters. For example, high stress is associated with cortisol spikes that increase sebum production.
   * **Output**: A comprehensive report containing an overall skin health score, prioritized active concerns (e.g., "Active Acne - Severe"), root cause explanations, and a diagnostic confidence rating.
2. **Trichologist Agent**:
   * **Input**: Scalp metrics and hair characteristics.
   * **Reasoning**: Evaluates damage indices and root causes (e.g., structural fragility of curly/coily hair under dry conditions, dehydration-induced scalp scaling).
   * **Output**: Overall hair score, concerns ledger (e.g., "Hair Damage & Breakage"), root causes, and confidence score.

### Phase 3: Formulation & Active Compounding Synthesis
The **Ingredient Scientist Agent** takes over once the primary diagnostics are complete:
* **Synthesis**: Consumes the combined diagnostic payloads from both the Dermatologist and Trichologist.
* **Database Mapping**: Cross-references the user's primary concerns with the active ingredient database to find the most effective compounds (e.g., Niacinamide and Salicylic Acid for oily/acne-prone skin, Biotin and Minoxidil for hair density).
* **Contraindication & Interaction Check**: Identifies safety conflicts. If Vitamin C and Retinol are both recommended, the agent flags the combination and instructs the routine generator to schedule them at different times (AM vs. PM) to prevent skin barrier irritation.
* **Formulation Compounding**: Customizes a bespoke serum formulation, assigning a unique batch code (e.g., `AURA-24OI-512`), determining a delivery base (e.g., "Water-Gel" for oily skin), and calculating precise percentage ratios for up to 3 active ingredients.

### Phase 4: Coaching and Routine Generation
The **Beauty Coach Agent** structures the daily schedule:
* **Routine Layout**: Formulates a detailed Morning, Evening, and Weekly protocol. Product ordering is structured based on viscosity and active ingredient guidelines (cleanser -> toner -> custom active serum -> moisturizer -> SPF).
* **Lifestyle Upgrades**: Generates actionable, prioritized habits based on the user's lowest-performing intake metrics (e.g., adding a "Sleep Optimization" card if sleep hours are < 7, or "Hydration Protocol" if water intake is low).

### Phase 5: Outcome Forecasting & Simulation
The **Outcome Predictor Agent** calculates the 90-day trajectory:
* **Baseline Forecast**: Computes projected scores for 30, 60, and 90 days. It factors in baseline scores, lifestyle indicators, and a routine adherence index.
* **Beauty Outcome Simulator**: The user can modify sliders (Sleep, Water, Stress, Adherence) in the sandbox. The Outcome Predictor recalculates the projections dynamically, refreshing charts and visual before/after image comparisons.
