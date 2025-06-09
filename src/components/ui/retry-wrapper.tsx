
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface RetryWrapperProps {
  children: React.ReactNode;
  onRetry: () => Promise<void> | void;
  error?: Error | null;
  isLoading?: boolean;
  maxRetries?: number;
}

export const RetryWrapper = ({ 
  children, 
  onRetry, 
  error, 
  isLoading = false,
  maxRetries = 3 
}: RetryWrapperProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
      setRetryCount(0);
    } catch (err) {
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  };

  if (error && !isLoading) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error.message}</span>
          {retryCount < maxRetries && (
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              size="sm"
              disabled={isRetrying}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              Retry ({maxRetries - retryCount} left)
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
