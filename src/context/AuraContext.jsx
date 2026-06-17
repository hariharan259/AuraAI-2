import { createContext, useContext, useReducer } from 'react'

const AuraContext = createContext(null)

const initialState = {
  profile: null,
  photoUrl: null,
  analysisResult: null,
  analysisStatus: 'idle', // idle | running | complete
  agentStatuses: {
    dermatologist: 'idle',
    trichologist: 'idle',
    ingredientScientist: 'idle',
    beautyCoach: 'idle',
    outcomePredictor: 'idle',
  },
  simulatorParams: {
    sleepHours: 6,
    waterIntake: 6,
    stressLevel: 7,
    routineAdherence: 50,
    dietQuality: 5,
    exerciseFreq: 2,
  },
  progressHistory: [],
}

function reducer(state, action) {
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
        agentStatuses: { ...state.agentStatuses, [action.agent]: action.status },
      }
    case 'SET_ANALYSIS_RESULT':
      return { ...state, analysisResult: action.payload }
    case 'SET_SIMULATOR_PARAMS':
      return { ...state, simulatorParams: { ...state.simulatorParams, ...action.payload } }
    case 'ADD_PROGRESS':
      return { ...state, progressHistory: [...state.progressHistory, action.payload] }
    case 'RESET_SCAN':
      return {
        ...state,
        analysisStatus: 'idle',
        agentStatuses: {
          dermatologist: 'idle',
          trichologist: 'idle',
          ingredientScientist: 'idle',
          beautyCoach: 'idle',
          outcomePredictor: 'idle',
        },
        analysisResult: null,
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function AuraProvider({ children }) {
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
