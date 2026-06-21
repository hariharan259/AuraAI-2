import React, { useState } from 'react';
import { 
  TrendingUp, Users, Calendar, DollarSign, ShieldCheck, 
  Settings, UserCheck, AlertTriangle, Layers, Activity,
  Briefcase, CheckCircle2, ChevronRight, BarChart2, ShieldAlert
} from 'lucide-react';
import { useAura } from '../context/AuraContext';

interface MockDoctorReg {
  id: number;
  name: string;
  specialty: string;
  licenseNumber: string;
  status: 'verified' | 'pending' | 'rejected';
  appliedDate: string;
}

export default function AdminDashboard() {
  const { state } = useAura();
  const profile = state.profile;
  const result = state.analysisResult;

  const [activeSubTab, setActiveSubTab] = useState<'investor' | 'doctors' | 'telemetry'>('investor');
  
  // Doctor Verification Registry
  const [docRegistries, setDocRegistries] = useState<MockDoctorReg[]>([
    { id: 1, name: 'Dr. Evelyn Vance, MD', specialty: 'Dermatologist', licenseNumber: 'MED-7809-CA', status: 'verified', appliedDate: 'June 01, 2026' },
    { id: 2, name: 'Dr. Marcus Vance', specialty: 'Trichologist', licenseNumber: 'TRIC-4512-NY', status: 'verified', appliedDate: 'June 03, 2026' },
    { id: 3, name: 'Sarah Lin, MS', specialty: 'Formulation Scientist', licenseNumber: 'CHEM-8902-NJ', status: 'verified', appliedDate: 'June 05, 2026' },
    { id: 4, name: 'Dr. Leila Thorne, MD', specialty: 'Acne Specialist', licenseNumber: 'MED-1104-TX', status: 'pending', appliedDate: 'June 18, 2026' },
    { id: 5, name: 'Dr. Rajan Patel, MD', specialty: 'Hair Loss Surgeon', licenseNumber: 'SURG-3398-FL', status: 'pending', appliedDate: 'June 20, 2026' }
  ]);

  const handleVerifyDoctor = (id: number, verify: boolean) => {
    setDocRegistries(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, status: verify ? 'verified' : 'rejected' };
      }
      return doc;
    }));
  };

  return (
    <div className="page-content animate-fadeIn p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3">
            <ShieldCheck size={12} /> Management Portal
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">Admin & Investor Analytics</h1>
          <p className="text-sm text-aura-muted">Track monthly recurring revenue, platform metrics, and administrative doctor credential configurations.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-black/45 p-1 rounded-xl border border-white/5 gap-1">
          <button 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 no-lift ${activeSubTab === 'investor' ? 'bg-indigo-600 text-white shadow-glow-primary' : 'text-aura-muted hover:text-white'}`}
            onClick={() => setActiveSubTab('investor')}
          >
            <TrendingUp size={14} className="inline mr-1.5" /> Investor Hub
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 no-lift ${activeSubTab === 'doctors' ? 'bg-indigo-600 text-white shadow-glow-primary' : 'text-aura-muted hover:text-white'}`}
            onClick={() => setActiveSubTab('doctors')}
          >
            <UserCheck size={14} className="inline mr-1.5" /> Verify Doctors
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 no-lift ${activeSubTab === 'telemetry' ? 'bg-indigo-600 text-white shadow-glow-primary' : 'text-aura-muted hover:text-white'}`}
            onClick={() => setActiveSubTab('telemetry')}
          >
            <Activity size={14} className="inline mr-1.5" /> System Status
          </button>
        </div>
      </div>

      {/* Tab: Investor Revenue */}
      {activeSubTab === 'investor' && (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Platform MRR', value: '$42,850', growth: '+14% MoM', icon: DollarSign, color: 'text-indigo-400' },
              { label: 'Active Subscribers', value: '1,482', growth: '+9.2%', icon: Users, color: 'text-cyan-400' },
              { label: 'Booking Commissions', value: '$5,120', growth: '10% Fee', icon: Calendar, color: 'text-purple-400' },
              { label: 'Product Referrals', value: '$3,280', growth: '8% Comm', icon: Layers, color: 'text-emerald-400' }
            ].map((card, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-glass-bg flex justify-between items-center relative overflow-hidden">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-aura-muted uppercase tracking-wider font-bold block">{card.label}</span>
                  <strong className="text-2xl font-black text-white block">{card.value}</strong>
                  <span className={`text-[10px] font-bold ${card.color}`}>{card.growth}</span>
                </div>
                <card.icon size={28} className={`${card.color} opacity-40`} />
              </div>
            ))}
          </div>

          {/* Subscription Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-6 rounded-2xl border border-white/5 bg-glass-bg flex flex-col justify-between h-72">
              <div>
                <span className="text-[10px] uppercase font-bold text-aura-muted tracking-wider">Plan Tier</span>
                <h3 className="text-lg font-bold text-white mt-1">Aura Free Scans</h3>
                <p className="text-xs text-aura-muted mt-2">Allows baseline skin health scans, acne assessment, and diagnostic scores.</p>
                <div className="mt-4 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1.5 mb-1.5">
                    <span>Pricing:</span>
                    <strong className="text-white">$0 / month</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <strong className="text-white">1,220 members</strong>
                  </div>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/10 to-purple-950/10 flex flex-col justify-between h-72 relative">
              <div className="absolute top-4 right-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                Best Seller
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Plan Tier</span>
                <h3 className="text-lg font-bold text-white mt-1">Aura Premium Pro</h3>
                <p className="text-xs text-aura-muted mt-2">Unlocks 3D skin twin, biological age tracking, routine forecast models, and PDF reports.</p>
                <div className="mt-4 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1.5 mb-1.5">
                    <span>Pricing:</span>
                    <strong className="text-white">$29 / month</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <strong className="text-white">212 members</strong>
                  </div>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            {/* Clinic */}
            <div className="p-6 rounded-2xl border border-white/5 bg-glass-bg flex flex-col justify-between h-72">
              <div>
                <span className="text-[10px] uppercase font-bold text-aura-muted tracking-wider">Plan Tier</span>
                <h3 className="text-lg font-bold text-white mt-1">Clinic Enterprise</h3>
                <p className="text-xs text-aura-muted mt-2">B2B portal licenses for local clinics, telehealth systems, and secure dermatologist databases.</p>
                <div className="mt-4 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1.5 mb-1.5">
                    <span>Pricing:</span>
                    <strong className="text-white">$199 / month</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Licenses:</span>
                    <strong className="text-white">50 clinics</strong>
                  </div>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>

          {/* Revenue and Retention Cohorts Graph mockups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SaaS MRR Growth */}
            <div className="p-6 rounded-2xl border border-white/5 bg-glass-bg">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-white">SaaS Revenue Growth Trend</h4>
                <BarChart2 size={16} className="text-indigo-400" />
              </div>
              <div className="h-44 flex items-end justify-between gap-2.5 pt-4">
                {[
                  { month: 'Jan', val: 32 },
                  { month: 'Feb', val: 40 },
                  { month: 'Mar', val: 48 },
                  { month: 'Apr', val: 56 },
                  { month: 'May', val: 72 },
                  { month: 'Jun', val: 95 }
                ].map((pt, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 transition-all rounded-t-lg relative group" style={{ height: `${pt.val * 1.2}px` }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 px-1 py-0.5 rounded">
                        ${Math.round(pt.val * 450)}
                      </span>
                    </div>
                    <span className="text-[10px] text-aura-muted font-mono">{pt.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Retention and cohort index */}
            <div className="p-6 rounded-2xl border border-white/5 bg-glass-bg">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-white">Retention Cohort Analytics</h4>
                <TrendingUp size={16} className="text-cyan-400" />
              </div>
              <div className="space-y-3.5">
                {[
                  { group: 'Day-30 Cohort', percent: 94, color: 'bg-indigo-500' },
                  { group: 'Day-60 Cohort', percent: 88, color: 'bg-cyan-500' },
                  { group: 'Day-90 Cohort', percent: 82, color: 'bg-purple-500' }
                ].map((co, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span>{co.group}</span>
                      <strong className="text-white">{co.percent}% Retention</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full ${co.color} rounded-full`} style={{ width: `${co.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Verify Doctors */}
      {activeSubTab === 'doctors' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted">Doctor Registrations & Credentials</h3>
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <AlertTriangle size={10} /> {docRegistries.filter(d => d.status === 'pending').length} Actions Pending
            </span>
          </div>

          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-glass-bg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 text-aura-muted font-bold text-[10px] uppercase tracking-wider">
                  <th className="p-4">Doctor Name</th>
                  <th className="p-4">Specialty</th>
                  <th className="p-4">Medical License</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {docRegistries.map(doc => (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{doc.name}</td>
                    <td className="p-4 text-aura-muted">{doc.specialty}</td>
                    <td className="p-4 font-mono text-purple-300">{doc.licenseNumber}</td>
                    <td className="p-4 text-aura-muted">{doc.appliedDate}</td>
                    <td className="p-4">
                      {doc.status === 'verified' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[9px] uppercase tracking-wide">
                          Verified
                        </span>
                      )}
                      {doc.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[9px] uppercase tracking-wide animate-pulse">
                          Pending Audit
                        </span>
                      )}
                      {doc.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[9px] uppercase tracking-wide">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {doc.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleVerifyDoctor(doc.id, true)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition no-lift"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleVerifyDoctor(doc.id, false)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold transition no-lift"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleVerifyDoctor(doc.id, 'pending' as any)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded text-[10px] font-bold transition no-lift"
                        >
                          Re-Audit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: System Diagnostics / Telemetry */}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted">System Diagnostic Logs</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Database */}
            <div className="p-5 rounded-2xl border border-white/5 bg-glass-bg space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <strong className="text-xs font-bold text-white uppercase tracking-wider">Health Logs Database</strong>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-1.5 text-xs text-aura-muted font-mono">
                <div className="flex justify-between"><span>Active Scans:</span> <strong className="text-white">1,412 records</strong></div>
                <div className="flex justify-between"><span>Prescription Entries:</span> <strong className="text-white">98 signed</strong></div>
                <div className="flex justify-between"><span>Audit Log Sync:</span> <strong className="text-emerald-400">Connected</strong></div>
              </div>
            </div>

            {/* Server */}
            <div className="p-5 rounded-2xl border border-white/5 bg-glass-bg space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <strong className="text-xs font-bold text-white uppercase tracking-wider">Secure Hosting API</strong>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-1.5 text-xs text-aura-muted font-mono">
                <div className="flex justify-between"><span>API Latency:</span> <strong className="text-white">24ms</strong></div>
                <div className="flex justify-between"><span>SSL Certification:</span> <strong className="text-emerald-400">Valid (256-bit)</strong></div>
                <div className="flex justify-between"><span>Server Load:</span> <strong className="text-white">4.8%</strong></div>
              </div>
            </div>

            {/* Compliance */}
            <div className="p-5 rounded-2xl border border-white/5 bg-glass-bg space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <strong className="text-xs font-bold text-white uppercase tracking-wider">HIPAA Audit Logs</strong>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-1.5 text-xs text-aura-muted font-mono">
                <div className="flex justify-between"><span>EHR Encryption:</span> <strong className="text-white">AES-GCM</strong></div>
                <div className="flex justify-between"><span>Consent Flags:</span> <strong className="text-white">100% active</strong></div>
                <div className="flex justify-between"><span>Audit Log ID:</span> <strong className="text-purple-300">LOG-903-HIPAA</strong></div>
              </div>
            </div>
          </div>

          {/* Diagnostic status block */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-cyan-400 space-y-2 h-44 overflow-y-auto">
            <div>[09:54:12] Initializing HIPAA secure sandbox ledger...</div>
            <div>[09:54:13] Syncing patient diagnostics database schema...</div>
            <div>[10:04:12] Establishing telehealth WebRTC connection protocol...</div>
            <div>[10:08:24] Handshaking SSL credentials for doctor license registry...</div>
            <div>[10:32:51] Verifying 256-bit AES-GCM audit log encryption...</div>
            <div>[11:00:24] Platform telemetry checks completed. Status: OPTIMAL.</div>
          </div>
        </div>
      )}
    </div>
  );
}
