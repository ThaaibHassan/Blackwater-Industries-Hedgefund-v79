import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import PrivateRoute from '@/components/auth/PrivateRoute'
import Layout from '@/components/layout/Layout'
import LoginPage from '@/pages/auth/LoginPage'
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
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Bypass login for development - go directly to dashboard */}
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="trades" element={<TradesPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="investors" element={<InvestorsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="investor-portal" element={<InvestorPortalPage />} />
          </Route>
          
          {/* Keep login route available but redirect to dashboard */}
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 