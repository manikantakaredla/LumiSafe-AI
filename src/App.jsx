import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppLayout } from '@/components/layout/AppLayout'
import { ModulePage } from '@/pages/ModulePage'
import { CommissionerPage } from '@/pages/CommissionerPage'
import { PublicPortal } from '@/components/public/PublicPortal'
import { ElectricalPage } from '@/pages/ElectricalPage'
import { initSocketClient } from '@/sockets/socketClient'

function App() {
  useEffect(() => {
    // 1. Initialize Real-Time Connection to Backend
    initSocketClient()
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="lumisafe-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app/commissioner" replace />} />
          
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="commissioner" replace />} />
            <Route path="commissioner" element={<CommissionerPage />} />
            <Route path="electrical" element={<ElectricalPage />} />
            <Route path="city-operations" element={<ModulePage title="City Operations" description="Real-time multi-department monitoring." />} />
            <Route path="police" element={<ModulePage title="Police" description="Security and incident management." />} />
            <Route path="public" element={<PublicPortal />} />
            <Route path="admin" element={<ModulePage title="Administrator" description="System configuration and user management." />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
