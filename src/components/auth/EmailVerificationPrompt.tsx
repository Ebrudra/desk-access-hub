
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, RefreshCw } from "lucide-react";

interface EmailVerificationPromptProps {
  email: string;
  onBack: () => void;
}

export const EmailVerificationPrompt = ({ email, onBack }: EmailVerificationPromptProps) => {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleResendVerification = async () => {
    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-blue-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-gray-600">
          We've sent a verification link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Click the link in your email to verify your account and complete the signup process.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={handleResendVerification}
          disabled={isResending}
          className="w-full"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Resending...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend verification email
            </>
          )}
        </Button>

        <Button variant="ghost" onClick={onBack} className="w-full">
          Back to sign in
        </Button>
      </div>

      <div className="text-xs text-gray-500">
        <p>Didn't receive the email? Check your spam folder or try resending.</p>
      </div>
    </div>
  );
};
