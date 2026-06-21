import React, { useState, useEffect } from 'react';
import { useAura } from '../context/AuraContext';
import { generateComparisonReport } from '../services/aiEngine';
import { ComparisonReport, PassportRecord } from '../types';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight, Activity, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ScanComparison() {
  const navigate = useNavigate();
  const { state, dispatch } = useAura();
  const { analysisResult, progressHistory, comparisonReport } = state;

  const [selectedRecordId, setSelectedRecordId] = useState<string>('');

  // Filter history to records other than the current active one (if active exists)
  const historyOptions = progressHistory.filter(r => r.id !== analysisResult?.skinPassportId);

  useEffect(() => {
    // Default select the first available history option
    if (historyOptions.length > 0 && !selectedRecordId) {
      setSelectedRecordId(historyOptions[0].id);
    }
  }, [progressHistory]); // eslint-disable-line

  useEffect(() => {
    if (analysisResult && selectedRecordId) {
      const record = progressHistory.find(r => r.id === selectedRecordId);
      if (record) {
        const report = generateComparisonReport(record, analysisResult.skinHealth);
        dispatch({ type: 'SET_COMPARISON_REPORT', payload: report });
      }
    }
  }, [selectedRecordId, analysisResult]); // eslint-disable-line

  if (!analysisResult) {
    return (
      <div className="page-content flex flex-col items-center justify-center text-center py-20" style={{ minHeight: '80vh' }}>
        <h2 className="text-xl font-bold text-white mb-2">No Active Scan Data</h2>
        <p className="text-sm text-aura-muted mb-4">Please perform a skin analysis scan before accessing comparisons.</p>
        <button className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition" onClick={() => navigate('/profile')}>
          Start Scan
        </button>
      </div>
    );
  }

  if (historyOptions.length === 0) {
    return (
      <div className="page-content flex flex-col items-center justify-center text-center py-20" style={{ minHeight: '80vh' }}>
        <h2 className="text-xl font-bold text-white mb-2">Insufficient History</h2>
        <p className="text-sm text-aura-muted mb-4">You need at least two scans in your Skin Passport to run comparisons.</p>
        <button className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition" onClick={() => navigate('/profile')}>
          Perform Second Scan
        </button>
      </div>
    );
  }

  const activeRecord = progressHistory.find(r => r.id === selectedRecordId);

  const getDeltaStyle = (val: number, isRisk = false) => {
    if (val === 0) return 'text-aura-muted';
    // For risk metrics, positive change is BAD, negative is GOOD
    if (isRisk) {
      return val < 0 ? 'text-emerald-400' : 'text-rose-400';
    }
    return val > 0 ? 'text-emerald-400' : 'text-rose-400';
  };

  const formatDelta = (val: number, isRisk = false) => {
    if (val === 0) return '0';
    const prefix = val > 0 ? '+' : '';
    return `${prefix}${val}`;
  };

  return (
    <div className="page-content animate-fadeIn p-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-3">
            <ArrowLeftRight size={12} /> Scan Comparison Engine
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">Dermatological Comparisons</h1>
          <p className="text-sm text-aura-muted">Select a historical scan to compare against your current active analysis.</p>
        </div>

        {/* Selection Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-aura-muted uppercase tracking-wider">Compare current scan with:</label>
          <select 
            value={selectedRecordId} 
            onChange={(e) => setSelectedRecordId(e.target.value)}
            className="px-4 py-2 bg-aura-panel border border-aura-border text-white text-xs rounded-xl focus:outline-none focus:border-teal-500 transition cursor-pointer"
          >
            {historyOptions.map(r => (
              <option key={r.id} value={r.id}>
                Scan on {r.date} (Score: {r.skinScore})
              </option>
            ))}
          </select>
        </div>
      </div>

      {comparisonReport && activeRecord && (
        <div className="space-y-6">
          
          {/* Comparison Cards Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Overall Score */}
            <div className="p-4 rounded-xl bg-aura-panel border border-aura-border text-center glass-gradient">
              <span className="text-[10px] text-aura-muted uppercase tracking-wider font-bold block mb-1">Skin Score</span>
              <div className="flex justify-center items-baseline gap-2">
                <span className="text-xl font-bold text-white">{activeRecord.skinScore} ➔ {analysisResult.beautyScore}</span>
              </div>
              <span className={`text-xs font-bold ${getDeltaStyle(comparisonReport.scoreChange)}`}>
                {formatDelta(comparisonReport.scoreChange)}
              </span>
            </div>

            {/* Hydration */}
            <div className="p-4 rounded-xl bg-aura-panel border border-aura-border text-center glass-gradient">
              <span className="text-[10px] text-aura-muted uppercase tracking-wider font-bold block mb-1">Hydration</span>
              <div className="flex justify-center items-baseline gap-2">
                <span className="text-xl font-bold text-white">{activeRecord.hydrationScore}% ➔ {analysisResult.skinHealth.hydrationScore}%</span>
              </div>
              <span className={`text-xs font-bold ${getDeltaStyle(comparisonReport.hydrationChange)}`}>
                {formatDelta(comparisonReport.hydrationChange)}%
              </span>
            </div>

            {/* Acne Risk */}
            <div className="p-4 rounded-xl bg-aura-panel border border-aura-border text-center glass-gradient">
              <span className="text-[10px] text-aura-muted uppercase tracking-wider font-bold block mb-1">Acne Risk</span>
              <div className="flex justify-center items-baseline gap-2">
                <span className="text-xl font-bold text-white">{activeRecord.acneRiskScore}% ➔ {analysisResult.skinHealth.acneRiskScore}%</span>
              </div>
              <span className={`text-xs font-bold ${getDeltaStyle(comparisonReport.acneRiskChange, true)}`}>
                {formatDelta(comparisonReport.acneRiskChange, true)}%
              </span>
            </div>

            {/* UV Damage */}
            <div className="p-4 rounded-xl bg-aura-panel border border-aura-border text-center glass-gradient">
              <span className="text-[10px] text-aura-muted uppercase tracking-wider font-bold block mb-1">UV Damage</span>
              <div className="flex justify-center items-baseline gap-2">
                <span className="text-xl font-bold text-white">{activeRecord.uvDamageScore}% ➔ {analysisResult.skinHealth.uvDamageScore}%</span>
              </div>
              <span className={`text-xs font-bold ${getDeltaStyle(comparisonReport.uvDamageChange, true)}`}>
                {formatDelta(comparisonReport.uvDamageChange, true)}%
              </span>
            </div>

            {/* Aging Risk */}
            <div className="p-4 rounded-xl bg-aura-panel border border-aura-border text-center glass-gradient">
              <span className="text-[10px] text-aura-muted uppercase tracking-wider font-bold block mb-1">Aging Risk</span>
              <div className="flex justify-center items-baseline gap-2">
                <span className="text-xl font-bold text-white">{activeRecord.agingRiskScore}% ➔ {analysisResult.skinHealth.agingRiskScore}%</span>
              </div>
              <span className={`text-xs font-bold ${getDeltaStyle(comparisonReport.agingRiskChange, true)}`}>
                {formatDelta(comparisonReport.agingRiskChange, true)}%
              </span>
            </div>
          </div>

          {/* Clinical comparison summary text */}
          <div className="p-5 rounded-2xl bg-teal-950/10 border border-teal-500/20 glass-gradient">
            <h4 className="text-sm font-bold text-teal-400 mb-2 flex items-center gap-1.5">
              <Activity size={16} /> Clinical Progress Assessment
            </h4>
            <p className="text-sm text-aura-text leading-relaxed m-0">{comparisonReport.overallSummary}</p>
          </div>

          {/* Side-by-side Improvements & Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Improvements Panel */}
            <div className="p-5 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <h4 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} /> Logged Improvements
              </h4>
              <ul className="space-y-3 pl-0 list-none m-0">
                {comparisonReport.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-aura-text leading-relaxed">
                    <ShieldCheck size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* New Concerns Panel */}
            <div className="p-5 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <h4 className="text-sm font-bold text-rose-400 mb-4 flex items-center gap-2">
                <AlertTriangle size={16} /> New Risks & Warnings
              </h4>
              <ul className="space-y-3 pl-0 list-none m-0">
                {comparisonReport.newConcerns.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-aura-text leading-relaxed">
                    <AlertTriangle size={14} className="text-rose-400 mt-0.5 flex-shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Historical Scan Metadata Panel */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 border border-aura-border bg-aura-panel/60 rounded-xl justify-between items-center text-xs text-aura-muted">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> Previous Scan Reference: <strong>{prevRecordDate(activeRecord)}</strong></span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> Current Scan Reference: <strong>{analysisResult.timestamp}</strong></span>
          </div>

        </div>
      )}

    </div>
  );
}

function prevRecordDate(record: PassportRecord) {
  return record.date;
}
