
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarSyncManager } from "./CalendarSyncManager";
import { EmailNotificationManager } from "./EmailNotificationManager";
import { BillingDashboard } from "../billing/BillingDashboard";

export const IntegrationsHub = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations Hub</h1>
        <p className="text-muted-foreground">
          Manage your external integrations and backend services
        </p>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar Sync</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <CalendarSyncManager />
        </TabsContent>

        <TabsContent value="notifications">
          <EmailNotificationManager />
        </TabsContent>

        <TabsContent value="payments">
          <BillingDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
