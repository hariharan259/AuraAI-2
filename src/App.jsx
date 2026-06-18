import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuraProvider } from './context/AuraContext'
import AppShell from './components/layout/AppShell'
import Landing from './pages/Landing'
import BeautyProfile from './pages/BeautyProfile'
import PhotoUpload from './pages/PhotoUpload'
import Analysis from './pages/Analysis'
import IntelligenceReport from './pages/IntelligenceReport'
import OutcomeSimulator from './pages/OutcomeSimulator'
import ForecastDashboard from './pages/ForecastDashboard'
import ProgressDashboard from './pages/ProgressDashboard'
import SkinJournal from './pages/SkinJournal'

export default function App() {
  return (
    <AuraProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Public landing page — no shell */}
          <Route path="/" element={<Landing />} />

          {/* Onboarding flow — no shell */}
          <Route path="/profile" element={<BeautyProfile />} />
          <Route path="/upload" element={<PhotoUpload />} />
          <Route path="/analysis" element={<Analysis />} />

          {/* App pages — with sidebar shell */}
          <Route element={<AppShell />}>
            <Route path="/report" element={<IntelligenceReport />} />
            <Route path="/simulator" element={<OutcomeSimulator />} />
            <Route path="/forecast" element={<ForecastDashboard />} />
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/journal" element={<SkinJournal />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuraProvider>
  )
}
