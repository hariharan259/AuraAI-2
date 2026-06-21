import React from 'react';
import { useAura } from '../context/AuraContext';
import { Calendar, User, FileText, CheckCircle2, Award, ArrowUpRight, ShieldAlert, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SkinPassport() {
  const navigate = useNavigate();
  const { state, dispatch } = useAura();
  const { analysisResult, progressHistory, achievements } = state;

  const handleRestoreRecord = (record: any) => {
    // Find matching full analysis record if we have it, or simulate restoration
    if (analysisResult && analysisResult.skinPassportId === record.id) {
      alert('This is already your active scan report.');
      return;
    }

    // Restore skin parameters from record
    if (confirm(`Do you want to restore the skin report from ${record.date} as your active scan?`)) {
      // Re-trigger dispatch
      const restoredResult = {
        ...analysisResult!,
        timestamp: record.date,
        beautyScore: record.skinScore,
        skinPassportId: record.id,
        skinHealth: {
          ...analysisResult!.skinHealth,
          overallScore: record.skinScore,
          hydrationScore: record.hydrationScore,
          acneRiskScore: record.acneRiskScore,
          uvDamageScore: record.uvDamageScore,
          agingRiskScore: record.agingRiskScore,
          measurements: {
            ...analysisResult!.skinHealth.measurements,
            dryness: record.hydrationScore,
            acne: Math.round(100 - record.acneRiskScore),
            darkSpots: Math.round(100 - record.uvDamageScore),
            wrinkles: Math.round(100 - record.agingRiskScore)
          }
        }
      };

      dispatch({ type: 'SET_ANALYSIS_RESULT', payload: restoredResult });
      dispatch({ type: 'SET_ACTIVE_TAB', payload: 'summary' });
      navigate('/report');
    }
  };

  const activeId = analysisResult?.skinPassportId || 'NO-ACTIVE-SCAN';

  return (
    <div className="page-content animate-fadeIn p-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-3">
          <Award size={12} /> Skin Passport Ledger
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">AuraAI Skin Passport</h1>
        <p className="text-sm text-aura-muted">Track your dermatological identity, previous scan records, and earned achievement badges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Passport Card (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-teal-950/30 to-purple-950/40 border border-aura-border shadow-glow-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-mono font-bold text-[10px] text-teal-400 bg-teal-500/10 border-b border-l border-teal-500/25 rounded-bl-xl">
              MEDICAL PASS
            </div>
            
            <div className="mb-6">
              <span className="text-[10px] text-aura-muted font-bold uppercase tracking-wider block mb-1">Dermatological Identification</span>
              <h2 className="text-lg font-black text-white font-mono text-glow">{activeId}</h2>
            </div>

            <div className="space-y-4 border-t border-aura-border/60 pt-4">
              <div className="flex justify-between">
                <span className="text-xs text-aura-muted">Patient Name</span>
                <span className="text-xs font-bold text-white">{state.profile?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-aura-muted">Age Profile</span>
                <span className="text-xs font-bold text-white">{state.profile?.age || 'N/A'} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-aura-muted">Biological Skin Type</span>
                <span className="text-xs font-bold text-teal-400 capitalize">{state.profile?.skinType || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-aura-muted">Passport Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Clinical Active
                </span>
              </div>
            </div>

            {state.profile && (
              <div className="mt-6 p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-aura-muted">
                <strong>Objectives:</strong> {state.profile.goals.join(', ')}
              </div>
            )}
          </div>

          {/* Badges Box */}
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="text-purple-400" size={16} /> Achievement Badges
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((ach) => (
                <div 
                  key={ach.id}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                    ach.unlocked 
                      ? 'bg-purple-950/20 border-purple-500/30 text-white shadow-glow-secondary' 
                      : 'bg-aura-bg/20 border-aura-border text-aura-muted opacity-50'
                  }`}
                  title={ach.description}
                >
                  <div className="text-2xl mb-1">{ach.icon}</div>
                  <div className="text-[9px] font-black leading-tight truncate">{ach.title}</div>
                  <div className="text-[7px] text-aura-muted mt-0.5 leading-tight">{ach.unlocked ? `Unlocked` : 'Locked'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scan History Ledger (Right) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <History className="text-teal-400" size={16} /> Scanning History Ledger
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {progressHistory.map((record) => (
              <div 
                key={record.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
                  record.id === activeId 
                    ? 'bg-teal-950/15 border-teal-500/40' 
                    : 'bg-aura-bg/25 border-aura-border hover:border-aura-border/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono">
                      {record.id.substring(0, 12)}
                    </span>
                    <span className="text-[10px] text-aura-muted flex items-center gap-1">
                      <Calendar size={10} /> {record.date}
                    </span>
                  </div>
                  <p className="text-xs text-white leading-relaxed line-clamp-1 italic m-0">
                    "{record.twinSummary}"
                  </p>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-center sm:text-right">
                    <span className="text-lg font-black text-white">{record.skinScore}</span>
                    <span className="text-[8px] text-aura-muted block uppercase font-bold">Skin Score</span>
                  </div>
                  
                  {record.id !== activeId ? (
                    <button 
                      className="px-3 py-1.5 bg-aura-bg border border-aura-border hover:border-teal-500 text-[10px] font-bold text-white hover:text-teal-400 rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-100 hover:-translate-y-0.5"
                      onClick={() => handleRestoreRecord(record)}
                    >
                      Restore Report
                    </button>
                  ) : (
                    <span className="px-2.5 py-1.5 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg">
                      Active
                    </span>
                  )}
                </div>
              </div>
            ))}

            {progressHistory.length === 0 && (
              <div className="text-center py-12 text-aura-muted">
                <ShieldAlert size={36} className="mx-auto text-aura-border mb-3" />
                <p className="text-sm">No historical scan entries found in this passport.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
