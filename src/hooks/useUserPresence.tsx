
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
    // Early return if no user, but don't skip the hook
    if (!user) {
      setIsOnline(false);
      setPresenceState({});
      return;
    }

    // Clean up existing channel if it exists
    if (channel) {
      console.log('Cleaning up existing presence channel');
      supabase.removeChannel(channel);
    }

    let cleanupFunction: (() => void) | null = null;

    const setupPresence = () => {
      try {
        const newChannel = supabase.channel(channelName, {
          config: {
            presence: {
              key: user.id,
            },
          },
        });

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
            
            const transformedState: Record<string, UserPresence[]> = {};
            Object.entries(newState).forEach(([key, presences]) => {
              if (Array.isArray(presences) && presences.length > 0) {
                const validPresences: UserPresence[] = presences
                  .filter((presence: any) => presence && presence.user_id && presence.user_email)
                  .map((presence: any) => ({
                    user_id: presence.user_id,
                    user_email: presence.user_email,
                    last_seen: presence.last_seen,
                    status: presence.status || 'online',
                    current_page: presence.current_page
                  }));
                
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
            console.log('Presence channel subscription status:', status);
            if (status === 'SUBSCRIBED') {
              const presenceTrackStatus = await newChannel.track(userStatus);
              console.log('Presence track status:', presenceTrackStatus);
              setIsOnline(presenceTrackStatus === 'ok');
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('Presence channel error:', status);
              setIsOnline(false);
            }
          });

        setChannel(newChannel);

        // Update presence when page changes
        const handlePageChange = () => {
          if (newChannel && isOnline) {
            newChannel.track({
              ...userStatus,
              current_page: window.location.pathname,
              last_seen: new Date().toISOString(),
            });
          }
        };

        // Update presence periodically
        const interval = setInterval(() => {
          if (newChannel && isOnline) {
            newChannel.track({
              ...userStatus,
              last_seen: new Date().toISOString(),
            });
          }
        }, 30000); // Every 30 seconds

        // Listen for page visibility changes
        const handleVisibilityChange = () => {
          if (newChannel) {
            const status = document.hidden ? 'away' : 'online';
            newChannel.track({
              ...userStatus,
              status,
              last_seen: new Date().toISOString(),
            });
          }
        };

        window.addEventListener('popstate', handlePageChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        cleanupFunction = () => {
          window.removeEventListener('popstate', handlePageChange);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          clearInterval(interval);
          if (newChannel) {
            console.log('Unsubscribing from presence channel');
            supabase.removeChannel(newChannel);
          }
        };
      } catch (error) {
        console.error('Error setting up presence:', error);
        setIsOnline(false);
      }
    };

    setupPresence();

    return () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
    };
  }, [user?.id, channelName]);

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
