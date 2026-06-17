// ============================================================
// AuraAI — Mock Progress History Data
// ============================================================

export function generateMockProgress(analysisResult) {
  if (!analysisResult) return []

  const base = {
    skin: analysisResult.skin.overallScore,
    hair: analysisResult.hair.overallScore,
    beauty: analysisResult.beautyScore,
  }

  // Generate 8 weeks of historical data going backwards
  const history = []
  for (let i = 8; i >= 0; i--) {
    const weekOffset = i
    const date = new Date()
    date.setDate(date.getDate() - weekOffset * 7)
    const noise = (Math.random() - 0.5) * 4
    history.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      skin: Math.max(30, Math.round(base.skin - weekOffset * 1.5 + noise)),
      hair: Math.max(30, Math.round(base.hair - weekOffset * 1.2 + noise)),
      beauty: Math.max(30, Math.round(base.beauty - weekOffset * 1.35 + noise)),
      routineAdherence: Math.max(20, Math.round(75 - weekOffset * 3 + (Math.random() - 0.5) * 10)),
    })
  }
  return history
}

export function generateHeatmapData() {
  const data = []
  for (let i = 0; i < 28; i++) {
    data.push(Math.floor(Math.random() * 5)) // 0-4 intensity
  }
  return data
}

export const ACHIEVEMENTS = [
  { id: 'first_analysis', icon: '🔬', title: 'First Scan', desc: 'Completed your first AI beauty analysis', unlocked: true },
  { id: 'streak_7', icon: '🔥', title: '7-Day Streak', desc: 'Followed your routine for 7 consecutive days', unlocked: true },
  { id: 'score_80', icon: '⭐', title: 'Beauty Star', desc: 'Achieved a Beauty Score of 80+', unlocked: false },
  { id: 'simulator', icon: '🎯', title: 'Scenario Planner', desc: 'Ran 5 outcome simulations', unlocked: true },
  { id: 'streak_30', icon: '💎', title: 'Diamond Routine', desc: 'Maintained routine for 30 days', unlocked: false },
  { id: 'score_90', icon: '👑', title: 'Glow Royalty', desc: 'Achieved a Beauty Score of 90+', unlocked: false },
]
