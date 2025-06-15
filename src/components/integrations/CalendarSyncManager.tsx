
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, RefreshCw, Unlink, CheckCircle, XCircle, Clock } from "lucide-react";
import { useCalendarSync } from "@/hooks/useCalendarSync";

export const CalendarSyncManager = () => {
  const { 
    integrations, 
    isLoading, 
    connectCalendar, 
    syncCalendar, 
    disconnectCalendar,
    isConnecting,
    isSyncing,
    isDisconnecting
  } = useCalendarSync();

  const handleConnect = (provider: 'google' | 'outlook' | 'apple') => {
    // In a real implementation, this would open OAuth flow
    // For demo purposes, we'll simulate a connection
    connectCalendar({
      provider,
      accessToken: 'demo_access_token',
      refreshToken: 'demo_refresh_token',
      calendarId: `${provider}_calendar_id`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'disabled':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'error':
        return 'destructive';
      case 'disabled':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading calendar integrations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Calendar Sync Manager</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['google', 'outlook', 'apple'].map((provider) => {
            const integration = integrations?.find(i => i.provider === provider);
            
            return (
              <div key={provider} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium capitalize">{provider} Calendar</h3>
                  {integration && getStatusIcon(integration.sync_status)}
                </div>
                
                {integration ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(integration.sync_status)}>
                        {integration.sync_status}
                      </Badge>
                      {integration.sync_enabled && (
                        <Badge variant="outline">Enabled</Badge>
                      )}
                    </div>
                    
                    {integration.last_sync_at && (
                      <p className="text-sm text-muted-foreground">
                        Last sync: {new Date(integration.last_sync_at).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncCalendar(provider as any)}
                        disabled={isSyncing || !integration.sync_enabled}
                      >
                        {isSyncing ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => disconnectCalendar(provider as any)}
                        disabled={isDisconnecting}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleConnect(provider as any)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      `Connect ${provider}`
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Calendar Sync Features</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Automatic two-way sync with external calendars</li>
            <li>• Conflict detection and resolution</li>
            <li>• Real-time booking updates</li>
            <li>• Custom sync intervals</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
