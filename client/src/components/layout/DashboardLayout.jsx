import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/Card';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" message="Loading CareerCraft AI..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, marginLeft: 0 }} className="dashboard-main-content">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .dashboard-main-content {
            margin-left: 260px !important;
          }
        }
        @media (max-width: 640px) {
          main {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
