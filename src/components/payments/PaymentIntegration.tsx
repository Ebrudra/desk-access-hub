
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, DollarSign, Receipt, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export const PaymentIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [newPaymentData, setNewPaymentData] = useState({
    type: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: ""
  });

  const { data: paymentMethods = [] } = useQuery({
    queryKey: ["payment-methods", user?.id],
    queryFn: async () => {
      // Simulate payment methods - in real app, fetch from Stripe/payment provider
      return [
        { id: "1", type: "card", last4: "4242", brand: "visa", isDefault: true },
        { id: "2", type: "card", last4: "5555", brand: "mastercard", isDefault: false }
      ] as PaymentMethod[];
    },
    enabled: !!user?.id
  });

  const { data: pendingPayments = [] } = useQuery({
    queryKey: ["pending-payments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("payments")
        .select("*, bookings(title)")
        .eq("member_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const processPaymentMutation = useMutation({
    mutationFn: async ({ paymentId, methodId }: { paymentId: string; methodId: string }) => {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase
        .from("payments")
        .update({ 
          status: "completed",
          payment_method: methodId,
          metadata: { processed_at: new Date().toISOString() }
        })
        .eq("id", paymentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Payment Processed",
        description: "Payment has been successfully processed."
      });
      queryClient.invalidateQueries({ queryKey: ["pending-payments"] });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const addPaymentMethodMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      // Simulate adding payment method
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { id: Date.now().toString(), ...paymentData, isDefault: false };
    },
    onSuccess: () => {
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been saved successfully."
      });
      setNewPaymentData({ type: "card", cardNumber: "", expiryDate: "", cvv: "", name: "" });
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    }
  });

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Payment Management</h2>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Pending Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{payment.description || 'Payment'}</h4>
                    <p className="text-sm text-gray-600">
                      Amount: ${payment.amount} • Due: {new Date(payment.due_date || payment.created_at).toLocaleDateString()}
                    </p>
                    {payment.bookings && (
                      <p className="text-xs text-gray-500">Related to: {payment.bookings.title}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.brand?.toUpperCase()} ****{method.last4}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => processPaymentMutation.mutate({ 
                        paymentId: payment.id, 
                        methodId: selectedMethod 
                      })}
                      disabled={!selectedMethod || processPaymentMutation.isPending}
                    >
                      {processPaymentMutation.isPending ? "Processing..." : "Pay Now"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Methods</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {method.brand?.toUpperCase()} ending in {method.last4}
                    </p>
                    <p className="text-sm text-gray-600">{method.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Add Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={newPaymentData.cardNumber}
                  onChange={(e) => setNewPaymentData(prev => ({
                    ...prev,
                    cardNumber: formatCardNumber(e.target.value)
                  }))}
                  maxLength={19}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newPaymentData.name}
                  onChange={(e) => setNewPaymentData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={newPaymentData.expiryDate}
                  onChange={(e) => setNewPaymentData(prev => ({
                    ...prev,
                    expiryDate: e.target.value
                  }))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={newPaymentData.cvv}
                  onChange={(e) => setNewPaymentData(prev => ({
                    ...prev,
                    cvv: e.target.value
                  }))}
                  maxLength={4}
                />
              </div>
            </div>
            <Button
              onClick={() => addPaymentMethodMutation.mutate(newPaymentData)}
              disabled={addPaymentMethodMutation.isPending}
              className="w-full"
            >
              {addPaymentMethodMutation.isPending ? "Adding..." : "Add Payment Method"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
