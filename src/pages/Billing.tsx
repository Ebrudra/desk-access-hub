
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BillingDashboard } from "@/components/billing/BillingDashboard";
import { SubscriptionPlans } from "@/components/billing/SubscriptionPlans";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Billing = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto py-12">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">Billing Dashboard</TabsTrigger>
              <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <BillingDashboard />
            </TabsContent>
            
            <TabsContent value="plans">
              <SubscriptionPlans />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Billing;
