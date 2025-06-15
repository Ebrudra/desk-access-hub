
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar, RefreshCw, ExternalLink, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface CalendarProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
  syncEnabled: boolean;
  accountEmail?: string;
}

interface SyncEvent {
  id: string;
  title: string;
  provider: string;
  syncStatus: 'success' | 'failed' | 'pending';
  timestamp: string;
  error?: string;
}

export const CalendarSync = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [syncInProgress, setSyncInProgress] = useState<string | null>(null);

  const { data: providers = [] } = useQuery({
    queryKey: ["calendar-providers", user?.id],
    queryFn: async (): Promise<CalendarProvider[]> => {
      // Simulate calendar providers - in real app, fetch from user settings
      return [
        {
          id: "google",
          name: "Google Calendar",
          icon: "🗓️",
          connected: true,
          lastSync: "2024-01-15T10:30:00Z",
          syncEnabled: true,
          accountEmail: "user@gmail.com"
        },
        {
          id: "outlook",
          name: "Microsoft Outlook",
          icon: "📅",
          connected: false,
          syncEnabled: false
        },
        {
          id: "apple",
          name: "Apple Calendar",
          icon: "🍎",
          connected: false,
          syncEnabled: false
        }
      ];
    },
    enabled: !!user?.id
  });

  const { data: recentSync = [] } = useQuery({
    queryKey: ["recent-sync-events", user?.id],
    queryFn: async (): Promise<SyncEvent[]> => {
      // Simulate recent sync events
      return [
        {
          id: "1",
          title: "Team Meeting synced to Google Calendar",
          provider: "google",
          syncStatus: "success",
          timestamp: "2024-01-15T10:30:00Z"
        },
        {
          id: "2",
          title: "Conference Room Booking sync failed",
          provider: "google",
          syncStatus: "failed",
          timestamp: "2024-01-15T09:15:00Z",
          error: "Calendar permission denied"
        }
      ];
    },
    enabled: !!user?.id
  });

  const connectProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      setSyncInProgress(providerId);
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would redirect to OAuth provider
      if (providerId === "google") {
        window.open("https://accounts.google.com/oauth/authorize", "_blank");
      } else if (providerId === "outlook") {
        window.open("https://login.microsoftonline.com/oauth/authorize", "_blank");
      }
      
      return { connected: true, accountEmail: "user@example.com" };
    },
    onSuccess: (data, providerId) => {
      toast({
        title: "Calendar Connected",
        description: `Successfully connected to ${providers.find(p => p.id === providerId)?.name}`
      });
      queryClient.invalidateQueries({ queryKey: ["calendar-providers"] });
    },
    onError: (error, providerId) => {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${providers.find(p => p.id === providerId)?.name}`,
        variant: "destructive"
      });
    },
    onSettled: () => {
      setSyncInProgress(null);
    }
  });

  const syncNowMutation = useMutation({
    mutationFn: async (providerId: string) => {
      setSyncInProgress(providerId);
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 3000));
      return { success: true, eventsSync: 5 };
    },
    onSuccess: (data, providerId) => {
      toast({
        title: "Sync Complete",
        description: `Synchronized ${data.eventsSync} events with ${providers.find(p => p.id === providerId)?.name}`
      });
      queryClient.invalidateQueries({ queryKey: ["calendar-providers"] });
      queryClient.invalidateQueries({ queryKey: ["recent-sync-events"] });
    },
    onError: (error, providerId) => {
      toast({
        title: "Sync Failed",
        description: `Failed to sync with ${providers.find(p => p.id === providerId)?.name}`,
        variant: "destructive"
      });
    },
    onSettled: () => {
      setSyncInProgress(null);
    }
  });

  const toggleSyncMutation = useMutation({
    mutationFn: async ({ providerId, enabled }: { providerId: string; enabled: boolean }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { providerId, enabled };
    },
    onSuccess: ({ providerId, enabled }) => {
      toast({
        title: enabled ? "Sync Enabled" : "Sync Disabled",
        description: `Calendar sync has been ${enabled ? 'enabled' : 'disabled'} for ${providers.find(p => p.id === providerId)?.name}`
      });
      queryClient.invalidateQueries({ queryKey: ["calendar-providers"] });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "pending": return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Calendar Integration</h2>
      </div>

      {/* Calendar Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Calendars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{provider.icon}</div>
                  <div>
                    <h4 className="font-medium">{provider.name}</h4>
                    {provider.connected ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">{provider.accountEmail}</p>
                        {provider.lastSync && (
                          <p className="text-xs text-gray-500">
                            Last sync: {new Date(provider.lastSync).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Not connected</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {provider.connected ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`sync-${provider.id}`} className="text-sm">
                          Auto-sync
                        </Label>
                        <Switch
                          id={`sync-${provider.id}`}
                          checked={provider.syncEnabled}
                          onCheckedChange={(enabled) => 
                            toggleSyncMutation.mutate({ providerId: provider.id, enabled })
                          }
                        />
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => syncNowMutation.mutate(provider.id)}
                        disabled={syncInProgress === provider.id}
                      >
                        {syncInProgress === provider.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Sync Now
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => connectProviderMutation.mutate(provider.id)}
                      disabled={syncInProgress === provider.id}
                    >
                      {syncInProgress === provider.id ? "Connecting..." : "Connect"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sync Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSync.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent sync activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSync.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  {getStatusIcon(event.syncStatus)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                    {event.error && (
                      <p className="text-xs text-red-600 mt-1">{event.error}</p>
                    )}
                  </div>
                  <Badge variant={event.syncStatus === 'success' ? 'default' : 'destructive'}>
                    {event.syncStatus}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sync-bookings">Sync Bookings</Label>
                <p className="text-sm text-gray-600">Automatically sync booking confirmations to your calendar</p>
              </div>
              <Switch id="sync-bookings" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sync-events">Sync Events</Label>
                <p className="text-sm text-gray-600">Sync coworking space events to your calendar</p>
              </div>
              <Switch id="sync-events" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sync-reminders">Sync Reminders</Label>
                <p className="text-sm text-gray-600">Add booking reminders to your calendar</p>
              </div>
              <Switch id="sync-reminders" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
