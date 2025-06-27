
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import Header from './Header';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {user.role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
