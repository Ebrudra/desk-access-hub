
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Settings, RefreshCw } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";

export const BillingDashboard = () => {
  const { subscription, loading, checkSubscription, openCustomerPortal } = useSubscription();

  useEffect(() => {
    // Auto-refresh subscription data every 10 seconds
    const interval = setInterval(checkSubscription, 10000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const getStatusColor = (subscribed: boolean) => {
    return subscribed ? "bg-green-500" : "bg-red-500";
  };

  const getStatusText = (subscribed: boolean) => {
    return subscribed ? "Active" : "Inactive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Billing & Subscription</h2>
          <p className="text-muted-foreground">Manage your subscription and billing information</p>
        </div>
        <Button onClick={checkSubscription} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>Your current plan and billing status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge className={getStatusColor(subscription.subscribed)}>
                  {getStatusText(subscription.subscribed)}
                </Badge>
              </div>
              {subscription.subscription_tier && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Plan:</span>
                  <Badge variant="secondary">{subscription.subscription_tier}</Badge>
                </div>
              )}
              {subscription.subscription_end && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    Next billing: {format(new Date(subscription.subscription_end), "PPP")}
                  </span>
                </div>
              )}
            </div>
            {subscription.subscribed && (
              <Button onClick={openCustomerPortal} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your account and billing preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={openCustomerPortal} 
            variant="outline" 
            className="w-full justify-start"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
          <Button 
            onClick={openCustomerPortal} 
            variant="outline" 
            className="w-full justify-start"
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Billing History
          </Button>
          <Button 
            onClick={openCustomerPortal} 
            variant="outline" 
            className="w-full justify-start"
          >
            <Settings className="h-4 w-4 mr-2" />
            Download Invoices
          </Button>
        </CardContent>
      </Card>

      {/* Debug Information (Development Only) */}
      {import.meta.env.DEV && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify(subscription, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
