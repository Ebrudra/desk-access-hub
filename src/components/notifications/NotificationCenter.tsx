
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Settings, 
  Check, 
  Trash2, 
  Mail, 
  Smartphone,
  Calendar,
  CreditCard,
  Users,
  Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreference {
  type: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export const NotificationCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: preferences = [] } = useQuery({
    queryKey: ["notification-preferences", user?.id],
    queryFn: async (): Promise<NotificationPreference[]> => {
      // Simulate notification preferences
      return [
        {
          type: "booking",
          label: "Booking Updates",
          description: "Confirmations, changes, and reminders",
          email: true,
          push: true,
          inApp: true
        },
        {
          type: "payment",
          label: "Payment & Billing",
          description: "Payment confirmations and billing alerts",
          email: true,
          push: false,
          inApp: true
        },
        {
          type: "event",
          label: "Events & Activities",
          description: "Community events and announcements",
          email: false,
          push: true,
          inApp: true
        },
        {
          type: "system",
          label: "System Updates",
          description: "Maintenance and system notifications",
          email: true,
          push: false,
          inApp: true
        },
        {
          type: "access",
          label: "Access & Security",
          description: "Access codes and security alerts",
          email: true,
          push: true,
          inApp: true
        }
      ];
    },
    enabled: !!user?.id
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user?.id)
        .eq("is_read", false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "All notifications marked as read",
        description: "Your notifications have been updated."
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const updatePreferenceMutation = useMutation({
    mutationFn: async ({ 
      type, 
      channel, 
      enabled 
    }: { 
      type: string; 
      channel: 'email' | 'push' | 'inApp'; 
      enabled: boolean; 
    }) => {
      // Simulate updating preferences
      await new Promise(resolve => setTimeout(resolve, 500));
      return { type, channel, enabled };
    },
    onSuccess: ({ type, channel, enabled }) => {
      toast({
        title: "Preference Updated",
        description: `${channel} notifications ${enabled ? 'enabled' : 'disabled'} for ${type}`
      });
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking": return <Calendar className="h-4 w-4" />;
      case "payment": return <CreditCard className="h-4 w-4" />;
      case "event": return <Users className="h-4 w-4" />;
      case "system": return <Settings className="h-4 w-4" />;
      case "access": return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "booking": return "bg-blue-100 text-blue-800";
      case "payment": return "bg-green-100 text-green-800";
      case "event": return "bg-purple-100 text-purple-800";
      case "system": return "bg-orange-100 text-orange-800";
      case "access": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    selectedFilter === "all" || notification.type === selectedFilter
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Notification Center</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => markAllAsReadMutation.mutate()}
          disabled={unreadCount === 0}
        >
          <Check className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Notifications</CardTitle>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="all">All Types</option>
                    <option value="booking">Bookings</option>
                    <option value="payment">Payments</option>
                    <option value="event">Events</option>
                    <option value="system">System</option>
                    <option value="access">Access</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.is_read ? 'bg-gray-50' : 'bg-white border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-1 rounded-full ${getTypeColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.created_at).toLocaleDateString()} at{" "}
                              {new Date(notification.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.is_read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotificationMutation.mutate(notification.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {preferences.map((preference) => (
                  <div key={preference.type} className="space-y-3">
                    <div>
                      <h4 className="font-medium">{preference.label}</h4>
                      <p className="text-sm text-gray-600">{preference.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 ml-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <Label htmlFor={`${preference.type}-email`} className="text-sm">Email</Label>
                        <Switch
                          id={`${preference.type}-email`}
                          checked={preference.email}
                          onCheckedChange={(enabled) => 
                            updatePreferenceMutation.mutate({
                              type: preference.type,
                              channel: 'email',
                              enabled
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-gray-400" />
                        <Label htmlFor={`${preference.type}-push`} className="text-sm">Push</Label>
                        <Switch
                          id={`${preference.type}-push`}
                          checked={preference.push}
                          onCheckedChange={(enabled) => 
                            updatePreferenceMutation.mutate({
                              type: preference.type,
                              channel: 'push',
                              enabled
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <Label htmlFor={`${preference.type}-app`} className="text-sm">In-App</Label>
                        <Switch
                          id={`${preference.type}-app`}
                          checked={preference.inApp}
                          onCheckedChange={(enabled) => 
                            updatePreferenceMutation.mutate({
                              type: preference.type,
                              channel: 'inApp',
                              enabled
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
