import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import TradesPage from './pages/TradesPage';
import ResearchPage from './pages/ResearchPage';
import InvestorsPage from './pages/InvestorsPage';
import ReportsPage from './pages/ReportsPage';
import CompliancePage from './pages/CompliancePage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/auth/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import UsersPage from './pages/UsersPage';
import InvestorPortalPage from './pages/InvestorPortalPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/investor-portal" element={<InvestorPortalPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="trades" element={<TradesPage />} />
              <Route path="research" element={<ResearchPage />} />
              <Route path="investors" element={<InvestorsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="compliance" element={<CompliancePage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route element={<AdminRoute />}> 
                <Route path="users" element={<UsersPage />} />
              </Route>
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;