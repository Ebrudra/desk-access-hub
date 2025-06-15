
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

export const useErrorBoundary = () => {
  const { toast } = useToast();

  const logError = useCallback((error: Error, errorInfo?: ErrorInfo) => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // In production, send to error monitoring service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    toast({
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
  }, [toast]);

  const resetError = useCallback(() => {
    // Reset error state if needed
    window.location.reload();
  }, []);

  return {
    logError,
    resetError,
  };
};
