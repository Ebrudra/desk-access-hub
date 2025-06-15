
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
    const maxRetries = 3;
    const retryDelay = 2000;

    const createChannel = () => {
      const channel = supabase
        .channel(`realtime-${tableName}-${Date.now()}`, {
          config: {
            postgres_changes: [{
              event: '*',
              schema: 'public',
              table: tableName
            }]
          }
        })
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
            
            // Show notification for important updates
            if (payload.eventType === 'INSERT') {
              toast({
                title: "New item added",
                description: `A new ${tableName.slice(0, -1)} has been created`,
              });
            } else if (payload.eventType === 'DELETE') {
              toast({
                title: "Item deleted",
                description: `A ${tableName.slice(0, -1)} has been deleted`,
                variant: "destructive"
              });
            }
          }
        )
        .subscribe((status) => {
          console.log(`Realtime status for ${tableName}:`, status);
          
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected');
            retryCount = 0; // Reset retry count on success
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setConnectionStatus('disconnected');
            
            // Retry connection with exponential backoff
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying connection for ${tableName} (attempt ${retryCount}/${maxRetries})`);
              setTimeout(() => {
                supabase.removeChannel(channel);
                createChannel();
              }, retryDelay * retryCount);
            } else {
              console.error(`Max retries reached for ${tableName} realtime connection`);
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
      supabase.removeChannel(channel);
    };
  }, [tableName, queryKey, queryClient, toast]);

  return { connectionStatus };
};
