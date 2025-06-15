
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionPersistence } from "./useSessionPersistence";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCache } = useSessionPersistence();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only log in development mode
        if (import.meta.env.DEV) {
          console.log('Auth state changed:', event, session);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle navigation after auth state changes
        if (event === 'SIGNED_IN' && session) {
          // Redirect to dashboard after successful login
          if (location.pathname === '/auth') {
            navigate('/');
          }
        } else if (event === 'SIGNED_OUT') {
          clearCache();
          // Redirect to auth page after logout
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      if (import.meta.env.DEV) {
        console.error('Error getting session:', error);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, clearCache]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error signing out:', error);
      }
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
  };
};
