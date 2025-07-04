
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/components/ui/notification-center";

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Map database notification types to UI types
  const mapNotificationType = (dbType: string): "info" | "success" | "warning" | "error" => {
    switch (dbType) {
      case 'booking':
        return 'info';
      case 'payment':
        return 'success';
      case 'event':
        return 'info';
      case 'system':
        return 'warning';
      case 'access':
        return 'info';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  useEffect(() => {
    // Early return if no user, but don't skip the hook
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let channel: any = null;

    const setupNotifications = async () => {
      try {
        // Subscribe to real-time notifications
        channel = supabase
          .channel('notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              const newNotification = payload.new as any;
              const notification: Notification = {
                id: newNotification.id,
                title: newNotification.title,
                message: newNotification.message,
                type: mapNotificationType(newNotification.type),
                timestamp: new Date(newNotification.created_at),
                read: newNotification.is_read,
                action: newNotification.action_url ? {
                  label: "View",
                  onClick: () => window.location.href = newNotification.action_url
                } : undefined
              };

              setNotifications(prev => [notification, ...prev]);
              setUnreadCount(prev => prev + 1);

              // Show toast notification
              toast({
                title: notification.title,
                description: notification.message,
                variant: notification.type === 'error' ? 'destructive' : 'default',
              });
            }
          )
          .subscribe();

        // Load existing notifications
        await loadNotifications();
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, toast]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedNotifications: Notification[] = data.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: mapNotificationType(n.type),
        timestamp: new Date(n.created_at),
        read: n.is_read,
        action: n.action_url ? {
          label: "View",
          onClick: () => window.location.href = n.action_url
        } : undefined
      }));

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.read ? prev - 1 : prev;
      });
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    refreshNotifications: loadNotifications,
  };
};
