
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Mail, RefreshCw } from "lucide-react";

export const EmailVerification = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }

      setMessage("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      setError(error.message || "Failed to send verification email");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.email_confirmed_at) {
    return null;
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-orange-800">Verify your email</CardTitle>
        </div>
        <CardDescription className="text-orange-700">
          Please verify your email address to access all features
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <p className="text-sm text-orange-700">
            We sent a verification link to {user.email}
          </p>
          <Button
            onClick={handleResendVerification}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              "Resend"
            )}
          </Button>
        </div>

        {message && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
