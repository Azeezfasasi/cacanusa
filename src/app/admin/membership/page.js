'use client';

// This is an example admin page that uses the AdminMembershipDashboard component
// You can use this as a template to create your own admin interface

import AdminMembershipDashboard from '@/app/components/AdminMembershipDashboard.js';

export default function AdminMembershipPage() {
  // TODO: Add authentication check here
  // Example:
  // if (!user || user.role !== 'admin') {
  //   redirect('/');
  // }

  return (
    <div>
      {/* Optional: Add admin header/navigation here */}
      {/* <AdminNav /> */}

      {/* Main dashboard component */}
      <AdminMembershipDashboard />

      {/* Optional: Add footer here */}
      {/* <AdminFooter /> */}
    </div>
  );
}
