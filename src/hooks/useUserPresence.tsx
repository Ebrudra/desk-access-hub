
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface UserPresence {
  user_id: string;
  user_email: string;
  last_seen: string;
  status: 'online' | 'away' | 'offline';
  current_page?: string;
}

export const useUserPresence = (channelName: string = 'workspace') => {
  const { user } = useAuth();
  const [presenceState, setPresenceState] = useState<Record<string, UserPresence[]>>({});
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(channelName);

    const userStatus: UserPresence = {
      user_id: user.id,
      user_email: user.email || '',
      last_seen: new Date().toISOString(),
      status: 'online',
      current_page: window.location.pathname,
    };

    // Track presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        // Transform the presence state to match our expected type
        const transformedState: Record<string, UserPresence[]> = {};
        Object.entries(newState).forEach(([key, presences]) => {
          transformedState[key] = presences as UserPresence[];
        });
        setPresenceState(transformedState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const presenceTrackStatus = await channel.track(userStatus);
          setIsOnline(presenceTrackStatus === 'ok');
        }
      });

    // Update presence when page changes
    const handlePageChange = () => {
      channel.track({
        ...userStatus,
        current_page: window.location.pathname,
        last_seen: new Date().toISOString(),
      });
    };

    // Update presence periodically
    const interval = setInterval(() => {
      channel.track({
        ...userStatus,
        last_seen: new Date().toISOString(),
      });
    }, 30000); // Every 30 seconds

    window.addEventListener('popstate', handlePageChange);

    return () => {
      window.removeEventListener('popstate', handlePageChange);
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user, channelName]);

  const getOnlineUsers = (): UserPresence[] => {
    return Object.values(presenceState).flat();
  };

  const getUserCount = (): number => {
    return getOnlineUsers().length;
  };

  return {
    presenceState,
    getOnlineUsers,
    getUserCount,
    isOnline,
  };
};
