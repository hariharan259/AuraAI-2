import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { Trophy, Award, Star, Activity, Sparkles, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';

export default function BeautyChallenges() {
  const navigate = useNavigate();
  const { state, dispatch } = useAura();
  const achievements = state.achievements;
  const leaderboard = state.leaderboard;

  const [joinedChallenges, setJoinedChallenges] = useState<Record<string, boolean>>({
    glow_7day: true
  });
  const [userXP, setUserXP] = useState(380);

  const toggleChallenge = (id: string) => {
    const isJoined = joinedChallenges[id];
    setJoinedChallenges(prev => ({ ...prev, [id]: !prev[id] }));
    if (!isJoined) {
      setUserXP(prev => prev + 50);
      alert("Successfully joined challenge! +50 XP awarded.");
    }
  };

  const challenges = [
    {
      id: 'glow_7day',
      title: '7 Day Glow Challenge',
      desc: 'Follow the prescribed morning and evening serums for 7 consecutive days to boot hydration indices.',
      xp: 150,
      days: 7,
      progress: 4,
      icon: '✨'
    },
    {
      id: 'skin_reset',
      title: '30 Day Skin Reset',
      desc: 'Complete nightly retinoid applications and water hydration check-ins to speed up cellular mitosis.',
      xp: 500,
      days: 30,
      progress: 12,
      icon: '🛡️'
    },
    {
      id: 'hair_growth',
      title: '30 Day Hair Growth',
      desc: 'Massage scalp daily and apply prescribed copper-peptide hair growth serums consistently.',
      xp: 450,
      days: 30,
      progress: 0,
      icon: '🌿'
    },
    {
      id: 'hydration_ch',
      title: 'Hydration Challenge',
      desc: 'Drink 9 glasses of water daily to maintain epidermal cell turgor and flush metabolic toxins.',
      xp: 200,
      days: 10,
      progress: 8,
      icon: '💧'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 mb-3">
            <Trophy size={12} /> Gamified Wellness Platform
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display">Beauty Challenges</h1>
          <p className="text-sm text-aura-muted mt-1">Participate in community skin resets, unlock rare achievement badges, and climb the leaderboard arena.</p>
        </div>

        {/* User Level Info Card */}
        <div className="p-4 rounded-xl border border-aura-border bg-aura-panel glass-gradient w-full md:w-60">
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="text-aura-muted">Aura Level 4</span>
            <span className="text-yellow-400">{userXP} XP</span>
          </div>
          <div className="h-2 bg-black/45 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-400" style={{ width: `${(userXP % 100)}%` }} />
          </div>
          <span className="text-[9px] text-aura-muted">Unlock achievements to advance.</span>
        </div>
      </header>

      {/* Grid: Challenges (8 Cols) & Leaderboard (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Challenges List (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-white mb-2">Active Challenges</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map(ch => {
              const isJoined = !!joinedChallenges[ch.id];
              const progressPct = Math.round((ch.progress / ch.days) * 100);
              return (
                <div key={ch.id} className="p-5 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-2xl">{ch.icon}</span>
                      <span className="text-[10px] font-bold text-yellow-400 font-mono">+{ch.xp} XP</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{ch.title}</h4>
                    <p className="text-[10px] text-aura-muted leading-relaxed mb-4">{ch.desc}</p>
                  </div>

                  <div>
                    {isJoined ? (
                      <div className="mb-4">
                        <div className="flex justify-between text-[9px] font-mono mb-1">
                          <span className="text-aura-muted">Progress: {ch.progress}/{ch.days} Days</span>
                          <span className="text-white">{progressPct}%</span>
                        </div>
                        <ProgressBar progress={progressPct} colorClass="bg-yellow-500" />
                      </div>
                    ) : null}

                    <button 
                      onClick={() => toggleChallenge(ch.id)}
                      className={`w-full py-2 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-100 ${
                        isJoined 
                          ? 'border border-white/10 text-aura-muted hover:text-white bg-black/20 hover:bg-black/40 hover:border-white/20' 
                          : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-glow-secondary'
                      }`}
                    >
                      {isJoined ? 'Leave Challenge' : 'Join Challenge'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Badges Cabinet */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient mt-4">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Award size={18} className="text-yellow-400" /> Unlocked Badges Cabinet
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {achievements.map(ach => (
                <div 
                  key={ach.id} 
                  className={`p-3 rounded-xl border flex gap-3 items-center ${
                    ach.unlocked ? 'bg-yellow-950/5 border-yellow-500/20' : 'bg-black/20 border-aura-border opacity-55'
                  }`}
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <h5 className="text-[10px] font-bold text-white leading-none mb-1">{ach.title}</h5>
                    <span className="text-[8px] text-aura-muted block leading-tight">{ach.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Leaderboard Arena (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" /> Leaderboard Arena
            </h3>

            <div className="flex flex-col gap-3">
              {leaderboard.map(user => (
                <div key={user.rank} className="flex items-center gap-3 p-3 rounded-xl bg-black/25 border border-white/5">
                  <span className="text-xs font-bold text-yellow-400 font-mono w-4">#{user.rank}</span>
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-r ${user.avatarColor} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{user.name}</div>
                    <span className="text-[9px] text-aura-muted">Glow: {user.skinScore}</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400">+{user.improvementScore} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
