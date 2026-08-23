import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CattleProblemProvider } from "@/contexts/CattleProblemContext";
import { TreatmentProvider } from "@/contexts/TreatmentContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { FeedAdditiveProvider } from "@/contexts/FeedAdditiveContext";
import ProtectedRoute from "@/pages/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/auth/Login";
import FarmerDashboard from "@/pages/dashboard/FarmerDashboard";
import VeterinarianDashboard from "@/pages/dashboard/VeterinarianDashboard";
import RegulatorDashboard from "@/pages/dashboard/RegulatorDashboard";
import ApprovalsList from "@/pages/dashboard/ApprovalsList";
import FarmersList from "@/pages/dashboard/FarmersList";
import AnalyticsView from "@/pages/dashboard/AnalyticsView";
import ReportsView from "@/pages/dashboard/ReportsView";
import ComplianceView from "@/pages/dashboard/ComplianceView";
import TreatmentsList from "@/pages/treatments/TreatmentsList";
import FeedAdditivesList from "@/pages/feed-additives/FeedAdditivesList";
import AlertsList from "@/pages/alerts/AlertsList";
import CattleProblemsList from "@/pages/problems/CattleProblemsList";
import NotFound from "./pages/NotFound";
import Landing from "@/pages/Landing";
import { useTranslation } from '@/hooks/useTranslation';
const queryClient = new QueryClient();
const DashboardRouter = () => {
    const { user } = useAuth();
    if (!user)
        return <Navigate to="/login" replace/>;
    switch (user.role) {
        case 'farmer':
            return <FarmerDashboard />;
        case 'veterinarian':
            return <VeterinarianDashboard />;
        case 'regulator':
            return <RegulatorDashboard />;
        default:
            return <Navigate to="/login" replace/>;
    }
};
const App = () => {
    const { t } = useTranslation();
    return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <NotificationProvider>
            <CattleProblemProvider>
              <TreatmentProvider>
                <FeedAdditiveProvider>
                  <HashRouter>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Landing />}/>
                      <Route path="/login" element={<Login />}/>
                      {/* Protected Routes */}
                      <Route path="/dashboard" element={<ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>}>
                        <Route index element={<DashboardRouter />}/>
                        <Route path="problems" element={<ProtectedRoute allowedRoles={['farmer', 'veterinarian']}>
                            <CattleProblemsList />
                          </ProtectedRoute>}/>
                        <Route path="treatments" element={<ProtectedRoute allowedRoles={['farmer', 'veterinarian']}>
                            <TreatmentsList />
                          </ProtectedRoute>}/>
                        <Route path="feed-additives" element={<ProtectedRoute allowedRoles={['farmer']}>
                            <FeedAdditivesList />
                          </ProtectedRoute>}/>
                        <Route path="approvals" element={<ProtectedRoute allowedRoles={['veterinarian']}>
                            <ApprovalsList />
                          </ProtectedRoute>}/>
                        <Route path="farmers" element={<ProtectedRoute allowedRoles={['veterinarian']}>
                            <FarmersList />
                          </ProtectedRoute>}/>
                        <Route path="analytics" element={<ProtectedRoute allowedRoles={['regulator']}>
                            <AnalyticsView />
                          </ProtectedRoute>}/>
                        <Route path="reports" element={<ProtectedRoute allowedRoles={['regulator']}>
                            <ReportsView />
                          </ProtectedRoute>}/>
                        <Route path="compliance" element={<ProtectedRoute allowedRoles={['regulator']}>
                            <ComplianceView />
                          </ProtectedRoute>}/>
                        <Route path="alerts" element={<ProtectedRoute>
                            <AlertsList />
                          </ProtectedRoute>}/>
                        <Route path="settings" element={<ProtectedRoute>
                            <div className="text-center py-12">
                              <h2 className="text-2xl font-bold text-foreground mb-4">{t('settings')}</h2>
                              <p className="text-muted-foreground">{t('settingsComingSoon')}</p>
                            </div>
                          </ProtectedRoute>}/>
                      </Route>
                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />}/>
                    </Routes>
                  </HashRouter>
                </FeedAdditiveProvider>
              </TreatmentProvider>
            </CattleProblemProvider>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
