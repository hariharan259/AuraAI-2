import {
  UserProfile,
  SkinAnalysisResult,
  SkinTwin,
  PersonalizedRoutine,
  ProductRecommendation,
  TransformationForecast,
  ComparisonReport,
  PassportRecord
} from '../types';
import { AnalysisResultPayload } from '../context/AuraContext';
import { ROUTINE_TEMPLATES } from '../data/routines';

// Help functions for seeding random values
function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

// ============================================================
// CORE FEATURE 1: AI SKIN ANALYSIS
// ============================================================
export function runSkinAnalysis(profile: UserProfile): SkinAnalysisResult {
  const rng = seedRandom(profile.age * 3 + profile.sleepHours * 17 + profile.waterIntake * 11);

  // Impact factors based on skin type
  const skinTypeModifiers = {
    oily: { acne: -22, pimples: -25, darkSpots: -5, pigmentation: -8, oiliness: -35, dryness: +25, pores: -30, lines: 0, wrinkles: 0, bags: -5, redness: -10, unevenness: -10 },
    dry: { acne: +10, pimples: +8, darkSpots: -10, pigmentation: -10, oiliness: +30, dryness: -35, pores: +10, lines: -15, wrinkles: -12, bags: -8, redness: -8, unevenness: -5 },
    combination: { acne: -12, pimples: -15, darkSpots: -5, pigmentation: -8, oiliness: -18, dryness: -15, pores: -20, lines: -5, wrinkles: -5, bags: -5, redness: -5, unevenness: -8 },
    normal: { acne: +12, pimples: +15, darkSpots: +8, pigmentation: +10, oiliness: +15, dryness: +15, pores: +15, lines: +10, wrinkles: +12, bags: +8, redness: +10, unevenness: +10 },
    sensitive: { acne: -5, pimples: -5, darkSpots: -8, pigmentation: -10, oiliness: +10, dryness: -15, pores: -5, lines: -5, wrinkles: -5, bags: -5, redness: -32, unevenness: -15 },
  };

  const mod = skinTypeModifiers[profile.skinType] || skinTypeModifiers.normal;

  // Lifestyle bonuses/penalties
  const sleepBonus = (profile.sleepHours - 7) * 2.5; // Base 7h
  const waterBonus = (profile.waterIntake - 8) * 2.0; // Base 8 glasses
  const stressPenalty = (profile.stressLevel - 4) * -2.2; // Base 4/10
  const dietBonus = (profile.dietQuality - 5) * 1.8;
  const exerciseBonus = (profile.exerciseFreq - 2) * 1.5;

  const totalMod = sleepBonus + waterBonus + stressPenalty + dietBonus + exerciseBonus;

  // Base scores (higher means better condition, e.g. acne: 100 means perfectly clear skin)
  const acne = clamp(76 + mod.acne + totalMod * 0.5 + rng() * 8 - 4);
  const pimples = clamp(80 + mod.pimples + totalMod * 0.6 + rng() * 10 - 5);
  const darkSpots = clamp(74 + mod.darkSpots + totalMod * 0.4 + rng() * 6 - 3);
  const pigmentation = clamp(72 + mod.pigmentation + totalMod * 0.3 + rng() * 8 - 4);
  const oiliness = clamp(70 + mod.oiliness + (profile.skinType === 'oily' ? -10 : 5) + rng() * 10 - 5);
  const dryness = clamp(72 + mod.dryness + (profile.skinType === 'dry' ? -12 : 5) + waterBonus * 0.8 + rng() * 8 - 4);
  const poreVisibility = clamp(75 + mod.pores + oiliness * 0.2 + rng() * 8 - 4);
  const fineLines = clamp(80 + mod.lines - (profile.age - 20) * 0.8 + sleepBonus * 0.5 + rng() * 6 - 3);
  const wrinkles = clamp(82 + mod.wrinkles - (profile.age - 20) * 1.0 + sleepBonus * 0.4 + rng() * 6 - 3);
  const eyeBags = clamp(78 + mod.bags + sleepBonus * 1.2 + stressPenalty * 0.8 + rng() * 10 - 5);
  const redness = clamp(82 + mod.redness + stressPenalty * 0.7 + rng() * 8 - 4);
  const unevenness = clamp(75 + mod.unevenness + dietBonus * 0.5 + rng() * 8 - 4);

  // Core scores
  const skinHealthScore = clamp((acne + darkSpots + oiliness + dryness + wrinkles + redness) / 6);
  const hydrationScore = clamp(dryness * 0.7 + waterIntakeScore(profile.waterIntake) * 0.3);
  const acneRiskScore = clamp(100 - (acne * 0.5 + pimples * 0.3 + (100 - oiliness) * 0.2));
  const uvDamageScore = clamp(100 - (darkSpots * 0.6 + unevenness * 0.4));
  const agingRiskScore = clamp(100 - (wrinkles * 0.5 + fineLines * 0.3 + eyeBags * 0.2));
  const overallScore = clamp((skinHealthScore * 0.4 + hydrationScore * 0.2 + (100 - acneRiskScore) * 0.15 + (100 - uvDamageScore) * 0.125 + (100 - agingRiskScore) * 0.125));

  // Determine concerns
  const concerns: Array<{ id: string; label: string; severity: 'Mild' | 'Moderate' | 'Severe' }> = [];
  if (acne < 60) concerns.push({ id: 'acne', label: 'Active Acne & Pimples', severity: acne < 45 ? 'Severe' : 'Moderate' });
  if (pigmentation < 62) concerns.push({ id: 'pigmentation', label: 'Hyperpigmentation', severity: 'Moderate' });
  if (oiliness < 55) concerns.push({ id: 'oiliness', label: 'Excess Sebum Activity', severity: 'Moderate' });
  if (dryness < 58) concerns.push({ id: 'dryness', label: 'Dehydrated Epidermis', severity: dryness < 40 ? 'Severe' : 'Moderate' });
  if (redness < 60) concerns.push({ id: 'redness', label: 'Vascular Redness / Sensitivity', severity: 'Moderate' });
  if (wrinkles < 60) concerns.push({ id: 'wrinkles', label: 'Premature Wrinkles & Lines', severity: 'Mild' });

  // Generate root causes
  const rootCauses: string[] = [];
  if (profile.sleepHours < 6.5) rootCauses.push('Sleep deprivation causing nocturnal barrier repair impairment.');
  if (profile.stressLevel > 6) rootCauses.push('Elevated stress (cortisol) triggering systemic skin inflammation.');
  if (profile.waterIntake < 7) rootCauses.push('Low hydration volume reducing cellular skin turgor.');
  if (profile.dietQuality < 5) rootCauses.push('High glycemic diet accelerating sebum secretion.');
  if (profile.skinType === 'oily') rootCauses.push('Genetic hyper-responsiveness of sebaceous gland androgen receptors.');
  if (profile.skinType === 'sensitive') rootCauses.push('Compromised stratum corneum lipids causing high permeability.');
  if (rootCauses.length === 0) rootCauses.push('Skin barrier parameters are chemically balanced.');

  return {
    overallScore,
    skinHealthScore,
    hydrationScore,
    acneRiskScore,
    uvDamageScore,
    agingRiskScore,
    confidence: {
      acne: clamp(92 + rng() * 6),
      pigmentation: clamp(89 + rng() * 7),
      wrinkles: clamp(90 + rng() * 5),
      hydration: clamp(93 + rng() * 4),
      sensitivity: clamp(88 + rng() * 6)
    },
    concerns,
    rootCauses,
    measurements: {
      acne,
      pimples,
      darkSpots,
      pigmentation,
      oiliness,
      dryness,
      poreVisibility,
      fineLines,
      wrinkles,
      eyeBags,
      redness,
      unevenness
    }
  };
}

function waterIntakeScore(glasses: number): number {
  return clamp(glasses * 12.5); // 8 glasses = 100
}

// ============================================================
// CORE FEATURE 2: AI SKIN TWIN
// ============================================================
export function runSkinTwinAnalysis(result: SkinAnalysisResult, profile: UserProfile): SkinTwin {
  const meas = result.measurements;
  
  // Current state summary
  let currentSummary = `Digital twin represents a ${profile.age}-year-old ${profile.skinType} skin type. `;
  if (result.overallScore >= 80) {
    currentSummary += 'The skin barrier is highly stable, displaying optimal collagen structuring and cellular hydration balance.';
  } else if (result.overallScore >= 65) {
    currentSummary += 'The skin barrier is moderately stable, showing localized areas of lipid depletion and minor environmental damage.';
  } else {
    currentSummary += 'The skin barrier shows active compromise, with elevated markers for inflammation and epidermal water loss.';
  }

  // Strengths (scores >= 75)
  const strengthAreas: Array<{ title: string; description: string; score: number }> = [];
  if (meas.acne >= 75) strengthAreas.push({ title: 'Follicular Clarity', description: 'Very low rate of pore congestion or active blemishes.', score: meas.acne });
  if (meas.dryness >= 75) strengthAreas.push({ title: 'Cellular Hydration', description: 'Robust water-retention capacity in the stratum corneum.', score: meas.dryness });
  if (meas.darkSpots >= 75) strengthAreas.push({ title: 'Pigment Homogeneity', description: 'Excellent melanin distribution with minimal UV damage markers.', score: meas.darkSpots });
  if (meas.wrinkles >= 75) strengthAreas.push({ title: 'Collagen Density', description: 'Firm dermal matrix displaying resilient elasticity.', score: meas.wrinkles });
  if (meas.redness >= 75) strengthAreas.push({ title: 'Vascular Calmness', description: 'Stable micro-capillary system with minimal redness.', score: meas.redness });
  
  if (strengthAreas.length === 0) {
    strengthAreas.push({ title: 'Stratum Corneum Integrity', description: 'General skin barrier functionality is structurally intact.', score: 70 });
  }

  // Problems (scores < 60)
  const problemAreas: Array<{ title: string; description: string; score: number }> = [];
  if (meas.acne < 60) problemAreas.push({ title: 'Sebum Congestion', description: 'Active follicular clogging promoting bacterial growth.', score: meas.acne });
  if (meas.pigmentation < 60) problemAreas.push({ title: 'Pigmentation Spots', description: 'UV-induced melanin accumulation requiring cellular renewal.', score: meas.pigmentation });
  if (meas.dryness < 60) problemAreas.push({ title: 'Dehydration Areas', description: 'Elevated transepidermal water loss causing dry texture.', score: meas.dryness });
  if (meas.wrinkles < 60) problemAreas.push({ title: 'Micro-Creasing', description: 'Early degradation of collagen fibers in high-movement zones.', score: meas.wrinkles });
  if (meas.redness < 60) problemAreas.push({ title: 'Vascular Irritation', description: 'Localized inflammation of surface micro-vessels.', score: meas.redness });
  if (meas.oiliness < 55) problemAreas.push({ title: 'Hyper-Seborrhea', description: 'Overproduction of surface lipids leading to shine and congestion.', score: meas.oiliness });

  // Risk Areas (scores 60-74 or lifestyle risks)
  const riskAreas: Array<{ title: string; description: string; score: number }> = [];
  if (result.acneRiskScore > 40) riskAreas.push({ title: 'Blemish Flaring', description: 'Increased probability of inflammatory breakouts due to stress.', score: Math.round(100 - result.acneRiskScore) });
  if (result.uvDamageScore > 40) riskAreas.push({ title: 'Melasma Development', description: 'Melanocytes are active; UV exposure will trigger dark spots.', score: Math.round(100 - result.uvDamageScore) });
  if (result.agingRiskScore > 40) riskAreas.push({ title: 'Elasticity Loss', description: 'Oxidative stress is accelerating dermal matrix thinning.', score: Math.round(100 - result.agingRiskScore) });
  if (profile.stressLevel > 6) riskAreas.push({ title: 'Cortisol Thinning', description: 'High cortisol levels slow down skin cell regeneration rates.', score: 65 });

  // Improvement opportunities
  const improvementOpportunities: string[] = [];
  if (meas.acne < 65) improvementOpportunities.push('Introduce lipophilic beta-hydroxy acids to clear follicular blockages.');
  if (meas.dryness < 65) improvementOpportunities.push('Apply skin-identical lipids (ceramides, cholesterol) to lock in hydration.');
  if (meas.pigmentation < 65) improvementOpportunities.push('Incorporate tyrosinase inhibitors (vitamin C, alpha arbutin) to fade pigmentation.');
  if (meas.wrinkles < 65) improvementOpportunities.push('Utilize retinoids to stimulate dermal collagen and speed cell turnover.');
  if (profile.waterIntake < 8) improvementOpportunities.push('Increase cellular hydration from within by drinking 8+ glasses of water daily.');

  return {
    currentSummary,
    strengthAreas: strengthAreas.slice(0, 3),
    problemAreas: problemAreas.slice(0, 3),
    riskAreas: riskAreas.slice(0, 3),
    improvementOpportunities: improvementOpportunities.slice(0, 3)
  };
}

// ============================================================
// CORE FEATURE 3: 30-DAY TRANSFORMATION ENGINE
// ============================================================
export function runTransformationEngine(
  result: SkinAnalysisResult,
  profile: UserProfile,
  adherence = 85
): TransformationForecast[] {
  const baseScore = result.overallScore;

  const sleepFactor = Math.max(0.5, profile.sleepHours / 8);
  const waterFactor = Math.max(0.5, profile.waterIntake / 8);
  const stressFactor = Math.max(0.5, (10 - profile.stressLevel) / 6);
  const adherenceFactor = adherence / 100;

  const rate = 0.5 * sleepFactor * waterFactor * stressFactor * adherenceFactor;

  const buildPoint = (day: number): TransformationForecast => {
    if (day === 0) {
      return {
        day: 0,
        overallScore: baseScore,
        hydrationImprovementPct: 0,
        acneReductionPct: 0,
        pigmentationImprovementPct: 0
      };
    }

    const progressRatio = day / 30; // 0 to 1
    const improvement = rate * 20 * progressRatio;

    return {
      day,
      overallScore: clamp(baseScore + improvement),
      hydrationImprovementPct: clamp(rate * 30 * progressRatio),
      acneReductionPct: clamp(rate * 40 * progressRatio),
      pigmentationImprovementPct: clamp(rate * 25 * progressRatio)
    };
  };

  return [buildPoint(0), buildPoint(7), buildPoint(15), buildPoint(30)];
}

// ============================================================
// CORE FEATURE 4: PERSONALIZED ROUTINE ENGINE
// ============================================================
export function runRoutineEngine(
  result: SkinAnalysisResult,
  profile: UserProfile
): PersonalizedRoutine {
  const skinType = profile.skinType;
  
  const template = ROUTINE_TEMPLATES[skinType] || ROUTINE_TEMPLATES.normal;

  // Customize based on concerns
  const morning = [...template.morning];
  const night = [...template.night];

  const lifestyle: Array<{ icon: string; title: string; detail: string }> = [];
  if (profile.sleepHours < 7) {
    lifestyle.push({ icon: '😴', title: 'Sleep Optimization', detail: `Increase nightly sleep from ${profile.sleepHours}h to 8h. Epidermal mitosis peaks during sleep.` });
  }
  if (profile.waterIntake < 8) {
    lifestyle.push({ icon: '💧', title: 'Hydration Target', detail: `Drink 8-10 glasses. Currently drinking ${profile.waterIntake} glasses. Hydrated cells divide faster.` });
  }
  if (profile.stressLevel > 5) {
    lifestyle.push({ icon: '🧘', title: 'Stress Reduction', detail: `Implement 10-min breathwork. Stress triggers cortisol, causing breakouts.` });
  }
  if (profile.dietQuality < 6) {
    lifestyle.push({ icon: '🥗', title: 'Antioxidant Intake', detail: 'Consume berries, leafy greens, and nuts. Prevents free radical collagen breakdown.' });
  }
  if (lifestyle.length === 0) {
    lifestyle.push({ icon: '🏃', title: 'Circulatory Exercise', detail: 'Engage in cardio 3x/week. Promotes nutrient blood-flow to skin follicles.' });
  }

  return {
    morning,
    night,
    weekly: template.weekly,
    monthly: template.monthly,
    lifestyle: lifestyle.slice(0, 3)
  };
}

// ============================================================
// CORE FEATURE 7: AI PRODUCT RECOMMENDATIONS
// ============================================================
export const PRODUCT_RECOMMENDATIONS_DATABASE: ProductRecommendation[] = [
  // Cleansers
  {
    category: 'Cleanser',
    name: 'Salicylic Acid Gel Cleanser',
    brand: 'Dermaceutic',
    price: '$28',
    keyIngredients: ['Salicylic Acid 2%', 'Zinc PCA', 'Tea Tree Extract'],
    reason: 'Deeply penetrates hair follicle linings to dissolve oxidized sebum, preventing comedones and pimple flares.',
    matchScore: 96,
    rating: 4.8,
    imagePlaceholderColor: 'bg-teal-900/40'
  },
  {
    category: 'Cleanser',
    name: 'Hydrating Ceramide Cleansing Milk',
    brand: 'Dermatol',
    price: '$26',
    keyIngredients: ['Ceramides NP/AP/EOP', 'Hyaluronic Acid', 'Colloidal Oat'],
    reason: 'Non-foaming emulsion that emulsifies impurities without altering stratum corneum barrier proteins.',
    matchScore: 98,
    rating: 4.9,
    imagePlaceholderColor: 'bg-cyan-900/40'
  },
  {
    category: 'Cleanser',
    name: 'Balancing Amino Acid Foam',
    brand: 'AuraClinique',
    price: '$24',
    keyIngredients: ['Glycine', 'Alanine', 'Green Tea Extract'],
    reason: 'Uses gentle amino-acid surfactants that cleanse the skin while maintaining optimal lipid mantle pH.',
    matchScore: 92,
    rating: 4.6,
    imagePlaceholderColor: 'bg-emerald-900/40'
  },

  // Moisturizers
  {
    category: 'Moisturizer',
    name: 'Oil-Free Hyaluronic Water Cream',
    brand: 'HydroBiotic',
    price: '$42',
    keyIngredients: ['Hyaluronic Acid 1.5%', 'Squalane', 'Centella'],
    reason: 'Ultralight gel-cream providing intense humectant hydration without adding comedogenic lipids.',
    matchScore: 94,
    rating: 4.7,
    imagePlaceholderColor: 'bg-teal-900/40'
  },
  {
    category: 'Moisturizer',
    name: 'Triple Ceramide Barrier Restoration Cream',
    brand: 'Epiderm',
    price: '$48',
    keyIngredients: ['Ceramide 3', 'Cholesterol 1%', 'Fatty Acids 1%'],
    reason: 'Emulates natural 3:1:1 skin lipid ratios to rapidly repair flaking and seal in hydration.',
    matchScore: 97,
    rating: 4.9,
    imagePlaceholderColor: 'bg-cyan-900/40'
  },

  // Sunscreens
  {
    category: 'Sunscreen',
    name: 'Matte Zinc Oxide SPF 50',
    brand: 'UVShield',
    price: '$34',
    keyIngredients: ['Zinc Oxide 18%', 'Niacinamide 2%', 'Tocopherol'],
    reason: 'Broad-spectrum mineral filter that absorbs sebum, leaving a matte finish without causing acne breakouts.',
    matchScore: 95,
    rating: 4.8,
    imagePlaceholderColor: 'bg-emerald-900/40'
  },
  {
    category: 'Sunscreen',
    name: 'Soothing Centella Sun Fluid SPF 50',
    brand: 'CicaSafe',
    price: '$32',
    keyIngredients: ['Centella Extract', 'Panthenol', 'Organic Sun Filters'],
    reason: 'Ultra-gentle fluid that protects against UV rays while reducing vasodilation and calming sensitive redness.',
    matchScore: 98,
    rating: 4.9,
    imagePlaceholderColor: 'bg-teal-900/40'
  },

  // Serums
  {
    category: 'Serum',
    name: 'Clinical Niacinamide 10% + Zinc 1%',
    brand: 'Actives Lab',
    price: '$38',
    keyIngredients: ['Niacinamide 10%', 'Zinc PCA 1%', 'Allantoin'],
    reason: 'Regulates hyper-active sebaceous output and fades post-inflammatory erythema spots.',
    matchScore: 96,
    rating: 4.7,
    imagePlaceholderColor: 'bg-cyan-900/40'
  },
  {
    category: 'Serum',
    name: 'Hyaluronic Acid Multi-Weight Infusion',
    brand: 'HydroBiotic',
    price: '$36',
    keyIngredients: ['Sodium Hyaluronate', 'Hydrolyzed HA', 'Pro-Vitamin B5'],
    reason: 'Combines multiple molecular weights to hydrate both the epidermal surface and deep dermal layers.',
    matchScore: 99,
    rating: 4.8,
    imagePlaceholderColor: 'bg-teal-900/40'
  },

  // Treatments
  {
    category: 'Treatment',
    name: 'Salicylic Acid 2% Liquid Exfoliant',
    brand: 'Dermaceutic',
    price: '$32',
    keyIngredients: ['Salicylic Acid 2%', 'Green Tea', 'Glycerin'],
    reason: 'Liquid BHA exfoliant that unclogs pores, clears microcomedones, and refines uneven skin texture.',
    matchScore: 95,
    rating: 4.6,
    imagePlaceholderColor: 'bg-rose-900/40'
  },
  {
    category: 'Treatment',
    name: 'Retinol 0.3% Dermal Renewal Complex',
    brand: 'Actives Lab',
    price: '$45',
    keyIngredients: ['Pure Retinol 0.3%', 'Bakuchiol 0.5%', 'Peptides'],
    reason: 'Upregulates cell mitosis to smooth micro-wrinkles, clear debris, and enhance skin radiance.',
    matchScore: 93,
    rating: 4.7,
    imagePlaceholderColor: 'bg-indigo-900/40'
  },
  {
    category: 'Treatment',
    name: 'Azelaic Acid 10% Vascular Soothing Gel',
    brand: 'CicaSafe',
    price: '$35',
    keyIngredients: ['Azelaic Acid 10%', 'Licorice Root', 'Cica'],
    reason: 'Targets vascular inflammation to reduce redness while fading stubborn pigmentation spots.',
    matchScore: 97,
    rating: 4.8,
    imagePlaceholderColor: 'bg-teal-900/40'
  }
];

export function runProductRecommendations(
  result: SkinAnalysisResult,
  profile: UserProfile
): ProductRecommendation[] {
  const recommendations: ProductRecommendation[] = [];

  // Filter category lists
  const cleansers = PRODUCT_RECOMMENDATIONS_DATABASE.filter(p => p.category === 'Cleanser');
  const moisturizers = PRODUCT_RECOMMENDATIONS_DATABASE.filter(p => p.category === 'Moisturizer');
  const sunscreens = PRODUCT_RECOMMENDATIONS_DATABASE.filter(p => p.category === 'Sunscreen');
  const serums = PRODUCT_RECOMMENDATIONS_DATABASE.filter(p => p.category === 'Serum');
  const treatments = PRODUCT_RECOMMENDATIONS_DATABASE.filter(p => p.category === 'Treatment');

  // Helper to select best match
  const selectProduct = (list: ProductRecommendation[], isOily: boolean, isDry: boolean, isSensitive: boolean) => {
    let best = list[0];
    let maxVal = -1;
    for (const prod of list) {
      let score = prod.matchScore;
      if (isOily && (prod.name.includes('Oil-Free') || prod.name.includes('Salicylic') || prod.name.includes('Matte'))) score += 5;
      if (isDry && (prod.name.includes('Cream') || prod.name.includes('Milk') || prod.name.includes('Rich') || prod.name.includes('Hyaluronic'))) score += 5;
      if (isSensitive && (prod.name.includes('Soothing') || prod.name.includes('Centella') || prod.name.includes('Ceramide') || prod.name.includes('Mineral'))) score += 5;
      if (score > maxVal) {
        maxVal = score;
        best = prod;
      }
    }
    return best;
  };

  const isOily = profile.skinType === 'oily' || profile.skinType === 'combination';
  const isDry = profile.skinType === 'dry';
  const isSensitive = profile.skinType === 'sensitive';

  recommendations.push(selectProduct(cleansers, isOily, isDry, isSensitive));
  recommendations.push(selectProduct(moisturizers, isOily, isDry, isSensitive));
  recommendations.push(selectProduct(sunscreens, isOily, isDry, isSensitive));
  recommendations.push(selectProduct(serums, isOily, isDry, isSensitive));
  recommendations.push(selectProduct(treatments, isOily, isDry, isSensitive));

  return recommendations;
}

// ============================================================
// HACKATHON BONUS FEATURE 3: FACE COMPARISON REPORT
// ============================================================
export function generateComparisonReport(
  prevRecord: PassportRecord,
  currentResult: SkinAnalysisResult
): ComparisonReport {
  const currentScore = currentResult.overallScore;
  const scoreChange = currentScore - prevRecord.skinScore;
  const hydrationChange = currentResult.hydrationScore - prevRecord.hydrationScore;
  const acneRiskChange = prevRecord.acneRiskScore - currentResult.acneRiskScore; // Positive means reduction
  const uvDamageChange = prevRecord.uvDamageScore - currentResult.uvDamageScore;
  const agingRiskChange = prevRecord.agingRiskScore - currentResult.agingRiskScore;

  const improvements: string[] = [];
  const newConcerns: string[] = [];

  if (scoreChange > 0) improvements.push(`Overall skin barrier health improved by ${Math.abs(scoreChange)} points.`);
  if (hydrationChange > 5) improvements.push(`Epidermal hydration increased by ${hydrationChange}%, restoring cellular volume.`);
  if (acneRiskChange > 5) improvements.push(`Follicular blemish risk decreased by ${acneRiskChange}%, signaling reduced sebum clogging.`);
  if (uvDamageChange > 5) improvements.push(`UV pigmentation damage risk reduced by ${uvDamageChange}%, showing fading dark spots.`);

  if (scoreChange < -2) newConcerns.push('Slight overall barrier defense degradation detected.');
  if (hydrationChange < -5) newConcerns.push('Epidermal dryness markers have spiked, indicate rising water loss.');
  if (acneRiskChange < -5) newConcerns.push('Acne risk markers have increased due to oil congestion.');

  let overallSummary = '';
  if (scoreChange >= 5) {
    overallSummary = `Excellent progress. Clinical comparisons show notable skin barrier recovery since ${prevRecord.date}. Cellular structures show high adherence to active ingredient routines.`;
  } else if (scoreChange > 0) {
    overallSummary = `Minor positive improvements detected. Continue following the prescribed morning and evening treatments to cement barrier stability.`;
  } else {
    overallSummary = `Skin indices are stable but show early hydration depletion. We advise prioritizing ceramide-rich barrier creams and increasing water intake.`;
  }

  return {
    previousScanDate: prevRecord.date,
    currentScanDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    scoreChange,
    hydrationChange,
    acneRiskChange,
    uvDamageChange,
    agingRiskChange,
    improvements: improvements.length > 0 ? improvements : ['Skin parameters are stable with no major changes.'],
    newConcerns: newConcerns.length > 0 ? newConcerns : ['No new clinical skin concerns detected.'],
    overallSummary
  };
}

// ============================================================
// MASTER PIPELINE RUNNER
// ============================================================
export async function runFullAnalysis(
  profile: UserProfile,
  dispatch: React.Dispatch<any>
): Promise<AnalysisResultPayload> {
  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  dispatch({ type: 'SET_ANALYSIS_STATUS', payload: 'running' });

  // Checkpoint 1: Run Dermatologist Agent
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'dermatologist', status: 'running' });
  await delay(1200);
  const skinHealth = runSkinAnalysis(profile);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'dermatologist', status: 'complete' });

  // Checkpoint 2: Run Skin Twin Agent
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'skinTwinAgent', status: 'running' });
  await delay(1000);
  const skinTwin = runSkinTwinAnalysis(skinHealth, profile);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'skinTwinAgent', status: 'complete' });

  // Checkpoint 3: Run Routine Agent
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'routineAgent', status: 'running' });
  await delay(900);
  const routine = runRoutineEngine(skinHealth, profile);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'routineAgent', status: 'complete' });

  // Checkpoint 4: Run Skincare Coach Agent
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'coachAgent', status: 'running' });
  await delay(800);
  const products = runProductRecommendations(skinHealth, profile);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'coachAgent', status: 'complete' });

  // Checkpoint 5: Run Predictor Agent
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'predictorAgent', status: 'running' });
  await delay(1000);
  const forecast = runTransformationEngine(skinHealth, profile);
  dispatch({ type: 'SET_AGENT_STATUS', agent: 'predictorAgent', status: 'complete' });

  const passportId = `PASS-ARK-${profile.age}${profile.skinType.toUpperCase().substring(0, 2)}-${Math.floor(Math.random() * 90000) + 10000}`;

  const payload: AnalysisResultPayload = {
    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    profile,
    skinHealth,
    skinTwin,
    forecast,
    routine,
    products,
    beautyScore: skinHealth.overallScore,
    lifestyleScore: clamp(
      (profile.sleepHours / 8) * 25 +
      (profile.waterIntake / 8) * 25 +
      ((10 - profile.stressLevel) / 10) * 25 +
      (profile.dietQuality / 10) * 25
    ),
    skinPassportId: passportId
  };

  dispatch({ type: 'SET_ANALYSIS_RESULT', payload });
  dispatch({ type: 'SET_ANALYSIS_STATUS', payload: 'complete' });

  // Check for badge unlocks
  if (payload.skinHealth.hydrationScore >= 80) {
    dispatch({ type: 'UNLOCK_BADGE', payload: 'hydration_hero' });
  }
  if (payload.skinHealth.acneRiskScore <= 25) {
    dispatch({ type: 'UNLOCK_BADGE', payload: 'acne_fighter' });
  }
  if (payload.skinHealth.overallScore >= 85) {
    dispatch({ type: 'UNLOCK_BADGE', payload: 'glow_master' });
  }
  dispatch({ type: 'UNLOCK_BADGE', payload: 'skin_explorer' });

  // Automatically create a passport entry
  const passportEntry: PassportRecord = {
    id: passportId,
    date: payload.timestamp,
    skinScore: payload.skinHealth.overallScore,
    hydrationScore: payload.skinHealth.hydrationScore,
    acneRiskScore: payload.skinHealth.acneRiskScore,
    uvDamageScore: payload.skinHealth.uvDamageScore,
    agingRiskScore: payload.skinHealth.agingRiskScore,
    photoUrl: null,
    twinSummary: payload.skinTwin.currentSummary,
    badgesUnlocked: ['skin_explorer']
  };
  dispatch({ type: 'ADD_PROGRESS', payload: passportEntry });

  return payload;
}

// ============================================================
// LIFESTYLE & COMPLIANCE OUTCOME PREDICTOR (90-DAY FORECAST)
// ============================================================
export function runOutcomePredictor(
  skin: any,
  hair: any,
  profile: UserProfile,
  params: any
) {
  const currentOverall = skin?.overallScore || 70;
  const currentSkin = skin?.overallScore || 70;
  const currentHair = hair?.overallScore || 75;

  const sleepFactor = (params.sleepHours - 6) * 1.5;
  const waterFactor = (params.waterIntake - 6) * 1.2;
  const stressFactor = (5 - params.stressLevel) * 1.5;
  const adherenceFactor = (params.routineAdherence - 50) * 0.15;

  const totalGrowth = sleepFactor + waterFactor + stressFactor + adherenceFactor;

  const chartData = [];
  for (let i = 0; i < 13; i++) {
    const day = i * 7;
    const progress = i / 12; // 0 to 1
    const overallScore = clamp(currentOverall + totalGrowth * progress);
    const skinScore = clamp(currentSkin + totalGrowth * 1.1 * progress);
    const hairScore = clamp(currentHair + totalGrowth * 0.9 * progress);

    chartData.push({
      day: `Day ${day}`,
      skin: skinScore,
      hair: hairScore,
      overall: overallScore
    });
  }

  return {
    current: { overallScore: currentOverall },
    day90: { overallScore: chartData[12].overall },
    chartData
  };
}

// Wrapper helper to generate ingredient warnings/details
function getIngredientIntelligence(profile: UserProfile, skinHealth: SkinAnalysisResult) {
  let formulaName = `AURA-SERUM-${profile.age}${profile.skinType.toUpperCase().substring(0, 2)}`;
  let base = 'Hyaluronic Acid 1.5% Gel Base';
  let compounds: Array<{ name: string; percentage: string }> = [];

  if (profile.skinType === 'oily') {
    compounds = [
      { name: 'Niacinamide', percentage: '5.0%' },
      { name: 'Salicylic Acid', percentage: '1.5%' },
      { name: 'Zinc PCA', percentage: '1.0%' }
    ];
  } else if (profile.skinType === 'dry') {
    compounds = [
      { name: 'Niacinamide', percentage: '4.0%' },
      { name: 'Squalane', percentage: '2.0%' },
      { name: 'Panthenol', percentage: '2.0%' }
    ];
  } else if (profile.skinType === 'sensitive') {
    compounds = [
      { name: 'Centella Extract', percentage: '3.0%' },
      { name: 'Panthenol', percentage: '2.5%' },
      { name: 'Allantoin', percentage: '0.5%' }
    ];
  } else {
    compounds = [
      { name: 'Vitamin C', percentage: '10.0%' },
      { name: 'Niacinamide', percentage: '3.0%' },
      { name: 'Hyaluronic Acid', percentage: '1.5%' }
    ];
  }

  return {
    customFormula: {
      name: formulaName,
      base,
      compounds
    },
    interactions: ['Alternate Retinol (PM) and Vitamin C (AM) to prevent conflict.'],
    risks: profile.skinType === 'sensitive' ? ['Retinol may cause initial sensitivity.'] : []
  };
}

// Legacy/test wrapper definitions
export function runDermatologist(profile: UserProfile) {
  const res = runSkinAnalysis(profile);
  return {
    ...res,
    acneScore: res.measurements.acne,
    oilinessScore: res.measurements.oiliness,
    rednessScore: res.measurements.redness,
    pigmentationScore: res.measurements.pigmentation
  };
}

export function runTrichologist(profile: UserProfile) {
  return {
    overallScore: 78,
    hairFallScore: 82,
    scalpHealthScore: 76,
    concerns: [],
    rootCauses: ['Scalp barrier parameters are balanced.']
  };
}

export function runIngredientScientist(skin: any, hair: any, profile: UserProfile) {
  const mockSkinHealth: SkinAnalysisResult = {
    overallScore: skin.overallScore || 70,
    skinHealthScore: skin.overallScore || 70,
    hydrationScore: 70,
    acneRiskScore: 30,
    uvDamageScore: 30,
    agingRiskScore: 30,
    confidence: { acne: 95, pigmentation: 95, wrinkles: 95, hydration: 95, sensitivity: 95 },
    concerns: [],
    rootCauses: [],
    measurements: {
      acne: skin.acneScore || 70,
      pimples: 70,
      darkSpots: 70,
      pigmentation: skin.pigmentationScore || 70,
      oiliness: skin.oilinessScore || 70,
      dryness: 70,
      poreVisibility: 70,
      fineLines: 70,
      wrinkles: 70,
      eyeBags: 70,
      redness: skin.rednessScore || 70,
      unevenness: 70
    }
  };
  const products = runProductRecommendations(mockSkinHealth, profile);
  const intel = getIngredientIntelligence(profile, mockSkinHealth);
  return {
    recommendations: products.map((p, idx) => ({
      id: p.category.toLowerCase() + idx,
      name: p.name,
      icon: '🧪',
      concentration: 'Clinical strength',
      mechanism: p.reason,
      benefits: p.keyIngredients
    })),
    customFormula: intel.customFormula,
    interactions: intel.interactions,
    risks: intel.risks
  };
}

export function runBeautyCoach(skin: any, hair: any, ingredients: any, profile: UserProfile) {
  const mockSkinHealth: SkinAnalysisResult = {
    overallScore: skin.overallScore || 70,
    skinHealthScore: skin.overallScore || 70,
    hydrationScore: 70,
    acneRiskScore: 30,
    uvDamageScore: 30,
    agingRiskScore: 30,
    confidence: { acne: 95, pigmentation: 95, wrinkles: 95, hydration: 95, sensitivity: 95 },
    concerns: [],
    rootCauses: [],
    measurements: {
      acne: 70, pimples: 70, darkSpots: 70, pigmentation: 70, oiliness: 70, dryness: 70,
      poreVisibility: 70, fineLines: 70, wrinkles: 70, eyeBags: 70, redness: 70, unevenness: 70
    }
  };
  const routine = runRoutineEngine(mockSkinHealth, profile);
  return {
    morningRoutine: routine.morning,
    nightRoutine: routine.night,
    lifestyleImprovements: routine.lifestyle
  };
}

