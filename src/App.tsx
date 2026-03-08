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

const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedTypes?: string[] }> = ({
  children,
  allowedTypes,
}) => {
  const { user, isAuthenticated } = useApp();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(user.type)) {
    switch (user.type) {
      case 'SELLER':
        return <Navigate to="/seller" replace />;
      case 'CUSTOMER':
        return <Navigate to="/customer" replace />;
      case 'TECHNICIAN':
        return <Navigate to="/technician" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useApp();

  if (user && isAuthenticated) {
    switch (user.type) {
      case 'SELLER':
        return <Navigate to="/seller" replace />;
      case 'CUSTOMER':
        return <Navigate to="/customer" replace />;
      case 'TECHNICIAN':
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
      <Route path="/" element={<AuthRoute><PhoneRequest /></AuthRoute>} />
      <Route path="/pending" element={<PendingScreen />} />
      <Route path="/register" element={<RegisterForm />} />

      <Route path="/seller" element={<ProtectedRoute allowedTypes={['SELLER']}><SellerHome /></ProtectedRoute>} />
      <Route path="/seller/create" element={<ProtectedRoute allowedTypes={['SELLER']}><CreateWarrantyForm /></ProtectedRoute>} />
      <Route path="/seller/warranties" element={<ProtectedRoute allowedTypes={['SELLER']}><SellerWarrantyList /></ProtectedRoute>} />
      <Route path="/seller/stats" element={<ProtectedRoute allowedTypes={['SELLER']}><SellerStats /></ProtectedRoute>} />

      <Route path="/customer" element={<ProtectedRoute allowedTypes={['CUSTOMER']}><CustomerHome /></ProtectedRoute>} />
      <Route path="/customer/warranties" element={<ProtectedRoute allowedTypes={['CUSTOMER']}><MyWarranties /></ProtectedRoute>} />
      <Route path="/customer/warranty/:id" element={<ProtectedRoute allowedTypes={['CUSTOMER']}><WarrantyDetails /></ProtectedRoute>} />
      <Route path="/customer/services" element={<ProtectedRoute allowedTypes={['CUSTOMER']}><CustomerServices /></ProtectedRoute>} />

      <Route path="/technician" element={<ProtectedRoute allowedTypes={['TECHNICIAN']}><TechnicianHome /></ProtectedRoute>} />
      <Route path="/technician/create" element={<ProtectedRoute allowedTypes={['TECHNICIAN']}><CreateServiceLog /></ProtectedRoute>} />
      <Route path="/technician/jobs" element={<ProtectedRoute allowedTypes={['TECHNICIAN']}><MyJobs /></ProtectedRoute>} />
      <Route path="/technician/stats" element={<ProtectedRoute allowedTypes={['TECHNICIAN']}><TechnicianStats /></ProtectedRoute>} />

      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
