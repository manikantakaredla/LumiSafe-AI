import React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { ElectricalSupervisor } from '@/components/electrical/ElectricalSupervisor'
import { FieldEngineer } from '@/components/electrical/FieldEngineer'

export function ElectricalPage() {
  const { currentRole } = useAppStore()

  if (currentRole === 'Field Engineer') {
    return <FieldEngineer />
  }

  return <ElectricalSupervisor />
}
