
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-gray-600">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <Button variant="outline" onClick={onBack} className="w-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Reset your password</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>

        <Button variant="ghost" onClick={onBack} className="w-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign in
        </Button>
      </form>
    </div>
  );
};
