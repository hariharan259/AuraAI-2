import { describe, it, expect, vi } from 'vitest'
import {
  runDermatologist,
  runTrichologist,
  runIngredientScientist,
  runBeautyCoach,
  runOutcomePredictor,
  runFullAnalysis
} from './aiEngine'

describe('AuraAI Agent Engine Tests', () => {
  const mockProfile = {
    name: 'Jane Doe',
    age: 28,
    skinType: 'oily',
    hairType: 'wavy',
    sleepHours: 6,
    waterIntake: 5,
    stressLevel: 7,
    dietQuality: 5,
    exerciseFreq: 2,
    goals: ['acne reduction', 'hydration']
  }

  describe('Agent 1: Dermatologist', () => {
    it('should calculate valid scores and concerns for oily skin profile', () => {
      const result = runDermatologist(mockProfile)
      expect(result).toHaveProperty('overallScore')
      expect(result.overallScore).toBeGreaterThanOrEqual(0)
      expect(result.overallScore).toBeLessThanOrEqual(100)
      expect(result.acneScore).toBeGreaterThanOrEqual(0)
      expect(result.oilinessScore).toBeGreaterThanOrEqual(0)
      expect(result.concerns.length).toBeGreaterThan(0)
      expect(result.rootCauses.length).toBeGreaterThan(0)
    })

    it('should handle sensitive skin type and adjust scores accordingly', () => {
      const sensitiveProfile = { ...mockProfile, skinType: 'sensitive' }
      const result = runDermatologist(sensitiveProfile)
      expect(result.rednessScore).toBeLessThan(85) // Redness is penalized for sensitive skin
    })
  })

  describe('Agent 2: Trichologist', () => {
    it('should calculate valid hair scores and root causes', () => {
      const result = runTrichologist(mockProfile)
      expect(result).toHaveProperty('overallScore')
      expect(result.hairFallScore).toBeGreaterThanOrEqual(0)
      expect(result.scalpHealthScore).toBeGreaterThanOrEqual(0)
      expect(result.concerns).toBeInstanceOf(Array)
      expect(result.rootCauses.length).toBeGreaterThan(0)
    })
  })

  describe('Agent 3: Ingredient Scientist', () => {
    it('should recommend active ingredients and flag conflicts like Retinol + Vitamin C', () => {
      // Simulate low scores to trigger both retinol (oiliness) and vitamin C (pigmentation)
      const mockSkin = { acneScore: 50, pigmentationScore: 50, rednessScore: 80, oilinessScore: 50, overallScore: 57, concerns: ['acne', 'oiliness', 'pigmentation'] }
      const mockHair = { hairFallScore: 80, densityScore: 80, damageScore: 80, scalpHealthScore: 80, overallScore: 80, concerns: [] }

      const result = runIngredientScientist(mockSkin, mockHair, mockProfile)
      expect(result.recommendations.length).toBeGreaterThan(0)
      
      // Ensure custom formulation details are synthesized
      expect(result).toHaveProperty('customFormula')
      expect(result.customFormula).toHaveProperty('base')
      expect(result.customFormula).toHaveProperty('compounds')
      expect(result.customFormula.compounds.length).toBeLessThanOrEqual(3)

      // Retinol and Vitamin C combination should generate a warning
      const hasRetinol = result.recommendations.some(r => r.benefits.includes('Retinol') || r.benefits.includes('Retinol (Vitamin A)'))
      const hasVitC = result.recommendations.some(r => r.benefits.includes('Vitamin C') || r.benefits.includes('Vitamin C (L-Ascorbic Acid)'))
      if (hasRetinol && hasVitC) {
        expect(result.interactions.some(i => i.includes('Retinol + Vitamin C') || i.includes('Retinol (PM) and Vitamin C (AM)'))).toBe(true)
      }
    })

    it('should flag risks for sensitive skin types', () => {
      const mockSkin = { acneScore: 50, pigmentationScore: 80, rednessScore: 80, oilinessScore: 50, overallScore: 65, concerns: ['acne', 'oiliness'] }
      const mockHair = { hairFallScore: 80, densityScore: 80, damageScore: 80, scalpHealthScore: 80, overallScore: 80, concerns: [] }
      const sensitiveProfile = { ...mockProfile, skinType: 'sensitive' }

      const result = runIngredientScientist(mockSkin, mockHair, sensitiveProfile)
      // Check for sensitive skin risk warning
      expect(result.risks.some(r => r.includes('Retinol may cause initial sensitivity'))).toBe(true)
    })
  })

  describe('Agent 4: Beauty Coach', () => {
    it('should generate morning, evening, weekly routines and lifestyle suggestions', () => {
      const mockSkin = { overallScore: 75 }
      const mockHair = { overallScore: 78 }
      const mockIngredients = { recommendations: [{ name: 'Niacinamide' }, { name: 'Salicylic Acid' }] }

      const result = runBeautyCoach(mockSkin, mockHair, mockIngredients, mockProfile)
      expect(result).toHaveProperty('morningRoutine')
      expect(result).toHaveProperty('nightRoutine')
      expect(result.lifestyleImprovements.length).toBeGreaterThan(0)
      
      // Check that low sleep triggers sleep optimization
      const hasSleepImprovement = result.lifestyleImprovements.some(item => item.title === 'Sleep Optimization')
      expect(hasSleepImprovement).toBe(true)
    })
  })

  describe('Agent 5: Outcome Predictor', () => {
    it('should project a positive trajectory when habits are good', () => {
      const mockSkin = { overallScore: 60, acneScore: 60, pigmentationScore: 60, rednessScore: 60 }
      const mockHair = { overallScore: 65, hairFallScore: 65, densityScore: 65 }
      
      const goodParams = { sleepHours: 8, waterIntake: 9, stressLevel: 3, routineAdherence: 90 }
      const result = runOutcomePredictor(mockSkin, mockHair, mockProfile, goodParams)
      
      expect(result.day90.overallScore).toBeGreaterThan(result.current.overallScore)
      expect(result.chartData.length).toBe(13) // 0 to 90 days step 7 = 13 items
    })
  })

  describe('Master Multi-Agent Router', () => {
    it('should orchestrate all agents in sequence and call dispatch', async () => {
      const dispatch = vi.fn()
      
      const result = await runFullAnalysis(mockProfile, dispatch)
      
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_ANALYSIS_STATUS', payload: 'running' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'dermatologist', status: 'running' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'dermatologist', status: 'complete' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'skinTwinAgent', status: 'running' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'skinTwinAgent', status: 'complete' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'routineAgent', status: 'running' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'routineAgent', status: 'complete' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'coachAgent', status: 'running' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'coachAgent', status: 'complete' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'predictorAgent', status: 'running' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AGENT_STATUS', agent: 'predictorAgent', status: 'complete' })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_ANALYSIS_RESULT', payload: result })
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_ANALYSIS_STATUS', payload: 'complete' })
      
      expect(result).toHaveProperty('beautyScore')
      expect(result).toHaveProperty('lifestyleScore')
      expect(result).toHaveProperty('skinHealth')
      expect(result).toHaveProperty('skinTwin')
      expect(result).toHaveProperty('routine')
      expect(result).toHaveProperty('forecast')
      expect(result).toHaveProperty('products')
    }, 15000)
  })
})
