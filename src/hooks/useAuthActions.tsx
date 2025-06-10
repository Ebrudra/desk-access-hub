
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please verify your email address before signing in.");
      } else {
        setError(error.message || "An error occurred during sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
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

      setMessage("Please check your email for the confirmation link.");
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        setError("An account with this email already exists. Please sign in instead.");
      } else {
        setError(error.message || "An error occurred during sign up");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    message,
    handleSignIn,
    handleSignUp,
  };
};
