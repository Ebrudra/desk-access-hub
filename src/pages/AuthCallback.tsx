
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data.session) {
          toast({
            title: "Welcome!",
            description: "You have been successfully signed in.",
          });
          navigate("/");
        } else {
          // Check for error in URL params
          const errorDescription = searchParams.get('error_description');
          const error = searchParams.get('error');
          
          if (error || errorDescription) {
            throw new Error(errorDescription || error || 'Authentication failed');
          }
          
          // If no session and no error, redirect to auth
          navigate("/auth");
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to complete authentication",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
