import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppLayout } from '@/components/layout/AppLayout'
import { ModulePage } from '@/pages/ModulePage'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="lumisafe-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app/commissioner" replace />} />
          
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="commissioner" replace />} />
            <Route path="commissioner" element={<ModulePage title="Commissioner" description="City-wide executive overview." />} />
            <Route path="electrical" element={<ModulePage title="Electrical Dept" description="Manage street lights and electrical infrastructure." />} />
            <Route path="city-operations" element={<ModulePage title="City Operations" description="Real-time multi-department monitoring." />} />
            <Route path="police" element={<ModulePage title="Police" description="Security and incident management." />} />
            <Route path="public" element={<ModulePage title="Public" description="Citizen complaints and feedback." />} />
            <Route path="admin" element={<ModulePage title="Administrator" description="System configuration and user management." />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
