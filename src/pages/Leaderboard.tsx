import React from 'react';
import { useAura } from '../context/AuraContext';
import { Trophy, ArrowUpRight, Award, Star, TrendingUp } from 'lucide-react';

export default function Leaderboard() {
  const { state } = useAura();
  const { leaderboard, analysisResult } = state;

  // Add current user to leaderboard dynamically if analysis is complete
  let fullLeaderboard = [...leaderboard];
  if (analysisResult) {
    const userScore = analysisResult.beautyScore;
    const userImprovement = state.progressHistory.length > 1 
      ? userScore - state.progressHistory[state.progressHistory.length - 1].skinScore
      : 8; // Default mock improvement

    const exists = fullLeaderboard.some(e => e.isCurrentUser);
    if (!exists) {
      fullLeaderboard.push({
        rank: 0, // Will recalculate
        name: `${analysisResult.profile.name} (You)`,
        skinScore: userScore,
        improvementScore: userImprovement,
        avatarColor: 'from-teal-500 to-cyan-500',
        isCurrentUser: true
      });
    }
  }

  // Sort by score
  const sortedByScore = [...fullLeaderboard]
    .sort((a, b) => b.skinScore - a.skinScore)
    .map((e, idx) => ({ ...e, rank: idx + 1 }));

  // Sort by improvement
  const sortedByImprovement = [...fullLeaderboard]
    .sort((a, b) => b.improvementScore - a.improvementScore)
    .map((e, idx) => ({ ...e, rank: idx + 1 }));

  return (
    <div className="page-content animate-fadeIn p-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
          <Trophy size={12} /> Hackathon Live Arena
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">AuraAI Global Leaderboard</h1>
        <p className="text-sm text-aura-muted">Compare your barrier progress and skin health metrics with community explorers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Glow Leaders */}
        <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" size={18} /> Top Skin Health Index
          </h3>
          <div className="space-y-4">
            {sortedByScore.map((entry, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                  entry.isCurrentUser 
                    ? 'bg-teal-950/20 border-teal-500/35 shadow-glow-primary' 
                    : 'bg-aura-bg/25 border-aura-border hover:border-aura-border/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    entry.rank === 1 ? 'bg-amber-500 text-aura-bg' :
                    entry.rank === 2 ? 'bg-slate-300 text-aura-bg' :
                    entry.rank === 3 ? 'bg-amber-700 text-white' : 'bg-aura-border text-aura-text'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${entry.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-md`} />
                  <div>
                    <span className={`text-sm font-semibold block ${entry.isCurrentUser ? 'text-teal-400' : 'text-white'}`}>
                      {entry.name}
                    </span>
                    <span className="text-[10px] text-aura-muted uppercase tracking-wider font-semibold">Active Member</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white">{entry.skinScore}</span>
                  <span className="text-[9px] text-aura-muted block uppercase font-bold">Skin Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Leaders */}
        <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-teal-400" size={18} /> Highest Improvement Rate
          </h3>
          <div className="space-y-4">
            {sortedByImprovement.map((entry, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                  entry.isCurrentUser 
                    ? 'bg-teal-950/20 border-teal-500/35 shadow-glow-primary' 
                    : 'bg-aura-bg/25 border-aura-border hover:border-aura-border/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    entry.rank === 1 ? 'bg-teal-500 text-white' :
                    entry.rank === 2 ? 'bg-slate-300 text-aura-bg' :
                    entry.rank === 3 ? 'bg-amber-700 text-white' : 'bg-aura-border text-aura-text'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${entry.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-md`} />
                  <div>
                    <span className={`text-sm font-semibold block ${entry.isCurrentUser ? 'text-teal-400' : 'text-white'}`}>
                      {entry.name}
                    </span>
                    <span className="text-[10px] text-aura-muted uppercase tracking-wider font-semibold">Active Member</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400">+{entry.improvementScore}</span>
                  <span className="text-[9px] text-aura-muted block uppercase font-bold">Points Gained</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
