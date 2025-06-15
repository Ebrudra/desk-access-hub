
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEnhancedAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => setError(null), []);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setVerificationEmail(email);
        return { needsVerification: true };
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });

      return { needsVerification: false };
    } catch (error: any) {
      let errorMessage = "An error occurred during sign in";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email address before signing in.";
        setVerificationEmail(email);
        return { needsVerification: true };
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { needsVerification: false };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setVerificationEmail(email);
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
        return { needsVerification: true };
      }

      toast({
        title: "Account created",
        description: "Welcome to WorkspaceHub!",
      });

      return { needsVerification: false };
    } catch (error: any) {
      let errorMessage = "An error occurred during sign up";
      
      if (error.message.includes("already registered")) {
        errorMessage = "An account with this email already exists. Please sign in instead.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.message.includes("Signup is disabled")) {
        errorMessage = "Account creation is currently disabled. Please contact support.";
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { needsVerification: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    verificationEmail,
    setVerificationEmail,
    clearError,
    handleSignIn,
    handleSignUp,
  };
};
