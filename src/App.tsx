import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CattleProblemProvider } from "@/contexts/CattleProblemContext";
import { TreatmentProvider } from "@/contexts/TreatmentContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/pages/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/auth/Login";
import FarmerDashboard from "@/pages/dashboard/FarmerDashboard";
import VeterinarianDashboard from "@/pages/dashboard/VeterinarianDashboard";
import RegulatorDashboard from "@/pages/dashboard/RegulatorDashboard";
import TreatmentsList from "@/pages/treatments/TreatmentsList";
import FeedAdditivesList from "@/pages/feed-additives/FeedAdditivesList";
import AlertsList from "@/pages/alerts/AlertsList";
import NotFound from "./pages/NotFound";
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'veterinarian':
      return <VeterinarianDashboard />;
    case 'regulator':
      return <RegulatorDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};


const App = () => {
  const { t } = useTranslation();
  return (
  <NotificationProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <CattleProblemProvider>
            <TreatmentProvider>
              <HashRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Login />} />
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<DashboardRouter />} />
                    <Route path="treatments" element={
                      <ProtectedRoute allowedRoles={['farmer', 'veterinarian']}>
                        <TreatmentsList />
                      </ProtectedRoute>
                    } />
                    <Route path="feed-additives" element={
                      <ProtectedRoute allowedRoles={['farmer']}>
                        <FeedAdditivesList />
                      </ProtectedRoute>
                    } />
                    <Route path="approvals" element={
                      <ProtectedRoute allowedRoles={['veterinarian']}>
                        <VeterinarianDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="farmers" element={
                      <ProtectedRoute allowedRoles={['veterinarian']}>
                        <VeterinarianDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="analytics" element={
                      <ProtectedRoute allowedRoles={['regulator']}>
                        <RegulatorDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="reports" element={
                      <ProtectedRoute allowedRoles={['regulator']}>
                        <RegulatorDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="compliance" element={
                      <ProtectedRoute allowedRoles={['regulator']}>
                        <RegulatorDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="alerts" element={
                      <ProtectedRoute>
                        <AlertsList />
                      </ProtectedRoute>
                    } />
                    <Route path="settings" element={
                      <ProtectedRoute>
                        <div className="text-center py-12">
                          <h2 className="text-2xl font-bold text-foreground mb-4">{t('settings')}</h2>
                          <p className="text-muted-foreground">{t('settingsComingSoon')}</p>
                        </div>
                      </ProtectedRoute>
                    } />
                  </Route>
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </HashRouter>
            </TreatmentProvider>
          </CattleProblemProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </NotificationProvider>
  );
};

export default App;
