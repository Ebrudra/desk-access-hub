
import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useSessionPersistence = () => {
  const queryClient = useQueryClient();

  const clearCache = useCallback(() => {
    queryClient.clear();
    // Clear sensitive data from localStorage
    const keysToKeep = ['sb-amixnbtaexuzbkylsdqc-auth-token'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
        localStorage.removeItem(key);
      }
    });
  }, [queryClient]);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Session refresh failed:', error);
      clearCache();
      return null;
    }
  }, [clearCache]);

  useEffect(() => {
    // Set up automatic session refresh
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const expiresAt = session.expires_at;
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = (expiresAt || 0) - now;
        
        // Refresh if less than 5 minutes remaining
        if (timeUntilExpiry < 300) {
          await refreshSession();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [refreshSession]);

  return {
    clearCache,
    refreshSession,
  };
};
