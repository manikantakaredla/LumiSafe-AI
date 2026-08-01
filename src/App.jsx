import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { RoleBasedRedirect } from '@/components/layout/RoleBasedRedirect'
import { CommissionerPage } from '@/pages/CommissionerPage'
import { ElectricalPage } from '@/pages/ElectricalPage'
import { CityOperationsPage } from '@/pages/CityOperationsPage'
import { AiResourceOptimizerPage } from '@/pages/AiResourceOptimizerPage'
import { CopilotPage } from '@/pages/CopilotPage'
import { IotStreetlightsPage } from '@/pages/IotStreetlightsPage'
import { FieldEngineerPage } from '@/pages/FieldEngineerPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { PublicPortal } from '@/components/public/PublicPortal'
import { initSocketClient } from '@/sockets/socketClient'

function App() {
  useEffect(() => {
    initSocketClient()
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="lumisafe-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/public" element={<PublicPortal />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Strictly guarded routes requiring valid JWT authentication from backend */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<RoleBasedRedirect />} />
              <Route path="dashboard" element={<CommissionerPage />} />
              <Route path="street-lights" element={<ElectricalPage />} />
              <Route path="iot" element={<IotStreetlightsPage />} />
              <Route path="field-engineer" element={<FieldEngineerPage />} />
              <Route path="operations" element={<CityOperationsPage />} />
              <Route path="optimizer" element={<AiResourceOptimizerPage />} />
              <Route path="copilot" element={<CopilotPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
