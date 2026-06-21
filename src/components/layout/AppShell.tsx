import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAura } from '../../context/AuraContext'
import {
  LayoutDashboard, FileText, Sliders, TrendingUp, Activity,
  Sparkles, Menu, X, ChevronRight, User, LogOut,
  CloudSun, Cpu, Wifi, Check, Loader2, BookOpen,
  Award, ArrowLeftRight, Trophy, Dna, Brain, ShieldAlert,
  ClipboardList, Milestone, Gauge, Microscope, Search, 
  MessageSquare, ShoppingBag, Calendar, Play, Stethoscope
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/report', icon: FileText, label: 'Dermatology Report', section: 'Analysis' },
  { path: '/simulator', icon: Sliders, label: '30-Day Simulator', section: 'Analysis' },
  { path: '/forecast', icon: TrendingUp, label: 'Future Projections', section: 'Intelligence' },
  { path: '/progress', icon: Activity, label: 'Clinical Progress', section: 'Intelligence' },
  { path: '/bio-age', icon: Dna, label: 'Biological Age', section: 'Advanced' },
  { path: '/passport', icon: Award, label: 'Skin Passport', section: 'Passport' },
  { path: '/comparison', icon: ArrowLeftRight, label: 'Scan Comparison', section: 'Passport' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard Arena', section: 'Passport' },
  { path: '/journal', icon: BookOpen, label: 'Skin Journal', section: 'Daily', badge: '🔥' },
  
  // Aura OS v4.0 Suite
  { path: '/skin-lab', icon: Microscope, label: 'Skin Health Lab', section: 'AuraOS' },
  { path: '/hair-lab', icon: Activity, label: 'Hair Intelligence Lab', section: 'AuraOS' },
  { path: '/beauty-twin', icon: Sparkles, label: 'AI Beauty Twin', section: 'AuraOS' },
  { path: '/care-planner', icon: Calendar, label: 'AI Care Planner', section: 'AuraOS' },
  { path: '/journey', icon: Milestone, label: '90-Day Journey', section: 'AuraOS' },
  { path: '/ingredients', icon: Search, label: 'Ingredient Center', section: 'AuraOS' },
  { path: '/risk-intelligence', icon: ShieldAlert, label: 'Risk Intelligence', section: 'AuraOS' },
  { path: '/timeline', icon: Milestone, label: 'Progress Timeline', section: 'AuraOS' },
  { path: '/coach', icon: MessageSquare, label: 'AI Beauty Coach', section: 'AuraOS' },
  { path: '/products', icon: ShoppingBag, label: 'Product Engine', section: 'AuraOS' },
  { path: '/challenges', icon: Trophy, label: 'Beauty Challenges', section: 'AuraOS' },
  { path: '/how-it-thinks', icon: Brain, label: 'How AuraAI Thinks', section: 'AuraOS' },
  { path: '/demo', icon: Play, label: 'Demo Console', section: 'AuraOS' },
  { path: '/consultation', icon: Stethoscope, label: 'Specialist Consult', section: 'AuraOS' }
]



export default function AppShell() {
  const { state } = useAura()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const profile = state.profile
  const result = state.analysisResult

  const [serumLevel, setSerumLevel] = useState(84)
  const [dispenseStatus, setDispenseStatus] = useState<'idle' | 'mixing' | 'dispensing' | 'complete'>('idle')

  const handleDispense = () => {
    setDispenseStatus('mixing')
    setTimeout(() => {
      setDispenseStatus('dispensing')
      setTimeout(() => {
        setDispenseStatus('complete')
        setSerumLevel(prev => Math.max(0, prev - 1))
        setTimeout(() => {
          setDispenseStatus('idle')
        }, 3000)
      }, 2000)
    }, 1500)
  }

  const beautyScore = result?.beautyScore ?? '--'
  const scoreColor =
    typeof beautyScore === 'number'
      ? beautyScore >= 80 ? 'var(--aura-green)' :
        beautyScore >= 65 ? 'var(--aura-cyan)' :
        beautyScore >= 50 ? 'var(--aura-gold)' : 'var(--aura-orange)'
      : 'var(--text-muted)'

  return (
    <div className="app-shell bg-mesh">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
        <Menu size={20} color="white" />
      </button>

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px var(--aura-primary-glow)'
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff' }}>
                AuraAI
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Derm Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Beauty Score Card */}
        {result && typeof beautyScore === 'number' && (
          <div style={{ margin: '12px 12px 4px', padding: '14px 16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
              Skin Health Index
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                {beautyScore}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 4, background: 'var(--glass-bg-strong)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${beautyScore}%`, background: 'var(--gradient-primary)', borderRadius: 99, transition: 'width 1s ease' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {beautyScore >= 80 ? 'Optimal' : beautyScore >= 65 ? 'Good' : beautyScore >= 50 ? 'Fair' : 'Needs Care'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Dashboard */}
          <div className="sidebar-section-label">Overview</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
            style={{ marginBottom: 2 }}
          >
            <LayoutDashboard size={16} />
            Executive Dashboard
          </NavLink>

          {/* Analysis */}
          <div className="sidebar-section-label">Analysis</div>
          {NAV_ITEMS.filter(item => item.section === 'Analysis').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              {item.label}
              <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </NavLink>
          ))}

          {/* Intelligence */}
          <div className="sidebar-section-label">Intelligence</div>
          {NAV_ITEMS.filter(item => item.section === 'Intelligence').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              {item.label}
              <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </NavLink>
          ))}

          {/* Advanced Insights */}
          <div className="sidebar-section-label">Advanced Insights</div>
          {NAV_ITEMS.filter(item => item.section === 'Advanced').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              {item.label}
              <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </NavLink>
          ))}

          {/* Aura OS v4.0 Suite */}
          <div className="sidebar-section-label">Aura OS v4.0 Suite</div>
          {NAV_ITEMS.filter(item => item.section === 'AuraOS').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              {item.label}
              <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </NavLink>
          ))}



          {/* Passport */}
          <div className="sidebar-section-label">Identity & Badges</div>
          {NAV_ITEMS.filter(item => item.section === 'Passport').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              {item.label}
              <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
            </NavLink>
          ))}

          {/* Daily */}
          <div className="sidebar-section-label">Daily Logs</div>
          {NAV_ITEMS.filter(item => item.section === 'Daily').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              {item.label}
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>{item.badge}</span>
            </NavLink>
          ))}

          {/* Connected Device Hub Widget */}
          <div className="sidebar-section-label">Aura Vanity Dispenser</div>
          <div className="sidebar-widget-card mt-2">
            <div className="widget-header flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5">
                <Cpu size={14} className="text-primary-color" />
                <span className="widget-title">Dispenser Hub</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="device-status-dot active animate-pulse" />
                <span style={{ fontSize: '0.6rem', color: 'var(--aura-green-light)', fontWeight: 700 }}>ACTIVE</span>
              </div>
            </div>

            <div className="dispenser-status-body">
              <div className="dispenser-tank-section">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Bespoke Cartridge</span>
                  <span className="font-bold text-primary-color">{serumLevel}%</span>
                </div>
                <div className="tank-progress-bar">
                  <div 
                    className="tank-progress-fill" 
                    style={{ width: `${serumLevel}%` }} 
                  />
                </div>
              </div>

              {dispenseStatus === 'idle' && (
                <button 
                  className="btn btn-primary btn-sm w-full mt-3 font-semibold"
                  onClick={handleDispense}
                  style={{ borderRadius: '8px', padding: '6px 12px' }}
                >
                  <Wifi size={12} /> Sync & Dispense
                </button>
              )}

              {dispenseStatus === 'mixing' && (
                <div className="dispense-loading mt-3 text-center text-xs text-secondary py-2 border rounded-md bg-glass-strong flex justify-center items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-cyan" />
                  <span>Mixing Formula...</span>
                </div>
              )}

              {dispenseStatus === 'dispensing' && (
                <div className="dispense-loading mt-3 text-center text-xs text-secondary py-2 border rounded-md bg-glass-strong flex justify-center items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-rose" />
                  <span>Dispensing Dose...</span>
                </div>
              )}

              {dispenseStatus === 'complete' && (
                <div className="dispense-success mt-3 text-center text-xs text-green py-2 border rounded-md bg-glass-strong flex justify-center items-center gap-2" style={{ borderColor: 'var(--aura-green)' }}>
                  <Check size={12} className="text-green" />
                  <span style={{ color: 'var(--aura-green-light)' }}>Dose Dispensed!</span>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* User Footer */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--glass-border)' }}>
          {profile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--gradient-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, flexShrink: 0
              }}>
                {profile.name?.charAt(0)?.toUpperCase() || <User size={16} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                  {profile.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {profile.skinType} skin · {profile.age}y
                </div>
              </div>
              <button
                className="btn-ghost"
                onClick={() => navigate('/')}
                style={{ padding: 6, borderRadius: 8 }}
                title="Back to Home"
              >
                <LogOut size={14} color="var(--text-muted)" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        {/* Top Bar */}
        <header className="app-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 20, background: 'var(--glass-border)', marginRight: 4 }} />
            {profile && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Welcome back, <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{profile.name}</span>
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {result && (
              <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--aura-green)', boxShadow: '0 0 6px var(--aura-green)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Skin Health</span>
                  <span style={{ fontWeight: 700, color: 'var(--aura-green)' }}>{result.beautyScore}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--aura-cyan)', boxShadow: '0 0 6px var(--aura-cyan)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Hydration</span>
                  <span style={{ fontWeight: 700, color: 'var(--aura-cyan)' }}>{result.skinHealth.hydrationScore}%</span>
                </div>
              </div>
            )}
            <button className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={() => navigate('/upload')}>
              <Sparkles size={13} />
              New Analysis
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ position: 'relative', zIndex: 1 }} className="pb-24 lg:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Premium Glassmorphic Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 border-t border-white/10 px-4 py-2 flex justify-around items-center backdrop-blur-xl">
        {[
          { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
          { path: '/upload', icon: Microscope, label: 'Analysis' },
          { path: '/journey', icon: Milestone, label: 'Journey' },
          { path: '/report', icon: FileText, label: 'Reports' },
          { path: '/profile', icon: User, label: 'Profile' }
        ].map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-300 relative ${
              isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-md opacity-30 animate-pulse" />
                )}
                <item.icon size={18} className={isActive ? 'text-purple-400 relative z-10' : 'relative z-10'} />
                <span className="text-[9px] tracking-wide relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
