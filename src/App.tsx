import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { Loader2 } from "lucide-react";

// Auth components
import { PhoneRequest, PendingScreen, RegisterForm } from "@/components/auth";

// Seller components
import { SellerHome } from "@/components/seller/SellerHome";
import { CreateWarrantyForm } from "@/components/seller/CreateWarrantyForm";
import { SellerWarrantyList } from "@/components/seller/SellerWarrantyList";
import { SellerStats } from "@/components/seller/SellerStats";

// Customer components
import { CustomerHome } from "@/components/customer/CustomerHome";
import { MyWarranties } from "@/components/customer/MyWarranties";
import { WarrantyDetails } from "@/components/customer/WarrantyDetails";
import { CustomerServices } from "@/components/customer/CustomerServices";

// Technician components
import { TechnicianHome } from "@/components/technician/TechnicianHome";
import { CreateServiceLog } from "@/components/technician/CreateServiceLog";
import { MyJobs } from "@/components/technician/MyJobs";
import { TechnicianStats } from "@/components/technician/TechnicianStats";

// Common
import { Profile } from "@/components/common/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Loading screen
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, authStatus } = useApp();

  if (!user || authStatus !== 'approved') {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the user's own dashboard
    switch (user.role) {
      case 'seller':
        return <Navigate to="/seller" replace />;
      case 'customer':
        return <Navigate to="/customer" replace />;
      case 'technician':
        return <Navigate to="/technician" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Auth check for initial route
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authStatus } = useApp();

  if (authStatus === 'pending') {
    return <Navigate to="/pending" replace />;
  }

  if (user && authStatus === 'approved') {
    // Redirect to the user's dashboard
    switch (user.role) {
      case 'seller':
        return <Navigate to="/seller" replace />;
      case 'customer':
        return <Navigate to="/customer" replace />;
      case 'technician':
        return <Navigate to="/technician" replace />;
    }
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoading } = useApp();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route
        path="/"
        element={
          <AuthRoute>
            <PhoneRequest />
          </AuthRoute>
        }
      />
      <Route path="/pending" element={<PendingScreen />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Seller routes */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/create"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <CreateWarrantyForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/warranties"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerWarrantyList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/stats"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerStats />
          </ProtectedRoute>
        }
      />

      {/* Customer routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/warranties"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MyWarranties />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/warranty/:id"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <WarrantyDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/services"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerServices />
          </ProtectedRoute>
        }
      />

      {/* Technician routes */}
      <Route
        path="/technician"
        element={
          <ProtectedRoute allowedRoles={['technician']}>
            <TechnicianHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technician/create"
        element={
          <ProtectedRoute allowedRoles={['technician']}>
            <CreateServiceLog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technician/jobs"
        element={
          <ProtectedRoute allowedRoles={['technician']}>
            <MyJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technician/stats"
        element={
          <ProtectedRoute allowedRoles={['technician']}>
            <TechnicianStats />
          </ProtectedRoute>
        }
      />

      {/* Profile (shared) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
