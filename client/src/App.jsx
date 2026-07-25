import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Core UI Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Lazy Loaded Page Components for Performance & Code-Splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CheckInPage = lazy(() => import('./pages/CheckInPage'));
const AIChatPage = lazy(() => import('./pages/AIChatPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));
const CaregiverDashboardPage = lazy(() => import('./pages/CaregiverDashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Suspense
                fallback={
                  <div className="h-[70vh] flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/docs" element={<DocumentationPage />} />

                  {/* Protected App Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/check-in"
                    element={
                      <ProtectedRoute>
                        <CheckInPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ai-coach"
                    element={
                      <ProtectedRoute>
                        <AIChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/emergency"
                    element={
                      <ProtectedRoute>
                        <EmergencyPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/education" element={<EducationPage />} />
                  <Route
                    path="/caregiver"
                    element={
                      <ProtectedRoute caregiverOnly>
                        <CaregiverDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
