import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { Calendar, Clock, Sun, Moon, Sparkles, CheckSquare, Square, Bell, User } from 'lucide-react';

export default function AICarePlanner() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    am_cleanse: true,
    pm_retinol: true,
    weekly_mask: false
  });
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <Calendar size={48} className="text-emerald-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to compile your AI Care Planner.
        </p>
        <button 
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition shadow-glow-primary"
          onClick={() => navigate('/profile')}
        >
          Start Analysis
        </button>
      </div>
    );
  }

  const toggleReminder = (id: string) => {
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const routine = result.routine;

  // Daily timelines: AM, PM, Afternoon (newly introduced for v4.0)
  const amTasks = routine.morning.map(item => ({
    id: `am_${item.step}`,
    time: '08:00 AM',
    title: item.productType,
    product: item.product,
    desc: item.why,
    category: 'skin'
  }));

  const afternoonTasks = [
    {
      id: 'noon_1',
      time: '12:30 PM',
      title: 'Sunscreen Reapplication',
      product: 'Broad Spectrum SPF 50 Block',
      desc: 'Re-apply barrier protection to counter secondary daytime UV index increases.',
      category: 'skin'
    },
    {
      id: 'noon_2',
      time: '01:00 PM',
      title: 'Hydration Target Check',
      product: 'Water Intake Verification',
      desc: 'Verify 4 glasses consumed. Maintains optimal cellular skin turgor.',
      category: 'lifestyle'
    },
    {
      id: 'noon_3',
      time: '03:00 PM',
      title: 'Hair Nourishment',
      product: 'Moisturizing Hair Mist',
      desc: 'Light misting of hair shaft ends to prevent moisture evaporation.',
      category: 'hair'
    }
  ];

  const pmTasks = routine.night.map(item => ({
    id: `pm_${item.step}`,
    time: '10:00 PM',
    title: item.productType,
    product: item.product,
    desc: item.why,
    category: 'skin'
  }));

  const allDailyTasks = [...amTasks, ...afternoonTasks, ...pmTasks];
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPct = allDailyTasks.length > 0 ? Math.round((completedCount / allDailyTasks.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            <Calendar size={12} /> Personal Wellness Planner
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display">AI Care Planner</h1>
          <p className="text-sm text-aura-muted mt-1">Generate customized tasks and schedule reminders across skin, hair, and lifestyle vectors.</p>
        </div>

        {/* Adherence Card */}
        <div className="p-4 rounded-xl border border-aura-border bg-aura-panel w-full md:w-64 glass-gradient">
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="text-aura-muted">Planner Adherence</span>
            <span className="text-emerald-400">{progressPct}%</span>
          </div>
          <div className="h-2 bg-black/45 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[9px] text-aura-muted">Check off tasks to complete daily logs.</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-black/45 rounded-xl border border-aura-border max-w-sm mb-8">
        {(['daily', 'weekly', 'monthly'] as const).map(t => (
          <button
            key={t}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === t ? 'bg-emerald-600 text-white shadow-glow-primary' : 'text-aura-muted hover:text-white'
            }`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'daily' ? 'Daily Schedule' : t === 'weekly' ? 'Weekly Plan' : 'Monthly Plan'}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Timeline columns (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Morning Section */}
            <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-aura-border pb-2">
                <Sun size={14} className="text-amber-400" /> Morning Routine Timeline
              </h3>
              <div className="flex flex-col gap-4">
                {amTasks.map(task => {
                  const isDone = !!completedTasks[task.id];
                  return (
                    <div key={task.id} className="flex gap-4 items-start">
                      <button onClick={() => toggleTask(task.id)} className="mt-1 text-aura-muted hover:text-white">
                        {isDone ? <CheckSquare size={16} className="text-emerald-400" /> : <Square size={16} />}
                      </button>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className={`font-bold ${isDone ? 'line-through text-aura-muted' : 'text-white'}`}>{task.title}</span>
                          <span className="font-mono text-aura-muted">{task.time}</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-semibold">{task.product}</span>
                        <p className="text-[10px] text-aura-muted mt-1 leading-relaxed">{task.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Afternoon Section */}
            <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-aura-border pb-2">
                <Clock size={14} className="text-cyan-400 animate-pulse" /> Afternoon Routine Timeline
              </h3>
              <div className="flex flex-col gap-4">
                {afternoonTasks.map(task => {
                  const isDone = !!completedTasks[task.id];
                  return (
                    <div key={task.id} className="flex gap-4 items-start">
                      <button onClick={() => toggleTask(task.id)} className="mt-1 text-aura-muted hover:text-white">
                        {isDone ? <CheckSquare size={16} className="text-emerald-400" /> : <Square size={16} />}
                      </button>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className={`font-bold ${isDone ? 'line-through text-aura-muted' : 'text-white'}`}>{task.title}</span>
                          <span className="font-mono text-aura-muted">{task.time}</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-semibold">{task.product}</span>
                        <p className="text-[10px] text-aura-muted mt-1 leading-relaxed">{task.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Night Section */}
            <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-aura-border pb-2">
                <Moon size={14} className="text-purple-400" /> Night Routine Timeline
              </h3>
              <div className="flex flex-col gap-4">
                {pmTasks.map(task => {
                  const isDone = !!completedTasks[task.id];
                  return (
                    <div key={task.id} className="flex gap-4 items-start">
                      <button onClick={() => toggleTask(task.id)} className="mt-1 text-aura-muted hover:text-white">
                        {isDone ? <CheckSquare size={16} className="text-emerald-400" /> : <Square size={16} />}
                      </button>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className={`font-bold ${isDone ? 'line-through text-aura-muted' : 'text-white'}`}>{task.title}</span>
                          <span className="font-mono text-aura-muted">{task.time}</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-semibold">{task.product}</span>
                        <p className="text-[10px] text-aura-muted mt-1 leading-relaxed">{task.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right column: Reminders & Alerts (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Bell size={14} className="text-purple-400" /> Smart Notification Alerts
              </h3>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => toggleReminder('am_cleanse')}
                  className="flex justify-between items-center p-3 rounded-xl bg-black/25 border border-white/5 text-xs text-left"
                >
                  <div>
                    <div className="font-bold text-white">Morning Cleanse Alert</div>
                    <span className="text-[9px] text-aura-muted">Trigger time: 08:00 AM</span>
                  </div>
                  <span className={`text-[10px] font-bold ${reminders.am_cleanse ? 'text-emerald-400' : 'text-aura-muted'}`}>
                    {reminders.am_cleanse ? 'ENABLED' : 'MUTED'}
                  </span>
                </button>

                <button 
                  onClick={() => toggleReminder('pm_retinol')}
                  className="flex justify-between items-center p-3 rounded-xl bg-black/25 border border-white/5 text-xs text-left"
                >
                  <div>
                    <div className="font-bold text-white">Evening Retinol Alert</div>
                    <span className="text-[9px] text-aura-muted">Trigger time: 10:00 PM</span>
                  </div>
                  <span className={`text-[10px] font-bold ${reminders.pm_retinol ? 'text-emerald-400' : 'text-aura-muted'}`}>
                    {reminders.pm_retinol ? 'ENABLED' : 'MUTED'}
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routine.weekly?.map((week, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 font-mono">{week.day}</span>
              <h4 className="text-xs font-bold text-white mt-1 mb-2">{week.treatment}</h4>
              <p className="text-[11px] text-white/90 font-medium mb-2">{week.product} ({week.duration})</p>
              <p className="text-[10px] text-aura-muted leading-relaxed">{week.why}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'monthly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routine.monthly?.map((month, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
              <span className="text-[9px] font-bold uppercase tracking-wider text-pink-400 font-mono">Week {idx + 1} Target</span>
              <h4 className="text-xs font-bold text-white mt-1 mb-2">{month.treatment}</h4>
              <p className="text-[10px] text-pink-300 font-mono mb-2">{month.cycle}</p>
              <p className="text-[10px] text-aura-muted leading-relaxed">{month.why}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
