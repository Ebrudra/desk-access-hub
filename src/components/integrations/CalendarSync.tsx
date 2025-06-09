
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CalendarSync = () => {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const handleConnectCalendar = async (provider: string) => {
    try {
      // In a real implementation, this would redirect to OAuth flow
      toast({
        title: "Calendar Integration",
        description: `${provider} calendar integration would be configured here. This requires OAuth setup.`,
      });
      
      // Simulate connection
      setConnectedCalendars(prev => [...prev, provider]);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnectCalendar = (provider: string) => {
    setConnectedCalendars(prev => prev.filter(p => p !== provider));
    toast({
      title: "Calendar Disconnected",
      description: `${provider} calendar has been disconnected.`,
    });
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Sync Complete",
        description: "Calendar events have been synchronized.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync calendar events.",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const calendarProviders = [
    { id: 'google', name: 'Google Calendar', color: 'bg-blue-500' },
    { id: 'outlook', name: 'Outlook Calendar', color: 'bg-blue-600' },
    { id: 'apple', name: 'Apple Calendar', color: 'bg-gray-700' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Sync your workspace bookings with external calendars
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sync Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="calendar-sync">Enable Calendar Sync</Label>
            <div className="text-sm text-muted-foreground">
              Automatically sync bookings with connected calendars
            </div>
          </div>
          <Switch
            id="calendar-sync"
            checked={syncEnabled}
            onCheckedChange={setSyncEnabled}
          />
        </div>

        {/* Connected Calendars */}
        <div className="space-y-3">
          <Label>Connected Calendars</Label>
          {connectedCalendars.length === 0 ? (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              No calendars connected
            </div>
          ) : (
            <div className="space-y-2">
              {connectedCalendars.map(provider => {
                const providerInfo = calendarProviders.find(p => p.id === provider);
                return (
                  <div key={provider} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${providerInfo?.color}`} />
                      <span className="text-sm">{providerInfo?.name}</span>
                      <Badge variant="secondary">Connected</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectCalendar(provider)}
                    >
                      Disconnect
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Calendar Providers */}
        <div className="space-y-3">
          <Label>Available Calendars</Label>
          <div className="grid gap-2">
            {calendarProviders
              .filter(provider => !connectedCalendars.includes(provider.id))
              .map(provider => (
                <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${provider.color}`} />
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnectCalendar(provider.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
              ))}
          </div>
        </div>

        {/* Manual Sync */}
        {connectedCalendars.length > 0 && (
          <div className="pt-4 border-t">
            <Button
              onClick={handleSync}
              disabled={syncing || !syncEnabled}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
