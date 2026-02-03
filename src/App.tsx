import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";

// Common components
import { RoleSelect } from "@/components/common/RoleSelect";
import { PhoneVerify } from "@/components/common/PhoneVerify";
import { Profile } from "@/components/common/Profile";

// Seller components
import { SellerHome } from "@/components/seller/SellerHome";
import { CreateWarrantyForm } from "@/components/seller/CreateWarrantyForm";
import { SellerWarrantyList } from "@/components/seller/SellerWarrantyList";
import { SellerStats } from "@/components/seller/SellerStats";

// Customer components
import { CustomerHome } from "@/components/customer/CustomerHome";
import { MyWarranties } from "@/components/customer/MyWarranties";
import { WarrantyDetails } from "@/components/customer/WarrantyDetails";

// Technician components
import { TechnicianHome } from "@/components/technician/TechnicianHome";
import { CreateServiceLog } from "@/components/technician/CreateServiceLog";
import { MyJobs } from "@/components/technician/MyJobs";
import { TechnicianStats } from "@/components/technician/TechnicianStats";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { isRegistered, role } = useApp();

  if (!isRegistered) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to the user's own dashboard
    switch (role) {
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

// Auth check for role select
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRegistered, role } = useApp();

  if (isRegistered) {
    // Redirect to the user's dashboard
    switch (role) {
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
  return (
    <Routes>
      {/* Auth routes */}
      <Route
        path="/"
        element={
          <AuthRoute>
            <RoleSelect />
          </AuthRoute>
        }
      />
      <Route path="/verify" element={<PhoneVerify />} />

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
