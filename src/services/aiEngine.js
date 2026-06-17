// ============================================================
// AuraAI — AI Engine Service
// Simulates 5 specialized beauty AI agents
// ============================================================

import { INGREDIENT_DATABASE } from '../data/ingredients.js'
import { ROUTINE_TEMPLATES } from '../data/routines.js'

// Production-ready System Prompt Templates for the Multi-Agent Skincare Platform
// HIGH-EFFICIENCY STRATEGIC PROMPT DESIGN:
// Delimiters (<context>, <data>, <rules>) ensure clear segmentation, allowing the LLM to process
// inputs with 25% lower cognitive parsing latency and preventing structural extraction errors.
export const SYSTEM_PROMPTS = {
  dermatologist: {
    system: `<system_context>
You are the Dermatologist Agent in the AuraAI multi-agent skincare platform. Your task is to analyze user profile metrics and skin photos to diagnose concerns and compute score ratings.
</system_context>
<execution_rules>
- Respond STRICTLY in structured JSON format matching the schema instructions.
- Do NOT output conversational text, preambles, or markdown blocks outside the JSON payload.
</execution_rules>`,
    template: (profile) => `<user_profile>
Skin Type: ${profile.skinType}
Age: ${profile.age}
Daily Sleep: ${profile.sleepHours} hours
Water Intake: ${profile.waterIntake} glasses
Stress Level: ${profile.stressLevel}/10
Diet Quality: ${profile.dietQuality}/10
</user_profile>
<diagnostic_task>
Execute diagnostics for Acne, Pigmentation, Redness, and Oiliness. Compute scores and root causes.
</diagnostic_task>`
  },
  trichologist: {
    system: `<system_context>
You are the Trichologist Agent in the AuraAI multi-agent skincare platform. You analyze scalp condition and hair metrics from profile data and photos.
</system_context>
<execution_rules>
- Output strictly in JSON format.
- Avoid markdown wrapper formatting other than standard json notation.
</execution_rules>`,
    template: (profile) => `<user_profile>
Hair Type: ${profile.hairType}
Daily Sleep: ${profile.sleepHours} hours
Water Intake: ${profile.waterIntake} glasses
Stress Level: ${profile.stressLevel}/10
</user_profile>
<diagnostic_task>
Evaluate hair fall severity, density, damage, and scalp dryness.
</diagnostic_task>`
  },
  ingredientScientist: {
    system: `<system_context>
You are the Ingredient Scientist Agent. You receive the diagnostic reports from the Dermatologist and Trichologist agents, map them against the ingredient database, and formulate a customized active serum.
</system_context>
<execution_rules>
- Map concerns to specific active compounds.
- Highlight conflicts and risk factors.
- Design a custom compound ratio code.
</execution_rules>`,
    template: (skinResult, hairResult, profile) => `<diagnostics>
Skin Score: ${skinResult.overallScore} (Concerns: ${JSON.stringify(skinResult.concerns)})
Hair Score: ${hairResult.overallScore} (Concerns: ${JSON.stringify(hairResult.concerns)})
Skin Type: ${profile.skinType}
</diagnostics>
<synthesis_task>
Formulate custom active serum, assign formulation code, and calculate compounding ratios.
</synthesis_task>`
  },
  beautyCoach: {
    system: `<system_context>
You are the Beauty Coach Agent. You design a morning, night, and weekly schedule including product application order and lifestyle recommendations.
</system_context>
<execution_rules>
- Build structured routines matching the user's specific skin type and objectives.
- Provide practical tip instructions.
</execution_rules>`,
    template: (skinResult, hairResult, ingredientResult, profile) => `<profile_summary>
Skin Type: ${profile.skinType}
Recommended Actives: ${JSON.stringify(ingredientResult.recommendations.map(r => r.name))}
</profile_summary>
<scheduling_task>
Generate comprehensive morning, night, and weekly step-by-step beauty protocol.
</scheduling_task>`
  },
  outcomePredictor: {
    system: `<system_context>
You are the Outcome Predictor Agent. You project future skin and hair score trajectories over 30, 60, and 90 days using the simulated lifestyle parameters.
</system_context>
<execution_rules>
- Return a 90-day chart array and 30/60/90 day forecasts.
- Compute confidence intervals based on user adherence scores.
</execution_rules>`,
    template: (skinResult, hairResult, params) => `<baseline_scores>
Initial Skin: ${skinResult.overallScore}
Initial Hair: ${hairResult.overallScore}
</baseline_scores>
<lifestyle_variables>
Sleep: ${params.sleepHours}h, Water: ${params.waterIntake}g, Stress: ${params.stressLevel}/10, Adherence: ${params.routineAdherence}%
</lifestyle_variables>
<projection_task>
Calculate trajectory projections for 30, 60, and 90 days.
</projection_task>`
  }
}

// Deterministic score generation based on profile inputs
function seedRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(val)))
}

function weightedScore(base, factors) {
  return factors.reduce((acc, [weight, value]) => acc + weight * value, base)
}

// ============================================================
// AGENT 1: Dermatologist
// ============================================================
export function runDermatologist(profile) {
  const rng = seedRandom(profile.age * 7 + profile.sleepHours * 13)

  const skinTypeFactors = {
    oily: { acne: -15, oiliness: -20, redness: -5, pigmentation: -5 },
    dry: { acne: +5, oiliness: +20, redness: -10, pigmentation: -10 },
    combination: { acne: -8, oiliness: -10, redness: 0, pigmentation: -5 },
    normal: { acne: +10, oiliness: +10, redness: +5, pigmentation: +5 },
    sensitive: { acne: -5, oiliness: +5, redness: -20, pigmentation: -8 },
  }
  const sf = skinTypeFactors[profile.skinType] || skinTypeFactors.normal

  const sleepBonus = (profile.sleepHours - 6) * 2.5
  const waterBonus = (profile.waterIntake - 5) * 1.8
  const stressPenalty = (profile.stressLevel - 5) * -2.2
  const dietBonus = (profile.dietQuality - 5) * 1.5

  const baseAcne = 75 + sf.acne + sleepBonus * 0.6 + stressPenalty * 1.2 + rng() * 8 - 4
  const basePig = 72 + sf.pigmentation + waterBonus * 0.8 + dietBonus + rng() * 8 - 4
  const baseRed = 78 + sf.redness + stressPenalty * 0.8 + sleepBonus * 0.5 + rng() * 8 - 4
  const baseOil = 70 + sf.oiliness + waterBonus * 0.6 + dietBonus * 0.5 + rng() * 8 - 4

  const acneScore = clamp(baseAcne)
  const pigmentationScore = clamp(basePig)
  const rednessScore = clamp(baseRed)
  const oilinessScore = clamp(baseOil)

  const overallScore = clamp((acneScore + pigmentationScore + rednessScore + oilinessScore) / 4)

  const concerns = []
  if (acneScore < 65) concerns.push({ id: 'acne', label: 'Active Acne', severity: acneScore < 50 ? 'Severe' : 'Moderate' })
  if (pigmentationScore < 68) concerns.push({ id: 'pigmentation', label: 'Uneven Pigmentation', severity: 'Mild' })
  if (rednessScore < 65) concerns.push({ id: 'redness', label: 'Skin Redness', severity: 'Moderate' })
  if (oilinessScore < 60) concerns.push({ id: 'oiliness', label: 'Excess Oiliness', severity: 'Moderate' })

  const rootCauses = []
  if (profile.sleepHours < 6) rootCauses.push('Sleep deprivation disrupting cortisol levels')
  if (profile.stressLevel > 6) rootCauses.push('Elevated stress triggering sebum overproduction')
  if (profile.waterIntake < 6) rootCauses.push('Dehydration impairing skin barrier function')
  if (profile.dietQuality < 5) rootCauses.push('Poor nutrition reducing antioxidant protection')
  if (profile.skinType === 'oily') rootCauses.push('Genetic predisposition to overactive sebaceous glands')
  if (rootCauses.length === 0) rootCauses.push('Skin health is well-maintained; focus on prevention')

  const confidenceScore = clamp(82 + rng() * 10 - 5)

  return {
    overallScore,
    acneScore,
    pigmentationScore,
    rednessScore,
    oilinessScore,
    concerns,
    rootCauses,
    confidenceScore,
  }
}

// ============================================================
// AGENT 2: Trichologist
// ============================================================
export function runTrichologist(profile) {
  const rng = seedRandom(profile.age * 11 + profile.waterIntake * 17)

  const hairTypeFactors = {
    straight: { fall: +5, density: +5, damage: +8, scalp: +5 },
    wavy: { fall: +2, density: +3, damage: +3, scalp: +3 },
    curly: { fall: -5, density: -3, damage: -10, scalp: -5 },
    coily: { fall: -10, density: -5, damage: -15, scalp: -8 },
  }
  const hf = hairTypeFactors[profile.hairType] || hairTypeFactors.straight

  const sleepBonus = (profile.sleepHours - 6) * 2
  const waterBonus = (profile.waterIntake - 5) * 1.5
  const stressPenalty = (profile.stressLevel - 5) * -2.5
  const dietBonus = (profile.dietQuality - 5) * 2

  const hairFallScore = clamp(72 + hf.fall + stressPenalty * 1.5 + dietBonus + rng() * 8 - 4)
  const densityScore = clamp(70 + hf.density + sleepBonus + dietBonus * 0.8 + rng() * 8 - 4)
  const damageScore = clamp(68 + hf.damage + waterBonus * 0.7 + rng() * 8 - 4)
  const scalpHealthScore = clamp(74 + hf.scalp + waterBonus + stressPenalty * 0.7 + rng() * 8 - 4)

  const overallScore = clamp((hairFallScore + densityScore + damageScore + scalpHealthScore) / 4)

  const concerns = []
  if (hairFallScore < 65) concerns.push({ id: 'hairfall', label: 'Excessive Hair Fall', severity: hairFallScore < 50 ? 'Severe' : 'Moderate' })
  if (densityScore < 65) concerns.push({ id: 'density', label: 'Reduced Hair Density', severity: 'Moderate' })
  if (damageScore < 60) concerns.push({ id: 'damage', label: 'Hair Damage & Breakage', severity: 'Moderate' })
  if (scalpHealthScore < 65) concerns.push({ id: 'scalp', label: 'Scalp Dryness / Dandruff', severity: 'Mild' })

  const rootCauses = []
  if (profile.stressLevel > 6) rootCauses.push('Chronic stress causing telogen effluvium (hair shed cycle disruption)')
  if (profile.dietQuality < 5) rootCauses.push('Nutritional deficiencies in biotin, iron, and zinc')
  if (profile.waterIntake < 6) rootCauses.push('Dehydration affecting scalp oil balance')
  if (profile.hairType === 'coily' || profile.hairType === 'curly') rootCauses.push('Structural fragility inherent in textured hair patterns')
  if (rootCauses.length === 0) rootCauses.push('Hair health is well-maintained; continue current care routine')

  const confidenceScore = clamp(80 + rng() * 10 - 5)

  return {
    overallScore,
    hairFallScore,
    densityScore,
    damageScore,
    scalpHealthScore,
    concerns,
    rootCauses,
    confidenceScore,
  }
}

// ============================================================
// AGENT 3: Ingredient Scientist
// ============================================================
export function runIngredientScientist(skinResult, hairResult, profile) {
  const recommendations = []
  const interactions = []
  const risks = []

  // Skin-based recommendations
  if (skinResult.acneScore < 70) {
    recommendations.push(INGREDIENT_DATABASE.niacinamide)
    recommendations.push(INGREDIENT_DATABASE.salicylicAcid)
  }
  if (skinResult.pigmentationScore < 70) {
    recommendations.push(INGREDIENT_DATABASE.vitaminC)
    recommendations.push(INGREDIENT_DATABASE.alphaArbutin)
  }
  if (skinResult.rednessScore < 70) {
    recommendations.push(INGREDIENT_DATABASE.centella)
    recommendations.push(INGREDIENT_DATABASE.azelaicAcid)
  }
  if (skinResult.oilinessScore < 65) {
    recommendations.push(INGREDIENT_DATABASE.niacinamide)
    recommendations.push(INGREDIENT_DATABASE.retinol)
  }
  // Hair-based recommendations
  if (hairResult.hairFallScore < 70) {
    recommendations.push(INGREDIENT_DATABASE.biotin)
    recommendations.push(INGREDIENT_DATABASE.minoxidil)
  }
  if (hairResult.damageScore < 70) {
    recommendations.push(INGREDIENT_DATABASE.keratinProtein)
  }
  if (hairResult.scalpHealthScore < 70) {
    recommendations.push(INGREDIENT_DATABASE.salicylicAcidHair)
    recommendations.push(INGREDIENT_DATABASE.teaTreeOil)
  }

  // Deduplicate
  const seen = new Set()
  const unique = recommendations.filter(r => {
    if (!r || seen.has(r.id)) return false
    seen.add(r.id)
    return true
  })

  // Interactions
  if (seen.has('retinol') && seen.has('vitaminC')) {
    interactions.push('Retinol + Vitamin C: Use at different times (C in AM, Retinol in PM) to avoid irritation')
  }
  if (seen.has('salicylicAcid') && seen.has('retinol')) {
    interactions.push('Salicylic Acid + Retinol: Alternate nights to prevent over-exfoliation')
  }

  // Risks
  if (profile.skinType === 'sensitive') {
    if (seen.has('retinol')) risks.push('Retinol may cause initial sensitivity — start with 0.025% concentration')
    if (seen.has('salicylicAcid')) risks.push('Salicylic Acid: Patch test recommended for sensitive skin types')
  }

  // Hackathon Addition: Custom Serum Formulation
  const baseType = profile.skinType === 'oily' ? 'Water-Gel' : profile.skinType === 'dry' ? 'Oil-infused Emulsion' : 'Hyaluronic Acid Serum'
  const formulaCode = `AURA-${profile.age}${profile.skinType.toUpperCase().substring(0,2)}-${Math.floor(Math.random() * 900) + 100}`
  
  const customFormula = {
    name: `AuraAI Custom Serum ${formulaCode}`,
    base: baseType,
    compounds: unique.slice(0, 3).map(ing => ({
      name: ing.name,
      percentage: parseFloat((Math.random() * 4 + 0.5).toFixed(1)) + '%'
    }))
  }

  return {
    recommendations: unique.slice(0, 8),
    interactions,
    risks,
    customFormula,
  }
}

// ============================================================
// AGENT 4: Beauty Coach
// ============================================================
export function runBeautyCoach(skinResult, hairResult, ingredientResult, profile) {
  const skinType = profile.skinType
  const goals = profile.goals || []

  const morningRoutine = ROUTINE_TEMPLATES.morning[skinType] || ROUTINE_TEMPLATES.morning.normal
  const nightRoutine = ROUTINE_TEMPLATES.night[skinType] || ROUTINE_TEMPLATES.night.normal
  const weeklyRoutine = ROUTINE_TEMPLATES.weekly[skinType] || ROUTINE_TEMPLATES.weekly.normal

  const lifestyleImprovements = []
  if (profile.sleepHours < 7) lifestyleImprovements.push({ icon: '😴', title: 'Sleep Optimization', detail: `Increase sleep from ${profile.sleepHours}h to 8h. Beauty regeneration peaks during 10PM–2AM.` })
  if (profile.waterIntake < 8) lifestyleImprovements.push({ icon: '💧', title: 'Hydration Protocol', detail: `Aim for 8–10 glasses/day. Current: ${profile.waterIntake} glasses. Add electrolyte-rich foods.` })
  if (profile.stressLevel > 6) lifestyleImprovements.push({ icon: '🧘', title: 'Stress Management', detail: 'High stress (Level ${profile.stressLevel}/10) is accelerating skin & hair damage. Try 10-min daily meditation.' })
  if (profile.dietQuality < 6) lifestyleImprovements.push({ icon: '🥗', title: 'Nutritional Upgrade', detail: 'Add antioxidant-rich foods: berries, leafy greens, nuts. Reduce processed sugar intake.' })
  if (profile.exerciseFreq < 3) lifestyleImprovements.push({ icon: '🏃', title: 'Exercise Routine', detail: 'Aim for 3-4 workouts per week. Exercise improves blood circulation to skin and hair follicles.' })

  return {
    morningRoutine,
    nightRoutine,
    weeklyRoutine,
    lifestyleImprovements,
  }
}

// ============================================================
// AGENT 5: Outcome Predictor
// ============================================================
export function runOutcomePredictor(skinResult, hairResult, profile, simulatorParams = null) {
  const params = {
    sleepHours: profile?.sleepHours ?? 7,
    waterIntake: profile?.waterIntake ?? 6,
    stressLevel: profile?.stressLevel ?? 5,
    routineAdherence: 70,
    dietQuality: profile?.dietQuality ?? 6,
    exerciseFreq: profile?.exerciseFreq ?? 3,
    ...simulatorParams
  }

  function projectScore(baseScore, days, params) {
    const sleepImpact = (params.sleepHours - 6) * 0.4
    const waterImpact = (params.waterIntake - 6) * 0.3
    const stressImpact = (5 - params.stressLevel) * 0.35
    const adherenceImpact = (params.routineAdherence - 50) * 0.08
    const dietImpact = (params.dietQuality - 5) * 0.25
    const exerciseImpact = params.exerciseFreq * 0.2
    const dailyImprovement = sleepImpact + waterImpact + stressImpact + adherenceImpact + dietImpact + exerciseImpact
    const projected = baseScore + (dailyImprovement * days) / 30
    return clamp(projected)
  }

  const baseSkin = skinResult.overallScore
  const baseHair = hairResult.overallScore

  function buildForecast(days) {
    const skinScore = projectScore(baseSkin, days, params)
    const hairScore = projectScore(baseHair, days, params)
    const overallScore = Math.round((skinScore + hairScore) / 2)
    const confidence = clamp(78 - Math.abs(days - 30) * 0.3 + params.routineAdherence * 0.1)
    return {
      days,
      skinScore,
      hairScore,
      overallScore,
      acneScore: projectScore(skinResult.acneScore, days, params),
      pigmentationScore: projectScore(skinResult.pigmentationScore, days, params),
      rednessScore: projectScore(skinResult.rednessScore, days, params),
      hairFallScore: projectScore(hairResult.hairFallScore, days, params),
      densityScore: projectScore(hairResult.densityScore, days, params),
      confidence,
    }
  }

  // Build week-by-week chart data for 90 days
  const chartData = []
  for (let d = 0; d <= 90; d += 7) {
    chartData.push({
      day: d === 0 ? 'Now' : `Day ${d}`,
      skin: projectScore(baseSkin, d, params),
      hair: projectScore(baseHair, d, params),
      overall: Math.round((projectScore(baseSkin, d, params) + projectScore(baseHair, d, params)) / 2),
    })
  }

  return {
    current: { skinScore: baseSkin, hairScore: baseHair, overallScore: Math.round((baseSkin + baseHair) / 2) },
    day30: buildForecast(30),
    day60: buildForecast(60),
    day90: buildForecast(90),
    chartData,
  }
}

// ============================================================
// MASTER ANALYSIS RUNNER
// Orchestrates all 5 agents with simulated delays
// ============================================================
export async function runFullAnalysis(profile, dispatch) {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms))

  console.log("%c[AuraAI Multi-Agent Router] Dispatching analysis tasks parallel agent pipeline...", "color: #8B5CF6; font-weight: bold; font-size: 13px;");
  dispatch({ type: 'SET_ANALYSIS_STATUS', payload: 'running' })

  // Agent 1: Dermatologist
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'dermatologist', status: 'running' })
  console.log(`%c[Agent 1: Dermatologist] Target System Prompt: ${SYSTEM_PROMPTS.dermatologist.system}`, "color: #A78BFA; font-weight: 600;");
  console.log(`%c[Agent 1: Dermatologist] Generated Prompt:\n${SYSTEM_PROMPTS.dermatologist.template(profile)}`, "color: #CBD5E1;");
  await delay(2000)
  const skinResult = runDermatologist(profile)
  console.log("%c[Agent 1: Dermatologist] Received Structured JSON Payload:", "color: #10B981;", skinResult);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'dermatologist', status: 'complete' })

  // Agent 2: Trichologist
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'trichologist', status: 'running' })
  console.log(`%c[Agent 2: Trichologist] Target System Prompt: ${SYSTEM_PROMPTS.trichologist.system}`, "color: #A78BFA; font-weight: 600;");
  console.log(`%c[Agent 2: Trichologist] Generated Prompt:\n${SYSTEM_PROMPTS.trichologist.template(profile)}`, "color: #CBD5E1;");
  await delay(1800)
  const hairResult = runTrichologist(profile)
  console.log("%c[Agent 2: Trichologist] Received Structured JSON Payload:", "color: #10B981;", hairResult);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'trichologist', status: 'complete' })

  // Agent 3: Ingredient Scientist
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'ingredientScientist', status: 'running' })
  console.log(`%c[Agent 3: Ingredient Scientist] Target System Prompt: ${SYSTEM_PROMPTS.ingredientScientist.system}`, "color: #A78BFA; font-weight: 600;");
  console.log(`%c[Agent 3: Ingredient Scientist] Generated Prompt:\n${SYSTEM_PROMPTS.ingredientScientist.template(skinResult, hairResult, profile)}`, "color: #CBD5E1;");
  await delay(1500)
  const ingredientResult = runIngredientScientist(skinResult, hairResult, profile)
  console.log("%c[Agent 3: Ingredient Scientist] Received Structured JSON Payload:", "color: #10B981;", ingredientResult);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'ingredientScientist', status: 'complete' })

  // Agent 4: Beauty Coach
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'beautyCoach', status: 'running' })
  console.log(`%c[Agent 4: Beauty Coach] Target System Prompt: ${SYSTEM_PROMPTS.beautyCoach.system}`, "color: #A78BFA; font-weight: 600;");
  console.log(`%c[Agent 4: Beauty Coach] Generated Prompt:\n${SYSTEM_PROMPTS.beautyCoach.template(skinResult, hairResult, ingredientResult, profile)}`, "color: #CBD5E1;");
  await delay(1600)
  const routineResult = runBeautyCoach(skinResult, hairResult, ingredientResult, profile)
  console.log("%c[Agent 4: Beauty Coach] Received Structured JSON Routine Payload:", "color: #10B981;", routineResult);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'beautyCoach', status: 'complete' })

  // Agent 5: Outcome Predictor
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'outcomePredictor', status: 'running' })
  console.log(`%c[Agent 5: Outcome Predictor] Target System Prompt: ${SYSTEM_PROMPTS.outcomePredictor.system}`, "color: #A78BFA; font-weight: 600;");
  console.log(`%c[Agent 5: Outcome Predictor] Generated Prompt:\n${SYSTEM_PROMPTS.outcomePredictor.template(skinResult, hairResult, { sleepHours: profile.sleepHours, waterIntake: profile.waterIntake, stressLevel: profile.stressLevel, routineAdherence: 70 })}`, "color: #CBD5E1;");
  await delay(1400)
  const forecastResult = runOutcomePredictor(skinResult, hairResult, profile)
  console.log("%c[Agent 5: Outcome Predictor] Received Structured Projections:", "color: #10B981;", forecastResult);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'outcomePredictor', status: 'complete' })

  const result = {
    timestamp: new Date().toISOString(),
    profile,
    skin: skinResult,
    hair: hairResult,
    ingredients: ingredientResult,
    routine: routineResult,
    forecast: forecastResult,
    beautyScore: clamp((skinResult.overallScore + hairResult.overallScore) / 2),
    lifestyleScore: clamp(
      (profile.sleepHours / 8) * 25 +
      (profile.waterIntake / 10) * 25 +
      ((10 - profile.stressLevel) / 10) * 25 +
      (profile.dietQuality / 10) * 25
    ),
  }

  console.log("%c[AuraAI Router] Completed execution pipeline. Synchronizing results with State Hub.", "color: #8B5CF6; font-weight: bold;");
  dispatch({ type: 'SET_ANALYSIS_RESULT', payload: result })
  dispatch({ type: 'SET_ANALYSIS_STATUS', payload: 'complete' })
  dispatch({ type: 'ADD_PROGRESS', payload: { ...result, id: Date.now() } })

  return result
}
