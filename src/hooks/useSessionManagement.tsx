
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export const useSessionManagement = () => {
  const { toast } = useToast();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity.",
      variant: "destructive",
    });
  }, [toast]);

  const extendSession = useCallback(() => {
    resetActivity();
    toast({
      title: "Session Extended",
      description: "Your session has been extended.",
    });
  }, [resetActivity, toast]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => resetActivity();
    
    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
    };
  }, [resetActivity]);

  useEffect(() => {
    const checkSession = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;

      if (timeSinceActivity >= SESSION_TIMEOUT) {
        handleLogout();
      } else if (timeSinceActivity >= SESSION_TIMEOUT - WARNING_TIME && !showWarning) {
        setShowWarning(true);
        toast({
          title: "Session Warning",
          description: "Your session will expire in 5 minutes due to inactivity.",
          action: (
            <button
              onClick={extendSession}
              className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm"
            >
              Extend Session
            </button>
          ),
        });
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastActivity, showWarning, handleLogout, extendSession, toast]);

  return {
    resetActivity,
    extendSession,
    showWarning
  };
};
