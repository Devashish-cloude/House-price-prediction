import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// 12 Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardOverview from './pages/DashboardOverview';
import PredictPage from './pages/PredictPage';
import ResultPage from './pages/ResultPage';
import AssistantPage from './pages/AssistantPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ComparePage from './pages/ComparePage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Routes>
      {/* Public Pages with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Authenticated Dashboard Pages with DashboardLayout & ProtectedRoute */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
