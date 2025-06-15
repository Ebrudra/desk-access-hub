
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Download, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  FileText,
  Clock,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface BillingCycle {
  id: string;
  period: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  usage: {
    hours: number;
    limit: number;
    overage: number;
  };
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  downloadUrl?: string;
}

export const BillingDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentBilling } = useQuery({
    queryKey: ["current-billing", user?.id],
    queryFn: async (): Promise<BillingCycle> => {
      // Simulate current billing cycle
      return {
        id: "current",
        period: "January 2024",
        amount: 299.00,
        dueDate: "2024-01-31",
        status: "pending",
        usage: {
          hours: 45,
          limit: 60,
          overage: 0
        }
      };
    },
    enabled: !!user?.id
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: async (): Promise<Invoice[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Transform payments to invoices format
      return (data || []).map(payment => ({
        id: payment.id,
        number: payment.invoice_number || `INV-${payment.id.slice(0, 8)}`,
        date: payment.invoice_date || payment.created_at,
        amount: payment.amount,
        status: payment.status as 'paid' | 'pending' | 'overdue',
        downloadUrl: payment.metadata?.downloadUrl
      }));
    },
    enabled: !!user?.id
  });

  const { data: usageStats } = useQuery({
    queryKey: ["usage-stats", user?.id],
    queryFn: async () => {
      // Simulate usage statistics
      return {
        currentMonth: 45,
        lastMonth: 52,
        averageMonthly: 48,
        peakDay: 8,
        peakTime: "2:00 PM - 4:00 PM"
      };
    },
    enabled: !!user?.id
  });

  const downloadInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      // Simulate invoice download
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, generate PDF or get download URL
      const link = document.createElement('a');
      link.href = `data:text/plain;charset=utf-8,Invoice ${invoiceId}`;
      link.download = `invoice-${invoiceId}.pdf`;
      link.click();
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Your invoice is being downloaded."
      });
    }
  });

  const payInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase
        .from("payments")
        .update({ status: "completed" })
        .eq("id", invoiceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Payment Processed",
        description: "Your invoice has been paid successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["current-billing"] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const usagePercentage = currentBilling ? (currentBilling.usage.hours / currentBilling.usage.limit) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Billing & Usage</h2>
      </div>

      {/* Current Billing Overview */}
      {currentBilling && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Current Bill</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">${currentBilling.amount}</div>
                <div className="text-sm text-gray-600">{currentBilling.period}</div>
                <Badge className={getStatusColor(currentBilling.status)}>
                  {currentBilling.status}
                </Badge>
                <div className="text-xs text-gray-500">
                  Due: {new Date(currentBilling.dueDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Hours Used</span>
                  <span>{currentBilling.usage.hours} / {currentBilling.usage.limit}</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
                <div className="text-xs text-gray-500">
                  {currentBilling.usage.limit - currentBilling.usage.hours} hours remaining
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Usage Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usageStats && (
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{usageStats.currentMonth}h</div>
                  <div className="text-sm text-gray-600">This month</div>
                  <div className="text-xs text-gray-500">
                    Last month: {usageStats.lastMonth}h
                  </div>
                  <div className="text-xs text-gray-500">
                    Average: {usageStats.averageMonthly}h/month
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="usage">Usage Details</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No invoices found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{invoice.number}</h4>
                        <p className="text-sm text-gray-600">
                          ${invoice.amount} • {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoiceMutation.mutate(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => payInvoiceMutation.mutate(invoice.id)}
                            disabled={payInvoiceMutation.isPending}
                          >
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Usage</CardTitle>
            </CardHeader>
            <CardContent>
              {usageStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Current Month</span>
                      <span className="font-medium">{usageStats.currentMonth} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Month</span>
                      <span className="font-medium">{usageStats.lastMonth} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Average</span>
                      <span className="font-medium">{usageStats.averageMonthly} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Day Usage</span>
                      <span className="font-medium">{usageStats.peakDay} hours</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Peak Usage Time</h4>
                      <p className="text-sm text-gray-600">{usageStats.peakTime}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Usage Pattern</h4>
                      <p className="text-sm text-gray-600">Weekdays: 85% | Weekends: 15%</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Premium Plan</h4>
                    <p className="text-sm text-gray-600">60 hours/month • Meeting rooms included</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$299/month</div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Change Plan
                  </Button>
                  <Button variant="outline" className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
