
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CalendarIntegration {
  id: string;
  provider: 'google' | 'outlook' | 'apple';
  sync_enabled: boolean;
  sync_status: string;
  last_sync_at: string | null;
}

export const useCalendarSync = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['calendar-integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CalendarIntegration[];
    }
  });

  const connectCalendarMutation = useMutation({
    mutationFn: async ({ provider, accessToken, refreshToken, calendarId }: {
      provider: 'google' | 'outlook' | 'apple';
      accessToken: string;
      refreshToken?: string;
      calendarId?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('sync-calendar', {
        body: {
          provider,
          action: 'connect',
          accessToken,
          refreshToken,
          calendarId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Calendar Connected",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['calendar-integrations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const syncCalendarMutation = useMutation({
    mutationFn: async (provider: 'google' | 'outlook' | 'apple') => {
      const { data, error } = await supabase.functions.invoke('sync-calendar', {
        body: {
          provider,
          action: 'sync'
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Calendar Synced",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['calendar-integrations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const disconnectCalendarMutation = useMutation({
    mutationFn: async (provider: 'google' | 'outlook' | 'apple') => {
      const { data, error } = await supabase.functions.invoke('sync-calendar', {
        body: {
          provider,
          action: 'disconnect'
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Calendar Disconnected",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['calendar-integrations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Disconnection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    integrations,
    isLoading,
    connectCalendar: connectCalendarMutation.mutate,
    syncCalendar: syncCalendarMutation.mutate,
    disconnectCalendar: disconnectCalendarMutation.mutate,
    isConnecting: connectCalendarMutation.isPending,
    isSyncing: syncCalendarMutation.isPending,
    isDisconnecting: disconnectCalendarMutation.isPending
  };
};
