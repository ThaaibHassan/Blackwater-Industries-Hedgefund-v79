import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import PerformanceAttributionPage from './pages/PerformanceAttributionPage';
import AIInsightsPage from './pages/AIInsightsPage';
import TradingEMSPage from './pages/TradingEMSPage';
import TradesPage from './pages/TradesPage';
import ResearchPage from './pages/ResearchPage';
import CreditAnalysisPage from './pages/CreditAnalysisPage';
import RiskManagementPage from './pages/RiskManagementPage';
import ESGPage from './pages/ESGPage';
import DataIngestionPage from './pages/DataIngestionPage';
import AdvancedUserManagementPage from './pages/AdvancedUserManagementPage';
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
import { WatchlistProvider } from './context/WatchlistContext';
import ScreenerPage from './pages/market/ScreenerPage';
import MT5Page from './pages/MT5Page';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <WatchlistProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="portfolio" element={<PortfolioPage />} />
                <Route path="performance-attribution" element={<PerformanceAttributionPage />} />
                <Route path="ai-insights" element={<AIInsightsPage />} />
                <Route path="trading-ems" element={<TradingEMSPage />} />
                <Route path="investor-portal" element={<InvestorPortalPage />} />
                <Route path="trades" element={<TradesPage />} />
                <Route path="research" element={<ResearchPage />} />
                <Route path="credit-analysis" element={<CreditAnalysisPage />} />
                <Route path="risk-management" element={<RiskManagementPage />} />
                <Route path="esg" element={<ESGPage />} />
                <Route path="data-ingestion" element={<DataIngestionPage />} />
                <Route path="user-management" element={<AdvancedUserManagementPage />} />
                <Route path="investors" element={<InvestorsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="compliance" element={<CompliancePage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="screener" element={<ScreenerPage />} />
                <Route path="mt5" element={<MT5Page />} />
                <Route element={<AdminRoute />}>
                  <Route path="users" element={<UsersPage />} />
                </Route>
              </Route>
            </Routes>
          </WatchlistProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;