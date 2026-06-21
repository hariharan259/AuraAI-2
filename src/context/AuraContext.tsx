import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import {
  UserProfile,
  SkinAnalysisResult,
  SkinTwin,
  PersonalizedRoutine,
  ProductRecommendation,
  Achievement,
  PassportRecord,
  ComparisonReport,
  SimulatorParams,
  LeaderboardEntry,
  DailyProgressLog,
  TransformationJourneyState
} from '../types'

export interface AnalysisResultPayload {
  timestamp: string;
  profile: UserProfile;
  skinHealth: SkinAnalysisResult;
  skinTwin: SkinTwin;
  forecast: any; // Forecast data points
  routine: PersonalizedRoutine;
  products: ProductRecommendation[];
  beautyScore: number;
  lifestyleScore: number;
  skinPassportId: string;
}

export interface AuraState {
  profile: UserProfile | null;
  photoUrl: string | null;
  analysisResult: AnalysisResultPayload | null;
  analysisStatus: 'idle' | 'running' | 'complete';
  agentStatuses: {
    dermatologist: 'idle' | 'running' | 'complete';
    skinTwinAgent: 'idle' | 'running' | 'complete';
    routineAgent: 'idle' | 'running' | 'complete';
    coachAgent: 'idle' | 'running' | 'complete';
    predictorAgent: 'idle' | 'running' | 'complete';
  };
  simulatorParams: SimulatorParams;
  progressHistory: PassportRecord[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  comparisonReport: ComparisonReport | null;
  activeTab: string; // Dashboard sub-tab tracking
  journeyState: TransformationJourneyState;
}

const initialAchievements: Achievement[] = [
  { id: 'hydration_hero', title: 'Hydration Hero', description: 'Reach a hydration level of 80% or higher.', icon: '💧', unlocked: false, metricType: 'hydration' },
  { id: 'acne_fighter', title: 'Acne Fighter', description: 'Bring your acne risk score down to 25% or lower.', icon: '🛡️', unlocked: false, metricType: 'acne' },
  { id: 'glow_master', title: 'Glow Master', description: 'Achieve an overall skin health score of 85+.', icon: '✨', unlocked: false, metricType: 'glow' },
  { id: 'consistency_champion', title: 'Consistency Champion', description: 'Maintain routine adherence of 85% or higher.', icon: '📅', unlocked: false, metricType: 'consistency' },
  { id: 'skin_explorer', title: 'Healthy Skin Explorer', description: 'Perform your first complete dermatological skin scan.', icon: '🔍', unlocked: false, metricType: 'scans' },
  { id: 'improvement_pro', title: 'Skin Improvement Pro', description: 'Improve your overall skin score by 5 points or more between scans.', icon: '📈', unlocked: false, metricType: 'improvement' }
]

const initialLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Elena Rostova', skinScore: 94, improvementScore: 12, avatarColor: 'from-pink-500 to-rose-500' },
  { rank: 2, name: 'Dr. Marcus Vance', skinScore: 91, improvementScore: 6, avatarColor: 'from-blue-500 to-indigo-500' },
  { rank: 3, name: 'Sophia Chen', skinScore: 89, improvementScore: 15, avatarColor: 'from-purple-500 to-violet-500' },
  { rank: 4, name: 'David Miller', skinScore: 86, improvementScore: 8, avatarColor: 'from-green-500 to-teal-500' },
  { rank: 5, name: 'Priya Patel', skinScore: 83, improvementScore: 19, avatarColor: 'from-amber-500 to-orange-500' }
]

// Generate 30 days of transformation history for demo and presentation purposes
export function generateSeededJourney(): TransformationJourneyState {
  const dailyLogs: DailyProgressLog[] = [];
  const baseDate = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const progress = i / 30;
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (30 - i));
    
    // Skin metrics progress (higher is better/clearer)
    const acneLevel = Math.round(55 + progress * 20 + Math.sin(i) * 3);
    const darkSpotProgress = Math.round(60 + progress * 15 + Math.cos(i) * 2);
    const skinHydration = Math.round(58 + progress * 24 + Math.sin(i * 1.5) * 4);
    const skinBrightness = Math.round(62 + progress * 18 + Math.cos(i * 1.2) * 3);
    const oilControl = Math.round(50 + progress * 22 + Math.sin(i * 0.8) * 3);
    const poreVisibility = Math.round(55 + progress * 20 + Math.cos(i * 1.5) * 2);
    const skinAgeEstimate = Math.round(32 - progress * 3);
    
    // Hair metrics
    const hairDensity = Math.round(72 + progress * 6 + Math.sin(i) * 1);
    const hairFallLevel = Math.round(45 - progress * 20 + Math.cos(i) * 3);
    const hairGrowthProgress = Math.round(40 + progress * 35 + Math.sin(i) * 2);
    const scalpHealth = Math.round(64 + progress * 18 + Math.cos(i) * 2);
    const hairThickness = Math.round(68 + progress * 8 + Math.sin(i * 1.1) * 1);
    const dandruffCondition = Math.round(40 - progress * 25 + Math.sin(i) * 2);
    
    // Wellness
    const sleepDuration = parseFloat((6.0 + progress * 1.8 + Math.sin(i) * 0.4).toFixed(1));
    const waterIntake = Math.round(5 + progress * 4 + (i % 3 === 0 ? 1 : 0));
    const stressLevel = Math.round(7 - progress * 4 + Math.sin(i * 0.7) * 1);
    const physicalActivity = Math.round(30 + progress * 30 + (i % 2 === 0 ? 15 : 0));
    const nutritionScore = Math.round(60 + progress * 25 + Math.sin(i) * 4);
    const screenTime = parseFloat((7.5 - progress * 3.0 + Math.cos(i) * 0.5).toFixed(1));
    
    const complianceScore = Math.round(70 + progress * 20 + (i % 5 === 0 ? -8 : 2));
    
    dailyLogs.push({
      day: i,
      timestamp: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      acneLevel,
      darkSpotProgress,
      skinHydration,
      skinBrightness,
      oilControl,
      poreVisibility,
      skinAgeEstimate,
      hairDensity,
      hairFallLevel,
      hairGrowthProgress,
      scalpHealth,
      hairThickness,
      dandruffCondition,
      sleepDuration,
      waterIntake,
      stressLevel,
      physicalActivity,
      nutritionScore,
      screenTime,
      complianceScore,
      recommendations: [
        'Apply niacinamide serum AM/PM.',
        'Ensure daily sunscreen application.',
        'Drink at least 8 glasses of water.',
        'Maintain 7.5+ hours of deep sleep.'
      ]
    });
  }
  
  return {
    currentDay: 31,
    streakCount: 14,
    totalPoints: 2450,
    dailyLogs
  };
}

const getInitialJourneyState = (): TransformationJourneyState => {
  const saved = localStorage.getItem('aura_journey_state');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return generateSeededJourney();
};

const initialState: AuraState = {
  profile: null,
  photoUrl: null,
  analysisResult: null,
  analysisStatus: 'idle',
  agentStatuses: {
    dermatologist: 'idle',
    skinTwinAgent: 'idle',
    routineAgent: 'idle',
    coachAgent: 'idle',
    predictorAgent: 'idle'
  },
  simulatorParams: {
    sleepHours: 6,
    waterIntake: 6,
    stressLevel: 7,
    routineAdherence: 50,
    dietQuality: 5,
    exerciseFreq: 2
  },
  progressHistory: [],
  achievements: initialAchievements,
  leaderboard: initialLeaderboard,
  comparisonReport: null,
  activeTab: 'summary',
  journeyState: getInitialJourneyState()
}

type AuraAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_PHOTO'; payload: string | null }
  | { type: 'SET_ANALYSIS_STATUS'; payload: 'idle' | 'running' | 'complete' }
  | { type: 'SET_AGENT_STATUS'; agent: keyof AuraState['agentStatuses']; status: 'idle' | 'running' | 'complete' }
  | { type: 'SET_ANALYSIS_RESULT'; payload: AnalysisResultPayload }
  | { type: 'SET_SIMULATOR_PARAMS'; payload: Partial<SimulatorParams> }
  | { type: 'ADD_PROGRESS'; payload: PassportRecord }
  | { type: 'UNLOCK_BADGE'; payload: string }
  | { type: 'SET_COMPARISON_REPORT'; payload: ComparisonReport | null }
  | { type: 'SET_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'RESET_SCAN' }
  | { type: 'RESET' }
  | { type: 'ADD_DAILY_LOG'; payload: Omit<DailyProgressLog, 'day' | 'timestamp' | 'complianceScore' | 'recommendations'> }
  | { type: 'SIMULATE_JOURNEY' }
  | { type: 'RESET_JOURNEY' }

function reducer(state: AuraState, action: AuraAction): AuraState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload }
    case 'SET_PHOTO':
      return { ...state, photoUrl: action.payload }
    case 'SET_ANALYSIS_STATUS':
      return { ...state, analysisStatus: action.payload }
    case 'SET_AGENT_STATUS':
      return {
        ...state,
        agentStatuses: { ...state.agentStatuses, [action.agent]: action.status }
      }
    case 'SET_ANALYSIS_RESULT':
      return { ...state, analysisResult: action.payload }
    case 'SET_SIMULATOR_PARAMS':
      return { ...state, simulatorParams: { ...state.simulatorParams, ...action.payload } }
    case 'ADD_PROGRESS':
      // Avoid duplicate passport records by checking ID
      const exists = state.progressHistory.some(r => r.id === action.payload.id);
      return {
        ...state,
        progressHistory: exists ? state.progressHistory : [action.payload, ...state.progressHistory]
      }
    case 'UNLOCK_BADGE':
      return {
        ...state,
        achievements: state.achievements.map(ach =>
          ach.id === action.payload ? { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() } : ach
        )
      }
    case 'SET_COMPARISON_REPORT':
      return { ...state, comparisonReport: action.payload }
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'RESET_SCAN':
      return {
        ...state,
        analysisStatus: 'idle',
        agentStatuses: {
          dermatologist: 'idle',
          skinTwinAgent: 'idle',
          routineAgent: 'idle',
          coachAgent: 'idle',
          predictorAgent: 'idle'
        },
        analysisResult: null,
        comparisonReport: null
      }
    case 'ADD_DAILY_LOG': {
      const dailyLog = action.payload;
      const currentDay = state.journeyState.currentDay;
      const day = currentDay;
      const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      // Calculate compliance score
      let complianceScore = 0;
      if (dailyLog.sleepDuration >= 7.5) complianceScore += 30;
      else if (dailyLog.sleepDuration >= 6.0) complianceScore += 15;
      
      if (dailyLog.waterIntake >= 8) complianceScore += 30;
      else if (dailyLog.waterIntake >= 6) complianceScore += 15;
      
      if (dailyLog.stressLevel <= 4) complianceScore += 20;
      else if (dailyLog.stressLevel <= 7) complianceScore += 10;
      
      if (dailyLog.physicalActivity >= 30) complianceScore += 20;
      else if (dailyLog.physicalActivity >= 15) complianceScore += 10;
      
      // Calculate points
      const pointsEarned = 100 + (complianceScore >= 80 ? 50 : 0);
      const totalPoints = state.journeyState.totalPoints + pointsEarned;
      
      // Streak count
      const newStreak = state.journeyState.streakCount + 1;
      
      const newLog: DailyProgressLog = {
        ...dailyLog,
        day,
        timestamp,
        complianceScore,
        recommendations: [
          dailyLog.skinHydration < 70 ? 'Boost hydration with ceramide creams and multi-HA serums.' : 'Epidermal hydration optimal.',
          dailyLog.acneLevel < 70 ? 'Incorporate 2% Salicylic Acid to clear follicles.' : 'Acne congestion low.',
          dailyLog.sleepDuration < 7 ? 'Prioritize circadian sleep window.' : 'Excellent sleep duration.',
          dailyLog.waterIntake < 8 ? 'Increase daily water intake to 8+ glasses.' : 'Hydration limits satisfied.'
        ]
      };
      
      const updatedLogs = [...state.journeyState.dailyLogs, newLog];
      const updatedJourneyState: TransformationJourneyState = {
        currentDay: currentDay + 1,
        streakCount: newStreak,
        totalPoints,
        dailyLogs: updatedLogs
      };
      
      localStorage.setItem('aura_journey_state', JSON.stringify(updatedJourneyState));
      
      let achievements = state.achievements;
      if (newStreak >= 7) {
        achievements = achievements.map(ach => 
          ach.id === 'consistency_champion' ? { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() } : ach
        );
      }
      
      return {
        ...state,
        journeyState: updatedJourneyState,
        achievements
      };
    }
    case 'SIMULATE_JOURNEY': {
      const seeded = generateSeededJourney();
      localStorage.setItem('aura_journey_state', JSON.stringify(seeded));
      return {
        ...state,
        journeyState: seeded
      };
    }
    case 'RESET_JOURNEY': {
      const resetState: TransformationJourneyState = {
        currentDay: 1,
        streakCount: 0,
        totalPoints: 0,
        dailyLogs: []
      };
      localStorage.removeItem('aura_journey_state');
      return {
        ...state,
        journeyState: resetState
      };
    }
    case 'RESET':
      return {
        ...initialState,
        progressHistory: [],
        journeyState: {
          currentDay: 1,
          streakCount: 0,
          totalPoints: 0,
          dailyLogs: []
        }
      }
    default:
      return state
  }
}

const AuraContext = createContext<{
  state: AuraState;
  dispatch: React.Dispatch<AuraAction>;
} | null>(null)

export function AuraProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AuraContext.Provider value={{ state, dispatch }}>
      {children}
    </AuraContext.Provider>
  )
}

export function useAura() {
  const ctx = useContext(AuraContext)
  if (!ctx) throw new Error('useAura must be used within AuraProvider')
  return ctx
}
