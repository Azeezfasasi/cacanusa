import React from 'react'
import ProfileManagement from './components/ProfileManagement'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function page() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'member', 'committee', 'it-support']}>
      <ProfileManagement />
    </ProtectedRoute>
  )
}
