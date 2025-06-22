import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Layout from '@/components/layout/Layout'
import DashboardPage from '@/pages/DashboardPage'
import PortfolioPage from '@/pages/PortfolioPage'
import TradesPage from '@/pages/TradesPage'
import ResearchPage from '@/pages/ResearchPage'
import InvestorsPage from '@/pages/InvestorsPage'
import ReportsPage from '@/pages/ReportsPage'
import CompliancePage from '@/pages/CompliancePage'
import TasksPage from '@/pages/TasksPage'
import SettingsPage from '@/pages/SettingsPage'
import InvestorPortalPage from '@/pages/InvestorPortalPage'

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={user ? "/dashboard" : "/investor-portal"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="trades" element={<TradesPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="investors" element={<InvestorsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Standalone routes */}
      <Route path="/investor-portal" element={<InvestorPortalPage />} />

      {/* Redirect any other path */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
} 