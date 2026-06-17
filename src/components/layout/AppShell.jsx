import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAura } from '../../context/AuraContext'
import {
  LayoutDashboard, FileText, Sliders, TrendingUp, Activity,
  Sparkles, Menu, X, ChevronRight, User, LogOut,
  CloudSun, Droplet, Cpu, Wifi, Check, Loader2, BookOpen
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/report', icon: FileText, label: 'Beauty Report', section: 'Analysis' },
  { path: '/simulator', icon: Sliders, label: 'Outcome Simulator', section: 'Analysis' },
  { path: '/forecast', icon: TrendingUp, label: 'Forecast', section: 'Intelligence' },
  { path: '/progress', icon: Activity, label: 'Progress', section: 'Intelligence' },
  { path: '/journal', icon: BookOpen, label: 'Skin Journal', section: 'Daily', badge: '🔥' },
]

export default function AppShell() {
  const { state } = useAura()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const profile = state.profile
  const result = state.analysisResult

  const [serumLevel, setSerumLevel] = useState(84)
  const [dispenseStatus, setDispenseStatus] = useState('idle') // idle | mixing | dispensing | complete

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
    beautyScore >= 80 ? 'var(--aura-green)' :
    beautyScore >= 65 ? 'var(--aura-cyan)' :
    beautyScore >= 50 ? 'var(--aura-gold)' : 'var(--aura-orange)'

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
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                AuraAI
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Beauty Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Beauty Score Card */}
        {result && (
          <div style={{ margin: '12px 12px 4px', padding: '14px 16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
              Beauty Score
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
                  {beautyScore >= 80 ? 'Excellent' : beautyScore >= 65 ? 'Good' : beautyScore >= 50 ? 'Fair' : 'Needs Care'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Dashboard */}
          <div className="sidebar-section-label">Overview</div>
          <button
            className="sidebar-nav-item"
            onClick={() => { navigate('/report'); setSidebarOpen(false) }}
            style={{ marginBottom: 2 }}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          {/* Analysis */}
          <div className="sidebar-section-label">Analysis</div>
          {NAV_ITEMS.slice(0, 2).map(item => (
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
          {NAV_ITEMS.slice(2, 4).map(item => (
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
          <div className="sidebar-section-label">Daily</div>
          {NAV_ITEMS.slice(4).map(item => (
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

          {/* Vanity IoT & Environment OS */}
          <div className="sidebar-section-label">Aura Vanity OS</div>
          
          {/* Daily Environmental Calibration Widget */}
          <div className="sidebar-widget-card animate-fadeIn">
            <div className="widget-header">
              <CloudSun size={14} className="text-cyan" />
              <span className="widget-title">Daily Calibration</span>
            </div>
            <div className="widget-env-grid">
              <div className="env-pill">
                <span className="env-label">UV INDEX</span>
                <span className="env-value text-rose">8.4 (High)</span>
              </div>
              <div className="env-pill">
                <span className="env-label">HUMIDITY</span>
                <span className="env-value text-cyan">72% (Humid)</span>
              </div>
            </div>
            <div className="widget-advice">
              <span>Formula modified: +2% Niacinamide, UV filter active.</span>
            </div>
          </div>

          {/* Connected Device Hub Widget */}
          <div className="sidebar-widget-card mt-2">
            <div className="widget-header flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5">
                <Cpu size={14} className="text-primary-color" />
                <span className="widget-title">Aura Dispenser</span>
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
                <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                  <span style={{ color: 'var(--text-muted)' }}>Skin</span>
                  <span style={{ fontWeight: 700, color: 'var(--aura-green)' }}>{result.skin.overallScore}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--aura-cyan)', boxShadow: '0 0 6px var(--aura-cyan)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Hair</span>
                  <span style={{ fontWeight: 700, color: 'var(--aura-cyan)' }}>{result.hair.overallScore}</span>
                </div>
              </div>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/upload')}>
              <Sparkles size={13} />
              New Analysis
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
