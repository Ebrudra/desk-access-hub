
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BookingDetail from "./pages/BookingDetail";
import MemberDetail from "./pages/MemberDetail";
import EventDetail from "./pages/EventDetail";
import SpaceDetail from "./pages/SpaceDetail";
import ResourceDetail from "./pages/ResourceDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
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
          <Route 
            path="/crud/bookings/:id" 
            element={
              <ProtectedRoute>
                <BookingDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crud/members/:id" 
            element={
              <ProtectedRoute>
                <MemberDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crud/events/:id" 
            element={
              <ProtectedRoute>
                <EventDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crud/spaces/:id" 
            element={
              <ProtectedRoute>
                <SpaceDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crud/resources/:id" 
            element={
              <ProtectedRoute>
                <ResourceDetail />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
