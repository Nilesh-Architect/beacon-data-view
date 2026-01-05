import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { AppLayout } from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadData from "./pages/UploadData";
import Submissions from "./pages/Submissions";
import IndicatorManagement from "./pages/IndicatorManagement";
import VirtualBook from "./pages/VirtualBook";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route element={
        <ProtectedRoute allowedRoles={['admin', 'contributor', 'viewer']}>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'viewer']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute allowedRoles={['admin', 'contributor']}>
            <UploadData />
          </ProtectedRoute>
        } />
        <Route path="/submissions" element={
          <ProtectedRoute allowedRoles={['admin', 'contributor']}>
            <Submissions />
          </ProtectedRoute>
        } />
        <Route path="/indicators" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <IndicatorManagement />
          </ProtectedRoute>
        } />
        <Route path="/virtual-book" element={
          <ProtectedRoute allowedRoles={['admin', 'viewer']}>
            <VirtualBook />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
