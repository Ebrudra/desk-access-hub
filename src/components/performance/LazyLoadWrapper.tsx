
import { Suspense, lazy, ComponentType } from "react";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

interface LazyLoadWrapperProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export const LazyLoadWrapper = ({ 
  component, 
  fallback = <LoadingSkeleton />, 
  ...props 
}: LazyLoadWrapperProps) => {
  const LazyComponent = lazy(component);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Pre-configured lazy components for common use cases
export const LazyAnalytics = () => LazyLoadWrapper({
  component: () => import("@/components/analytics/AdvancedMetrics")
});

export const LazyBookingForm = () => LazyLoadWrapper({
  component: () => import("@/components/booking/EnhancedBookingForm")
});

export const LazyMemberProfile = () => LazyLoadWrapper({
  component: () => import("@/components/member/EnhancedProfileDashboard")
});
