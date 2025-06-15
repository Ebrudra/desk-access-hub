
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, DollarSign, FileText, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const BillingDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock billing data since we don't have billing tables yet
  const { data: billingData, isLoading } = useQuery({
    queryKey: ["billing-dashboard", user?.id],
    queryFn: async () => {
      // Simulate API call - replace with actual billing data fetch
      return {
        currentPlan: { name: "Pro", price: 99, billingCycle: "monthly" },
        usageMetrics: { bookings: 45, storage: 2.3, users: 12 },
        invoices: [
          {
            id: "inv-001",
            amount: 99,
            status: "paid",
            date: "2024-01-15",
            description: "Pro Plan - January 2024",
            metadata: { downloadUrl: "/invoices/inv-001.pdf" }
          },
          {
            id: "inv-002", 
            amount: 99,
            status: "pending",
            date: "2024-02-15",
            description: "Pro Plan - February 2024",
            metadata: { downloadUrl: "/invoices/inv-002.pdf" }
          }
        ]
      };
    },
    enabled: !!user?.id
  });

  const downloadInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const invoice = billingData?.invoices?.find(inv => inv.id === invoiceId);
      if (!invoice) throw new Error("Invoice not found");

      // Handle the metadata properly
      let downloadUrl = '';
      if (typeof invoice.metadata === 'object' && invoice.metadata !== null) {
        const metadata = invoice.metadata as { downloadUrl?: string };
        downloadUrl = metadata.downloadUrl || '';
      }

      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      } else {
        // Generate a mock PDF download
        const blob = new Blob(['Mock Invoice PDF'], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    onSuccess: () => {
      toast({
        title: "Invoice Downloaded",
        description: "Invoice has been downloaded successfully."
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Billing Dashboard</h1>
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          Manage Payment Methods
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData?.currentPlan?.name}</div>
            <p className="text-xs text-muted-foreground">
              ${billingData?.currentPlan?.price}/{billingData?.currentPlan?.billingCycle}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData?.usageMetrics?.bookings}</div>
            <p className="text-xs text-muted-foreground">
              bookings this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData?.usageMetrics?.storage}GB</div>
            <Progress value={23} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="usage">Usage Details</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingData?.invoices?.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{invoice.description}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount}</p>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadInvoiceMutation.mutate(invoice.id)}
                        disabled={downloadInvoiceMutation.isPending}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Bookings Created</span>
                  <span className="font-medium">{billingData?.usageMetrics?.bookings}</span>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Storage Used</span>
                  <span className="font-medium">{billingData?.usageMetrics?.storage}GB</span>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Active Users</span>
                  <span className="font-medium">{billingData?.usageMetrics?.users}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
