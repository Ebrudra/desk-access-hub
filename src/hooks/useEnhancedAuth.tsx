
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword, sanitizeInput, logSecurityEvent } from "@/utils/security";

export const useEnhancedAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => setError(null), []);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    // Input validation
    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return { needsVerification: false };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        logSecurityEvent('failed_signin', { email: sanitizedEmail, error: error.message });
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setVerificationEmail(sanitizedEmail);
        return { needsVerification: true };
      }

      logSecurityEvent('successful_signin', { email: sanitizedEmail });
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
        setVerificationEmail(sanitizedEmail);
        return { needsVerification: true };
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Too many login attempts. Please try again later.";
        logSecurityEvent('rate_limit_exceeded', { email: sanitizedEmail });
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

    // Input validation
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);

    if (!validateEmail(sanitizedEmail)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return { needsVerification: false };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      setIsLoading(false);
      return { needsVerification: false };
    }

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: sanitizedFirstName,
            last_name: sanitizedLastName,
          },
        },
      });

      if (error) {
        logSecurityEvent('failed_signup', { email: sanitizedEmail, error: error.message });
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setVerificationEmail(sanitizedEmail);
        logSecurityEvent('successful_signup', { email: sanitizedEmail });
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
        return { needsVerification: true };
      }

      logSecurityEvent('successful_signup_verified', { email: sanitizedEmail });
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
