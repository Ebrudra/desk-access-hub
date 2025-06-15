
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRealtimeData = (tableName: string, queryKey: string[]) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 2; // Reduced retries to prevent spam
    const retryDelay = 5000; // Increased delay
    let retryTimeout: NodeJS.Timeout;

    const createChannel = () => {
      const channel = supabase
        .channel(`realtime-${tableName}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName
          },
          (payload) => {
            console.log(`Real-time update for ${tableName}:`, payload);
            
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey });
            
            // Show notification for important updates (only for specific events)
            if (payload.eventType === 'INSERT' && tableName === 'bookings') {
              toast({
                title: "New booking created",
                description: `A new booking has been created`,
              });
            }
          }
        )
        .subscribe((status) => {
          console.log(`Realtime status for ${tableName}:`, status);
          
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected');
            retryCount = 0; // Reset retry count on success
            if (retryTimeout) clearTimeout(retryTimeout);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            setConnectionStatus('disconnected');
            
            // Only retry if we haven't exceeded max retries
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Will retry connection for ${tableName} (attempt ${retryCount}/${maxRetries}) in ${retryDelay}ms`);
              retryTimeout = setTimeout(() => {
                supabase.removeChannel(channel);
                createChannel();
              }, retryDelay * retryCount);
            } else {
              console.log(`Max retries reached for ${tableName} realtime connection`);
              setConnectionStatus('disconnected');
            }
          } else {
            setConnectionStatus('connecting');
          }
        });

      return channel;
    };

    const channel = createChannel();

    return () => {
      console.log(`Cleaning up realtime channel for ${tableName}`);
      if (retryTimeout) clearTimeout(retryTimeout);
      supabase.removeChannel(channel);
    };
  }, [tableName, queryKey, queryClient, toast]);

  return { connectionStatus };
};
