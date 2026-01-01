import React from 'react'
import ManageDonations from '@/components/dashboard-component/ManageDonations'

export const metadata = {
  title: 'Manage Donations - Dashboard',
  description: 'Manage and track all donations received by CANAN USA',
}

export default function AllDonations() {
  return (
    <div>
      <ManageDonations />
    </div>
  )
}
