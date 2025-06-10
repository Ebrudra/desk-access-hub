
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface RetryWrapperProps {
  children: ReactNode;
  onRetry: () => void;
  error?: Error | null;
  loading?: boolean;
  maxRetries?: number;
}

export const RetryWrapper = ({ 
  children, 
  onRetry, 
  error, 
  loading = false,
  maxRetries = 3 
}: RetryWrapperProps) => {
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      onRetry();
    }
  };

  if (error && !loading) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error.message || "Something went wrong"}</span>
          {retryCount < maxRetries && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry ({maxRetries - retryCount} left)
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
