export interface UserProfile {
  name: string;
  age: number;
  gender?: string;
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  hairType: 'straight' | 'wavy' | 'curly' | 'coily';
  sleepHours: number;
  waterIntake: number;
  stressLevel: number;
  dietQuality: number;
  exerciseFreq: number;
  goals: string[];
}

export interface SkinConditionMeasurement {
  acne: number;         // 0-100 (higher is better/clearer)
  pimples: number;      // count or 0-100
  darkSpots: number;    // 0-100
  pigmentation: number; // 0-100
  oiliness: number;     // 0-100
  dryness: number;      // 0-100
  poreVisibility: number; // 0-100
  fineLines: number;    // 0-100
  wrinkles: number;     // 0-100
  eyeBags: number;      // 0-100
  redness: number;      // 0-100
  unevenness: number;   // 0-100
}

export interface SkinAnalysisResult {
  overallScore: number;
  skinHealthScore: number;
  hydrationScore: number;
  acneRiskScore: number;
  uvDamageScore: number;
  agingRiskScore: number;
  confidence: {
    acne: number;
    pigmentation: number;
    wrinkles: number;
    hydration: number;
    sensitivity: number;
  };
  concerns: Array<{ id: string; label: string; severity: 'Mild' | 'Moderate' | 'Severe' }>;
  rootCauses: string[];
  measurements: SkinConditionMeasurement;
}

export interface SkinTwin {
  currentSummary: string;
  strengthAreas: Array<{ title: string; description: string; score: number }>;
  problemAreas: Array<{ title: string; description: string; score: number }>;
  riskAreas: Array<{ title: string; description: string; score: number }>;
  improvementOpportunities: string[];
}

export interface TransformationForecast {
  day: number;
  overallScore: number;
  hydrationImprovementPct: number;
  acneReductionPct: number;
  pigmentationImprovementPct: number;
}

export interface SkincareRoutineItem {
  productType: string;
  step: number;
  product: string;
  duration: string;
  why: string;
  tip: string;
}

export interface PersonalizedRoutine {
  morning: SkincareRoutineItem[];
  night: SkincareRoutineItem[];
  weekly: Array<{ day: string; treatment: string; product: string; duration: string; why: string }>;
  monthly: Array<{ cycle: string; treatment: string; product: string; why: string }>;
  lifestyle: Array<{ icon: string; title: string; detail: string }>;
}

export interface ProductRecommendation {
  category: 'Cleanser' | 'Moisturizer' | 'Sunscreen' | 'Serum' | 'Treatment';
  name: string;
  brand: string;
  price: string;
  keyIngredients: string[];
  reason: string;
  matchScore: number;
  rating: number;
  imagePlaceholderColor: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  metricType?: 'hydration' | 'acne' | 'glow' | 'consistency' | 'scans' | 'improvement';
}

export interface PassportRecord {
  id: string;
  date: string;
  skinScore: number;
  hydrationScore: number;
  acneRiskScore: number;
  uvDamageScore: number;
  agingRiskScore: number;
  photoUrl: string | null;
  twinSummary: string;
  badgesUnlocked: string[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  skinScore: number;
  improvementScore: number;
  avatarColor: string;
  isCurrentUser?: boolean;
}

export interface ComparisonReport {
  previousScanDate: string;
  currentScanDate: string;
  scoreChange: number;
  hydrationChange: number;
  acneRiskChange: number;
  uvDamageChange: number;
  agingRiskChange: number;
  improvements: string[];
  newConcerns: string[];
  overallSummary: string;
}

export interface SimulatorParams {
  sleepHours: number;
  waterIntake: number;
  stressLevel: number;
  routineAdherence: number;
  dietQuality: number;
  exerciseFreq: number;
}

export interface DailyProgressLog {
  day: number;
  timestamp: string;
  // Skin Metrics
  acneLevel: number;
  darkSpotProgress: number;
  skinHydration: number;
  skinBrightness: number;
  oilControl: number;
  poreVisibility: number;
  skinAgeEstimate: number;
  // Hair Metrics
  hairDensity: number;
  hairFallLevel: number;
  hairGrowthProgress: number;
  scalpHealth: number;
  hairThickness: number;
  dandruffCondition: number;
  // Wellness Metrics
  sleepDuration: number;
  waterIntake: number;
  stressLevel: number;
  physicalActivity: number;
  nutritionScore: number;
  screenTime: number;
  // Metadata
  complianceScore: number;
  recommendations: string[];
}

export interface TransformationJourneyState {
  currentDay: number;
  streakCount: number;
  totalPoints: number;
  dailyLogs: DailyProgressLog[];
}
