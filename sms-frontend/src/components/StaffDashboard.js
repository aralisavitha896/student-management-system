import React from 'react';

const StaffDashboard = ({ user }) => {
  return (
    <div className="dashboard-content">
      <h2>Staff Dashboard</h2>
      <p>Welcome, {user?.name || 'Staff'}!</p>
    </div>
  );
};

export default StaffDashboard;
