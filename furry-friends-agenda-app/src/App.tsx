
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const BanhoTosa = lazy(() => import("./pages/BanhoTosa"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ClientsList = lazy(() => import("./components/clients/ClientsList"));
const PetsList = lazy(() => import("./components/pets/PetsList"));
const AppointmentsList = lazy(() => import("./components/appointments/AppointmentsList"));
const GroomersList = lazy(() => import("./components/groomers/GroomersList"));
const PackagesList = lazy(() => import("./components/packages/PackagesList"));
const Reports = lazy(() => import("./components/reports/Reports"));
const Register = lazy(() => import("./pages/Register"));
const Backup = lazy(() => import("./pages/Backup"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App component
const AppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />

          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />

          {/* Rotas individuais para cada seção */}
          <Route path="/clients" element={<ProtectedRoute><ClientsList /></ProtectedRoute>} />
          <Route path="/pets" element={<ProtectedRoute><PetsList /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><AppointmentsList /></ProtectedRoute>} />
          <Route path="/groomers" element={<ProtectedRoute><GroomersList /></ProtectedRoute>} />
          <Route path="/packages" element={<ProtectedRoute><PackagesList /></ProtectedRoute>} />
          <Route path="/banho-tosa" element={<ProtectedRoute><BanhoTosa /></ProtectedRoute>} />
          <Route path="/reports" element={
            <ProtectedRoute>
              {isAdmin() ? <Reports /> : <Navigate to="/" replace />}
            </ProtectedRoute>
          } />
          <Route path="/backup" element={
            <ProtectedRoute>
              {isAdmin() ? <Backup /> : <Navigate to="/" replace />}
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// Main App component
const App = () => {
  // Move QueryClient initialization inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <StoreProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </StoreProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
