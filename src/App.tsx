import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import BookingDetail from "./pages/BookingDetail";
import MemberDetail from "./pages/MemberDetail";
import EventDetail from "./pages/EventDetail";
import SpaceDetail from "./pages/SpaceDetail";
import ResourceDetail from "./pages/ResourceDetail";
import NewBooking from "./pages/NewBooking";
import NewMember from "./pages/NewMember";
import NotFound from "./pages/NotFound";
import EnhancedAuth from "./pages/EnhancedAuth";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import Billing from "./pages/Billing";
import UserManagement from "./pages/UserManagement";
import LandingPage from "./components/landing/LandingPage";
import BlogPage from "./pages/BlogPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      throwOnError: false, // Let error boundaries handle errors
    },
    mutations: {
      throwOnError: false, // Let error boundaries handle errors
    },
  },
});

const App = () => (
  <EnhancedErrorBoundary>
    <ThemeProvider defaultTheme="system" defaultColorScheme="default">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/enhanced-auth" element={<EnhancedAuth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-canceled" element={<PaymentCanceled />} />
              <Route 
                path="/billing" 
                element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user-management" 
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bookings/new" 
                element={
                  <ProtectedRoute>
                    <NewBooking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/members/new" 
                element={
                  <ProtectedRoute>
                    <NewMember />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bookings/:id" 
                element={
                  <ProtectedRoute>
                    <BookingDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/members/:id" 
                element={
                  <ProtectedRoute>
                    <MemberDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/:id" 
                element={
                  <ProtectedRoute>
                    <EventDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/spaces/:id" 
                element={
                  <ProtectedRoute>
                    <SpaceDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources/:id" 
                element={
                  <ProtectedRoute>
                    <ResourceDetail />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </EnhancedErrorBoundary>
);

export default App;
