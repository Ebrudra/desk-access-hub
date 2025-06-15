
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Activity, Calendar, Users, CreditCard } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'booking' | 'member' | 'payment' | 'event';
  title: string;
  description: string;
  timestamp: Date;
  user_email?: string;
}

export const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates for multiple tables
    const channels = [
      supabase
        .channel('bookings-activity')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, handleBookingChange),
      
      supabase
        .channel('members-activity')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, handleMemberChange),
      
      supabase
        .channel('events-activity')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, handleEventChange),
      
      supabase
        .channel('payments-activity')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, handlePaymentChange),
    ];

    channels.forEach(channel => channel.subscribe());

    // Load initial activities
    loadRecentActivities();

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const handleBookingChange = (payload: any) => {
    const booking = payload.new || payload.old;
    let description = '';
    
    switch (payload.eventType) {
      case 'INSERT':
        description = `New booking created: ${booking.title || 'Untitled'}`;
        break;
      case 'UPDATE':
        description = `Booking updated: ${booking.title || 'Untitled'}`;
        break;
      case 'DELETE':
        description = `Booking cancelled: ${booking.title || 'Untitled'}`;
        break;
    }

    addActivity({
      id: `booking-${booking.id}-${Date.now()}`,
      type: 'booking',
      title: 'Booking Activity',
      description,
      timestamp: new Date(),
    });
  };

  const handleMemberChange = (payload: any) => {
    const member = payload.new || payload.old;
    let description = '';
    
    switch (payload.eventType) {
      case 'INSERT':
        description = `New member joined: ${member.member_id}`;
        break;
      case 'UPDATE':
        description = `Member updated: ${member.member_id}`;
        break;
    }

    addActivity({
      id: `member-${member.id}-${Date.now()}`,
      type: 'member',
      title: 'Member Activity',
      description,
      timestamp: new Date(),
    });
  };

  const handleEventChange = (payload: any) => {
    const event = payload.new || payload.old;
    let description = '';
    
    switch (payload.eventType) {
      case 'INSERT':
        description = `New event created: ${event.title}`;
        break;
      case 'UPDATE':
        description = `Event updated: ${event.title}`;
        break;
      case 'DELETE':
        description = `Event cancelled: ${event.title}`;
        break;
    }

    addActivity({
      id: `event-${event.id}-${Date.now()}`,
      type: 'event',
      title: 'Event Activity',
      description,
      timestamp: new Date(),
    });
  };

  const handlePaymentChange = (payload: any) => {
    const payment = payload.new || payload.old;
    let description = '';
    
    switch (payload.eventType) {
      case 'INSERT':
        description = `New payment received: $${payment.amount}`;
        break;
      case 'UPDATE':
        description = `Payment updated: $${payment.amount}`;
        break;
    }

    addActivity({
      id: `payment-${payment.id}-${Date.now()}`,
      type: 'payment',
      title: 'Payment Activity',
      description,
      timestamp: new Date(),
    });
  };

  const addActivity = (activity: ActivityItem) => {
    setActivities(prev => [activity, ...prev.slice(0, 49)]); // Keep only 50 items
  };

  const loadRecentActivities = async () => {
    setIsLoading(true);
    // In a real app, you'd load recent activities from a dedicated activity log table
    // For now, we'll just show real-time activities
    setIsLoading(false);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'member':
        return Users;
      case 'payment':
        return CreditCard;
      case 'event':
        return Activity;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'member':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'payment':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'event':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live Activity Feed
        </CardTitle>
        <CardDescription>
          Real-time updates from your workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 bg-muted rounded animate-pulse" />
                    <div className="h-2 bg-muted rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
              <p className="text-xs">Activities will appear here in real-time</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
