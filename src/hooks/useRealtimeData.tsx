
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRealtimeData = (tableName: string, queryKey: string[]) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${tableName}`)
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
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, queryKey, queryClient, toast]);

  return { connectionStatus };
};
