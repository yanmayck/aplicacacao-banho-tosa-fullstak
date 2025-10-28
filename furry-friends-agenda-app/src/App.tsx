
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Layout } from "./components/Layout"; // Importando o Layout

// Lazy load pages and components
const Dashboard = lazy(() => import("./components/Dashboard"));
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

// Layout para rotas protegidas
const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Layout para rotas de admin
const AdminLayout = () => {
    const { isAdmin } = useAuth();

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

// Main App component
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/pets" element={<PetsList />} />
            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/groomers" element={<GroomersList />} />
            <Route path="/packages" element={<PackagesList />} />
            <Route path="/banho-tosa" element={<BanhoTosa />} />
            <Route element={<AdminLayout />}>
                <Route path="/reports" element={<Reports />} />
                <Route path="/backup" element={<Backup />} />
            </Route>
          </Route>

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
