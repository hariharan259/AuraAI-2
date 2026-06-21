import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuraProvider } from './context/AuraContext'
import AppShell from './components/layout/AppShell'

// Onboarding Pages
import Landing from './pages/Landing'
import BeautyProfile from './pages/BeautyProfile'
import PhotoUpload from './pages/PhotoUpload'
import Analysis from './pages/Analysis'

// Dashboard Pages
import IntelligenceReport from './pages/IntelligenceReport'
import OutcomeSimulator from './pages/OutcomeSimulator'
import ForecastDashboard from './pages/ForecastDashboard'
import ProgressDashboard from './pages/ProgressDashboard'
import SkinJournal from './pages/SkinJournal'
import SkinPassport from './pages/SkinPassport'
import ScanComparison from './pages/ScanComparison'
import Leaderboard from './pages/Leaderboard'
import DemoConsole from './pages/DemoConsole'

// Advanced Upgrade Pages
import BeautyTwin from './pages/BeautyTwin'
import BioAge from './pages/BioAge'
import RoutinePlanner from './pages/RoutinePlanner'
import BeautyRisk from './pages/BeautyRisk'
import ProgressTimeline from './pages/ProgressTimeline'
import AIWorkflowVisualizer from './pages/AIWorkflowVisualizer'
import DermatologistConsult from './pages/DermatologistConsult'
import AdminDashboard from './pages/AdminDashboard'

// Aura OS v4.0 Pages
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import SkinHealthLab from './pages/SkinHealthLab'
import HairIntelligenceLab from './pages/HairIntelligenceLab'
import AICarePlanner from './pages/AICarePlanner'
import IngredientIntelligence from './pages/IngredientIntelligence'
import AIBeautyCoach from './pages/AIBeautyCoach'
import ProductEngine from './pages/ProductEngine'
import BeautyChallenges from './pages/BeautyChallenges'
import TransformationJourney from './pages/TransformationJourney'

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
            <Route path="/passport" element={<SkinPassport />} />
            <Route path="/comparison" element={<ScanComparison />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* Dedicated Hackathon presentation portal */}
            <Route path="/demo" element={<DemoConsole />} />
            
            {/* New Premium Upgrade Routes */}
            <Route path="/beauty-twin" element={<BeautyTwin />} />
            <Route path="/bio-age" element={<BioAge />} />
            <Route path="/routine-planner" element={<AICarePlanner />} />
            <Route path="/risk-intelligence" element={<BeautyRisk />} />
            <Route path="/timeline" element={<ProgressTimeline />} />
            <Route path="/how-it-thinks" element={<AIWorkflowVisualizer />} />
            <Route path="/consultation" element={<DermatologistConsult />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Aura OS v4.0 Routes */}
            <Route path="/dashboard" element={<ExecutiveDashboard />} />
            <Route path="/skin-lab" element={<SkinHealthLab />} />
            <Route path="/hair-lab" element={<HairIntelligenceLab />} />
            <Route path="/care-planner" element={<AICarePlanner />} />
            <Route path="/ingredients" element={<IngredientIntelligence />} />
            <Route path="/coach" element={<AIBeautyCoach />} />
            <Route path="/products" element={<ProductEngine />} />
            <Route path="/challenges" element={<BeautyChallenges />} />
            <Route path="/journey" element={<TransformationJourney />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuraProvider>
  )
}


