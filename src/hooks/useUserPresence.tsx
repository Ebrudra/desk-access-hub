
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
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // Clean up existing channel if it exists
    if (channel) {
      supabase.removeChannel(channel);
    }

    const newChannel = supabase.channel(channelName);

    const userStatus: UserPresence = {
      user_id: user.id,
      user_email: user.email || '',
      last_seen: new Date().toISOString(),
      status: 'online',
      current_page: window.location.pathname,
    };

    // Track presence
    newChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = newChannel.presenceState();
        console.log('Presence sync state:', newState);
        
        // Transform the presence state to match our expected type
        const transformedState: Record<string, UserPresence[]> = {};
        Object.entries(newState).forEach(([key, presences]) => {
          // Each presence entry is an array of presence objects
          if (Array.isArray(presences) && presences.length > 0) {
            // Extract the actual tracked data from each presence object
            const validPresences: UserPresence[] = [];
            
            presences.forEach((presence: any) => {
              // The tracked data is directly in the presence object when using .track()
              if (presence && presence.user_id && presence.user_email) {
                validPresences.push({
                  user_id: presence.user_id,
                  user_email: presence.user_email,
                  last_seen: presence.last_seen,
                  status: presence.status || 'online',
                  current_page: presence.current_page
                });
              }
            });
            
            if (validPresences.length > 0) {
              transformedState[key] = validPresences;
            }
          }
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
        console.log('Channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          const presenceTrackStatus = await newChannel.track(userStatus);
          console.log('Presence track status:', presenceTrackStatus);
          setIsOnline(presenceTrackStatus === 'ok');
        }
      });

    setChannel(newChannel);

    // Update presence when page changes
    const handlePageChange = () => {
      if (newChannel) {
        newChannel.track({
          ...userStatus,
          current_page: window.location.pathname,
          last_seen: new Date().toISOString(),
        });
      }
    };

    // Update presence periodically
    const interval = setInterval(() => {
      if (newChannel) {
        newChannel.track({
          ...userStatus,
          last_seen: new Date().toISOString(),
        });
      }
    }, 30000); // Every 30 seconds

    window.addEventListener('popstate', handlePageChange);

    return () => {
      window.removeEventListener('popstate', handlePageChange);
      clearInterval(interval);
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
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
